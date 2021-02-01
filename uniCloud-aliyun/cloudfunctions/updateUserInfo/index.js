'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + JSON.stringify(event))
	const {
		openid, //openid 
		nickName,
		gender,
		language,
		city,
		province,
		country,
		avatarUrl,
		lastSignTime,
		invites,
		joins,
		point,
	} = event
	if (!openid) {
		console.log("cant get openid")
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}
	const userInfo = await db.collection('user').doc(openid).get()
	if (userInfo.data.length > 0) {
		await db.collection('user').doc(openid).update({
			nickName: nickName || userInfo.data[0].nickName,
			gender: gender || userInfo.data[0].gender,
			language: language || userInfo.data[0].language,
			city: city || userInfo.data[0].city,
			province: province || userInfo.data[0].province,
			country: country || userInfo.data[0].country,
			avatarUrl: avatarUrl || userInfo.data[0].avatarUrl,
			lastSignTime: lastSignTime || userInfo.data[0].lastSignTime,
			invites: invites || userInfo.data[0].invites,
			joins: joins || userInfo.data[0].joins,
			point: point || userInfo.data[0].point
		})
		return {
			code: 200,
			msg: '更新数据成功'
		}
	}
	return {
		code: 202,
		msg: '找不到用户：' + openid
	}
};
