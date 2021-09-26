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
    },
    async modifyPassword(data) {
        // 유효시간이 경과한 데이터 삭제
        const delBeforeSQL = `DELETE FROM ${TABLE.SEND_MAIL} WHERE sm_type = 1 AND sm_expire_at < NOW()`;
        await db.execute(delBeforeSQL);

        // 유효시간 안에 있는 해쉬로 검색
        const sql = {
            query : `SELECT sm_to FROM ${TABLE.SEND_MAIL} WHERE sm_type = ? AND sm_hash = ? AND sm_expire_at > NOW()`,
            values : [ 1, data.hash ]
        };

        const [[row]] = await db.execute(sql.query, sql.values);

        if (!row) throw new Error('유효 시간이 만료되었거나 이미 처리되었습니다.');

        const user_email = row.sm_to;
        const user_pwd = await jwt.generatePassword(data.password);
        const updateSql = sqlHelper.Update(
            TABLE.USER_INFO, 
            {user_pwd}, 
            {user_email}
        );

        const [result] = await db.execute(updateSql.query, updateSql.values);

        // 처리 결과 삭제
        const delAfterSQL = sqlHelper.DeleteSimple(
            TABLE.SEND_MAIL,
            { sm_hash : data.hash }
        )

        db.execute(delAfterSQL.query, delAfterSQL.values);

        return result.affectedRows == 1;
    },
    async socialCallback(req, res, err, user) {
        let html = fs.readFileSync(__dirname+'/socialPopup.html').toString();
        let payload = {};
        if (err) {
            payload.err = err;
        } else {
            // 토큰 만들고 쿠키 생성
            const token = jwt.getToken(user);
            req.body.user_id = user.user_id;
            const data = userModel.loginUser(req);
            user.user_login_at = data.user_login_at;
            user.user_login_ip = data.user_login_ip;
            res.cookie('token', token, { httpOnly : true });
            payload.token = token;
            payload.user = user;
        }
        html = html.replace('{payload}', JSON.stringify(payload));
        return html;
    },
    async loginGoogle(req, profile) {
        let user = null;
        try { // 이미 회원이 있는지?
            user = await userModel.getUserBy({ 
                user_email : profile.email 
            });
            return user;
        } catch (e) { // 없으면 새로 DB에 저장
            const at = moment().format('LT');
            const ip = getIp(req);
            const data = {
                user_id : profile.id,
                user_pwd : '',
                user_name : profile.displayName,
                user_email : profile.email,
                user_level : await getDefaultUserLevel(),
                user_create_at : at,
                user_create_ip : ip,
                user_update_at : at,
                user_update_ip : ip
            };
            const sql = sqlHelper.Insert(TABLE.USER_INFO, data);
            await db.execute(sql.query, sql.values);
            user = await userModel.getUserBy({ 
                user_email : profile.email 
            });
        }
        return user;
    },
    async loginKakao(req, profile) {
        let user = null;
        const kakaoAccount = profile._json.kakao_account;
        const kakaoProp = profile._json.properties;
        try { // 이미 회원이 있는지?
            user = await userModel.getUserBy({ 
                user_email : kakaoAccount.email
            });
            return user;
        } catch (e) { // 없으면 새로 DB에 저장
            const at = moment().format('LT');
            const ip = getIp(req);
            const data = {
                user_id : profile.id,
                user_pwd : '',
                user_provider : profile.provider,
                user_name : kakaoProp.nickname,
                user_gender : kakaoAccount.gender == 'male' ? 'M' : 'F',
                user_email : kakaoAccount.email,
                user_photo : kakaoProp.thumbnail_image,
                user_level : await getDefaultUserLevel(),
                user_create_at : at,
                user_create_ip : ip,
                user_update_at : at,
                user_update_ip : ip
            };
            const sql = sqlHelper.Insert(TABLE.USER_INFO, data);
            await db.execute(sql.query, sql.values);
            user = await userModel.getUserBy({ 
                user_email : kakaoAccount.email 
            });
        }
        return user;
    },
    async loginNaver(req, profile) {
        let user = null;
        const naverJson = profile._json;
        try { // 이미 회원이 있는지?
            user = await userModel.getUserBy({ 
                user_email : naverJson.email
            });
            return user;
        } catch (e) { // 없으면 새로 DB에 저장
            const at = moment().format('LT');
            const ip = getIp(req);
            const data = {
                user_id : profile.id,
                user_pwd : '',
                user_provider : profile.provider,
                user_name : naverJson.nickname,
                user_email : naverJson.email,
                user_photo : naverJson.profile_image,
                user_level : await getDefaultUserLevel(),
                user_create_at : at,
                user_create_ip : ip,
                user_update_at : at,
                user_update_ip : ip
            };
            const sql = sqlHelper.Insert(TABLE.USER_INFO, data);
            await db.execute(sql.query, sql.values);
            user = await userModel.getUserBy({ 
                user_email : naverJson.email 
            });
        }
        return user;
    }
};

module.exports = userModel;