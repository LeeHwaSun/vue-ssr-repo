const db = require('../../plugins/mysql');

const TABLE = require('../../../util/TABLE');
const { LV } = require('../../../util/level');
const sqlHelper = require('../../../util/sqlHelper');

const configModel = {
    async duplicateCheck( { field, value } ) {
        const sql = sqlHelper.SelectSimple(
            TABLE.CONFIG, 
            {[field]: value}, 
            ['COUNT(*) AS cnt']
        );
        const [[row]] = await db.execute(sql.query, sql.values);
        return row;
    },
    async post(req) {
        const data = req.body;
        const maxSql = sqlHelper.SelectSimple(
            TABLE.CONFIG,
            { cfg_group : data.cfg_group },
            ['IFNULL(MAX(cfg_sort), -1) AS max']
        );
        const [[{ max }]] = await db.execute(maxSql.query, maxSql.values);
        data.cfg_sort = max + 1;
        const sql = sqlHelper.InsertOrUpdate(
            TABLE.CONFIG,
            data
        );
        const [row] = await db.execute(sql.query, sql.values);
        return maxSql; // 업뎃된거 넘겨주기
    }
}

module.exports = configModel;