'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	const {
		page,
		pageSize
	} = event
	// 聚合 ： 更精细化的去处理数据 求和 、分组、指定那些字段
	const list = await db.collection('cover')
		.aggregate()
		.match({
			active: true
		})
		.lookup({
			from: 'participate',
			localField: '_id',
			foreignField: 'coverId',
			as: 'partis',
		})
		.lookup({
			from: 'serial-num',
			localField: '_id',
			foreignField: 'coverId',
			as: 'serials',
		})
		.addFields({
			partiNum: $.size('$partis'),
			total: $.size('$serials'),
			lessNum: $.size($.filter({
				input: '$serials',
				as: 'item',
				cond: $.eq(['$$item.isGot', false])
			}))
		})
		.project({
			serials: 0,
			partis: 0
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
