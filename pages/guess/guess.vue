<template>
	<view class="container">
		<uni-swiper-dot :info="coverInfo.imageBanner" :current="current" :mode="mode">
			<swiper class="swiper-box" @change="swiperChange">
				<swiper-item v-for="(item, index) in coverInfo.imageBanner" :key="index" @click="onImageClick(item.url)">
					<view class="swiper-item">
						<image :src="item.url" mode="aspectFill" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>

		<view class="cover-name">
			<view class="cover-name__info">
				<text class="cover-name__info-reward">封面：{{coverInfo.name}} x{{coverInfo.total}}</text>
				<view class="cover-desc__man">
					<view class="cover-desc__man-join">
						<text>{{coverInfo.totalPartiNum}}人参与活动</text>
					</view>
					<text class="cover-desc__man-get" @click="checkAllGets">{{coverInfo.gets.length}}人已领取</text>
				</view>
				<text class="cover-name__info-less">剩余：{{lessCover}}</text>
			</view>
			<button open-type="share">
				<image src="../../static/share2.png" mode="widthFix"></image>
				<text>分享</text>
			</button>
		</view>
		<task-item v-if="config.gzh" :desc="config.gzh.desc" :name="config.gzh.name" :image="config.gzh.image" :url="config.gzh.url"></task-item>
		<view class="cover-info">
			<view class="cover-info__num">
				<view v-for="(item, index) in numString" :key="index" class="cover-info__num-item" :class="item.mark?'cover-info__mark':''">
					<text>{{item.value}}</text>
				</view>
			</view>
			<view class="cover-info__tips">
				<text>
					1. 猜中 * 号中的部分即可获得完整封面序列号
					2. * 号可能为数字或字母
					3. 拼手速领封面，若此序列号在你猜中前被其他人领取，则领取失败,
					4. 当前每猜1次，消耗{{coverInfo.point}}积分
					5. 用户满{{coverInfo.point*coverInfo.ratio}}积分,可直接领取
				</text>
			</view>
			<view class="cover-info__btn">
				<button @click="changeNext">
					<image src="../../static/change.png" mode=""></image>
					<text>换下一个</text>
				</button>
				<button @click="onGetMore">
					<image src="../../static/more.png" mode=""></image>
					<text>获取更多积分</text>
				</button>
				<button class="cover-info__btn-yellow" @click="onStartTake">
					<text>直接领</text>
				</button>
			</view>
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<ad v-if="config.advInfo" :unit-id="config.advInfo.banner"></ad>
		<!-- #endif -->

		<view class="guess-view">
			<view class="guess-view__btn" @click="onStartGuess">
				<text>猜封面</text>
			</view>
			<view class="guess-view__data">
				<text @click="checkAllPartis">已经有{{coverInfo.totalPartiNum}}人参与，查看全部</text>
				<image src="../../static/right.png" mode=""></image>
			</view>
			<view class="guess-view__heads">
				<image v-for="(item, index) in coverInfo.partis" :key="index" :src="item.avatarUrl" mode=""></image>
			</view>
		</view>

		<!-- 提交信息 -->
		<uni-popup id="dialogInput" ref="dialogInput" type="dialog" @change="popupChange">
			<uni-popup-dialog v-if="serialNumInfo" mode="input" :title="'封面序列号('+ serialNumInfo.num + ')'" value="" placeholder="请输入完整的序列号"
			 @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>

		<uni-popup ref="popupShare" type="share" @change="change">
			<uni-popup-share title="请选择" :invitePoint="config.invitePoint" :videoAdPoint="config.videoAdPoint" @select="select"></uni-popup-share>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import uniPopupShare from '@/components/uni-popup/uni-popup-share.vue'
	import taskItem from '@/components/task-item/task-item.vue'
	var advUtil = require('@/common/utils/adv.js')
	export default {
		components: {
			uniPopupDialog,
			taskItem,
			uniPopupShare
		},
		data() {
			return {
				serialNumInfo: null,
				current: 0,
				mode: 'default',
				coverInfo: {
					imageBanner: [],
					gets: [],
					partis: [],
					totalPartiNum: 0,
					total: 0,
					point: 0,
					ratio: 50,
					name: ''
				},
				randNum: 0, //随机序列号
				config: this.$store.state.config,
				isFromInvite: false, //是否来自邀请

				// #ifdef MP-WEIXIN
				interstitialAd: null,
				rewardVideoAd: null,
				// #endif
			};
		},

		computed: {
			numString: function() {
				let nums = []
				if (this.serialNumInfo) {
					for (let i = 0; i < this.serialNumInfo.num.length; i++) {
						nums.push({
							index: i,
							value: this.serialNumInfo.num[i],
							mark: this.serialNumInfo.num[i] == '*'
						})
					}
				}
				return nums
			},
			//剩余封面
			lessCover: function() {
				return this.coverInfo.total - this.coverInfo.gets.length
			}
		},

		onShareAppMessage() {
			const nickName = this.$store.state.userInfo.nickName
			const inviteId = this.$store.state.userInfo._id
			const avatarUrl = this.$store.state.userInfo.avatarUrl
			let path = '/pages/index/index'
			let imageUrl = this.config.defaultImage
			let title = this.config.shareTitle
			if (this.isFromInvite) {
				path = '/pages/invite/invite?inviteId=' + inviteId + '&nickName=' + nickName + '&avatarUrl=' + avatarUrl
				this.isFromInvite = false
			}
			//如果封面设置了分享消息，则按封面的
			if (this.coverInfo.share) {
				title = this.coverInfo.share.title
				imageUrl = this.coverInfo.share.imageUrl
			}
			return {
				imageUrl: imageUrl,
				title: title,
				path: path
			}
		},

		onLoad(option) {
			// #ifdef H5
			// option.coverId = '600983deba58b00001e378bf'
			// #endif
			this.coverInfo.name = option.name
			console.log('coverId: ' + option.coverId)
			let getRand = this.getRandomSerialNum(option.coverId)
			let joinCover = this.joinCover(option.coverId)
			let getCover = this.getCover(option.coverId)
			uni.showLoading({
				title: '载入中',
				mask: true
			})
			Promise.all([getRand, joinCover, getCover]).then(res => {
				uni.hideLoading()
			}).catch(err => {
				console.warn(JSON.stringify(err))
				uni.hideLoading()
			})

			// #ifdef MP-WEIXIN
			this.initWechatAd()
			// #endif
		},

		methods: {
			onImageClick(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			initWechatAd: function() {
				this.rewardVideoAd = advUtil.initRewardVideoAd(() => {
					console.log('播放完成')
					uni.showLoading({
						title: '更新奖励中',
						mask: true
					})
					let afterPoint = this.$store.state.userInfo.point + this.config.videoAdPoint
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

			//参加这个封面活动
			joinCover: function(coverId) {
				return new Promise((resolve, reject) => {
					this.$api.joinCover({
						coverId: coverId
					}).then(res => {
						console.log('update joinCover success')
						resolve(res)
					}).catch(err => {
						console.warn('update joinCover err: ' + JSON.stringify(err))
						reject(err)
					})
				})
			},
			//获取封面信息
			getCover: function(coverId) {
				return new Promise((resolve, reject) => {
					this.$api.getCover({
						coverId: coverId
					}).then(res => {
						// console.log('getCover success：' + JSON.stringify(res.data))
						this.coverInfo = res.data
						console.log('partis: ' + JSON.stringify(this.coverInfo.partis))
						resolve(res)
					}).catch(err => {
						console.warn('getCover err: ' + JSON.stringify(err))
						reject(err)
					})
				})
			},
			//获取随机序列号
			getRandomSerialNum: function(coverId) {
				return new Promise((resolve, reject) => {
					this.$api.getRandomSerialNum({
						coverId: coverId,
						randNum: this.randNum
					}).then(res => {
						console.log('getRandomSerialNum: ' + JSON.stringify(res.data))
						this.serialNumInfo = res.data.serialNumInfo
						this.randNum = res.data.randNum
						resolve(res)
					}).catch(err => {
						reject(err)
						this.serialNumInfo = null
						uni.showModal({
							title: '提示',
							content: err.msg,
							confirmText: '返回首页',
							success: (res) => {
								if (res.confirm) {
									uni.switchTab({
										url: '../index/index'
									})
								}
							}
						})
					})
				})
			},
			swiperChange: function(e) {
				this.current = e.detail.current
			},
			popupChange: function(e) {
				console.log('popup ' + e.type + ' 状态', e.show)
			},
			//开始猜封面
			onStartGuess: function() {
				// #ifdef MP-WEIXIN
				if (this.interstitialAd != null) {
					this.interstitialAd.show().catch((err) => {
						console.error('插屏广告错误：' + JSON.stringify(err))
					})
				}
				// #endif
				if (this.serialNumInfo == null) {
					uni.showToast({
						title: '已领完，请尝试其他封面',
						icon: 'none'
					})
					return
				}
				this.$refs.dialogInput.open()
			},
			//直接领
			onStartTake: function() {
				if (this.serialNumInfo == null) {
					uni.showToast({
						title: '已领完，请尝试其他封面',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '领取中',
					mask: true
				})
				this.$api.startTake({
					serialId: this.serialNumInfo._id
				}).then(res => {
					console.log('onStartTake: ' + JSON.stringify(res))
					uni.showModal({
						title: '提示',
						content: res.msg,
						confirmText: '查看',
						success: (res) => {
							if (res.confirm) {
								uni.redirectTo({
									url: '../rewards/rewards'
								})
							}
						}
					})
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					uni.showModal({
						title: '提示',
						content: err.msg,
						showCancel: false,
					})
				})
			},
			//输入确认
			dialogInputConfirm: function(done, val) {
				console.log('___猜：' + JSON.stringify(this.serialNumInfo))
				done()
				if (this.serialNumInfo == null) {
					uni.showToast({
						title: '无法参与该活动，请查看其他封面',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '结果验证中',
					mask: true
				})
				this.$api.startGuess({
					serialId: this.serialNumInfo._id,
					guessNum: val
				}).then(res => {
					console.log('startGuess: ' + JSON.stringify(res))
					uni.hideLoading()
					uni.showModal({
						title: '恭喜',
						content: res.msg,
						confirmText: '查看',
						success: (res) => {
							if (res.confirm) {
								uni.redirectTo({
									url: '../rewards/rewards'
								})
							}
						}
					})
				}).catch(err => {
					console.warn('startGuess: ' + JSON.stringify(err))
					uni.hideLoading()
					uni.showModal({
						title: '提示',
						content: err.msg,
						showCancel: false,
					})
				})
			},
			//查看所有参加者
			checkAllPartis: function() {
				uni.navigateTo({
					url: '../allpartis/allpartis?coverId=' + this.coverInfo._id + '&total=' + this.coverInfo.totalPartiNum
				})
			},
			//查看所有领取者
			checkAllGets: function() {
				console.log('checkAllGets')
			},
			//切换序列号
			changeNext: function() {
				// #ifdef MP-WEIXIN
				if (this.interstitialAd != null) {
					this.interstitialAd.show().catch((err) => {
						console.error('插屏广告错误：' + JSON.stringify(err))
					})
				}
				// #endif

				uni.showLoading({
					title: '切换中',
					mask: true
				})
				let getRand = this.getRandomSerialNum(this.coverInfo._id)
				Promise.all([getRand]).then(res => {
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			},
			onGetMore: function() {
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
			}
		}
	}
</script>

<style lang="scss">
	$base-color : #ff3939;
	$base-text-color:#707070;

	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.swiper-box {
			height: 500rpx;

			.swiper-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background-color: #999;
				color: #fff;

				image {
					width: 750rpx;
				}
			}
		}

		.cover-name {
			display: flex;
			background-color: #fff;
			margin-bottom: 10px;
			padding: 6px 12px;
			box-sizing: border-box;
			justify-content: space-between;
			align-items: center;

			.cover-name__info {
				display: flex;
				flex-direction: column;

				.cover-name__info-reward {
					font-size: 30rpx;
					font-weight: bold;
					color: #4a0000;
				}

				.cover-name__info-less {
					font-size: 24rpx;
					color: $base-text-color;
				}
			}

			button {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				border: none;
				padding: 0;
				margin: 0;
				background-color: #fff;
				// border: 1px solid #d3e4ff;

				image {
					width: 70rpx;
				}

				text {
					font-size: 26rpx;
					color: $base-text-color;
					line-height: 1;
				}

				&::after {
					border: 0;
				}
			}

			.cover-desc__man {
				display: flex;
				align-items: center;

				.cover-desc__man-join {
					background-color: $base-color;
					text-align: center;
					border-radius: 2px;

					text {
						font-size: 20rpx;
						color: #fff;
						margin: 0 6px;
						display: block;
					}
				}

				.cover-desc__man-get {
					font-size: 20rpx;
					color: $base-color;
					font-weight: bold;
					margin: 0 6px;
				}
			}
		}

		.cover-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			background-color: #fff;
			padding: 12px 6px;
			box-sizing: border-box;
			background-color: #fff;
			margin: 10px 0;

			.cover-info__num {
				display: flex;
				width: 100%;
				flex-wrap: wrap;
				justify-content: center;
				margin-bottom: 10px;

				.cover-info__num-item {
					width: 58rpx;
					height: 58rpx;
					border: 1px solid #f1dada;
					text-align: center;
					background-color: $base-color;
					margin: 0 1px;
					border-radius: 3px;

					text {
						font-size: 40rpx;
						line-height: 58rpx;
						color: #fff;
					}
				}

				.cover-info__mark {
					background-color: #00aa7f;
				}
			}

			.cover-info__tips {
				background-color: #fff7f7;
				width: 700rpx;
				border-radius: 4px;
				padding: 4px;
				box-sizing: border-box;
				margin-bottom: 10px;

				text {
					color: #b98483;
					font-size: 20rpx;
					display: block;
				}
			}

			.cover-info__btn {
				display: flex;
				width: 100%;

				button {
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #fff;
					border: 1px solid $base-color;
					border-radius: 3px;

					image {
						width: 30rpx;
						height: 30rpx;
					}

					text {
						font-size: 24rpx;
						line-height: 60rpx;
						margin-left: 4px;
						color: $base-color;
					}
				}

				.cover-info__btn-yellow {
					background-color: #ff0000;

					text {
						color: #fff;
						line-height: 60rpx;
						font-weight: bold;
					}
				}
			}
		}

		.guess-view {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			width: 100%;

			.guess-view__btn {
				width: 200rpx;
				height: 200rpx;
				border-radius: 100rpx;
				margin-top: 10px;
				background-color: $base-color;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				position: relative;

				&::before {
					position: absolute;
					content: " ";
					top: 0;
					left: 0;
					width: 200rpx;
					height: 200rpx;
					border-radius: 50%;
					-webkit-animation: wave 1.2s linear infinite;
				}

				@keyframes wave {
					from {
						background-color: rgba(255, 0, 0, 0.4);
					}

					to {
						background-color: rgba(255, 0, 0, 0);
						transform: scale(1.2);
					}
				}

				@-webkit-keyframes wave {

					/* Safari and Chrome */
					from {
						background-color: rgba(255, 0, 0, 0.4);
					}

					to {
						background-color: rgba(255, 0, 0, 0);
						transform: scale(1.2);
					}
				}
			}

			.guess-view__data {
				display: flex;
				align-items: center;
				margin: 10px 0;

				image {
					width: 30rpx;
					height: 30rpx;
				}

				text {
					font-size: 22rpx;
					color: #555555;
				}
			}

			.guess-view__heads {
				display: flex;
				margin-bottom: 10px;

				image {
					width: 60rpx;
					height: 60rpx;
					margin: 2px;
					border-radius: 3px;
				}
			}
		}
	}
</style>
