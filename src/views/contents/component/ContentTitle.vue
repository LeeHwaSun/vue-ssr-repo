<template>
    <v-parallax height="200" dark src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
        <v-row class="align-center justify-center">
            <v-col class="text-center" cols="12">
                <h1 class="text-h3 font-weight mb-4">
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
    }
}
</script>

<style>

</style>