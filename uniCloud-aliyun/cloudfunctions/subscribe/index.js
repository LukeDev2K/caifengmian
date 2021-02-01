'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('subscribe event : ', JSON.stringify(event))
	const {
		openid,
		templateId,
	} = event
	const message = await db.collection('message').doc(openid).get()
	console.log('exist message: ' + JSON.stringify(message.data))
	if (message.data.length > 0) {
		console.log('更新数据：' + openid)
		await db.collection('message').doc(openid).update({
			done: false
		})
	} else {
		const result = await db.collection('message').add({
			_id: openid, 
			templateId: templateId, // 订阅消息模板ID
			done: false, // 消息发送状态设置为 false
		});
	}

	return {
		code: 200,
		msg: '订阅消息成功'
	}
};
