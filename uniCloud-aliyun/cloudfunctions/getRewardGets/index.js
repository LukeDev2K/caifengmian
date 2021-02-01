'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
const dbCmd = db.command

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + JSON.stringify(event))
	const {
		openid,
		page,
		pageSize
	} = event
	if (!openid) {
		console.log("cant get openid")
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}

	// 聚合 ： 更精细化的去处理数据 求和 、分组、指定那些字段
	const takeNumInfos = await db.collection('serial-num')
		.aggregate()
		.match({
			takeUser: openid,
			isGot: true
		})
		// 要跳过多少数据
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.sort({
			_id:-1
		})
		.end()

	let data = []
	for (let i = 0; i < takeNumInfos.data.length; i++) {
		const coverInfo = await db.collection('cover').doc(takeNumInfos.data[i].coverId).get()
		if (coverInfo.data.length == 0) continue
		data.push({
			...coverInfo.data[0],
			...takeNumInfos.data[i]
		})
	}
	console.log('data: ' + JSON.stringify(data))
	//返回数据给客户端
	return {
		code: 200,
		msg: '获取数据成功',
		data: data
	}
};
