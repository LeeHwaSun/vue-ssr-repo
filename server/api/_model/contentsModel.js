const fs = require('fs');
const path = require('path');
const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const sqlHelper = require('../../../util/sqlHelper');

const contentsModel = {
    async skinList() {
        const skinPath = path.join(__dirname, "../../../src/views/contents/skins");
        const files = fs.readdirSync(skinPath, { withFileTypes : true });
        const skins = [];
        files.forEach(p => {
            if (p.isDirectory()) {
                skins.push(p.name);
            }
        });
        return skins;
    },
    async getContents(wr_1) {
        const table = `${TABLE.WRITE}contents`;
        const sql = sqlHelper.SelectSimple(table, { wr_1 }, ['wr_title', 'wr_content', 'wr_2']);
        const [[row]] = await db.execute(sql.query, sql.values);
        return row;
    },
    async duplicateCheck(wr_1) {
        const table = `${TABLE.WRITE}contents`;
        const sql = sqlHelper.SelectSimple( table, { wr_1 }, ['COUNT(*) AS cnt'] );
        const [[row]] = await db.execute(sql.query, sql.values);
        return row;
    },
}

module.exports = contentsModel;