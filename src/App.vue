<template>
	<div id="app">
		<div class="box">
			<TagiDragSort
				:dataSource="list"
				:keyName="'key'"
				:width="300"
				:height="500"
				:gap="8"
				:itemWrapperStyle="{}"
				:itemWrapperClassName="'test'"
				@dragEnd="handleDragEnd"
			>
				<template #item="{ item }">
					{{ item.value }}
				</template>
			</TagiDragSort>

			<TagiDragSort
				:dataSource="list"
				:keyName="'key'"
				:width="300"
				:height="500"
				:gap="8"
				:itemWrapperStyle="{}"
				:itemWrapperClassName="'test'"
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
				{ key: 1, value: "a", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 2, value: "b", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 3, value: "c", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 4, value: "d", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 5, value: "e", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 6, value: "f", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 7, value: "g", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 8, value: "h", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 9, value: "i", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 10, value: "j", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 11, value: "k", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 12, value: "l", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 13, value: "m", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 14, value: "n", num: Math.floor(Math.random() * 5 + 1) },
				{ key: 15, value: "o", num: Math.floor(Math.random() * 5 + 1) },
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
#app {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 90vh;
	.box {
		display: flex;
		justify-content: center;
	}
}
</style>
