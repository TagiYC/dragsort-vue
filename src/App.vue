<template>
	<div id="app">
		<div class="box">
			<TagiDragSort
				:dataSource="list"
				:keyName="'key'"
				:width="'50%'"
				:height="'100%'"
				:gap="8"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperStyle="{
					borderRadius: '5px',
					border: '2px solid transparent',
				}"
				:draggingItemClassName="'active'"
				@dragEnd="handleDragEnd"
			>
				<template #item="{ item }">
					{{ item.value }}
				</template>
			</TagiDragSort>

			<TagiDragSort
				:dataSource="list"
				:keyName="'key'"
				:width="'50%'"
				:height="'100%'"
				:gap="8"
				:autoScrollOffset="100"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperClassName="'item-wrapper'"
				:draggingItemStyle="{ borderColor: 'aqua' }"
				@dragEnd="handleDragEnd"
			>
				<template #item="{ item }">
					<div>
						<div v-for="index in item.num">{{ item.value }}</div>
					</div>
				</template>
			</TagiDragSort>
		</div>
	</div>
</template>

<script>
import TagiDragSort from "./lib/index";
export default {
	name: "App",
	data() {
		return {
			list: [
				{ key: 1, value: "a", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 2, value: "b", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 3, value: "c", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 4, value: "d", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 5, value: "e", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 6, value: "f", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 7, value: "g", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 8, value: "h", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 9, value: "i", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 10, value: "j", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 11, value: "k", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 12, value: "l", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 13, value: "m", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 14, value: "n", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 15, value: "o", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 16, value: "p", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 17, value: "q", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 18, value: "r", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 19, value: "s", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 20, value: "t", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 21, value: "u", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 22, value: "v", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 23, value: "w", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 24, value: "x", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 25, value: "y", num: Math.floor(Math.random() * 8 + 1) },
				{ key: 26, value: "z", num: Math.floor(Math.random() * 8 + 1) },
			],
		};
	},
	components: { TagiDragSort },
	methods: {
		handleDragEnd(e) {
			const { dragIndex, dragNode, dragTarget, insertIndex, insertTarget, position } = e;
			// 移除拖拽的目标
			this.list.splice(dragIndex, 1);
			// 找到移除拖拽目标后的插入目标的index
			const newInsertIndex = this.list.findIndex((item) => item.key == insertTarget.key);
			this.list.splice(newInsertIndex + position, 0, dragTarget);
		},
	},
};
</script>

<style lang="scss">
* {
	padding: 0;
	margin: 0;
}
#app {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100vh;
	.box {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}
	.item-wrapper {
		border-radius: 5px;
		border: 2px solid transparent;
	}
	.active {
		border-color: aqua !important;
	}
}
</style>
