<template>
	<div>
		<v-parallax height="400" dark :src="src">
			<v-row class="align-center justify-center">
				<v-col class="text-center" cols="12">
					<h1 class="main-text font-weight mb-4">
						WELCOME!!!!!
					</h1>
					<h4 class="text-subtitle1">
						이 홈페이지는 Vue.js를 이용하여 만든 프로토타입 형태의 홈페이지입니다.
					</h4>
				</v-col>
			</v-row>
		</v-parallax>
		<!--board-latest table="gallery1" skin="slider" :limit="3" /-->
		<!-- <board-latest table="test1" skin="basic" :limit="4" /> -->
		<div class="d-flex" v-if="!isXs">
			<board-latest table="board" skin="basic" :limit="4" :isDivided="true" />
			<board-latest table="notice" skin="basic" :limit="4" :isDivided="true" />
		</div>
		<div v-else>
			<board-latest table="board" skin="basic" :limit="4" />
			<board-latest table="notice" skin="basic" :limit="4" />
		</div>
		<board-latest table="qna" skin="basic" :limit="5" />
		<!-- <board-latest table="gallery1" skin="gallery" :limit="6" /> -->
		<board-latest table="gallery" skin="gallery" :limit="6" />
		<popup-opener />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import BoardLatest from '../components/latest/BoardLatest.vue';
import PopupOpener from './board/skins/popup/component/PopupOpener.vue';
export default {
	components: { BoardLatest, PopupOpener },
	name: "Home",
	title() {
		return this.title;
	},
	computed: {
		...mapState({
			title : (state) => state.config?.title || '홈페이지',
		}),
		isXs() {
            return this.$vuetify.breakpoint.xs ? true : false;
        },
		src() {
			let src = 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg';
			const darkMode = this.$vuetify.theme.dark;
			if (darkMode) {
				src = 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg';
			}

			return src;
		}
	},
}
</script>
