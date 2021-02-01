'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		openid, //openid 
		inviteId
	} = event
	if (!openid || !inviteId) {
		console.log("cant get userId")
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}
	if (openid == inviteId) {
		return {
			code: 204,
			msg: '不能自己邀请自己'
		}
	}
	const myInfo = await db.collection('user').doc(openid).get()
	const inviteInfo = await db.collection('user').doc(inviteId).get()
	if (myInfo.data.length == 0 || inviteInfo.data.length == 0) {
		return {
			code: 202,
			msg: '无效用户'
		}
	}
	const inviteDatas = await db.collection('invite').where({
		openid: inviteId, //查找邀请id的数据，看有没有包含openid
		inviteId: openid
	}).get()
	if (inviteDatas.data.length > 0) {
		return {
			code: 203,
			msg: '已接受过邀请'
		}
	}
	await db.collection('invite').add({
		openid: inviteId,
		inviteId: openid,
		nickName: myInfo.data[0].nickName,
		avatarUrl: myInfo.data[0].avatarUrl,
		inviteDate: new Date().toLocaleString('zh', {
			hour12: false,
			timeZone: 'Asia/Shanghai'
		})
	})
	const configInfo = await db.collection('config').get()
	console.log('invitePoint: ' + configInfo.data[0].invitePoint)
	const point = inviteInfo.data[0].point + configInfo.data[0].invitePoint // 
	console.log('afterPoint: ' + point)
	await db.collection('user').doc(inviteId).update({
		point: point
	})
	return {
		code: 200,
		msg: '谢谢你帮我助力',
		data: {
			point: point
		}
	}
};
