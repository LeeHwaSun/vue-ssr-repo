<template>
    <div>
        <v-btn 
            v-for="file in wrFiles" 
            :key="file.brd_file_id"
            block
            :disabled="!access.download"
            :href="`/api/board/download/${table}/${file.brd_file_name}?src=111111${file.brd_file_src}`"
            target="_blank"
            class="mt-1 text-none"
        >
            <v-icon left>mdi-download</v-icon>
            {{ file.brd_file_name }}
            <v-spacer />
            {{ fileSize(file.brd_file_size) }}
        </v-btn>
    </div>
</template>

<script>
import { fileSize } from '../../../../../../util/lib';
export default {
    name : "FileDownload",
    props : ['table', 'item', 'access'],
    computed : {
        wrFiles() {
            return this.item.wrFiles || [];
        },
        fileSize : () => fileSize,
    }
}
</script>

<style>

</style>