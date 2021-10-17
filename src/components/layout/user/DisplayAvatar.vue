<template>
    <v-avatar color="accent" size="32">
        <template v-if="user">
        <v-img 
            v-if="hasImage" 
            :src="userPhoto"
            @error="imageError"></v-img>
        <div v-else>{{ user.user_name[0] }}</div>
        </template>
        <v-icon v-else>mdi-account</v-icon>
    </v-avatar>
</template>

<script>
export default {
    name : "DisplayAvatar",
    props : {
        user : {
            type: Object,
            default : null,
        }
    },
    data() {
        return {
            hasImage : true,
        }
    },
    watch : {
        user() {
            this.hasImage = true;
        }
    },
    computed : {
        userPhoto() {
            const user_provider = this.user.user_provider;
            if (user_provider && (user_provider == 'google' || user_provider == 'kakao')) {
                return this.user.user_photo;
            } else {
                return this.user.user_photo + '?w=32&h=32';
            }
        }
    },
    methods : {
        imageError() {
            this.hasImage = false;
        }
    }
}
</script>

<style>

</style>