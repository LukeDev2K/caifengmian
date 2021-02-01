'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + JSON.stringify(event))
	const {
		openid, //用户的id
		coverId,
	} = event
	if (!openid) {
		console.log("cant get openid")
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}
	if (!coverId) {
		return {
			code: 203,
			msg: '封面id错误'
		}
	}
	const userInfos = await db.collection('user').doc(openid).get()
	if (userInfos.data.length == 0) {
		return {
			code: 204,
			msg: '没有这个用户'
		}
	}
	const coverInfo = await db.collection('cover').doc(coverId).get()
	if (coverInfo.data.length == 0) {
		return {
			code: 202,
			msg: '没有这个封面信息'
		}
	}

	const partiInfos = await db.collection('participate').where({
		openid: openid,
		coverId: coverId
	}).get()

	if (partiInfos.data.length > 0) {
		return {
			code: 205,
			msg: '已添加过记录'
		}
	}

	await db.collection('participate').add({
		openid: openid,
		coverId: coverId,
		avatarUrl:userInfos.data[0].avatarUrl,
		joinDate: new Date().toLocaleString('zh', {
			hour12: false,
			timeZone: 'Asia/Shanghai'
		})
	}) 

	return {
		code: 200,
		msg: '添加数据成功'
	}
};
