'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + JSON.stringify(event))

	let datas = {
		'appid': 'your appid',
		'secret': 'your secret',
		'grant_type': 'client_credential'
	}
	let requireUrl = 'https://api.weixin.qq.com/cgi-bin/token'

	const tokens = await db.collection('token').get()
	const lenght = tokens.data.length
	const currentTime = new Date()
	console.log('lenght: ' + lenght + ' currentTime: ' + currentTime.getTime())
	let token = {}
	let isExpires = true
	if (lenght > 0) {
		console.log('token: ' + JSON.stringify(tokens.data[lenght - 1]))
		token = tokens.data[lenght - 1]
		const diff = getTimeDiff(token.createTime, currentTime)
		if (token.expires_in - diff > 1000) {
			//没过期
			isExpires = false
			console.log('本地拿')
		} else {
			//过期
			isExpires = true
			await db.collection('token').doc(token._id).update({
				expires_in: 0
			})
		}
	}
	if (isExpires) {
		const createTime = currentTime.toISOString()
		var res = await uniCloud.httpclient.request(requireUrl, {
			method: 'POST',
			dataType: 'json',
			data: datas
		})
		console.log("res: " + JSON.stringify(res.data))
		token = {
			...res.data,
			createTime
		}
		await db.collection('token').add(token)

	}
	//返回数据给客户端
	return {
		code: 200,
		msg: '获取access_token成功',
		data: {
			'access_token': token.access_token
		}
	}
};

function getTimeDiff(last, current) {
	// console.log('last: ' + last + '  current: ' + current)
	console.log('last1: ' + Date.parse(last) + '  current1: ' + Date.parse(current))
	const timeDiff = (Date.parse(current) - Date.parse(last)) / 1000
	console.log('timeDiff: ' + timeDiff)
	return timeDiff
}
