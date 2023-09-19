<template>
	<div class="tagi-drag-sort-item" :style="itemStyle">
		<div
			:class="[
				'tagi-drag-sort-item-wrapper',
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
import { getNodeHeight } from "./util";
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
	},
	data() {
		return {
			timer: null,
		};
	},
	computed: {
		itemStyle() {
			const isChoose = this.dragging && this.dragging.index == this.index;
			let translate = "0 0";
			if (this.dragging && !isChoose) {
				// 拖动中但不是拖动的元素，判断与拖动元素的关系进行位移
				const offsetTop = this.$el.offsetTop;
				const height = getNodeHeight(this.$el);

				const lateIndex = this.index - this.dragging.index;
				const transLine = offsetTop + height / 2;
				const dragLine = this.dragging.offsetTop + (lateIndex > 0 ? this.dragging.height : 0);
				const lateLine = dragLine - transLine;

				if (lateIndex < 0 && lateLine < 0) {
					translate = `0 ${this.dragging.height}px`;
					this.dragging.transArray[this.index] = 1;
				} else if (lateIndex > 0 && lateLine > 0) {
					translate = `0 -${this.dragging.height}px`;
					this.dragging.transArray[this.index] = 1;
				} else {
					this.dragging.transArray[this.index] = 0;
				}
			}
			// 不同状态的边框颜色
			this.borderColor = isChoose ? "#59c7f9" : "";
			return {
				translate,
				transition: isChoose || !this.dragging ? "" : `translate ${this.duration}s`,
				// cursor: isChoose ? "grabbing" : "",
				padding: this.gap / 2 + "px 0",
			};
		},
	},
	mounted() {},
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

<style>
.tagi-drag-sort-item {
	position: relative;
}
.tagi-drag-sort-item-wrapper {
	position: relative;
	padding: 5px;
	background-color: #d9d9d9;
}
</style>
