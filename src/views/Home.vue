<template>
	<div>
		<board-latest table="gallery1" skin="slider" :limit="3" />
		<board-latest table="test1" skin="basic" :limit="4" />
		<board-latest table="gallery1" skin="gallery" :limit="6" />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import BoardLatest from '../components/latest/BoardLatest.vue';
export default {
	components: { BoardLatest },
	name: "Home",
	title() {
		return this.title;
	},
	data() {
		return {
			
		}
	},
	computed: {
		...mapState({
			title : (state) => state.config?.title || '홈페이지',
		}),
	},
	methods: {
		
	}
}
</script>
