'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const list = await db.collection('serial-num')
		.aggregate()
		.match({
			isGot: true
		}) 
		.sort({
			takeDate:-1
		}) 
		.lookup({
			from:'user',
			localField:'takeUser',
			foreignField:'_id',
			as:'users'
		})
		.lookup({
			from:'cover',
			localField:'coverId',
			foreignField:'_id',
			as:'covers'
		}) 
		// 要跳过多少数据
		.skip(0)
		.limit(4)
		.end() 
	// console.log(JSON.stringify(list.data))
	
	let notices = [] 
	for(let i=0; i<list.data.length;i++) {
		const nickName = list.data[i].users[0].nickName 
		const coverName = list.data[i].covers[0].name 
		const takeDate = list.data[i].takeDate
		notices.push({
			content:'用户'+nickName+'在'+takeDate+'成功领取了'+coverName
		})
	}
	console.log(JSON.stringify(notices))
	return {
		code: 200,
		msg: '获取数据成功',
		data: notices
	}
};
