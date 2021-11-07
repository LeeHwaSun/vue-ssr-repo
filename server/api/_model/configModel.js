const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const { LV, isGrant } = require('../../../util/level');
const sqlHelper = require('../../../util/sqlHelper');

const configModel = {
    async load() {
        const sql = sqlHelper.SelectSimple(TABLE.CONFIG, null, ['cfg_key', 'cfg_val', 'cfg_client', 'cfg_type']);
        const [rows] = await db.execute(sql.query);
        const config = {};
        const clientConfig = {};
        for (const row of rows) {
            let val;
            if (row.cfg_type == 'JSON') {
                val = JSON.parse(row.cfg_val);
            } else {
                val = row.cfg_val;
            }
            
            if (row.cfg_client == 1) {
                clientConfig[row.cfg_key] = val;
            } else {
                config[row.cfg_key] = val;
            }
        }
        global.siteConfig = config;
        global.clientConfig = clientConfig;
        console.log('설정 로드');
    },
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
    async post(data) {
        const sql = sqlHelper.InsertOrUpdate(
            TABLE.CONFIG,
            data
        );
        const [row] = await db.execute(sql.query, sql.values);
        configModel.load(); // 설정 다시 로드
        return data; // 업뎃된거 넘겨주기
    },
    async put(req) {
        req.body.forEach( (item) => {
            configModel.post(item);
        });
        return true;
    },
    async remove(req) {
        if (!isGrant(req, LV.SUPER)) {
            throw new Error('최고관리자만 삭제 가능합니다.');
        }
        const { cfg_key } = req.params;
        const sql = sqlHelper.DeleteSimple(
            TABLE.CONFIG,
            { cfg_key }
        )
        const [row] = db.execute(sql.query, sql.values);
        configModel.load(); // 설정 다시 로드
        return row.affectedRows == 1;
    }
}

module.exports = configModel;