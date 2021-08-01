const router = require('express').Router();
const { modelCall } = require('../../util/lib');
const userModel = require('./_model/userModel');

router.get('/test', (req, res) => {
    res.json('test connection');
});

// 중복 체크
router.get('/duplicateCheck/:field/:value', async (req, res) => {
    const result = await modelCall(userModel.duplicateCheck, req.params);
    res.json(result);
});

module.exports = router;