<template>
	<div class="tagi-drag-sort-item" :style="itemStyle">
		<div
			:class="n('wrapper', itemWrapperClassName)"
			:style="itemWrapperStyle"
			@mousedown="$emit('itemDown', { downEvent: $event, item, index })"
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
		itemWrapperStyle: null,
		itemWrapperClassName: String,
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
				transition: isChoose || !this.dragging ? "" : "translate 0.3s",
				cursor: isChoose ? "grabbing" : "",
				padding: this.gap / 2 + "px 0",
			};
		},
	},
	mounted() {},
	methods: {
		n(name, otherClass = "") {
			return "tagi-drag-sort-item-" + name + " " + otherClass;
		},
	},
};
</script>

<style lang="scss">
.tagi-drag-sort-item {
	position: relative;
	// padding: 5px 0;
	&-wrapper {
		cursor: pointer;
		position: relative;
		padding: 5px;
		background-color: #cfcfcf;
		border-radius: 5px;
		border: 2px solid transparent;
		color: #000;
		outline: 2px solid transparent;
		&:hover {
			border: 2px solid #9a9a9a;
		}
	}
}
</style>
