const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const configModel = require('./_model/configModel');

router.get('/duplicateCheck/:field/:value', async (req, res) => {
    const result = await modelCall(configModel.duplicateCheck, req.params);
    res.json(result);
});

router.post('/', async (req, res) => {
    const result = await modelCall(configModel.post, req);
    res.json(result);
});

module.exports = router;