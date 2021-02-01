<template>
	<view>
		<view v-for="(get, i) in serialGets" :key="i" class="serial-card">
			<view class="image-content">
				<image :src="get.mainBanner" mode=""></image>
			</view>
			<view class="num-content">
				<text class="num-content__name">{{get.name}}</text>
				<view class="cover-info__num">
					<view v-for="(item, index) in get.num" :key="index" class="cover-info__num-item" :class="item.mark?'cover-info__mark':''">
						<text>{{item}}</text>
					</view>
				</view>
				<view class="cover-card__tips">
					<view class="cover-card__tips-txt">
						<text>获得时间：{{get.takeDate}}</text>
						<text class="tips-child" :class="!get.autoTake?'add-bg':''">{{get.autoTake?'若没有兑换，请尽快处理':'需要联系公众号领取'}}</text>
					</view>
					<view class="cover-card__go" @click="onTake(get.num)">
						<text>{{get.autoTake?'复制序列号':'关注公众号'}}</text>
						<image src="../../static/right.png" mode="widthFix"></image>
					</view>
				</view>
			</view>

		</view>
		<uni-load-more iconType="snow" :status='loadMoreStatus'></uni-load-more>

		<!-- #ifdef MP-WEIXIN -->
		<ad v-if="config.advInfo" :unit-id="config.advInfo.video" ad-type="video" ad-theme="white"></ad>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serialGets: [],
				takeUrl: '',
				config: this.$store.state.config,
				pageSize: 10,
				currentPage: 0,
				loadMoreStatus: 'loading',
				loadingRewardGets: false
			};
		},

		onLoad() {
			this.takeUrl = this.$store.state.config.takeUrl
			console.log('takeUrl: ' + this.takeUrl)
			this.loadRewardGets(this.currentPage)
		},
		onReachBottom() {
			console.log('  onReachBottom: ')
			this.loadRewardGets(this.currentPage)
		},
		methods: {
			loadRewardGets: function(current) {
				if (this.noMoreCovers) return
				if (this.loadingRewardGets) return
				this.loadMoreStatus = 'loading'
				this.loadingRewardGets = true

				this.$api.getRewardGets({
					pageSize: this.pageSize,
					page: current + 1,
				}).then(res => {
					console.log(JSON.stringify(res.data))
					//插入数据
					res.data.forEach(item => {
						this.serialGets.push(item)
					})

					if (res.data.length < this.pageSize) {
						this.loadMoreStatus = 'noMore'
						this.noMoreCovers = true
					} else {
						this.loadMoreStatus = 'more'
					}
					this.currentPage++
					this.loadingRewardGets = false
				}).catch(err => {
					this.loadMoreStatus = 'more'
					this.loadingRewardGets = false
				})
			},
			onTake: function(num) {
				uni.setClipboardData({
					data: num,
				});
				uni.navigateTo({
					url: '../webview/webview?src=' + this.takeUrl
				})
			}
		}
	}
</script>

<style lang="scss">
	.serial-card {
		display: flex;
		background-color: #fff;
		margin-top: 10px;
		padding: 10px;
		box-sizing: border-box;

		.image-content {
			width: 160rpx;
			height: 200rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 3px;
			}
		}

		.num-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 10px;
			flex: 1;

			.num-content__name {
				font-weight: bold;
				font-size: 32rpx;
				color: #3d3d3d;
			}

			.cover-info__num {
				display: flex;
				width: 100%;
				flex-wrap: wrap;
				justify-content: center;
				margin-bottom: 10px;

				.cover-info__num-item {
					width: 40rpx;
					height: 40rpx;
					border: 1px solid #f1dada;
					text-align: center;
					margin: 0 1px;
					border-radius: 3px;

					text {
						font-size: 40rpx;
						line-height: 40rpx;
						color: #3d3d3d;
					}
				}
			}

			.cover-card__tips {
				display: flex;
				// border: 1px solid #007AFF;
				width: 100%;
				align-items: center;

				.cover-card__tips-txt {
					font-size: 20rpx;
					color: #a7a7a7;
					display: flex;
					flex-direction: column;

					.tips-child {
						font-weight: bold;
						color: #007AFF;
						font-size: 24rpx;
						padding-left: 4px;
					}
					
					.add-bg {
						background-color: #ff0000;
						color: #fff;
						padding-left: 4px;
						border-radius: 3px;
					}
				}

				.cover-card__go {
					background-color: #ffeeef;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: right;
					border: 1px solid #ffb8b9;
					border-radius: 4px;
					margin-left: auto;

					image {
						width: 40rpx;
					}

					text {
						font-size: 20rpx;
						font-weight: bold;
						color: #ff0000;
						margin-left: 6px;
					}
				}
			}
		}
	}
</style>
