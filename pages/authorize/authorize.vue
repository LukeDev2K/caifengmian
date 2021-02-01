<template>
	<view class="container">
		<view class="main">
			<image class="logo" src="../../static/logo.png" mode=""></image>
			<text class="tips-title">微信小程序授权</text>
			<text class="tips-title-content">首次使用小程序，为保证小程序正常功能，请点击授权</text>
			<button class="btn" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">
				<image src="../../static/auth.png" mode="widthFix"></image>
				<text>授权登录</text>
			</button>
			<button class="btn" @click="onCancel">
				<image src="../../static/back.png" mode="widthFix"></image>
				<text class="dark">取消</text>
			</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return { 
				provider:'',
				openid:'',
			};
		},
		onLoad(option) { 
			this.provider = option.provider
			this.openid = option.openid
		},
		methods:{
			onCancel: function(){
				uni.navigateBack({
					delta:1
				})
			},
			getUserInfo: function() {
				uni.getUserInfo({
					provider:this.provider,
					success: (res) => { 
						var userInfo = this.$store.state.userInfo
						userInfo._id = this.openid
						userInfo.nickName = res.userInfo.nickName
						userInfo.gender = res.userInfo.gender
						userInfo.language = res.userInfo.language
						userInfo.city = res.userInfo.city
						userInfo.province = res.userInfo.province
						userInfo.country = res.userInfo.country
						userInfo.avatarUrl = res.userInfo.avatarUrl
						
						uni.showLoading({
							title:'数据同步中...',
							mask:true
						})
						this.$api.updateUserInfo(userInfo).then(res=>{
							uni.hideLoading()
							console.log('updateUserInfo: ' + JSON.stringify(res))
							this.$store.dispatch('set_user_info', userInfo)
							uni.navigateBack({
								delta:1
							})
						}).catch(err=>{
							uni.hideLoading()
							console.error('updateUserInfo warn: ' + JSON.stringify(err))
							uni.showToast({
								title:'更新用户数据发生错误',
								icon:'none'
							})
							uni.navigateBack({
								delta:1
							})
						})
					},
					fail: (err) => {
						console.error('getUserInfo err: ' + JSON.stringify(err))
						uni.showToast({
							title:'授权失败，请点击允许',
							icon:'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}
	.container {
		width: 100%;
		display: flex;
		justify-content: center;  

		.main {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 600rpx;

			.logo {
				width: 120rpx;
				height: 120rpx;
				margin-top: 200rpx;
				margin-bottom: 10px;
			}

			.tips-title {
				font-size: 40rpx;
				font-weight: bold;
				color: #101010;
			}

			.tips-title-content {
				font-size: 30rpx;
				color: #5a5a5a;
				margin: 10px 0;
				text-align: center;
			}

			.btn {
				width: 100%;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 5px 0;

				image {
					width: 50rpx;
					height: 50rpx;
					margin-right: 5px;
				}

				text {
					font-size: 30rpx;
					color: #ffffff;
				}

				.dark {
					color: #515151;
				}
			}
		}
	}
</style>
