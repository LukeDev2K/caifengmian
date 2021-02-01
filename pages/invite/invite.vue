<template>
	<view>
		<view class="content">
			<view class="user-info">
				<image :src="avatarUrl" mode=""></image>
				<text>我是{{nickName}}</text>
			</view>
			<text class="middle-text">邀请你领红包封面啦!</text>
			<image @click="onAcceptInvite" ref="btn" class="btn" src="../../static/accept-btn.png" mode="widthFix"></image>
			<text class="bottom-tips">点击↑↑按钮为我助力</text>

			<view class="go-home-btn" @click="onGoHome">
				点我去首页 >>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: '',
				nickName: '',
				inviteId: '',
				inviteBg: this.$store.state.config.inviteBg
			};
		},

		onLoad(option) {
			// #ifdef H5
			option.inviteId = 'oxiXk5H2EFEPZouBuiL4OWgaIATY'
			option.nickName = '凌米'
			option.avatarUrl =
				'https://thirdwx.qlogo.cn/mmopen/vi_32/ZO2AudXcx1J0QrcIlic0hjpmBbI9Sff6CNicwvIZSuRMvaOrVcnTZ5BfvDptFCmw5iazpr36eibHQnpUcBxdptlLMQ/132'

			// #endif
			this.avatarUrl = option.avatarUrl
			this.nickName = option.nickName
			this.inviteId = option.inviteId
		},

		methods: {
			onGoHome: function() {
				uni.switchTab({
					url: '../index/index'
				})
			},

			onAcceptInvite: function() {
				uni.showLoading({
					title: '助力中',
					mask: true
				})
				this.$api.acceptInvite({
					inviteId: this.inviteId
				}).then(res => {
					uni.hideLoading()
					uni.showModal({
						title: '提示',
						content: res.msg,
						confirmText: '去首页',
						success: (res) => {
							if (res.confirm) {
								this.onGoHome()
							}
						}
					})
				}).catch(err => {
					uni.hideLoading()
					console.warn('accept invite err: ' + JSON.stringify(err))
					uni.showModal({
						title: '提示',
						content: err.msg,
						confirmText: '去首页',
						success: (res) => {
							if (res.confirm) {
								this.onGoHome()
							}
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #be3026;
	}

	.content {
		background-image: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-kcc3luguatdjd9e570/da183a20-60b5-11eb-918d-3d24828c498c.jpg);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 1240rpx;

		.user-info {
			display: flex;
			height: 100rpx;
			margin-top: 200rpx;

			image {
				width: 100rpx;
				height: 100rpx;
				margin-right: 10rpx;
				border-radius: 50rpx;
			}

			text {
				font-size: 36rpx;
				color: #ffffff;
				line-height: 100rpx;
			}
		}

		.middle-text {
			font-size: 50rpx;
			color: #ffde7a;
		}

		.bottom-tips {
			font-size: 30rpx;
			font-weight: bold;
			color: #fff;
		}

		.btn {
			margin-top: 400rpx;
			width: 240rpx;
			-webkit-animation: wave 0.6s ease-in-out infinite;

			@keyframes wave {
				from {
					transform: scale(1);
				}

				to {
					transform: scale(1.2);
				}
			}

			@-webkit-keyframes wave {

				/* Safari and Chrome */
				from {
					transform: scale(1);
				}

				to {
					transform: scale(1.2);
				}
			}
		}

		.go-home-btn {
			margin-top: 40rpx;
			background-color: #d5372c;
			padding: 4px 6px;
			border-radius: 4px;
			color: #ffdb7b;
			text-align: center;
			font-size: 24rpx;
			font-weight: bold;
			border: 1px solid #ff7878;
		}
	}
</style>
