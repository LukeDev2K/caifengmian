'use strict';
const db = uniCloud.database()
// 项目作者微信 KA_LOON
// 欢迎研究技术变现 
exports.main = async (event, context) => { 
	const configInfo = await db.collection('config').get()
	if(configInfo.data.length == 0) {
		return {
			code: 201,
			msg: '获取配置失败'
		}
	}
	const currentConfig = configInfo.data[0]
	let advInfo = null
	if(currentConfig.advShow) {
		advInfo = currentConfig.wechatAdv
	}
	return {
		code: 200,
		msg: '获取配置成功',
		data: {
			advInfo: advInfo,
			gzh: currentConfig.gzh,
			takeUrl: currentConfig.takeUrl,
			shareImage: currentConfig.shareImage,
			shareTitle: currentConfig.shareTitle,
			defaultImage: currentConfig.defaultImage,
			invitePoint: currentConfig.invitePoint,
			videoAdPoint: currentConfig.videoAdPoint
		}
	}
};
