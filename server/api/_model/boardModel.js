const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const sqlHelper = require('../../../util/sqlHelper');

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
    }
};

module.exports = boardModel;