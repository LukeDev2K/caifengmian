<template>
	<view>
		<view class="top-view">
			<view class="head-view">
				<view class="head-view__left">
					<view class="head-view__image">
						<image :src="userInfo.avatarUrl" mode="widthFix"></image>
					</view>
					<view class="head-view__txt">
						<text class="head-view__name">{{userInfo.nickName}}</text>
						<text class="head-view__point">我的积分：{{userInfo.point}}</text>
					</view>
				</view>
				<view class="head-view__right" @click="onMorePoint">
					<image src="../../static/point.png" mode="widthFix"></image>
					<text>获取积分</text>
				</view>
			</view>
			<view class="cover-score">
				<view class="cover-score__item">
					<text class="cover-score__item-num">{{userInfo.partiNum}}</text>
					<text class="cover-score__item-title">参与活动</text>
				</view>
				<view class="cover-score__item">
					<text class="cover-score__item-num">{{userInfo.guessTime}}</text>
					<text class="cover-score__item-title">竞猜次数</text>
				</view>
				<view class="cover-score__item">
					<text class="cover-score__item-num">{{userInfo.inviteNum}}</text>
					<text class="cover-score__item-title">已邀请</text>
				</view>
				<view class="cover-score__item">
					<text class="cover-score__item-num">{{userInfo.takeNum}}</text>
					<text class="cover-score__item-title">已获取</text>
				</view>
			</view>
		</view>
		<view class="middle-view">
			<row-button icon="../../static/my-rewards.png" @onBtnClick="onBtnClick('rewards')">查看序列号</row-button>
			<row-button icon="../../static/contact.png" type="contact">联系客服</row-button>
			<row-button icon="../../static/share.png" type="share">分享小程序</row-button>
			<row-button icon="../../static/update.png" @onBtnClick="onBtnClick('subscribe')">封面更新提醒</row-button>
		</view>
		<view class="bottom-view">

		</view>

		<!-- #ifdef MP-WEIXIN -->
		<ad v-if="config.advInfo" :unit-id="config.advInfo.banner"></ad>
		<!-- #endif -->

		<uni-popup ref="popupShare" type="share" @change="change">
			<uni-popup-share title="请选择" :invitePoint="config.invitePoint" :videoAdPoint="config.videoAdPoint" @select="select"></uni-popup-share>
		</uni-popup>
	</view>
</template>

