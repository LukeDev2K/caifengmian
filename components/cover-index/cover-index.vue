<template>
	<view class="cover-card" @click="onCoverDetail">
		<view class="cover-card__item">
			<image class="cover-card__item-img" :src="image" mode="aspectFill"></image>
			<text class="cover-card__item-text">
				{{name}}{{subName}}
			</text>
			<view class="cover-card__info">
				<image class="cover-card__info-img" src="../../static/join.png" mode="widthFix"></image>
				<text class="cover-card__info-text">参与人数：{{join}}人</text>
			</view>
			<view v-if="less>0" class="cover-card__tips">
				<image src="../../static/hot.png" mode="widthFix"></image>
				<text>立即领取</text>
			</view>
			<view v-if="less<=0" class="cover-card__empty">
				<text>全部领完</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
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
			subName: {
				type: String,
				default: ''
			},
			coverId: {
				type: String,
				default: ''
			},
			join: {
				type: Number,
				default: 0
			},
			less: {
				type: Number,
				default: 0
			} 
		},
		methods: {
			onCoverDetail: function() {
				console.log('videoId: ' + this.coverId)
				uni.navigateTo({
					url: '../../pages/guess/guess?coverId=' + this.coverId + '&name=' + this.name
				})
			}
		}
	}
</script>

<style lang="scss">
	.cover-card {
		width: 250rpx;
		margin-bottom: 14px;
		display: flex;
		justify-content: center;

		.cover-card__item {
			border-radius: 6px;
			background-color: #fff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 240rpx;
			height: 400rpx;
			padding: 6px;
			box-sizing: border-box;
			// overflow: hidden;

			.cover-card__item-img {
				width: 100%;
				height: 300rpx;
				border-radius: 4px;
			}

			.cover-card__item-text {
				font-size: 24rpx;
				width: 100%;
				color: #444444;
				margin-top: 10rpx;
				font-weight: bold;
				text-align: center;
			}

			.cover-card__info {
				display: flex;
				align-items: center;
				width: 100%;
				margin-top: 4px;

				.cover-card__info-img {
					width: 24rpx;
					height: 24rpx;
					border-radius: 12rpx;
				}

				.cover-card__info-text {
					font-size: 18rpx;
					margin-left: 4px;
					color: #989898;
				}
			}

			.cover-card__tips {
				background-color: #ffeeef;
				width: 100%;
				height: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 3px;
				border: 1px solid #ffb8b9;
				margin-top: 4px;

				image {
					width: 24rpx;
					color: #007AFF;
				}

				text {
					font-size: 20rpx;
					font-weight: bold;
					color: #ff0000; 
				}
			}

			.cover-card__empty {
				background-color: #dedede;
				width: 100%;
				height: 50rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 3px;
				border: 1px solid #ababab;
				margin-top: 4px; 

				text {
					font-size: 20rpx; 
					margin: 0 4px;
					color: #797979; 
				}
			}
		}
	}
</style>
