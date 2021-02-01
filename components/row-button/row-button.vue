<template>
	<view>
		<button :open-type="oepnType" class="row-button" @click="onBtnClick" hover-class="hover-class">
			<view class="row-button__left">
				<image :src="icon" mode="widthFix"></image>
				<text>
					<slot></slot>
				</text>
			</view>
			<view class="row-button__right">
				<image src="../../static/right.png" mode=""></image>
			</view>
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				 
			};
		},
		computed:{
			oepnType:function(){
				if(this.type == 'share' || this.type == 'contact') {
					return this.type
				}
				return ''
			}
		},
		props: {
			icon: {
				type: String,
				default: ''
			},
			type: {
				type:String,
				default:''
			}
		},
		methods: {
			onBtnClick: function() {
				this.$emit('onBtnClick', this.type)
			}
		}
	}
</script>

<style lang="scss">
	.row-button {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1px;

		&::after {
			border: none;
			border-radius: 0;
		}

		.row-button__left {
			display: flex;
			width: 100%;
			height: 50rpx;

			image {
				width: 50rpx;
			}

			text {
				line-height: 50rpx;
				font-size: 30rpx;
				color: #333333;
				margin-left: 6px;
			}
		}

		.row-button__right {
			width: 100%;
			height: 50rpx;
			width: 50rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.hover-class {
		background-color: #f0f0f0;
	}
</style>
