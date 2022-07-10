<template>
    <v-container>
            <!-- <h2>{{ item.wr_title }}</h2> -->
            <ssr-renderer>
                <template>
                    <ez-tiptap :editable="false" v-model="item.wr_content" />
                </template>
                <template v-slot:server>
                    <div v-html="item.wr_content"></div>
                </template>
            </ssr-renderer>
    </v-container>
</template>

<script>
import SsrRenderer from '../../../../components/util/SsrRenderer.vue';
export default {
    components: { SsrRenderer },
    name: "CompanyContents",
    props: {
        item : {
            type : Object,
            required : true
        }
    },
    title() {
        return this.pageTitle;
    },
    computed: {
        pageTitle() {
            return this.item.wr_title;
        }
    },
    methods: {

    }
}
</script>

<style>

</style>