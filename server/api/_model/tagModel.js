const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const sqlHelper = require('../../../util/sqlHelper');

const tagModel = {
    async registerTags(brd_table, wr_id, wrTags) {
        // 이미 게시판 아이디에 해당 하는 태그를 모두 제거
        await tagModel.deleteTags(brd_table, wr_id);
        // 태그 목록을 모두 삽입
        const tagData = [];
        for (const brd_tag of wrTags) {
            tagData.push({brd_table, wr_id, brd_tag});
        }
        if (tagData.length) {
            const sql = sqlHelper.InsertBulk(TABLE.BOARD_TAGS, tagData);
            await db.execute(sql.query, sql.values);
        }
    },
    async deleteTags(brd_table, wr_id) {
        const sql = sqlHelper.DeleteSimple(TABLE.BOARD_TAGS, { 
            brd_table, 
            wr_id 
        });
        await db.execute(sql.query, sql.values);
    },
    async getTags(brd_table, wr_id) {
        const sql = sqlHelper.SelectSimple(TABLE.BOARD_TAGS, { brd_table, wr_id }, [ 'brd_tag' ]);
        const [rows] = await db.execute(sql.query, sql.values);
        const wrTags = [];
        for (const row of rows) {
            wrTags.push(row.brd_tag);
        }
        return wrTags;
    }
};

module.exports = tagModel;