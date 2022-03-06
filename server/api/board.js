const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const boardModel = require('./_model/boardModel');

router.get('/config/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    const result = await modelCall(boardModel.getConfig, brd_table);
    res.json(result);
})

module.exports = router;