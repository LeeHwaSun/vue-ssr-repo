const path = require('path');
const fs = require('fs');
const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const sqlHelper = require('../../../util/sqlHelper');
const moment = require('../../../util/moment');
const jwt = require('../../plugins/jwt');
const tagModel = require('./tagModel');
const goodModel = require('./goodModel');
const { getSummary } = require('../../../util/lib');

const boardModel = {
    async getConfig(brd_table) {
        const sql = sqlHelper.SelectSimple(TABLE.BOARD, { brd_table });
        const [[row]] = await db.execute(sql.query, sql.values);

        if (!row) {
            throw new Error(`${brd_table} 게시판이 존재하지 않습니다.`);
        }

        try {
            row.brd_category = JSON.parse(row.brd_category);
            row.wr_fields = JSON.parse(row.wr_fields);
            row.brd_sort = JSON.parse(row.brd_sort);
        } catch (e) {}

        return row;
    },
    async uploadFile(brd_table, brd_file_desc, file, wr_id = 0) {
        const ext = path.parse(file.name).ext;
        const time = new Date().getTime();
        const dest = `${UPLOAD_PATH}/${brd_table}/${file.md5}${time}${ext}`;
        file.mv(dest);
        const brd_file_src = path.parse(dest).base;
        const payload = {
            brd_table,
            wr_id,
            brd_file_name : file.name,
            brd_file_src,
            brd_file_desc,
            brd_file_type : file.mimetype,
            brd_file_size : file.size,
            brd_file_create_at : moment().format('LT'),
        };
        const sql = sqlHelper.Insert(TABLE.BOARD_FILE, payload);
        const [rows] = await db.execute(sql.query, sql.values);
        const result = {
            brd_file_id : rows.insertId,
            brd_file_src
        };
        return result;
    },
    async removeFile(brd_table, file) {
        const { brd_file_id, brd_file_src } = file;
        const filePath = `${UPLOAD_PATH}/${brd_table}/${brd_file_src}`;
        const cachePath = `${UPLOAD_PATH}/${brd_table}/.cache`;
        const baseName = path.parse(brd_file_src).name;

        // 파일 삭제
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // 섬네일 삭제
        if (fs.existsSync(cachePath)) {
            const cacheDir = fs.readdirSync(cachePath);
            for (const p of cacheDir) {
                if (p.startsWith(baseName)) {
                    try {
                        fs.unlinkSync(`${cacheDir}/${p}`);
                    } catch (e) {
                        console.log(`delete ${p} error`, e.message);
                    }
                }
            }
        }

        // DB에서 삭제
        const sql = sqlHelper.DeleteSimple(TABLE.BOARD_FILE, { brd_file_id });
        await db.execute(sql.query, sql.values);
    },
    async writeInsert(brd_table, data, files) {
        // 에디터에서 업로드한 이미지 목록
        const upImages = JSON.parse(data.upImages);
        delete data.upImages;
        // 태그 목록
        const wrTags = JSON.parse(data.wrTags);
        delete data.wrTags;
        // 게시판 테이블 명
        const table = `${TABLE.WRITE}${brd_table}`;

        // 게시판 글에 대한 그룹, 정렬, 깊이
        if (data.wr_parent == 0) { // 새글
            const grpQuery = `SELECT MAX(wr_grp) AS wr_grp FROM ${table}`;
            const [[{ wr_grp }]] = await db.execute(grpQuery);
            data.wr_grp = wr_grp ? wr_grp + 1 : 1;
            data.wr_order = 0;
            data.wr_dep = 0;
        } else { // 답글
            const grpQuery = `SELECT wr_grp, wr_order, wr_dep from ${table} WHERE wr_id = ${data.wr_parent}`;
            const [[ parent ]] = await db.execute(grpQuery);
            data.wr_grp = parent.wr_grp;
            data.wr_order = parent.wr_order + 1;
            data.wr_dep = parent.wr_dep + 1;
            const uSql = `UPDATE ${table} SET wr_order = wr_order + 1 WHERE wr_reply = ${data.wr_reply} AND wr_grp = ${parent.wr_grp} AND wr_order >= ${data.wr_order}`;
            await db.execute(uSql);
        }

        // 게시판 작성일, 수정일
        data.wr_create_at = moment().format('LT');
        data.wr_update_at = moment().format('LT');

        // 요약 정보
        data.wr_summary = getSummary(data.wr_content, 250);

        if (data.wr_password) { // 비회원 암호
            data.wr_password = jwt.generatePassword(data.wr_password);
        }

        const sql = sqlHelper.Insert(table, data);
        const [rows] = await db.execute(sql.query, sql.values);
        const wr_id = rows.insertId; // 게시물 ID;

        // 태그 등록
        await tagModel.registerTags(brd_table, wr_id, wrTags);

        // 첨부파일 등록
        if (files) {
            const keys = Object.keys(files);
            for (const key of keys) {
                const file = files[key];
                await boardModel.uploadFile(brd_table, "", file, wr_id);
            }
        }

        // 게시물 내용에서 에디터 이미지가 있는지 여부를 확인해서 없는 것들을 제거
        await boardModel.clearImages(brd_table, wr_id, data.wr_content, upImages);

        return { wr_id };
    },
    async writeUpdate(brd_table, wr_id, data, files) {
        const table = `${TABLE.WRITE}${brd_table}`;
        delete data.wr_id;

        // 기존 첨부파일
        const wrFiles = JSON.parse(data.wrFiles);
        delete data.wrFiles;

        // 기존 첨부파일에서 삭제가 참인거
        for (const wrFile of wrFiles) {
            if (wrFile.remove) {
                await boardModel.removeFile(brd_table, wrFile);
            }
        }

        // 새로운 첨부파일 등록
        if (files) {
            const keys = Object.keys(files);
            for (const key of keys) {
                const file = files[key];
                await boardModel.uploadFile(brd_table, "", file, wr_id);
            }
        }

        // 에디터에서 이미지 삽입
        const upImages = JSON.parse(data.upImages).concat(JSON.parse(data.wrImgs));
        delete data.upImages;
        delete data.wrImgs;
        await boardModel.clearImages(brd_table, wr_id, data.wr_content, upImages);
        
        // 데이터 정리
        delete data.wr_create_at; // 생성일 삭제
        if (data.wr_password) { //  새로운 비민번호가 있으면
            data.wr_password = jwt.generatePassword(data.wr_password);
        } else { // 비밀번호 삭제
            delete data.wr_password; // 비밀번호 삭제
        }
        data.wr_update_at = moment().format('LT'); // 수정일 현재로 변경
        data.wr_summary = getSummary(data.wr_content, 250);
        delete data.good;
        delete data.bad;
        delete data.replys;
        delete data.goodFlag;

        // 태그
        const wrTags = JSON.parse(data.wrTags);
        delete data.wrTags;
        await tagModel.registerTags(brd_table, wr_id, wrTags);

        const sql = sqlHelper.Update(table, data, { wr_id });
        const [rows] = await db.execute(sql.query, sql.values);
        return { wr_id };
    },
    async clearImages(brd_table, wr_id, wr_content, upImages) {
        for (const img of upImages) {
            if (wr_content.indexOf(img.brd_file_src) > -1) { // 게시물에 이미지가 있으면
                const sql = sqlHelper.Update(TABLE.BOARD_FILE, { wr_id }, { brd_file_id : img.brd_file_id });
                await db.execute(sql.query, sql.values);
            } else { // 게시물에 이미지가 없으면
                await boardModel.removeFile(brd_table, img);
            }
        }
    },
    async getList(brd_table, config, options, user) {
        const table = `${TABLE.VIEW}${brd_table}`;

        options.sortBy = [];
        options.sortDesc = [];
        for (const sort of config.brd_sort) {
            options.sortBy.push(sort.by);
            options.sortDesc.push(sort.desc == 1);
        }

        const sql = sqlHelper.SelectLimit(table, options);
        const [[{ totalItems }]] = await db.execute(sql.countQuery, sql.values);
        const [ items ] = await db.execute(sql.query, sql.values);
        return { items, totalItems };
    },
    async getDetail(brd_table, wr_id, user) {
        const table = `${TABLE.VIEW}${brd_table}`;
        const sql = sqlHelper.SelectSimple(table, { wr_id });
        const [[item]] = await db.execute(sql.query, sql.values);
        if (!item) {
            throw new Error('게시물이 존재하지 않습니다.');
        }

        // 첨부파일 목록 조회
        const files = await boardModel.getItemFiles(brd_table, wr_id, item.wr_content);
        item.wrImgs = files.wrImgs;
        item.wrFiles = files.wrFiles;
        // 게시물 태그 조회
        item.wrTags = await tagModel.getTags(brd_table, wr_id);
        // 게시물 좋아요 조회
        if (user) {
            item.goodFlag = await goodModel.getFlag(brd_table, wr_id, user.user_id);
        } else {
            item.goodFlag = 0;
        }
        
        delete item.wr_password;
        return item;
    },
    async getItemFiles(brd_table, wr_id, wr_content = "") {
        const sql = sqlHelper.SelectSimple(
            TABLE.BOARD_FILE, 
            { brd_table, wr_id }, 
            ['brd_file_id', 'brd_file_name', 'brd_file_src', 'brd_file_desc', 'brd_file_type', 'brd_file_size']
        );
        const [rows] = await db.execute(sql.query, sql.values);
        const wrImgs = []; // 본문에 첨부된 이미지 목록
        const wrFiles = []; // 첨부파일 목록
        for (const row of rows) {
            if (wr_content.indexOf(row.brd_file_src) > -1) { // 본문에 경로가 있으면
                wrImgs.push(row);
            } else { // 없으면 첨부파일
                row.remove = false; // 수정할때 첨부파일 삭제 여부
                wrFiles.push(row);
            }
        }
        return { wrImgs, wrFiles };
    },
    async checkItem(brd_table, wr_id, password) {
        const wr_password = jwt.generatePassword(password);
        const table = `${TABLE.WRITE}${brd_table}`;
        const sql = sqlHelper.SelectSimple(table, {
            wr_id, wr_password
        }, ['COUNT(*) AS cnt']);
        const [[{ cnt }]] = await db.execute(sql.query, sql.values);
        return cnt;
    }
};

module.exports = boardModel;