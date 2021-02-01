'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => { 

	//返回数据给客户端
	const serials = [
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao',
		'xuliehao'
	]
	console.log('size: ' + serials.length)
	for (let i = 0; i < serials.length; i++) {
		var keyIndex = Math.floor(Math.random()*(4 - 10) + 10)
		await db.collection('serial-num').add({
			"coverId": "6017f42a03fabc0001c2d073",
			"num": serials[i],
			"expire": new Date().toLocaleString('zh', {
				hour12: false,
				timeZone: 'Asia/Shanghai'
			}),
			"isGot": false,
			"keyIndex": keyIndex
		})
	}
	return {
		code: 200
	}
};
