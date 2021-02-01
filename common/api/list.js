import $http from '../http.js' 

export const getAccessToken = (data) => {
	return $http({
		url: 'getAccessToken',
		data
	})
} 

export const getOpenId = (data) => {
	return $http({
		url: 'getOpenId',
		data
	})
} 

export const subscribe = (data) => {
	return $http({
		url: 'subscribe',
		data
	})
}

export const getUserInfo = (data) => {
	return $http({
		url: 'getUserInfo',
		data
	})
}

export const updateUserInfo = (data) => {
	return $http({
		url: 'updateUserInfo',
		data
	})
}    

export const getAllCovers = (data) => {
	return $http({
		url: 'getAllCovers',
		data
	})
}

export const getRandomSerialNum = (data) => {
	return $http({
		url: 'getRandomSerialNum',
		data
	})
}

export const getCover = (data) => {
	return $http({
		url: 'getCover',
		data
	})
}

export const joinCover = (data) => {
	return $http({
		url: 'joinCover',
		data
	})
}

export const startGuess = (data) => {
	return $http({
		url: 'startGuess',
		data
	})
}

export const getAdvs = (data) => {
	return $http({
		url: 'getAdvs',
		data
	})
} 

export const getRewardGets = (data) => {
	return $http({
		url: 'getRewardGets',
		data
	})
} 

export const acceptInvite = (data) => {
	return $http({
		url: 'acceptInvite',
		data
	})
} 

export const getConfig = (data) => {
	return $http({
		url: 'getConfig',
		data
	})
}

export const startTake = (data) => {
	return $http({
		url: 'startTake',
		data
	})
} 

export const getCoverPartis = (data) => {
	return $http({
		url: 'getCoverPartis',
		data
	})
} 

export const getNotices = (data) => {
	return $http({
		url: 'getNotices',
		data
	})
} 
