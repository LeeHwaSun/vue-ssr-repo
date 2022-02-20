const router = require('express').Router();
const { modelCall } = require('../../../util/lib');
const admBoardModel = require('../_model/admBoardModel');

router.get('/skinList', async (req, res) => {
    const result = await modelCall(admBoardModel.skinList);
    res.json(result);
});

module.exports = router;