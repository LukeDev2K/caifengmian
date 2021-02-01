<template>
	<view>
		<view class="container">
			<text class="title">共{{total}}人参与，积分越多，竞猜次数越多</text>
			<view class="partis">
				<image v-for="(item, index) in partis" :key="item._id" :src="item.avatarUrl"
				 mode=""></image> 
			</view>
			<text class="load-btn" @click="loadPartis(currentPage)">{{loadingTips}}</text>
			
			<!-- #ifdef MP-WEIXIN -->
			<ad v-if="config.advInfo" :unit-id="config.advInfo.video" ad-type="video" ad-theme="white"></ad>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				config: this.$store.state.config,
				total: 0,
				loading: false,
				noMore: false,
				loadingTips: '加载更多...',
				currentPage: 0,
				pageSize: 100,
				coverId:'',
				partis:[]
			};
		},
		onLoad(option) {
			this.coverId = option.coverId
			this.total = option.total
			// #ifdef H5
			// this.coverId = '600983deba58b00001e378bf'
			// this.total = 100
			// #endif
			this.loadPartis(this.currentPage)
		},
		methods: {
			loadPartis: function(current) {
				if (this.noMore) return
				if (this.loading) return
				this.loadingTips = '加载中...'
				this.loading = true

				this.$api.getCoverPartis({
					pageSize: this.pageSize,
					page: current + 1,
					coverId: this.coverId
				}).then(res => {
					console.log(JSON.stringify(res.data))
					//插入数据
					res.data.forEach(item => {
						this.partis.push(item)
					})

					if (res.data.length < this.pageSize) {
						this.loadingTips = '没有更多了'
						this.noMore = true
					} else {
						this.loadingTips = '加载更多...'
					}
					this.currentPage++
					this.loading = false
				}).catch(err => {
					this.loadingTips = '加载更多...'
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;

		.title {
			font-size: 28rpx;
			color: #969696;
			margin: 10px 0;
		}

		.partis {
			width: 700rpx;
			display: flex;
			flex-wrap: wrap; 

			image {
				width: 70rpx;
				height: 70rpx;
				padding: 1px;
				box-sizing: border-box;
			}
		}

		.load-btn {
			margin-top: 10px;
			font-size: 28rpx;
			color: #00aaff;
		}
	}
</style>
