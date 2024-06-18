<template>
	<div
		ref="scrollWrapper"
		:class="['tagi-drag-sort', `tagi-drag-sort-${mode}`]"
		:style="wrapperStyle"
		@wheel="handleWheel"
	>
		<div :class="['tagi-drag-sort-list', `tagi-drag-sort-list-${mode}`]">
			<TagiDragSortItem
				v-for="(item, index) in dataSource"
				:key="item[keyName]"
				:mode="mode"
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
				<slot name="item" :item="item" :index="index" />
			</TagiDragSortItem>
			<div
				v-if="$slots.afterItem || $scopedSlots.afterItem"
				:class="['tagi-drag-sort-item', `tagi-drag-sort-item-${mode}`]"
				:style="itemStyle"
			>
				<div
					:class="[
						'tagi-drag-sort-item-wrapper',
						`tagi-drag-sort-item-wrapper-${mode}`,
						itemWrapperClassName,
						afterWrapperClassName,
					]"
					:style="afterItemStyle"
				>
					<slot name="afterItem" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TagiDragSortItem from "./TagiDragSortItem.vue";
import { getNodeSize } from "./util";
export default {
	name: "TagiDragSort",
	data() {
		return {
			dragging: null,
			scrollTimer: null,
			scrollOffset: 0,
		};
	},
	components: { TagiDragSortItem },
	props: {
		// 数据源
		dataSource: {
			type: Array,
			require: true,
		},
		// 宽度
		width: {
			type: [String, Number],
			default: "100%",
		},
		// 高度
		height: {
			type: [String, Number],
			default: "100%",
		},
		// 间隔
		gap: { type: Number, default: 8 },
		// 列表项key
		keyName: {
			type: String,
			default: "key",
		},
		// 列表项wrapper样式
		itemWrapperStyle: {
			type: Object,
			default: () => ({}),
		},
		// 列表项wrapper类名
		itemWrapperClassName: {
			type: String,
			default: "",
		},
		// 额外内容wrapper类名
		afterWrapperClassName: {
			type: String,
			default: "",
		},
		// 拖动项的样式
		draggingItemStyle: {
			type: Object,
			default: () => ({}),
		},
		// 拖动项的类名
		draggingItemClassName: {
			type: String,
			default: "",
		},
		// 拖拽时的鼠标指针样式
		draggingCursor: {
			type: String,
			default: "",
		},
		// 列表移动时的动画时长
		duration: {
			type: Number,
			default: 0.3,
		},
		// 是否开启拖动至头部或底部时自动滚动
		autoScroll: { type: Boolean, default: true },
		// 自动滚动的阈值
		autoScrollOffset: {
			type: Number,
			default: 50,
		},
		// 自动滚动的最高速度
		autoScrollMaxValue: {
			type: Number,
			default: 20,
		},
		// 垂直或水平模式
		mode: {
			type: String,
			default: "v",
			validator: function (value) {
				return ["v", "h"].includes(value);
			},
		},
		// 水平模式时滚动鼠标是否横向滚动
		hWheelScroll: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		isV() {
			return this.mode === "v";
		},
		wrapperStyle() {
			const { width, height } = this;
			return {
				width: typeof width === "number" ? width + "px" : width,
				height: typeof height === "number" ? height + "px" : height,
			};
		},
		itemStyle() {
			return { padding: this.mode === "v" ? `${this.gap / 2}px 0` : `0 ${this.gap / 2}px` };
		},
		afterItemStyle() {
			return {
				pointerEvents: this.dragging ? "none" : "",
			};
		},
	},
	methods: {
		handleWheel(e) {
			// 未开启水平自定义滚动或是垂直列表或按住shift 使用原生滚动
			if (!this.hWheelScroll || this.isV || e.shiftKey) return;
			// 水平列表自定义滚动
			const target = e.currentTarget;
			target.scrollTo({ left: target.scrollLeft + e.deltaY });
		},
		handleItemDown({ downEvent, item, index, touch, currentTarget }) {
			// 鼠标只允许左键拖动
			if (downEvent.button && downEvent !== 0) return;
			let moving = false;
			// target为拖拽的实际元素
			const target = downEvent.currentTarget || currentTarget;
			// dragTarget为包裹target的实际拖拽元素
			const dragTarget = target.parentElement;
			// 滚动元素
			const scrollWrapper = this.$refs.scrollWrapper;
			// 滚动的总长度
			const scrollLength = scrollWrapper[this.isV ? "scrollHeight" : "scrollWidth"];

			// 保存原始指针，在结束时恢复
			const originBodyCursor = document.body.style.cursor;

			// 垂直、水平模式的取值
			const clientType = this.isV ? "clientY" : "clientX";
			const positionType = this.isV ? "top" : "left";
			const sizeType = this.isV ? "height" : "width";
			const scrollPosType = this.isV ? "scrollTop" : "scrollLeft";
			const offsetType = this.isV ? "offsetTop" : "offsetLeft";
			// 点击事件开始的位置
			const startPosition = downEvent[clientType] || downEvent.targetTouches[0][clientType];
			// 拖拽目标的宽度或高度
			const size = getNodeSize(dragTarget, this.isV);
			// 滚动高度
			const oScrollPosition = this.$el[scrollPosType];
			// 当列表滚动时，记录滚动偏移值，然后使拖拽目标跟随鼠标
			let scrollOffset = 0;
			let position = 0;
			const moveStart = () => {
				// 改变指针
				document.body.style.cursor = this.draggingCursor;
				// 拖拽元素的信息
				this.dragging = {
					item,
					index,
					size,
					// 拖拽目标距离列表头部的距离
					offset: dragTarget[offsetType],
					// 记录拖拽列表时，列表的位移关系数组，拖拽目标的值为-1，其它为0，需要进行位置变换的为1
					transArray: this.dataSource.map((item, i) => (i === index ? -1 : 0)),
				};
				moving = true;
			};
			// 更新拖拽对象的位置和拖拽目标距离列表头部的距离
			const setPos = () => {
				// 计算拖拽目标的位置
				const latePosition = position + scrollOffset;
				dragTarget.style.translate = this.isV ? `0 ${latePosition}px` : `${latePosition}px 0`;
				this.dragging.offset = dragTarget[offsetType] + latePosition;
			};
			const move = (moveEvent) => {
				moveEvent.stopPropagation();
				moveEvent.preventDefault();
				if (moveEvent[clientType] || moveEvent?.targetTouches) {
					// 新拖拽位置的计算
					const clientPosition = moveEvent[clientType] || moveEvent.targetTouches[0][clientType];
					position = clientPosition - startPosition;
					if (!moving && Math.abs(position) >= 5) moveStart();

					if (moving) {
						// 获取鼠标相对于滚动元素的位置
						const scrollWrapperRect = scrollWrapper.getBoundingClientRect();
						const mousePosition = clientPosition - scrollWrapperRect[positionType];

						// 是否触发自动滚动
						if (this.autoScroll) {
							// 达到头部或尾部的偏移距离后进行自动滚动
							const isScrollHead = mousePosition < this.autoScrollOffset;
							const isScrollTail = scrollWrapperRect[sizeType] - mousePosition < this.autoScrollOffset;
							if (isScrollHead || isScrollTail) {
								// 当前位置距离头或尾的距离
								const borderLength = isScrollHead ? mousePosition : scrollWrapperRect[sizeType] - mousePosition;
								const autoScrollFn = () => {
									// 滚动至当前位置加上滚动速度值
									const newScrollPosition = scrollWrapper[scrollPosType] + this.scrollOffset;

									// 防止尾部无限滚动进行限制
									newScrollPosition < scrollLength - scrollWrapperRect[sizeType] &&
										scrollWrapper.scrollTo({ [positionType]: newScrollPosition });
									return autoScrollFn;
								};
								// 滚动速度计算
								this.scrollOffset =
									Math.min(this.autoScrollMaxValue, Math.pow((this.autoScrollOffset - borderLength) / 5, 1.5)) *
									(isScrollHead ? -1 : 1);
								clearInterval(this.scrollTimer);
								// 设置定时器执行滚动
								this.scrollTimer = setInterval(autoScrollFn(), 20);
							} else {
								this.scrollOffset = 0;
								clearInterval(this.scrollTimer);
							}
						}
						// 更新拖拽目标位置
						setPos();
					}
				}
			};
			// 当列表滚动时，更新滚动信息使得拖拽对象信息正确
			const scroll = (scrollEvent) => {
				const newPosition = scrollEvent.target[scrollPosType];
				scrollOffset = newPosition - oScrollPosition;
				if (!moving && Math.abs(scrollOffset) >= 5) moveStart();
				if (moving) setPos();
			};

			// 拖拽结束
			const up = (upEvent) => {
				this.scrollOffset = 0;
				clearInterval(this.scrollTimer);
				if (moving) {
					dragTarget.style.translate = "";
					document.body.style.cursor = originBodyCursor;
					// 完成拖拽
					this.positionChange(dragTarget);
					this.dragging = null;
				}
				document.removeEventListener(touch ? "touchmove" : "mousemove", move);
				document.removeEventListener(touch ? "touchend" : "mouseup", up);
				this.$el.removeEventListener("scroll", scroll);
			};
			document.addEventListener(touch ? "touchmove" : "mousemove", move, { passive: false });
			document.addEventListener(touch ? "touchend" : "mouseup", up);
			this.$el.addEventListener("scroll", scroll);
		},
		// 发送拖拽位置信息
		positionChange(dragTarget) {
			const dragIndex = this.dragging.index;

			/*
			 * dragIndex：拖拽目标的index，
			 * dragTarget：拖拽目标的原列表项，
			 * dragNode：拖拽目标的dom节点，
			 * insertIndex：将要插入目标的index，
			 * insertTarget：将要插入目标的原列表项，
			 * position：插入目标的前后位置，0为前，1为后
			 */
			const { insertIndex, position, isChange } = this.getInsertIndex(dragIndex);
			if (!isChange) return;
			const emitInfo = {
				dragIndex,
				dragTarget: this.dragging.item,
				dragNode: dragTarget,
				insertIndex,
				insertTarget: this.dataSource[insertIndex],
				position,
			};
			this.$emit("dragEnd", emitInfo);
		},
		/**
		 * 计算拖拽的新位置和检测是否位置发生改变
		 * @param {Number} dragIndex
		 */
		getInsertIndex(dragIndex) {
			const len = this.dataSource.length;
			const arr = this.dragging.transArray;
			let insertIndex = dragIndex;
			// 插入目标的前后位置，0为前，1为后
			let position = 0;
			// 位置是否改变
			let isChange = false;
			if (dragIndex !== 0 && arr[dragIndex - 1] === 1) {
				// 拖拽元素不为第一项并且上一项的位置信息为1，则为向前位移
				// 接着找到数组中第一个位置信息为1的项就是插入目标
				insertIndex = arr.indexOf(1);
				isChange = true;
			} else if (dragIndex !== len - 1 && arr[dragIndex + 1] === 1) {
				// 拖拽元素不为最后一项并且下一项的位置信息为1，则为向后位移
				// 接着找到数组中最后一个位置信息为1的项就是插入目标
				// 然后修改为后插入
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
	user-select: none;
}
.tagi-drag-sort-v {
	overflow-y: scroll;
}
.tagi-drag-sort-h {
	overflow-x: scroll;
}

.tagi-drag-sort-list {
	position: relative;
}
.tagi-drag-sort-list-v {
	min-height: 100%;
}
.tagi-drag-sort-list-h {
	display: flex;
	min-width: 100%;
	height: 100%;
}
/* ============== item ============= */
.tagi-drag-sort-item {
	position: relative;
}
.tagi-drag-sort-item-h {
	width: fit-content;
	height: 100%;
}
.tagi-drag-sort-item-wrapper {
	position: relative;
	padding: 5px;
	background-color: #eee;
}
.tagi-drag-sort-item-wrapper-h {
	box-sizing: border-box;
	height: 100%;
}
</style>
