const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const boardModel = require('./_model/boardModel');

router.get('/config/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    const result = await modelCall(boardModel.getConfig, brd_table);
    res.json(result);
});

router.post('/imageUpload/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    const { brd_file_desc } = req.body;
    const result = await modelCall(boardModel.uploadFile, brd_table, brd_file_desc, req.files.upFile);
    res.json(result);
});

router.put('/imgCancel/:brd_table', async (req, res) => {
    const { brd_table } = req.params;
    let cnt = 0;
    for (const file of req.body) {
        await modelCall(boardModel.removeFile, brd_table, file);
        cnt++;
    }
    res.json(cnt);
});

module.exports = router;