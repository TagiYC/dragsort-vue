<template>
	<div :class="['tagi-drag-sort-item', `tagi-drag-sort-item-${mode}`]" :style="itemStyle">
		<div
			:class="[
				'tagi-drag-sort-item-wrapper',
				`tagi-drag-sort-item-wrapper-${mode}`,
				itemWrapperClassName,
				dragging && dragging.item == item ? draggingItemClassName : '',
			]"
			:style="{ ...itemWrapperStyle, ...(dragging && dragging.item == item ? draggingItemStyle : {}) }"
			@mousedown="$emit('itemDown', { downEvent: $event, item, index })"
			@touchstart="handleTouchStart"
		>
			<slot />
		</div>
	</div>
</template>

<script>
import { getNodeSize } from "./util";
export default {
	name: "TgDragSortItem",
	props: {
		item: Object,
		index: Number,
		dragging: Object,

		gap: Number,
		itemWrapperStyle: Object,
		itemWrapperClassName: String,
		draggingItemStyle: Object,
		draggingItemClassName: String,
		duration: Number,
		mode: String,
	},
	data() {
		return {
			timer: null,
			translate: "0 0",
		};
	},
	computed: {
		isV() {
			return this.mode === "v";
		},
		isChoose() {
			return this.dragging && this.dragging.index === this.index;
		},
		itemStyle() {
			return {
				pointerEvents: this.dragging ? "none" : "",
				translate: this.translate,
				transition: this.isChoose || !this.dragging ? "" : `translate ${this.duration}s`,
				// 使用padding设置间隔，以便于获取列表项高度
				padding: this.mode === "v" ? `${this.gap / 2}px 0` : `0 ${this.gap / 2}px`,
				zIndex: this.isChoose ? 9999 : 1,
			};
		},
	},
	watch: {
		dragging: {
			deep: true,
			handler(dragging) {
				let translate = "0 0";
				// 拖拽中但不是拖拽元素
				if (dragging && !this.isChoose) {
					// 判断与拖动元素的关系进行位移
					const offset = this.$el[this.isV ? "offsetTop" : "offsetLeft"];
					const size = getNodeSize(this.$el, this.isV);

					// 与拖拽元素的index差值
					const indexOffset = this.index - dragging.index;
					// 该元素的中线位置
					const transLine = offset + size / 2;
					// 拖拽元素的顶线或底线，判断index差值是否大于0，是则说明该元素原本在拖拽元素的前方，使用头部线，反之使用尾部线
					const dragLine = dragging.offset + (indexOffset > 0 ? dragging.size : 0);
					// 两线直接的差值，用于检测是否越过线，以进行偏移
					const lineOffset = dragLine - transLine;

					if (indexOffset < 0 && lineOffset < 0) {
						// 当前元素在拖拽元素的前方并且越过线则偏移向尾部偏移
						translate = this.isV ? `0 ${dragging.size}px` : `${dragging.size}px 0`;
						// 设置偏移信息
						dragging.transArray[this.index] = 1;
					} else if (indexOffset > 0 && lineOffset > 0) {
						// 当前元素在拖拽元素的后并且越过线则偏移向头部偏移
						translate = this.isV ? `0 -${dragging.size}px` : `-${dragging.size}px 0`;
						// 设置偏移信息
						dragging.transArray[this.index] = 1;
					} else {
						// 设置偏移信息为0，不偏移
						dragging.transArray[this.index] = 0;
					}
				}
				this.translate = translate;
			},
		},
	},
	methods: {
		n(name, otherClass = "") {
			return "tagi-drag-sort-item-" + name + " " + otherClass;
		},
		handleTouchStart(e) {
			const currentTarget = e.currentTarget;
			const clear = (e, clearTimer = true) => {
				clearTimer && clearTimeout(this.timer);
				document.removeEventListener("touchmove", clear);
				document.removeEventListener("touchend", clear);
			};
			this.timer = setTimeout(() => {
				e.stopPropagation();
				e.preventDefault();
				clear(null, true);
				this.$emit("itemDown", { downEvent: e, item: this.item, index: this.index, touch: true, currentTarget });
			}, 300);
			document.addEventListener("touchmove", clear);
			document.addEventListener("touchend", clear);
		},
	},
};
</script>
