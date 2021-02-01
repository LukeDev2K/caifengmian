'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	const {
		openid,
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
		console.log("cant get coverId")
		return {
			code: 201,
			msg: '封面id错误'
		}
	}
	const coverData = await db.collection('cover').doc(coverId).get()
	console.log('coverData: ' + JSON.stringify(coverData.data[0]))
	const serialNums = await db.collection('serial-num').where({
		coverId: coverId
	}).get()
	console.log('total: ' + serialNums.data.length)
	let gets = []
	serialNums.data.forEach(item => {
		if (item.isGot) {
			gets.unshift(item.userBy)
		}
	})

	const partiInfos = await db.collection('participate')
		.aggregate()
		.match({
			coverId: coverId
		})
		.sort({
			_id: -1
		})
		// 要跳过多少数据
		.skip(0)
		.limit(8)
		.end()
	const totalPartis = await db.collection('participate').where({
		coverId: coverId
	}).get()
	console.log('partiInfo: ' + JSON.stringify(partiInfos.data))
	return {
		code: 200,
		msg: '获取成功',
		data: {
			...coverData.data[0],
			total: serialNums.data.length,
			gets: gets,
			partis: partiInfos.data,
			totalPartiNum: totalPartis.data.length
		}
	}
};
