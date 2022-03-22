const path = require('path');
const fs = require('fs');
const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const sqlHelper = require('../../../util/sqlHelper');
const moment = require('../../../util/moment');

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
            brd_create_at : moment().format('LT'),
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
    }
};

module.exports = boardModel;