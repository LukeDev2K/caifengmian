<template>
	<view class="container">
		<view class="top-banner">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="interval" :duration="duration">
				<swiper-item v-for="(item, index) in advs" :key="item._id" @click="onBannerClick(item)">
					<view class="swiper-item">
						<image :src="item.bannerPic" mode=""></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<ad v-if="config.advInfo" :unit-id="config.advInfo.banner"></ad>
		<!-- #endif -->
		
		<view class="notice-view" v-if="noticeContent">
			<uni-notice-bar :show-icon="true" :scrollable="true" :single="true" :text="noticeContent" />
		</view>
		
		<view class="content">
			<cover-index v-for="(item,index) in coverIndexList" :key="item._id" :image="item.mainBanner" :coverId="item._id"
			 :join="item.partiNum" :less="item.lessNum" :name="item.name" :subName="'(' + item.lessNum + '/' + item.total + ')'"></cover-index>
		</view>

		<view class="subscribe-btn" @click="onSubscribe">
			<image src="../../static/subsribe.png" mode="widthFix"></image>
		</view>
		<uni-load-more iconType="snow" :status='loadMoreStatus'></uni-load-more>
	</view>
</template>

<script>
	import coverIndex from '@/components/cover-index/cover-index.vue'
	import noticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	var advUtil = require('@/common/utils/adv.js')
	var commonUtil = require('@/common/utils/common.js')
	export default {
		components: {
			coverIndex,
			noticeBar
		},
		data() {
			return {
				noticeContent: '',
				background: ['color1', 'color2', 'color3'],
				interval: 2000,
				duration: 500,
				coverIndexList: [],
				noMoreCovers: false, //没有更多封面
				loadingCovers: false,
				advs: [],
				pageSize: 9,
				currentPage: 0,
				loadMoreStatus: 'loading',
				config: this.$store.state.config
			}
		},
		onLoad(option) {
			this.loadCovers(this.currentPage)
			this.initConfig()
			this.loadAdvs()
			this.getNotices()
		},
		onReachBottom() {
			console.log('  onReachBottom: ')
			this.loadCovers(this.currentPage)
		},
		onShareAppMessage() {
			return {
				imageUrl: this.$store.state.config.defaultImage,
				title: this.$store.state.config.shareTitle,
				path: '/pages/index/index',
			}
		},
		methods: {
			onSubscribe: function() {
				console.log('发起订阅')
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
			
			getNotices: function() {
				this.$api.getNotices().then(res=>{
					for(let i=0;i<res.data.length;i++) {
					console.log('notices: ' + res.data[i].content)
						this.noticeContent += res.data[i].content +  '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' 
					}
				})
			},

			initConfig: function() {
				this.$api.getConfig().then(res => {
					console.log('config: ' + JSON.stringify(res.data))
					this.$store.dispatch('set_config', res.data)
					this.config = res.data

					// #ifdef MP-WEIXIN
					let interstitialAd = advUtil.initInterstitialAd()
					console.log('interstitialAd: ' + interstitialAd)
					if (interstitialAd != null) {
						setTimeout(() => {
							interstitialAd.show().catch((err) => {
								console.error('插屏广告错误：' + JSON.stringify(err))
							})
						}, 12000)
					}
					// #endif
				})
			},

			loadCovers: function(current) {
				if (this.noMoreCovers) return
				if (this.loadingCovers) return
				console.log('noMore: ' + this.noMoreCovers + ' loading: ' + this.loadingCovers)
				this.loadMoreStatus = 'loading'
				this.loadingCovers = true
				this.$api.getAllCovers({
					pageSize: this.pageSize,
					page: current + 1,
				}).then(res => {
					// console.log('getAllCovers: ' + JSON.stringify(res.data))
					this.loadingCovers = false
					//插入数据
					res.data.forEach(item => {
						this.coverIndexList.push(item)
					})
					console.log('size: ' + res.data.length)
					if (res.data.length < this.pageSize) {
						this.loadMoreStatus = 'noMore'
						this.noMoreCovers = true
					} else {
						this.loadMoreStatus = 'more'
					}
					this.currentPage++
				}).catch(err => {
					console.warn('loadCovers: ' + JSON.stringify(err))
					this.loadMoreStatus = 'more'
					this.loadingCovers = false
				})
			},

			loadAdvs: function() {
				this.$api.getAdvs().then(res => {
					console.log('getAdvs success: ' + res.data.length)
					this.advs = res.data
				})
			},

			onBannerClick: function(item) {
				//#ifdef H5
				window.location.href = item.url
				//#endif
				//微信小程序
				//#ifdef MP-WEIXIN
				if (item.minapp) {
					wx.navigateToMiniProgram({
						appId: item.minapp.appid,
						path: item.minapp.path,
					})
				}
				//#endif
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.top-banner {
			width: 100%;
			padding: 6px;
			box-sizing: border-box;

			.swiper {
				height: 300rpx;

				.swiper-item {
					display: block;
					height: 300rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 4px;
					}
				}
			}
		}

		.content {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			width: 100%;
		}

		.subscribe-btn {
			position: fixed;
			margin-right: 20px;
			background-color: #fff;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			right: 0;
			bottom: 100rpx;
			border: 1px #e7e7e7 solid;

			image {
				width: 60rpx;
			}
		}
	}
</style>
