'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	// 聚合 ： 更精细化的去处理数据 求和 、分组、指定那些字段
	const adv = await db.collection('adv').where({
		active:true
	}).get()  
	return {
		code: 200,
		msg: '数据请求成功',
		data: adv.data
	}
};
