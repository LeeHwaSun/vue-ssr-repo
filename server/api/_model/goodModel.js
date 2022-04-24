const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const sqlHelper = require("../../../util/sqlHelper");
const moment = require('../../../util/moment');

const goodModel = {
    async getFlag(brd_table, wr_id, user_id) {
        const sql = sqlHelper.SelectSimple(TABLE.BOARD_GOOD, {
            brd_table,
            wr_id,
            user_id
        }, ['brd_good_flag']);
        const [[ row ]] = await db.execute(sql.query, sql.values);
        return row ? row.brd_good_flag : 0;
    },
    async update(data) {
        data.brd_good_create_at = moment().format("LT");
        const sql = sqlHelper.InsertOrUpdate(TABLE.BOARD_GOOD, data);
        await db.execute(sql.query, sql.values);
        const good = await goodModel.get(data);
        return good;
    },
    async remove(data) {
        const sql = sqlHelper.DeleteSimple(TABLE.BOARD_GOOD, data);
        await db.execute(sql.query, sql.values);
        const good = await goodModel.get(data);
        return good;
    },
    async get({ brd_table, wr_id, user_id }) {
        // 좋아요
        const good = await goodModel.getCount(brd_table, wr_id, 1);
        // 싫어요
        const bad = await goodModel.getCount(brd_table, wr_id, 2);
        // 현재 플래그
        const goodFlag = await goodModel.getFlag(brd_table, wr_id, user_id);

        return { good, bad, goodFlag };
    },
    async getCount(brd_table, wr_id, brd_good_flag) {
        const sql = sqlHelper.SelectSimple(TABLE.BOARD_GOOD, {
            brd_table,
            wr_id,
            brd_good_flag
        }, ['COUNT(*) AS cnt']);
        const [[{ cnt }]] = await db.execute(sql.query, sql.values);
        return cnt;
    }
}

module.exports = goodModel;