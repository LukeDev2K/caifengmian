import store from '../../store/index.js';

function initInterstitialAd() {
	if (wx.createInterstitialAd && store.state.config.advInfo) {
		let interstitialAd = wx.createInterstitialAd({
			adUnitId: store.state.config.advInfo.inters
		})
		interstitialAd.onLoad(() => {
			console.log('onLoad event emit')
		})
		interstitialAd.onError((err) => {
			console.log('onError event emit', err)
		})
		interstitialAd.onClose((res) => {
			console.log('onClose event emit', res)
		})

		return interstitialAd
	}

	return null
}

function initRewardVideoAd(onEnd) {
	// 在页面中定义激励视频广告
	let videoAd = null

	// 在页面onLoad回调事件中创建激励视频广告实例
	if (wx.createRewardedVideoAd && store.state.config.advInfo) {
		videoAd = wx.createRewardedVideoAd({
			adUnitId: store.state.config.advInfo.rewardVideo
		})
		videoAd.onLoad(() => {})
		videoAd.onError((err) => {})
		videoAd.onClose((res) => {
			// 用户点击了【关闭广告】按钮
			if (res && res.isEnded) {
				// 正常播放结束，可以下发游戏奖励
				onEnd()
			}
		})
	}
	
	return videoAd
}

module.exports = {
	initInterstitialAd: initInterstitialAd,
	initRewardVideoAd: initRewardVideoAd
}
