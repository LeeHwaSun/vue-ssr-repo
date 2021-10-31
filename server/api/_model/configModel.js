const db = require('../../plugins/mysql');

const TABLE = require('../../../util/TABLE');
const { LV, isGrant } = require('../../../util/level');
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
    async get(req) {
        const { all } = req.query;
        let where = {};
        if (all == 'true') {
            // 관리자
            if (!isGrant(req, LV.ADMIN)) {
                throw new Error('관리자 설정 목록 권한이 없습니다.');
            }
        } else {
            where.cfg_client = 1;
        }
        const sort = {
            cfg_group : true,
            cfg_sort : true,
        }
        const sql = sqlHelper.SelectSimple(
            TABLE.CONFIG,
            where, 
            [],
            sort
        );
        const [ rows ] = await db.execute(sql.query, sql.values);
        return rows;
    },
    async post(req) {
        /*const data = req.body;
        const maxSql = sqlHelper.SelectSimple(
            TABLE.CONFIG,
            { cfg_group : data.cfg_group },
            ['IFNULL(MAX(cfg_sort), -1) AS max']
        );
        const [[{ max }]] = await db.execute(maxSql.query, maxSql.values);
        data.cfg_sort = max + 1;*/
        const sql = sqlHelper.InsertOrUpdate(
            TABLE.CONFIG,
            req
        );
        const [row] = await db.execute(sql.query, sql.values);
        return row; // 업뎃된거 넘겨주기
    },
    async put(req) {
        req.body.forEach( (item) => {
            configModel.post(item);
        });
        return true;
    }
}

module.exports = configModel;