const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const goodModel = require('./_model/goodModel');

// 회원이 아닌 경우 진입 방지를 위한 미들웨어
router.use('/:brd_table/:wr_id', (req, res, next) => {
    if (!req.user) {
        return { err : '회원만 가능합니다.' };
    }
    next();
})

// 좋아요 생성 및 변경
router.post('/:brd_table/:wr_id', async (req, res) => {
    const { brd_table, wr_id } = req.params;
    const { brd_good_flag } = req.body;
    const { user_id } = req.user;
    const result = await modelCall(goodModel.update, { brd_table, wr_id, brd_good_flag, user_id });
    res.json(result);
});

// 좋아요 삭제
router.delete('/:brd_table/:wr_id', async (req, res) => {
    const { brd_table, wr_id } = req.params;
    const { user_id } = req.user;
    const result = await modelCall(goodModel.remove, { brd_table, wr_id, user_id });
    res.json(result);
});

module.exports = router;