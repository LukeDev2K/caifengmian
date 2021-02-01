<script>
	var commonUtil = require('@/common/utils/common.js')
	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.initUser()
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			initUser: function() {
				// #ifdef H5
				this.$store.state.userInfo = {
					// _id:'test421',
					// _id:'test421-----1234212',
					_id: 'oxiXk5PpDRYP0f_elJJnXMjYr-0g',
					avatarUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-ftvykkwi8cdb145ee4/49b60e10-4609-11eb-8ff1-d5dcf8779628.jpg'
				}
				return
				// #endif
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						const openid = this.$store.state.userInfo._id || ''
						const provider = res.provider
						if (openid == '') {
							commonUtil.getOpenId(provider,
								res => {
									this.getUserInfo(provider, res.openid)
								},
								errMsg => {
									console.log('errMsg: ' + errMsg)
								})
						} else {
							this.getUserInfo(provider, openid)
						}
					}
				})
			},

			getUserInfo: function(provider, openid) {
				commonUtil.getUserInfo(openid,
					userInfo => {
						console.log('getUserInfo: ' + JSON.stringify(userInfo))
						this.$store.dispatch('set_user_info', userInfo)
					},
					errCode => {
						console.log('errCode: ' + errCode)
						if (errCode == -1) {
							uni.navigateTo({
								url: '../authorize/authorize?provider=' + provider + '&openid=' + openid
							})
						} else {
							uni.showToast({
								title: '获取用户信息失败',
								icon: 'none'
							})
						}
					})
			},
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';

	page {
		background-color: #f4f4f4;
	}
</style>
