<template>
	<div class="tagi-drag-sort" :style="wrapperStyle">
		<div :class="n('list')">
			<TagiDragSortItem
				v-for="(item, index) in dataSource"
				:key="item[keyName]"
				:item="item"
				:index="index"
				:dragging="dragging"
				:gap="gap"
				:itemWrapperStyle="itemWrapperStyle"
				:itemWrapperClassName="itemWrapperClassName"
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
		};
	},
	components: { TagiDragSortItem },
	props: {
		dataSource: Array,
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
		itemWrapperStyle: String | Object,
		itemWrapperClassName: String,
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
		n(name) {
			return "tagi-drag-sort-" + name;
		},
		handleItemDown({ downEvent, item, index, touch, currentTarget }) {
			const target = downEvent.currentTarget || currentTarget;
			const dragTarget = target.parentElement;

			dragTarget.style.zIndex = 9999;
			target.style.cursor = "grabbing";
			document.body.style.cursor = "grabbing";

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
				top = (moveEvent.clientY || moveEvent.targetTouches[0].clientY) - startY;
				setY();
			};
			const scroll = (scrollEvent) => {
				const newTop = scrollEvent.target.scrollTop;
				scrollValue = newTop - oScrollTop;
				setY();
			};

			const up = (upEvent) => {
				dragTarget.style.translate = "";
				dragTarget.style.zIndex = 1;
				dragTarget.style.pointerEvents = "auto";
				target.style.cursor = "";
				document.body.style.cursor = null;
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

<style lang="scss">
.tagi-drag-sort {
	overflow-y: scroll;
	user-select: none;

	&-list {
		position: relative;
		min-height: 100%;
	}
}
</style>
