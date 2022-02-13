<template>
    <v-container fluid>
        <v-toolbar class="mt-2 mb-2">
            <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn to="/adm/board/list" color="accent">List</v-btn>
            <v-btn color="primary" class="ml-2" @click="save">{{ btnLabel }}</v-btn>
        </v-toolbar>
        <v-form 
            v-if="form"
            ref="form" 
            v-model="valid" 
            lazy-validation
        >
            <v-text-field 
                label="게시판 ID"
                v-model="form.brd_table"
                counter="30"
                :readonly="!!table"
            />
            <v-text-field 
                label="게시판 제목"
                v-model="form.brd_subject"
                counter="100"
            />
            <v-select 
                label="게시판 스킨"
                v-model="form.brd_skin"
                :items="skins"
            />
            <!-- 정렬 규칙 -->
            <div class="d-flex">
                <v-switch 
                    label="카테고리 사용"
                    v-model="form.brd_use_category"
                    inset
                />
                <div style="flex: 1;" class="ml-3">
                    <v-combobox
                        label="카테고리"
                        multiple
                        chips
                        :disabled="!form.brd_use_category"
                        dense
                        deletable-chips
                        clearable
                        append-icon=""
                        hint="카테고리 입력 후 Enter로 구분 등록 하세요."
                    >
                        <template v-slot:selection="{ attrs, item, parent, selected }">
                            <v-chip v-bind="attrs" :input-value="selected" label small>
                                <span>{{item}}</span>
                                <v-icon small right @click="parent.selectItem(item)">mdi-close</v-icon>
                            </v-chip>
                        </template>
                    </v-combobox>
                </div>
            </div>
            <board-slider label="목록 읽기 레벨" v-model="form.brd_list_level" />
            <board-slider label="게시물 읽기 레벨" v-model="form.brd_read_level" />
            <board-slider label="게시물 쓰기 레벨" v-model="form.brd_write_level" />
            <board-slider label="답변글 쓰기 레벨" v-model="form.brd_reply_level" />
            <board-slider label="댓글 쓰기 레벨" v-model="form.brd_comment_level" />
            <board-slider label="파일 다운로드 레벨" v-model="form.brd_download_level" />
            <div class="d-flex">
                <v-slider 
                    :label="`파일 업로드 개수 : ${form.brd_upload_cnt}`"
                    v-model="form.brd_upload_cnt"
                    min="0"
                    max="10"
                    thumb-label
                    ticks
                />
                <v-sheet width="200" class="ml-2" style="background: transparent;">
                    <v-text-field 
                        type="number"
                        label="파일 업로드 용량"
                        v-model="form.brd_upload_size"
                        dense
                        hide-details
                        min="1"
                        max="500"
                        suffix="MiB"
                    />
                </v-sheet>
            </div>
            <v-expansion-panels focusable>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        게시물 추가 필드 설정
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div v-for="(item, i) in form.wr_fields" :key="i" class="d-flex">
                            <v-tooltip top color="primary">
                                <template v-slot:activator="{ on, attrs }">
                                    <div v-on="on" v-bind="attrs" class="mt-2 mr-2">
                                        <v-switch 
                                            v-model="item.required"
                                            dense
                                            inset
                                        />
                                    </div>
                                </template>
                                <span>필수 입력</span>
                            </v-tooltip>
                            <v-text-field 
                                :label="`추가 필드 ${i + 1}`" 
                                v-model="item.title"

                                hide-details
                            />
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        게시판 여분 필드
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-text-field
                            v-for="i in 10"
                            :label="`여분 필드 ${i}`"
                            v-model="form[`brd_${i}`]"
                            :key="i"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-form>
        <v-toolbar class="mt-4">
            <v-btn to="/adm/board/list" color="accent">List</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="save">{{ btnLabel }}</v-btn>
        </v-toolbar>
    </v-container>
</template>

<script>
import { LV } from '../../../../util/level';
import BoardSlider from './Components/BoardSlider.vue';
export default {
    components : { BoardSlider, },
    name : "AdmBoardForm",
    props : {
        table : String,
    },
    title() {
        return this.pageTitle;
    },
    data() {
        return {
            valid : true,
            form : null,
            skins : [],
        }
    },
    computed : {
        pageTitle() {
            return this.table ? `${this.table} 게시판 수정` : `게시판 생성`;
        },
        btnLabel() {
            return this.table ? "Modify" : "Create";
        },
    },
    mounted() {
        this.init();
    },
    methods : {
        init() {
            if (this.table) {
                // 게시판 정보를 가지고 와서 넣어주자
            } else {
                // 신규
                const form = {
                    brd_table : "",
                    brd_subject : "",
                    brd_skin : "basic",
                    brd_list_level : LV.BLOCK,
                    brd_read_level : LV.BLOCK,
                    brd_write_level : LV.BLOCK,
                    brd_reply_level : LV.BLOCK,
                    brd_comment_level : LV.BLOCK,
                    brd_download_level : LV.BLOCK,
                    brd_upload_cnt : 2,
                    brd_upload_size : 2,
                    brd_category : [],
                    brd_use_category : 0,
                    brd_sort : [
                        {by : "wr_grp", desc : 0},
                        {by : "wr_order", desc : 1}
                    ],
                    wr_fields : [],
                };
                for (let i = 1; i <= 10; i++) {
                    form[`brd_${i}`] = "";
                    form.wr_fields.push({title:"", required:0});
                }
                this.form = form;
            }
        },
        save() {
            console.log(this.form);
        }
    }
}
</script>

<style>

</style>