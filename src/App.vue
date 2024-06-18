<template>
	<div id="app">
		<!-- --------------------- -->
		<div class="box-v">
			<div class="tip">
				<p>Move here to scroll automatically</p>
				<div class="content">List</div>
				<p>Move here to scroll automatically</p>
			</div>
			<TagiDragSort
				:dataSource="list[0]"
				:keyName="'key'"
				:height="'100%'"
				:gap="8"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperStyle="{
					borderRadius: '5px',
					border: '2px solid transparent',
				}"
				:draggingItemClassName="'active'"
				@dragEnd="(e) => handleDragEnd(e, 0)"
			>
				<template #item="{ item }">
					{{ item.value }}
				</template>
				<div slot="afterItem" class="add-button" @click="() => handleAdd(0)">+</div>
			</TagiDragSort>

			<TagiDragSort
				:dataSource="list[0]"
				:keyName="'key'"
				:height="'100%'"
				:gap="8"
				:autoScrollOffset="100"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperClassName="'item-wrapper'"
				:draggingItemStyle="{ borderColor: 'aqua' }"
				@dragEnd="(e) => handleDragEnd(e, 0)"
			>
				<template #item="{ item }">
					<div>
						<div v-for="index in item.num">{{ item.value }}</div>
					</div>
				</template>
				<div slot="afterItem" class="add-button" @click="() => handleAdd(0)">+</div>
			</TagiDragSort>

			<TagiDragSort
				:dataSource="list[0]"
				:keyName="'key'"
				:width="'600px'"
				:height="'100%'"
				:gap="8"
				:autoScrollOffset="100"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperClassName="'item-wrapper-v'"
				:draggingItemStyle="{ borderColor: 'aqua' }"
				@dragEnd="(e) => handleDragEnd(e, 0)"
			>
				<template #item="{ item }">
					<div style="display: flex">
						<div v-for="index in item.num">{{ item.value }}</div>
					</div>
				</template>
				<div slot="afterItem" class="add-button" @click="() => handleAdd(0)">+</div>
			</TagiDragSort>
		</div>
		<!-- --------------------- -->
		<div class="box-h">
			<TagiDragSort
				:mode="'h'"
				:dataSource="list[1]"
				:keyName="'key'"
				:width="'50%'"
				:height="'100%'"
				:hWheelScroll="true"
				:gap="8"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperStyle="{
					borderRadius: '5px',
					border: '2px solid transparent',
				}"
				:draggingItemClassName="'active'"
				@dragEnd="(e) => handleDragEnd(e, 1)"
			>
				<template #item="{ item }">
					{{ item.value }}
				</template>
				<div slot="afterItem" class="add-button-h" @click="() => handleAdd(1)">+</div>
			</TagiDragSort>

			<TagiDragSort
				:mode="'h'"
				:dataSource="list[1]"
				:keyName="'key'"
				:width="'50%'"
				:height="'100%'"
				:gap="8"
				:autoScrollOffset="100"
				:hWheelScroll="true"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperClassName="'item-wrapper'"
				:draggingItemStyle="{ borderColor: 'aqua' }"
				@dragEnd="(e) => handleDragEnd(e, 1)"
			>
				<template #item="{ item }">
					<div style="display: flex">
						<div v-for="index in item.num">{{ item.value }}</div>
					</div>
				</template>
				<div slot="afterItem" class="add-button-h" @click="() => handleAdd(1)">+</div>
			</TagiDragSort>
		</div>

		<!-- --------------------- -->
		<div class="box-h-2">
			<TagiDragSort
				:mode="'h'"
				:dataSource="list[2]"
				:keyName="'key'"
				:width="'100%'"
				:height="'100%'"
				:gap="8"
				:autoScrollOffset="100"
				:draggingCursor="'-webkit-grabbing'"
				:itemWrapperClassName="'item-wrapper-h'"
				:draggingItemStyle="{ borderColor: 'aqua' }"
				:hWheelScroll="true"
				@dragEnd="(e) => handleDragEnd(e, 2)"
			>
				<template #item="{ item }">
					<div>
						<div v-for="index in item.num" style="display: flex">
							<div v-for="index in item.num">{{ item.value }}</div>
						</div>
					</div>
				</template>
				<div slot="afterItem" class="add-button-h" @click="() => handleAdd(2)">+</div>
			</TagiDragSort>
		</div>
		<!-- --------------------- -->
	</div>
</template>

<script>
import TagiDragSort from "./lib/index";
export default {
	name: "App",
	data() {
		return {
			list: [
				[
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
				[
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
				[
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
			],
		};
	},
	components: { TagiDragSort },
	methods: {
		handleDragEnd(e, i) {
			const { dragIndex, dragNode, dragTarget, insertIndex, insertTarget, position } = e;
			const list = this.list[i];
			// 移除拖拽的目标
			list.splice(dragIndex, 1);
			// 找到移除拖拽目标后的插入目标的index
			const newInsertIndex = list.findIndex((item) => item.key == insertTarget.key);
			list.splice(newInsertIndex + position, 0, dragTarget);
		},
		handleAdd(i) {
			this.list[i].push({ key: this.list[i].length + 1, value: "New", num: Math.floor(Math.random() * 8 + 1) });
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
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 5vh;
	width: 100%;
	height: 100vh;
	.tip {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		.content {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: pink;
		}
		p {
			width: 150px;
			background-color: aqua;
			padding: 6px;
		}
	}
	.box-v {
		width: 100%;
		height: 55vh;
		display: flex;
		justify-content: center;
		gap: 5vh;
	}
	.box-h {
		width: 100%;
		height: 6vh;
		display: flex;
		justify-content: center;
		gap: 5vh;
	}
	.box-h-2 {
		width: 100%;
		height: 30vh;
		display: flex;
		justify-content: center;
		gap: 5vh;
	}
	.item-wrapper,
	.item-wrapper-h,
	.item-wrapper-v {
		border-radius: 5px;
		border: 2px solid transparent;
	}
	.item-wrapper-v {
		width: fit-content;
		height: 80px;
	}
	.item-wrapper-h {
		display: block;
		height: fit-content;
	}
	.active {
		border-color: aqua !important;
	}
	.add-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50px;
	}
	.add-button-h {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 100%;
	}
}
</style>
