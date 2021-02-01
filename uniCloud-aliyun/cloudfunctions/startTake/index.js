'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + JSON.stringify(event))
	const {
		openid, //用户的id 
		serialId, //序列号id
	} = event
	if (!openid) {
		console.log("cant get openid")
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}
	const userInfos = await db.collection('user').doc(openid).get()
	if (userInfos.data.length == 0) {
		return {
			code: 205,
			msg: '没有这个用户'
		}
	}

	const serialInfo = await db.collection('serial-num').doc(serialId).get()
	if (serialInfo.data.length == 0) {
		return {
			code: 202,
			msg: '找不到序列号'
		}
	}
	const currentSerial = serialInfo.data[0]
	console.log('currentSerial: ' + JSON.stringify(currentSerial))
	const coverInfos = await db.collection('cover').doc(currentSerial.coverId).get()
	if (coverInfos.data.length == 0) {
		return {
			code: 206,
			msg: '没有这个封面id'
		}
	}
	
	if (currentSerial.isGot) {
		return {
			code: 203,
			msg: '该序列号已被领走，换下一个吧'
		}
	}

	let currentCover = coverInfos.data[0]
	let currentUser = userInfos.data[0]
	console.log('needPoint: ' + currentCover.point + '  currentPoint: ' + currentUser.point)
	if (currentCover.point * currentCover.ratio > currentUser.point) {
		return {
			code: 207,
			msg: '积分不足，当前需要积分：' + currentCover.point * currentCover.ratio
		}
	}  

	//更新序列号----------------------
	const updateSerialNumRes = await db.collection('serial-num').doc(serialId).update({
		takeUser: openid,
		userAvatarUrl: currentUser.avatarUrl,
		isGot: true,
		gotType:'direct',
		takeDate: new Date().toLocaleString('zh', {
			hour12: false,
			timeZone: 'Asia/Shanghai'
		})
	}) 
	//更新序列号----------------------
	
	const lessPoint = currentUser.point - currentCover.point * currentCover.ratio 
	await db.collection('user').doc(openid).update({
		point: lessPoint
	})

	return {
		code: 200,
		msg: '领取成功，请尽快兑换并使用',
		data: {
			serialNum: currentSerial.num
		}

	}
};
