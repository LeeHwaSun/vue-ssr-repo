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
        if (!isGrant(req, LV.ADMIN)) {
            throw new Error('게시판 목록 권한이 없습니다.');
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
        if (!isGrant(req, LV.ADMIN)) {
            throw new Error('게시판 생성 권한이 없습니다.');
        }

        const data = req.body;
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
        console.log(rows);

        return rows.affectedRows == 1;
    },
    async updateBoard(req) {
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
    }
};

module.exports = admBoardModel;