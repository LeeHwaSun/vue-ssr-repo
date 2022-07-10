const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const contentsModel = require('./_model/contentsModel');

router.get('/skinList', async (req, res) => {
    const result = await modelCall(contentsModel.skinList);
    res.json(result);
});

router.get('/duplicateCheck', async (req, res) => {
    const result = await modelCall(contentsModel.duplicateCheck, req.query.wr_1);
    res.json(result);
});

router.get('/:wr_1', async (req, res) => {
    const wr_1 = req.params.wr_1;
    const result = await modelCall(contentsModel.getContents, wr_1);
    res.json(result);
});

module.exports = router;