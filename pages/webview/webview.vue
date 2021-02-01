<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				src:''
			}
		},
		onLoad(option) {
			this.src = option.src
		},
		methods: {

		}
	}
</script>

<style>

</style>
