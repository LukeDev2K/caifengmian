'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	const {
		page,
		pageSize,
		coverId,
	} = event
	// 聚合 ： 更精细化的去处理数据 求和 、分组、指定那些字段
	const list = await db.collection('participate')
		.aggregate()
		.match({
			coverId: coverId
		}) 
		.sort({
			_id:-1
		})
		// 要跳过多少数据
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.end() 
		
	return {
		code: 200,
		msg: '获取数据成功',
		data: list.data
	}
};