<script>
	var commonUtil = require('@/common/utils/common.js')
	var advUtil = require('@/common/utils/adv.js')
	import uniPopupShare from '@/components/uni-popup/uni-popup-share.vue'
	import rowButton from '@/components/row-button/row-button.vue'
	export default {
		components: {
			rowButton,
			uniPopupShare
		},
		data() {
			return {
				userInfo: {
					partiNum: 0,
					inviteNum: 0,
					guessTime: 0,
					takeNum: 0,
				},
				isFromInvite: false,
				config: this.$store.state.config,
				// #ifdef MP-WEIXIN
				interstitialAd: null,
				// #endif
			};
		},
		onLoad() {
			this.userInfo = this.$store.state.userInfo

			// #ifdef MP-WEIXIN
			this.initWechatAd()
			// #endif
		},
		onShow() {
			console.log('____' + JSON.stringify(this.$store.state.userInfo))
			this.getLastestUserInfo(this.$store.state.userInfo._id)
		},
		onShareAppMessage() {
			console.log('shareTitle: ' + this.$store.state.config.shareTitle)
			const nickName = this.$store.state.userInfo.nickName
			const inviteId = this.$store.state.userInfo._id
			const avatarUrl = this.$store.state.userInfo.avatarUrl
			let path = '/pages/index/index'
			let imageUrl = this.$store.state.config.defaultImage
			if (this.isFromInvite) {
				path = '/pages/invite/invite?inviteId=' + inviteId + '&nickName=' + nickName + '&avatarUrl=' + avatarUrl
				this.isFromInvite = false
				imageUrl = this.$store.state.config.shareImage
			}
			return {
				imageUrl: imageUrl,
				title: this.$store.state.config.shareTitle,
				path: path
			}
		},
		methods: {
			initWechatAd: function() {
				this.rewardVideoAd = advUtil.initRewardVideoAd(() => {
					console.log('播放完成')
					let afterPoint = this.$store.state.userInfo.point + this.config.videoAdPoint
					uni.showLoading({
						title: '更新奖励中',
						mask: true
					})
					this.$api.updateUserInfo({
						point: afterPoint
					}).then(res => {
						this.$store.state.userInfo.point = afterPoint
						this.$store.dispatch('set_user_info', this.$store.state.userInfo)
						uni.hideLoading()
						uni.showToast({
							title: '积分+' + this.config.videoAdPoint
						})
					}).catch(err => {
						uni.hideLoading()
						uni.showToast({
							title: '服务器错误，获取奖励出错',
							icon: 'none'
						})
					})
				})
				this.interstitialAd = advUtil.initInterstitialAd()
				if (this.interstitialAd != null) {
					setTimeout(() => {
						this.interstitialAd.show().catch((err) => {
							console.error('插屏广告错误：' + JSON.stringify(err))
						})
					}, 12000)
				}
			},
			onMorePoint: function() {
				this.$refs.popupShare.open()
			},
			select: function(e, done) {
				if (e.index == 1) {
					// #ifdef MP-WEIXIN
					if (this.rewardVideoAd != null) {
						// 用户触发广告后，显示激励视频广告
						if (this.rewardVideoAd) {
							this.rewardVideoAd.show().catch(() => {
								// 失败重试
								this.rewardVideoAd.load()
									.then(() => this.rewardVideoAd.show())
									.catch(err => {
										uni.showToast({
											title: '播放视频广告失败，请联系客服',
											icon: 'none'
										})
									})
							})
						}
					} else {
						uni.showToast({
							title: '当前不支持',
							icon: 'none'
						})
					}
					// #endif
				}
				done()
			},
			change: function(e) {
				console.log('popup ' + e.type + ' 状态', e.show)
				this.isFromInvite = e.show
			},
			//获取最新用户信息
			getLastestUserInfo: function(openid) {
				console.log('openid: ' + openid)
				commonUtil.getUserInfo(openid,
					userInfo => {
						console.log('getUserInfo: ' + JSON.stringify(userInfo))
						this.userInfo = userInfo
						this.$store.dispatch('set_user_info', userInfo)
					},
					errCode => {
						console.log('errCode: ' + errCode)
					})
			},
			onBtnClick: function(type) {
				console.log('点击: ' + type)
				if (type == 'subscribe') {
					this.subscribe()
				} else if (type == 'statement') {
					uni.navigateTo({
						url: '../statement/statement'
					})
				} else if (type == 'rewards') {
					uni.navigateTo({
						url: '../rewards/rewards'
					})
				}
			},
			subscribe: function() {
				commonUtil.subsribe('RM_3jTw4Acs65PS6o_1x-SMkLqNtWgO5BWAYMeusiPM',
					res => {
						uni.showToast({
							title: '订阅成功'
						})
					},
					err => {
						uni.showToast({
							title: '订阅失败',
							icon: 'none'
						})
					})
			},
		}
	}
</script>

<style lang="scss">
	.top-view {
		display: flex;
		background-color: #fff;
		flex-direction: column;
		padding: 10px;
		box-sizing: border-box;

		.head-view {
			display: flex;
			align-items: center;

			.head-view__left {
				display: flex;
				align-items: center;
				margin-bottom: 6px;
				flex: 1;

				.head-view__image {
					width: 100rpx;
					height: 100rpx;
					margin-right: 10px;

					image {
						width: 100%;
						height: 100%;
						border-radius: 4px;
					}
				}

				.head-view__txt {
					display: flex;
					flex-direction: column;
					height: 100rpx;
					// border: 1px solid #007AFF;
					justify-content: space-between;

					.head-view__name {
						font-weight: bold;
						font-size: 40rpx;
						line-height: 40rpx;
						color: #333333;
					}

					.head-view__point {
						font-size: 30rpx;
						line-height: 30rpx;
						color: #333333;
					}
				}
			}

			.head-view__right {
				display: flex;
				align-items: center;
				border: 1px solid #e53232;
				background-color: #ff5500;
				border-radius: 4px;

				image {
					width: 40rpx;
					margin: 0 4px;
				}

				text {
					color: #fff;
					margin-right: 4px;
					font-size: 28rpx;
				}
			}
		}

		.cover-score {
			display: flex;
			justify-content: space-between;
			border: 1px solid #e8e8e8;
			background-color: #f4f4f4;
			border-radius: 4px;
			box-sizing: border-box;
			padding: 4px 28px;
			margin-top: 10px;

			.cover-score__item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.cover-score__item-num {
					font-size: 40rpx;
					font-weight: bold;
					color: #333333;
				}

				.cover-score__item-title {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}
	}

	.middle-view {
		margin-top: 10px;
	}
</style>
