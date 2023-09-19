<template>
	<div ref="scrollWrapper" class="tagi-drag-sort" :style="wrapperStyle">
		<div class="tagi-drag-sort-list">
			<TagiDragSortItem
				v-for="(item, index) in dataSource"
				:key="item[keyName]"
				:item="item"
				:index="index"
				:dragging="dragging"
				:duration="duration"
				:gap="gap"
				:itemWrapperStyle="itemWrapperStyle"
				:itemWrapperClassName="itemWrapperClassName"
				:draggingItemStyle="draggingItemStyle"
				:draggingItemClassName="draggingItemClassName"
				@itemDown="handleItemDown"
			>
				<slot name="item" :item="item" />
			</TagiDragSortItem>
		</div>
	</div>
</template>

<script>
import TagiDragSortItem from "./TagiDragSortItem.vue";
import { getNodeHeight } from "./util";
export default {
	name: "TagiDragSort",
	data() {
		return {
			dragging: null,
			scrollTimer: null,
			scrollValue: 0,
		};
	},
	components: { TagiDragSortItem },
	props: {
		dataSource: {
			type: Array,
			require: true,
		},
		width: {
			type: String | Number,
			default: "100%",
		},
		height: {
			type: String | Number,
			default: "100%",
		},
		gap: { type: Number, default: 8 },
		keyName: {
			type: String,
			default: "key",
		},
		itemWrapperStyle: {
			type: Object,
			default: () => ({}),
		},
		itemWrapperClassName: {
			type: String,
			default: "",
		},
		draggingItemStyle: {
			type: Object,
			default: () => ({}),
		},
		draggingItemClassName: {
			type: String,
			default: "",
		},
		draggingCursor: {
			type: String,
			default: "",
		},
		duration: {
			type: Number,
			default: 0.3,
		},
		autoScroll: { type: Boolean, default: true },
		autoScrollOffset: {
			type: Number,
			default: 50,
		},
		autoScrollMaxValue: {
			type: Number,
			default: 20,
		},
	},
	computed: {
		wrapperStyle() {
			const { width, height } = this;
			return {
				width: typeof width == "number" ? width + "px" : width,
				height: typeof height == "number" ? height + "px" : height,
			};
		},
	},
	methods: {
		handleItemDown({ downEvent, item, index, touch, currentTarget }) {
			if (downEvent.button && downEvent !== 0) return;
			const target = downEvent.currentTarget || currentTarget;
			const dragTarget = target.parentElement;
			// TEST
			const scrollWrapper = this.$refs.scrollWrapper;
			const scrollHeight = scrollWrapper.scrollHeight;

			dragTarget.style.zIndex = 9999;
			const originTargetCursor = target.style.cursor;
			const originBodyCursor = document.body.style.cursor;
			target.style.cursor = this.draggingCursor;
			document.body.style.cursor = this.draggingCursor;

			// 点击事件开始的Y
			const startY = downEvent.clientY || downEvent.targetTouches[0].clientY;
			// 单个高度
			const height = getNodeHeight(dragTarget);
			// 拖拽元素的信息
			this.dragging = {
				item,
				index,
				height,
				offsetTop: dragTarget.offsetTop,
				transArray: this.dataSource.map((item, i) => (i == index ? -1 : 0)),
			};
			// 滚动高度
			const oScrollTop = this.$el.scrollTop;
			let scrollValue = 0;
			let top = 0;
			const setY = () => {
				const lateY = top + scrollValue;
				// 跟随移动
				dragTarget.style.translate = "0 " + lateY + "px";
				this.dragging.offsetTop = dragTarget.offsetTop + lateY;
			};
			const move = (moveEvent) => {
				moveEvent.stopPropagation();
				moveEvent.preventDefault();
				if (moveEvent.clientY || moveEvent?.targetTouches) {
					const clientY = moveEvent.clientY || moveEvent.targetTouches[0].clientY;
					top = clientY - startY;
					const scrollWrapperRect = scrollWrapper.getBoundingClientRect();
					const mouseTop = clientY - scrollWrapperRect.top;

					// 是否触发自动滚动
					if (this.autoScroll) {
						// 是否满足自动滚动条件
						const isScrollTop = mouseTop < this.autoScrollOffset;
						const isScrollBottom = scrollWrapperRect.height - mouseTop < this.autoScrollOffset;
						if (isScrollTop || isScrollBottom) {
							const borderLength = isScrollTop ? mouseTop : scrollWrapperRect.height - mouseTop;
							// 滚动速度
							this.scrollValue =
								Math.min(this.autoScrollMaxValue, Math.pow((this.autoScrollOffset - borderLength) / 5, 1.5)) *
								(isScrollTop ? -1 : 1);
							clearInterval(this.scrollTimer);
							// 设置定时器执行滚动
							this.scrollTimer = setInterval(() => {
								const newScrollTop = scrollWrapper.scrollTop + this.scrollValue;

								newScrollTop < scrollHeight - scrollWrapperRect.height && scrollWrapper.scrollTo({ top: newScrollTop });
							}, 20);
						} else {
							this.scrollValue = 0;
							clearInterval(this.scrollTimer);
						}
					}
					setY();
				}
			};
			const scroll = (scrollEvent) => {
				const newTop = scrollEvent.target.scrollTop;
				scrollValue = newTop - oScrollTop;
				setY();
			};

			const up = (upEvent) => {
				this.scrollValue = 0;
				clearInterval(this.scrollTimer);
				dragTarget.style.translate = "";
				dragTarget.style.zIndex = 1;
				dragTarget.style.pointerEvents = "auto";
				target.style.cursor = originTargetCursor;
				document.body.style.cursor = originBodyCursor;
				this.positionChange(dragTarget);
				this.dragging = null;
				document.removeEventListener(touch ? "touchmove" : "mousemove", move);
				document.removeEventListener(touch ? "touchend" : "mouseup", up);
				this.$el.removeEventListener("scroll", scroll);
			};
			document.addEventListener(touch ? "touchmove" : "mousemove", move, { passive: false });
			document.addEventListener(touch ? "touchend" : "mouseup", up);
			this.$el.addEventListener("scroll", scroll);
		},
		positionChange(dragTarget) {
			const dragIndex = this.dragging.index;

			/*
			dragIndex：拖拽目标的index，
			dragTarget：拖拽目标的原信息，
			dragNode：拖拽目标的dom节点，
			insertIndex：将要插入目标的index，
			insertTarget：将要插入目标的原信息，
			position：插入目标的前后位置，0为前，1为后
			*/
			const { insertIndex, position, isChange } = this.getInsertIndex(dragIndex);
			if (!isChange) return;
			const emitInfo = {
				dragIndex,
				dragTarget: this.dragging.item,
				dragNode: dragTarget,
				insertIndex,
				position,
			};
			emitInfo.insertTarget = this.dataSource[emitInfo.insertIndex];
			this.$emit("dragEnd", emitInfo);
		},
		getInsertIndex(dragIndex) {
			const len = this.dataSource.length;
			const arr = this.dragging.transArray;
			let insertIndex = dragIndex;
			let position = 0;
			let isChange = false;
			if (dragIndex != 0 && arr[dragIndex - 1] == 1) {
				insertIndex = arr.indexOf(1);
				isChange = true;
			} else if (dragIndex != len - 1 && arr[dragIndex + 1] == 1) {
				position = 1;
				insertIndex = arr.lastIndexOf(1);
				isChange = true;
			}
			return { insertIndex, position, isChange };
		},
	},
};
</script>

<style>
.tagi-drag-sort {
	overflow-y: scroll;
	user-select: none;
}
.tagi-drag-sort-list {
	position: relative;
	min-height: 100%;
}
</style>
