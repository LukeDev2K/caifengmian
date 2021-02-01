// vuex 状态管理
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	// 数据源
	state: {
		userInfo: uni.getStorageSync('USERINFO'), 
		rewardInfo: uni.getStorageSync('REWARDINFO'), 
		config: uni.getStorageSync('CONFIG'), 
		historyLists: uni.getStorageSync("__history")
	},
	mutations: {
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo
		}, 
		SET_CONFIG(state, config) {
			state.config = config
		}, 
		SET_HISTORY_LISTS(state, history) {
			state.historyLists = history
		}, 
		SET_REWARD_INFO(state, rewardInfo) {
			state.rewardInfo = rewardInfo
		}, 
		CLEAR_HISTORY(state) {
			state.historyLists = []
		}
	},
	actions: {
		set_user_info({
			commit
		}, userInfo) {
			uni.setStorageSync('USERINFO', userInfo)
			commit('SET_USER_INFO', userInfo)
		}, 
		set_config({
			commit
		}, config) {
			uni.setStorageSync('CONFIG', config)
			commit('SET_CONFIG', config)
		}, 
		set_reward_info({
			commit
		}, rewardInfo) {
			uni.setStorageSync('REWARDINFO', rewardInfo)
			commit('SET_REWARD_INFO', rewardInfo)
		}, 
		set_history({
			commit,
			state
		}, history) {
			let list = state.historyLists
			list.unshift(history)
			uni.setStorageSync('__history', list)
			commit('SET_HISTORY_LISTS', list)
		}, 
		clear_history({
			commit
		}) {
			uni.removeStorageSync('__history')
			commit('CLEAR_HISTORY')
		}

	}
})

export default store
