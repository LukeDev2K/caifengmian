import api from '../api/index.js';

function getAlbumPermission(succ, reject) {
	uni.getSetting({
		success: function success(res) {
			// 如果没有则获取授权
			if (!res.authSetting["scope.writePhotosAlbum"]) {
				uni.authorize({
					scope: "scope.writePhotosAlbum",
					success: function() {
						succ()
					},
					fail: function(err) {
						reject(err)
					}
				});
			} else {
				succ()
			}
		}
	});
}

function getOpenId(provider, succ, reject) {
	uni.login({
		provider: provider,
		success: (res) => {
			api.getOpenId({
				code: res.code
			}).then(res => {
				console.log(JSON.stringify(res))
				succ(res.data)
			}).catch(err => {
				reject('网络请求失败: ' + JSON.stringify(err))
			})
		},
		fail: (err) => {
			reject('请求provider失败')
		}
	})
}

function getUserInfo(openid, succ, reject) {
	api.getUserInfo({
		openid: openid
	}).then(res => {
		succ(res.data)
		if (res.data.nickName.indexOf('dtuser-') != -1) {
			reject(-1)
		}
	}).catch(err => {
		console.log('api.getUserInfo: ' + JSON.stringify(err))
		reject(-2)
	})
}

function subsribe(templateId, succ, fail) {
	uni.requestSubscribeMessage({ //获取下发权限
		tmplIds: [templateId], //此处写在后台获取的模板ID，可以写多个模板ID，看自己的需求
		success: (res) => {
			if (res[templateId] == 'accept') { //accept--用户同意 reject--用户拒绝 ban--微信后台封禁,可不管
				api.subscribe({
					templateId: templateId
				}).then(res => {
					console.log('订阅消息同步服务器成功')
					succ(res)
				}).catch(err=>{
					fail(err)
				})
			}
		}
	})
}

module.exports = {
	getAlbumPermission: getAlbumPermission,
	getOpenId: getOpenId,
	getUserInfo: getUserInfo,
	subsribe: subsribe,
}
