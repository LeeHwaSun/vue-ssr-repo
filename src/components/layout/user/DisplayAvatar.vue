<template>
    <v-avatar color="accent" size="32">
        <template v-if="user">
        <v-img 
            v-if="hasImage" 
            :src="`/upload/userProfile/${user.user_id}.jpg?w=32&h=32`"
            @onError="imageError"></v-img>
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
    methods : {
        imageError() {
            this.hasImage = false;
        }
    }
}
</script>

<style>

</style>