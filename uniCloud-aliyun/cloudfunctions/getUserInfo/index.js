'use strict';
const db = uniCloud.database()
const dbCmd = db.command
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + JSON.stringify(event))
	const {
		openid
	} = event
	if (!openid) {
		console.log("cant get openid")
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}
	const dataId = openid.substring(openid.length - 5);
	const userInfo = await db.collection('user').doc(openid).get()
	console.log('dataId: ' + dataId)
	let data = []
	if (userInfo.data.length == 0) {
		//新增数据
		data = {
			_id: openid,
			nickName: "dtuser-" + dataId,
			gender: 1,
			language: "zh_CN",
			city: "Guangzhou",
			province: "Guangdong",
			country: "China",
			avatarUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-ftvykkwi8cdb145ee4/49b60e10-4609-11eb-8ff1-d5dcf8779628.jpg",
			lastSignTime: '', //上次签到时间 
			guessTime: 0,
			point: 10, //积分送10
		}
		await db.collection('user').add(data)
	} else {
		data = userInfo.data[0]
		const partiInfos = await db.collection('participate').where({
			openid: openid
		}).get()
		const takeSerialInfos = await db.collection('serial-num').where({
			takeUser: openid,
			isGot: true
		}).get()
		const inviteInfos = await db.collection('invite').where({
			openid: openid
		}).get()
		data.partiNum = partiInfos.data.length
		data.takeNum = takeSerialInfos.data.length
		data.inviteNum = inviteInfos.data.length
	}
	console.log("userInfo: " + JSON.stringify(data))
	//返回数据给客户端
	return {
		code: 200,
		msg: '获取数据成功',
		data: data
	}
};
