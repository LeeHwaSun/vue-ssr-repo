<template>
    <v-parallax height="200" dark :src="src">
        <v-row class="align-center justify-center">
            <v-col class="text-center" cols="12">
                <h1 class="content-title font-weight mb-4">
                    {{ item.wr_title }}
                </h1>
            </v-col>
        </v-row>
    </v-parallax>
</template>

<script>
export default {
    name: "ContentTitle",
    props: {
        item : {
            type : Object,
            required : true
        }
    },
    computed: {
        src() {
            let src = 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg';
            const darkMode = this.$vuetify.theme.dark;
            if (darkMode) {
                src = 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg';
            }

            return src;
        }
    }
}
</script>

<style>

</style>