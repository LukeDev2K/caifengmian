<template>
	<view>
		<view class="task-content">
			<view class="task-content__left">
				<image class="icon" :src="image" mode=""></image>
				<view class="txt">
					<text class="txt-name">{{name}}</text>
					<text class="txt-desc">{{desc}}</text>
				</view>
			</view>
			<view class="task-content__right">
				<button @click="onWatch">关注</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			image: {
				type: String,
				default: ''
			},
			name: {
				type: String,
				default: ''
			},
			desc: {
				type: String,
				default: ''
			},
			url: {
				type: String,
				default: ''
			},
		},
		methods:{
			onWatch: function() {
				uni.navigateTo({
					url:'../../pages/webview/webview?src=' + this.url
				})
			}
		}
	}
</script>

<style lang="scss">
	.task-content {
		display: flex;
		background-color: #fff;
		padding: 6px;
		box-sizing: border-box;
		align-items: center;

		.task-content__left {
			display: flex;
			flex: 1;
			align-items: center;

			.icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 4px;
			}

			.txt {
				display: flex;
				flex-direction: column;
				margin-left: 6px;

				.txt-name {
					font-size: 30rpx;
					font-weight: bold;
					color: #555555;
				}

				.txt-desc {
					font-size: 24rpx;
					color: #acacac;
				}
			}
		}

		.task-content__right {
			button {
				background-color: #ff0000;
				color: #fff;
				font-size: 24rpx;
			}
		}
	}
</style>
