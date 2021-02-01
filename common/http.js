import store from '../store/index.js';
export default function $http(options) {
	const {
		url,
		data
	} = options
	const dataObj = {
		openid: store.state.userInfo._id,
		...data
	}
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: url,
			data: dataObj
		}).then((res) => {

			if (res.result.code === 200) {
				// .then
				reslove(res.result)
			} else {
				// catch
				reject(res.result)
			}

		}).catch((err) => {
			reject(err)
		})
	})
}
