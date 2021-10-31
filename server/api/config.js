const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const configModel = require('./_model/configModel');

router.get('/duplicateCheck/:field/:value', async (req, res) => {
    const result = await modelCall(configModel.duplicateCheck, req.params);
    res.json(result);
});

router.get('/', async (req, res) => {
    const result = await modelCall(configModel.get, req);
    res.json(result);
});

// 단일
router.post('/', async (req, res) => {
    const result = await modelCall(configModel.post, req.body);
    res.json(result);
});

// 배열
router.put('/', async (req, res) => {
    const result = await modelCall(configModel.put, req);
    res.json(result);
});

module.exports = router;