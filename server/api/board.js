const router = require('express').Router();
const { isGrant, LV } = require('../../util/level');
const { modelCall, getIp } = require('../../util/lib');
const boardModel = require('./_model/boardModel');
const fs = require('fs');
const jwt = require('../plugins/jwt');

async function isModify(config, req, wrItem) {
    let msg = '수정 권한이 없습니다.';
    if (req.user) { // 회원
        if (req.user.user_level >= LV.SUPER || req.user.user_id == wrItem.user_id) {
            msg = '';
        }
    } else { // 비회원
        // 세션에 비밀번호
        if (typeof(wrItem.token) === 'string' && wrItem.token == req.session.checkToken) {
            msg = '';
        }
    }
    delete wrItem.token;
    req.session.checkToken = '';
    return msg;
}

// 게시판 설정 불러오기
router.get('/config/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    const result = await modelCall(boardModel.getConfig, brd_table);
    res.json(result);
});

// 에디터 이미지 업로드
router.post('/imageUpload/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    const { brd_file_desc } = req.body;
    const result = await modelCall(boardModel.uploadFile, brd_table, brd_file_desc, req.files.upFile);
    res.json(result);
});

// 에디터 이미지 취소
router.put('/imgCancel/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    let cnt = 0;
    for (const file of req.body) {
        await modelCall(boardModel.removeFile, brd_table, file);
        cnt++;
    }
    res.json(cnt);
});

// 신규 게시물 작성
router.post('/write/:brd_table', async (req, res) => {
    const data = req.body;
    const { brd_table } = req.params;
    data.wr_ip = getIp(req);

    // 게시물 작성 권한 확인
    const config = await modelCall(boardModel.getConfig, brd_table);
    //return res.json({err : '작업중', data});
    
    let grant;
    let grantMsg = "";
    if (data.wr_reply == 0) {
        grant = isGrant(req, config.brd_write_level);
        grantMsg = "게시물";
    } else {
        grant = isGrant(req, config.brd_comment_level);
        grantMsg = "댓글"
    }
    if (!grant) {
        return res.json({ err : grantMsg + ' 작성 권한이 없습니다.' });
    }

    const result = await modelCall(boardModel.writeInsert, brd_table, data, req.files);
    if (data.wr_reply > 0) { // 댓글 내용만 넘겨주기
        const options = {
            stf : ['wr_id'],
            stc : ['eq'],
            stx : [result.wr_id]
        };
        const item = await modelCall(boardModel.getList, brd_table, config, options, req.user);
        res.json(item.items[0]);
    } else {
        res.json(result);
    }
});

// 게시물 수정
router.put('/write/:brd_table/:wr_id', async (req, res) => {
    const data = req.body;
    const { brd_table, wr_id } = req.params;
    data.wr_ip = getIp(req);

    // 게시물 수정 권한 확인
    const config = await modelCall(boardModel.getConfig, brd_table);
    const modifyMsg = await isModify(config, req, data);

    if (modifyMsg) { // 에러메시지가 있으면 에러
        return res.json({ err : modifyMsg });
    }

    const result = await modelCall(boardModel.writeUpdate, brd_table, wr_id, data, req.files);
    if (data.wr_reply > 0) { // 댓글 내용만 넘겨주기
        const options = {
            stf : ['wr_id'],
            stc : ['eq'],
            stx : [result.wr_id]
        };
        const item = await modelCall(boardModel.getList, brd_table, config, options, req.user);
        res.json(item.items[0]);
    } else {
        res.json(result);
    }    
})

// 게시물 목록 조회
router.get('/list/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    // 게시물 목록 보기 권한 확인
    const config = await modelCall(boardModel.getConfig, brd_table);
    const grant = isGrant(req, config.brd_list_level);
    if (!grant) {
        return res.json({ err : '게시물 목록 보기 권한이 없습니다.' });
    }

    const options = req.query;
    const result = await modelCall(boardModel.getList, brd_table, config, options, req.user);
    res.json(result);
});

// 게시물 상세 조회
router.get('/detail/:brd_table/:wr_id', async (req, res) => {
    const { brd_table, wr_id } = req.params;
    // 게시물 상세 보기 권한 확인
    const config = await modelCall(boardModel.getConfig, brd_table);
    const grant = isGrant(req, config.brd_read_level);
    if (!grant) {
        return res.json({ err : '게시물 상세 보기 권한이 없습니다.' });
    }

    const result = await modelCall(boardModel.getDetail, brd_table, wr_id, req.user);
    res.json(result);
});

// 파일 다운로드
router.get('/download/:brd_table/:brd_file_name', async (req, res) => {
    const { brd_table, brd_file_name } = req.params;
    // 게시물 파일 다운로드 권한
    const config = await modelCall(boardModel.getConfig, brd_table);
    const grant = isGrant(req, config.brd_download_level);
    if (!grant) {
        return res.status(403).end('NO FILE DOWNLOAD PERMISSION');
    }
    const { src } = req.query;

    const srcFile = `${UPLOAD_PATH}/${brd_table}/${src}`;
    if (!fs.existsSync(srcFile)) {
        return res.status(404).end('FILE NOT FOUND');
    }
    res.download(srcFile, brd_file_name);
});

// 게시글 삭제
router.delete('/:brd_table/:wr_id', async (req, res) => {
    const { brd_table, wr_id } = req.params;
    const { token } = req.query;
    res.json({ brd_table, wr_id, token});
});

// 비회원 비밀번호 체크
router.post('/check/:brd_table/:wr_id', async (req, res) => {
    const { brd_table, wr_id } = req.params;
    const { password } = req.body;
    const cnt = await modelCall(boardModel.checkItem, brd_table, wr_id, password);
    if (cnt == 1) {
        const token = jwt.getRandToken(16);
        req.session.checkToken = token;
        res.json({ token });
    } else {
        res.json({ err : "비밀번호가 올바르지 않습니다." });
    }
});

module.exports = router;