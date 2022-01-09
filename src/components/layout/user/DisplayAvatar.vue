<template>
    <v-avatar color="accent" :size="size">
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
        },
        size : {
            type : [String, Number],
            default : 32
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
            if (this.user.user_photo && !this.user.user_photo.startsWith('/upload')) {
                return this.user.user_photo;
            } else {
                return this.user.user_photo + `?w=${this.size}&h=${this.size}`;
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