const fs = require('fs');
const db = require('../../plugins/mysql');
const jwt = require('../../plugins/jwt');
const sendMailer = require('../../plugins/sendMailer');
const sqlHelper = require('../../../util/sqlHelper');
const TABLE = require('../../../util/TABLE');
const { LV } = require('../../../util/level');
const moment = require('../../../util/moment');
const { getIp } = require('../../../util/lib');


function clearUserField(user) {
    delete user.user_pwd;
    user.user_create_at = moment(user.user_create_at).format('LT');
    user.user_update_at = moment(user.user_update_at).format('LT');
    if (user.user_login_at) {
        user.user_login_at = moment(user.user_login_at).format('LT');
    }
    if (user.user_leave_at) {
        user.user_leave_at = moment(user.user_leave_at).format('LT');
    }
    if (user.user_birth) {
        user.user_birth = moment(user.user_birth).format('L');
    }
    return user;
}

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
        //console.log("createUser :", req.body);
        //console.log("image :", req.files);

        const at = moment().format('LT');
        const ip = getIp(req);
        const payload = {
            ...req.body,
            user_level : await getDefaultUserLevel(),
            user_create_at : at,
            user_create_ip : ip,
            user_update_at : at,
            user_update_ip : ip
        };

        // 이미지 업로드 처리
        if (req.files && req.files.user_img) {
            req.files.user_img.mv(`${USER_PROFILE_PATH}/${payload.user_id}.jpg`, (err) => {
                if (err) {
                    console.log("USER IMAGE UPLOAD ERROR ", err);
                }
            });
        }
        delete payload.user_img;

        payload.user_pwd = jwt.generatePassword(payload.user_pwd);
        const sql = sqlHelper.Insert(
            TABLE.USER_INFO,
            payload
        );

        const [row] = await db.execute(sql.query, sql.values);
        return row.affectedRows == 1;
    },
    async getUserBy(form, cols = []) {
        const sql = sqlHelper.SelectSimple(
            TABLE.USER_INFO, 
            form, 
            cols
        );
        const [[row]] = await db.execute(sql.query, sql.values);
        if (!row) {
            throw new Error('존재하지 않는 회원입니다.');
        }
        return clearUserField(row);
    },
    loginUser(req) {
        const data = {
            user_login_at : moment().format('LT'),
            user_login_ip : getIp(req)
        };
        const { user_id } = req.body;
        const sql = sqlHelper.Update(
            TABLE.USER_INFO,
            data,
            { user_id }
        )
        db.execute(sql.query, sql.values);
        return data;
    },
    async findID(data) {
        const sql = sqlHelper.SelectSimple(
            TABLE.USER_INFO, 
            data, 
            ['user_id']
        );
        const [[row]] = await db.execute(sql.query, sql.values);
        if (!row) throw new Error('일치하는 회원이 없습니다.');
        return row;
    },
    async findPassword(req) {
        const data = req.query
        const sql = sqlHelper.SelectSimple(TABLE.USER_INFO, data, ['user_name']);
        const [[user]] = await db.execute(sql.query, sql.values);
        if (!user) throw new Error('일치하는 회원정보가 없습니다.');

        // 랜덤 토큰 발급
        // 토큰 정보를 DB에 주입
        // DB TABLE 생성
        // sm_id, sm_to, sm_type, sm_hash, sm_subject, sm_content, sm_create_at, sm_expire_at
        const sm_hash = jwt.getRandToken(64);
        const title = 'My Diary';
        const sm_subject = `${title} 비밀번호 찾기`;
        const sm_create_at = moment().format('LT');
        const expire_at = moment().add('30', 'm');
        const hostName = req.headers['x-forwarded-host'] || req.headers.host;
        const baseUrl = `${req.protocol}://${hostName}/modifyPassword/`;
        // {{name}}, {{link}}, {{time}}
        let sm_content = fs.readFileSync(__dirname + "/findPasswordForm.html").toString();
        sm_content = sm_content.replace('{{name}}', user.user_name)
                               .replace('{{time}}', expire_at.format('LLLL') + '분')
                               .replace('{{link}}', baseUrl + sm_hash);

        const sm = {
            sm_to : data.user_email,
            sm_type : 1,
            sm_hash,
            sm_subject,
            sm_content,
            sm_create_at,
            sm_expire_at : expire_at.format('LT')
        }

        try {
            await sendMailer(`${title} 관리자`, data.user_email, sm_subject, sm_content);
            const smSql = sqlHelper.Insert(TABLE.SEND_MAIL, sm);
            await db.execute(smSql.query, smSql.values);
        } catch (e) {
            console.log(e);
            return { err : `이메일 발송에 실패했습니다.\r\n관리자에게 문의 해주세요.` }
        }

        return user;
    }
};

module.exports = userModel;