const router = require('express').Router();
const { isGrant, LV } = require('../../util/level');
const { modelCall, getIp } = require('../../util/lib');
const boardModel = require('./_model/boardModel');

async function isModify(config, user, wrItem) {
    let msg = '수정 권한이 없습니다.';
    if (user) { // 회원
        if (user.user_level >= LV.SUPER || user.user_id == wrItem.user_id) {
            msg = '';
        }
    } else { // 비회원
        // 세션에 비밀번호
        // TODO : 비밀번호가 맞는지 확인
    }
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
    const grant = isGrant(req, config.brd_write_level);
    if (!grant) {
        return res.json({ err : '게시물 작성 권한이 없습니다.' });
    }

    const result = await modelCall(boardModel.writeInsert, brd_table, data, req.files);
    res.json(result);
});

// 게시물 수정
router.put('/write/:brd_table/:wr_id', async (req, res) => {
    const data = req.body;
    const { brd_table, wr_id } = req.params;
    data.wr_ip = getIp(req);

    // 게시물 수정 권한 확인
    const config = await modelCall(boardModel.getConfig, brd_table);
    const modifyMsg = await isModify(config, req.user, data);

    if (modifyMsg) { // 에러메시지가 있으면 에러
        return res.json({ err : modifyMsg });
    }

    const result = await modelCall(boardModel.writeUpdate, brd_table, wr_id, data, req.files);
    res.json(result);
    
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

module.exports = router;