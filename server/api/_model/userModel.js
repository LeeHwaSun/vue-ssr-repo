const db = require('../../plugins/mysql');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const { LV } = require('../../../util/level');
const moment = require('../../../util/moment');
const { getIp } = require('../../../util/lib');

async function getDefaultUserLevel() {
    const sql = sqlHelper.SelectSimple(
        TABLE.USER_INFO,
        null,
        ['COUNT(*) AS cnt']
    );
    const [[row]] = await db.execute(sql.query, sql.value);
    if (row.cnt > 0) {
        return LV.USER;
    } else {
        return LV.SUPER;
    }
};

const userModel = {
    async duplicateCheck( { field, value } ) {
        const sql = sqlHelper.SelectSimple(
            TABLE.USER_INFO, 
            {[field]: value}, 
            ['COUNT(*) AS cnt']
        );
        const [[row]] = await db.execute(sql.query, sql.values);
        return row;
    },
    async createUser(req) {
        const at = moment().format('LT');
        const ip = getIp(req);
        const payload = {
            ...req.body,
            // user_pwd : 암호화
            user_level : await getDefaultUserLevel(),
            user_create_at : at,
            user_create_ip : ip,
            user_update_at : at,
            user_update_ip : ip
        };

        const sql = sqlHelper.Insert(
            TABLE.USER_INFO,
            payload
        );
        console.log(sql.query);
        console.log(sql.values);
        return req.body;
    }
};

module.exports = userModel;