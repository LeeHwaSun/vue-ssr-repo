<template>
	<v-app>
		<v-navigation-drawer app v-model="drawer" :width="drawerWidth">
			<site-navi @close="toggleDrawer"/>
		</v-navigation-drawer>

		<v-app-bar app color="primary" dark hide-on-scroll>
			<v-app-bar-nav-icon @click="toggleDrawer" />
			<site-header></site-header>
			<v-spacer></v-spacer>
			<site-user />
		</v-app-bar>

		<v-main>
			<router-view/>
		</v-main>
		<site-footer />
		<vue-progress-bar></vue-progress-bar>
	</v-app>
</template>

<script>
import SiteHeader from './components/layout/common/SiteHeader.vue';
import SiteFooter from './components/layout/common/SiteFooter.vue';
import SiteNavi from './components/layout/common/SiteNavi.vue';
import SiteUser from './components/layout/user/SiteUser.vue';
import { mapMutations, mapActions } from 'vuex';
export default {
	components: { 
		SiteHeader, 
		SiteFooter, 
		SiteNavi, 
		SiteUser 
	},
	name: 'App',
	data() {
		return {
			drawer : false,
		}
	},
	computed: {
		drawerWidth() {
			return this.$vuetify.breakpoint.xs ? '100%' : '360';
		}
	},
	socket() {
		return {
			"connect" : () => {
				this.SET_ONLINE(true);
				this.initRooms();
			},
			"disconnect" : () => {
				this.SET_ONLINE(false);
			},
			"config:update" : (data) => {
				this.SET_CONFIG(data);
			},
			"config:remove" : (data) => {
				this.SET_CONFIG({ key, value : null });
			}
		}
	},
	methods: {
		...mapMutations(['SET_CONFIG']),
		...mapMutations('socket', ['SET_ONLINE',]),
		...mapActions('socket', ['initRooms']),
		toggleDrawer() {
			this.drawer = !this.drawer;
		}
	}
};
</script>
