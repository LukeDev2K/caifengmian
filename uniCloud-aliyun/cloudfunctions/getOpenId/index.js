'use strict';
exports.main = async (event, context) => {  
	const {
		code
	} = event
	console.log('js_code: ' + code)
	const datas = {
			'appid': 'your appid',
			'secret': 'your secret',
			'js_code': code,
			'grant_type': 'authorization_code'
		}
	const requestUrl = 'https://api.weixin.qq.com/sns/jscode2session?'
	 
	const params = []

	Object.keys(datas).forEach((key) => {
		let value = datas[key]
		// 对于需要编码的文本（比如说中文）我们要进行编码
		params.push([key, encodeURIComponent(value)].join('='))
	})

	const res = await uniCloud.httpclient.request(requestUrl + params.join('&'), {
		method: 'GET',
		dataType: 'json'
	})
	console.log("res: " + JSON.stringify(res.data))
	if (res.data.openid != null && res.data.openid != '') {
		console.log("openid: " + res.data.openid)
		return {
			code: 200,
			msg: '获取openid成功',
			data: {
				'openid': res.data.openid
			}
		}
	}
	//返回数据给客户端
	return {
		code: 201,
		msg: '获取openid失败'
	}
};
