'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	const {
		openid,
		coverId,
		randNum,
	} = event
	if (!openid) {
		console.log("cant get openid")
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	} 
	if (!coverId) {
		console.log("cant get coverId")
		return {
			code: 202,
			msg: '封面id错误'
		}
	}
	const userData = await db.collection('user').doc(openid).get()
	if (userData.data.length == 0) {
		return {
			code: 203,
			msg: '没有这个用户'
		}
	}
	const coverData = await db.collection('cover').doc(coverId).get()
	if (coverData.data.length == 0) {
		return {
			code: 204,
			msg: '没有这个封面'
		}
	}
	//检查当前没有领取的封面
	const nums = await db.collection('serial-num').where({
		coverId: coverId,
		isGot: false
	}).get()
	
	if(nums.data.length == 0) {
		return {
			code: 204,
			msg: '当前封面序列号已被全部领取！'
		}
	}
	console.log('random__' + randNum)
	let newRandom = random(0, nums.data.length)
	while (newRandom == randNum && nums.data.length > 1) {
		newRandom = random(0, nums.data.length)
		console.log('重新生成： ' + newRandom)
	}
	console.log(newRandom + '__nums: ' + JSON.stringify(nums.data))
	let serialData = null
	for (let i = 0; i < nums.data.length; i++) {
		//取随机序列号
		if (i == newRandom) {
			serialData = nums.data[i]
			break
		}
	}
	if (serialData == null) {
		return {
			code: 203,
			msg: '获取序列号失败'
		}
	}
	const startStr = (coverData.data[0].autoTake?'AU':'MA') + coverData.data[0].no//如果是自动领取的话，则‘AU’卡头
	const newSerialNum = startStr + serialData.num.slice(4)//拼接新的兑换码
	console.log('new startStr: ' + coverData.data[0].no)
	console.log('new serial: ' + newSerialNum)
	serialData.num = changeStr(newSerialNum, serialData.keyIndex, '*')

	return {
		code: 200,
		msg: '获取成功',
		data: {
			serialNumInfo: serialData,
			randNum: newRandom
		}
	}
};

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

//str:原始字符串，index,开始位置,changeStr，改变后的字
function changeStr(str, index, changeStr) {
	return str.substr(0, index) + changeStr + str.substr(index + changeStr.length);
}
