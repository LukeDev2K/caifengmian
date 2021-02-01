'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	const messages = await db.collection('message').where({
		done: false
	}).get()
	const tokenData = await uniCloud.callFunction({
		name: 'getAccessToken'
	})
	console.log('tokenData: ' + JSON.stringify(tokenData.result.data))
	for (var i = 0; i < messages.data.length; i++) {
		const userid = messages.data[i]._id
		console.log('发送订阅消息： ' + messages.data[i].templateId)
		const requireUrl = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + tokenData.result.data
			.access_token
		const res = await uniCloud.httpclient.request(requireUrl, {
			method: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				touser: userid,
				template_id: messages.data[i].templateId,
				page: 'pages/index/index',
				data: {
					"name4": { //推荐人
						"value": '干饭工具' //这个值是下发给用户的信息
					},
					"thing5": { //温馨提示
						"value": '最新封面已更新，点击领取❤️'
					},
					"thing1": { //作品名称
						"value": '小小财神到'
					},
					"thing6": { //推荐理由
						"value": '有意思的封面，总有你想要的，快来看看吧'
					},
					"time2": { // 
						"value": '2021-1-1'
					},
				},
			})
		})
		console.log('res: ' + res.data.errcode)
		if (res.data.errcode == 0) {
			await db.collection('message').doc(userid).update({
				done: true
			})
		}
	}
	//返回数据给客户端
	return {
		code: 200,
		msg: '发送成功',
	}
};
