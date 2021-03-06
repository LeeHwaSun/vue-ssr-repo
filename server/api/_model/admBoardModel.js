const path = require('path');
const fs = require('fs');
const { LV, isGrant } = require('../../../util/level');
const db = require('../../plugins/mysql');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');


const admBoardModel = {
    async skinList() {
        const skinPath = path.join(__dirname, "../../../src/views/board/skins");
        const files = fs.readdirSync(skinPath, { withFileTypes : true });
        const skins = [];
        files.forEach(p => {
            if (p.isDirectory()) {
                skins.push(p.name);
            }
        });
        return skins;
    },
    async getBoardById(req) {
        const { user_level } = req.user;
        if (!isGrant(req, LV.ADMIN)) {
            throw new Error('게시판 조회 권한이 없습니다.');
        }
        const { brd_table } = req.params;
        const sql = sqlHelper.SelectSimple(TABLE.BOARD, { brd_table });
        const [[row]] = await db.execute(sql.query, sql.values);
        if (!row) {
            throw new Error(`${brd_table} 게시판이 존재하지 않습니다.`);
        }
        return row;
    },
    async getBoardList(req) {
        const { user_level } = req.user;
        if (!isGrant(req, LV.ADMIN)) {
            throw new Error('게시판 목록 권한이 없습니다.');
        }
        const options = req.query;
        const cols = [
            'brd_table', 'brd_subject', 
            'brd_skin', 'brd_list_level', 
            'brd_read_level', 'brd_write_level', 
            'brd_comment_level'
        ];

        const sql = sqlHelper.SelectLimit(TABLE.BOARD, options, cols);
        const [items] = await db.execute(sql.query, sql.values);
        const [[{totalItems}]] = await db.execute(sql.countQuery, sql.values);

        return { items, totalItems };
    },
    async createBoard(req) {
        const data = req.body;
        const { user_level } = req.user;
        if (!isGrant(req, LV.ADMIN)) {
            throw new Error('게시판 생성 권한이 없습니다.');
        }
        
        data.brd_category = JSON.stringify(data.brd_category);
        data.brd_sort = JSON.stringify(data.brd_sort);
        data.wr_fields = JSON.stringify(data.wr_fields);

        let sqls = fs.readFileSync(__dirname + '/WRITE_TABLE.sql').toString()
        sqls = sqls.replace(/{{table}}/g, data.brd_table);
        const sqlArr = sqls.split(";");
        for (const sql of sqlArr) {
            if (sql.trim()) {
                await db.execute(sql);
            }
        }

        const sql = sqlHelper.Insert(TABLE.BOARD, data);
        const [rows] = await db.execute(sql.query, sql.values);

        // 업로드 폴더
        fs.mkdirSync(`${UPLOAD_PATH}/${data.brd_table}`, { recursive : true });
        fs.chmodSync(`${UPLOAD_PATH}/${data.brd_table}`, 0o707);

        return rows.affectedRows == 1;
    },
    async updateBoard(req) {
        const { user_level } = req.user;
        if (!isGrant(req, LV.ADMIN)) {
            throw new Error('게시판 수정 권한이 없습니다.');
        }

        const { brd_table } = req.params;
        const data = req.body;
        delete data.brd_table;
        data.brd_category = JSON.stringify(data.brd_category);
        data.brd_sort = JSON.stringify(data.brd_sort);
        data.wr_fields = JSON.stringify(data.wr_fields);

        const sql = sqlHelper.Update(TABLE.BOARD, data, { brd_table });
        const [rows] = await db.execute(sql.query, sql.values);
        
        return rows.affectedRows == 1;
    },
    async removeBoard(req) {
        const { brd_table } = req.params;
        const { user_level } = req.user;
        if (!isGrant(req, LV.SUPER)) {
            throw new Error('게시판 삭제 권한이 없습니다.');
        };

        // TODO : 파일 삭제
        const fileCnt = await admBoardModel.deleteFiles(brd_table);
        // TODO : 태그 삭제
        const tagCnt = await admBoardModel.deleteTags(brd_table);
        // TODO : 좋아요 삭제
        const goodCnt = await admBoardModel.deleteGood(brd_table);
        // TODO : view 삭제
        const viewQuery = `DROP VIEW ${TABLE.VIEW}${brd_table}`;
        await db.execute(viewQuery);
        // TODO : table 삭제
        const tableQuery = `DROP TABLE ${TABLE.WRITE}${brd_table}`;
        await db.execute(tableQuery);
        // TODO : 설정 삭제
        const sql = sqlHelper.DeleteSimple(TABLE.BOARD, { brd_table });
        await db.execute(sql.query, sql.values);
        return { brd_table, fileCnt, tagCnt, goodCnt };   
    },
    async deleteFiles(brd_table) {
        const fSql = sqlHelper.SelectSimple(TABLE.BOARD_FILE, { brd_table }, [ 'brd_file_src' ]);
        const [files] = await db.execute(fSql.query, fSql.values);
        const cachePath = `${UPLOAD_PATH}/${brd_table}/.cache`;
        const filePath = `${UPLOAD_PATH}/${brd_table}/`;
        $logger.info(`'[deleteFiles] 파일 삭제 갯수 : ' + files.length`);
        for (const file of files) {
            $logger.info(`'[deleteFiles] 파일 삭제 : ' + file.brd_file_src`);
            const src = filePath + `${file.brd_file_src}`;
            const baseName = path.parse(file.brd_file_src).name;

            if (fs.existsSync(src)) { // 파일 있으면 삭제
                fs.unlinkSync(src);
            }

            // 섬네일 삭제
            if (fs.existsSync(cachePath)) {
                const cacheDir = fs.readdirSync(cachePath);
                for (const p of cacheDir) {
                    if (p.startsWith(baseName)) {
                        try {
                            $logger.info(`[deleteFiles] ${cacheDir}/${p} 파일 삭제`);
                            fs.unlinkSync(`${cacheDir}/${p}`);
                        } catch (e) {
                            $logger.error(`[deleteFiles] delete ${p} error ${e.message}`);
                            console.log(`delete ${p} error`, e.message);
                        }
                    }
                }
            }
        }

        const dSql = sqlHelper.DeleteSimple(TABLE.BOARD_FILE, { brd_table });
        await db.execute(dSql.query, dSql.values);

        return files.length;
    },
    async deleteTags(brd_table) {
        const sql = sqlHelper.DeleteSimple(TABLE.BOARD_TAGS, { brd_table });
        const [rows] = await db.execute(sql.query, sql.values);
        return rows.affectedRows;
    },
    async deleteGood(brd_table) {
        const sql = sqlHelper.DeleteSimple(TABLE.BOARD_GOOD, { brd_table });
        const [rows] = await db.execute(sql.query, sql.values);
        return rows.affectedRows;
    }
};

module.exports = admBoardModel;