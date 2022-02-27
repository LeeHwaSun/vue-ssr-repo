const router = require('express').Router();
const { modelCall } = require('../../../util/lib');
const admBoardModel = require('../_model/admBoardModel');

router.get('/skinList', async (req, res) => {
    const result = await modelCall(admBoardModel.skinList);
    res.json(result);
});

router.get('/:brd_table', async (req, res) => {
    const result = await modelCall(admBoardModel.getBoardById, req);
    res.json(result);
});

router.get('/', async (req, res) => {
    const result = await modelCall(admBoardModel.getBoardList, req);
    res.json(result);
});

router.post('/', async (req, res) => {
    const result = await modelCall(admBoardModel.createBoard, req);
    res.json(result);
});

router.put('/:brd_table', async (req, res) => {
    const result = await modelCall(admBoardModel.updateBoard, req);
    res.json(result);
});

module.exports = router;