<template>
	<view class="uni-popup-share">
		<view class="uni-share-title">
			<text>{{title}}</text>
		</view>
		<view class="uni-share-content">
			<view class="uni-share-content-box">
				<view class="line"></view>
				<button @click.stop="select(0)" open-type="share" hover-class="btn-hover">
					<image src="../../static/wechat.png" mode="aspectFill"></image>
					<text>邀请好友(成功邀请1人积分+{{invitePoint}})</text>
				</button>
				<view class="line"></view>
				<button @click.stop="select(1)" hover-class="btn-hover">
					<image src="../../static/video.png" mode="aspectFill"></image>
					<text>观看视频广告(积分+{{videoAdPoint}})</text>
				</button>
				<view class="line2"></view>
				<button @click="close" hover-class="btn-hover">
					<text>取消</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniPopupShare',
		props: {
			title: {
				type: String,
				default: '分享到'
			},
			invitePoint: {
				type: Number,
				default: 10
			}, 
			videoAdPoint: {
				type: Number,
				default: 10
			},
		},
		inject: ['popup'],
		data() {
			return {}
		},
		created() {},
		methods: {
			/**
			 * 选择内容
			 */
			select(index) {
				this.$emit('select', {
					index
				}, () => {
					this.popup.close()
				})
			},
			/**
			 * 关闭窗口
			 */
			close() {
				this.popup.close()
			}
		}
	}
</script>
<style lang="scss">
	button {
		border: none;
	}

	.uni-popup-share {
		background-color: #fff;

		.uni-share-title {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			align-items: center;
			justify-content: center;
			height: 40px;

			text {
				font-size: 34rpx;
				color: #340708;
				font-weight: bold;
			}
		}

		.uni-share-content {
			width: 100%;

			.uni-share-content-box {
				display: flex;
				flex-direction: column;

				.line {
					width: 100%;
					height: 1px;
					background-color: #f4f4f4;
				}

				.line2 {
					width: 100%;
					height: 14px;
					background-color: #f4f4f4;
				}

				button {
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100rpx;
					background-color: #fff;

					image {
						width: 40rpx;
						height: 40rpx;
					}

					text {
						font-size: 30rpx;
						color: #3B4144;
						line-height: 100rpx;
						margin-left: 4px;
					}

					&::after {
						border: none;
					}
				}

				.btn-hover {
					background-color: #f0f0f0;
				}
			}
		}

		.uni-share-button-box {
			width: 100%;
		}
	}
</style>
