const db = require('../../plugins/mysql');
const TABLE = require('../../../util/TABLE');
const { LV, isGrant } = require('../../../util/level');
const sqlHelper = require('../../../util/sqlHelper');

const configModel = {
    async load() {
        const sql = sqlHelper.SelectSimple(TABLE.CONFIG, null, ['cfg_key', 'cfg_val', 'cfg_client', 'cfg_type']);
        const [rows] = await db.execute(sql.query);
        global.siteConfig = {};
        global.clientConfig = {};
        for (const row of rows) {
            configModel.setConfigItem(row);
        }

        console.log('설정 로드');
    },
    setConfigItem(item) {
        configModel.clearConfigItem(item.cfg_key);
        let val;
        if (item.cfg_type == 'JSON') {
            val = JSON.parse(item.cfg_val);
        } else {
            val = item.cfg_val;
        }
        
        if (item.cfg_client == 1) {
            clientConfig[item.cfg_key] = val;
        } else {
            siteConfig[item.cfg_key] = val;
        }
    },
    clearConfigItem(cfg_key) {
        delete clientConfig[cfg_key];
        delete siteConfig[cfg_key];
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
        } else {
            //here.cfg_client = 1;
            return clientConfig;
        }
    },
    async post(data) {
        const sql = sqlHelper.InsertOrUpdate(
            TABLE.CONFIG,
            data
        );
        const [row] = await db.execute(sql.query, sql.values);
        configModel.setConfigItem(data); // 설정 다시 로드
        return data; // 업뎃된거 넘겨주기
    },
    async put(req) {
        req.body.forEach( (item) => {
            const { cfg_key, cfg_sort } = item;
            const sql = sqlHelper.Update(
                TABLE.CONFIG,
                { cfg_sort },
                { cfg_key }
            );
            db.execute(sql.query, sql.values);
        });
        return true;
    },
    async remove(req) {
        if (isGrant(req, LV.SUPER)) {
            throw new Error('최고관리자만 삭제 가능합니다.');
        }
        const { cfg_key } = req.params;
        const sql = sqlHelper.DeleteSimple(
            TABLE.CONFIG,
            { cfg_key }
        )
        const [row] = db.execute(sql.query, sql.values);
        configModel.clearConfigItem(cfg_key); // 설정값 삭제
        return row.affectedRows == 1;
    }
}

module.exports = configModel;