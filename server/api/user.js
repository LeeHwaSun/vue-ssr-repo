const router = require('express').Router();
const passport = require('passport');
const { modelCall } = require('../../util/lib');
const userModel = require('./_model/userModel');
const jwt = require('../plugins/jwt');
const fs = require('fs');

// 중복 체크
router.get('/duplicateCheck/:field/:value', async (req, res) => {
    const result = await modelCall(userModel.duplicateCheck, req.params);
    res.json(result);
});

// 회원 가입
router.post('/', async (req, res) => {
    const result = await modelCall(userModel.createUser, req);
    res.json(result);
});

// 로그인
router.post('/loginUserLocal', async (req, res) => {
    passport.authenticate('local', function(err, user, info) {
        if (info) {
            res.json({ err : info });
        } else {
            req.login(user, { session: false }, (err) => {
                if (err) {
                    console.log(err);
                    res.json({ err });
                } else {
                    const token = jwt.getToken(user);
                    const data = userModel.loginUser(req);
                    user.user_login_at = data.user_login_at;
                    user.user_login_ip = data.user_login_ip;
                    res.cookie('token', token, { httpOnly : true });
                    res.json({ user, token });
                }
            });
        }
    })(req, res);
});

// 인증 처리
router.get('/auth', (req, res) => {
    const user = req.user || null;
    const token = req.cookies.token || null;
    res.json({ user, token });

})

// 로그아웃
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.json(true);
});

// 아이디 찾기
router.get('/findID', async (req, res) => {
    const result = await modelCall(userModel.findID, req.query);
    res.json(result);
});

// 비밀번호 찾기
router.get('/findPassword', async (req, res) => {
    const result = await modelCall(userModel.findPassword, req);
    res.json(result);
});

// 비밀번호 변경
router.patch('/modifyPassword', async (req, res) => {
    const result = await modelCall(userModel.modifyPassword, req.body);
    res.json(result);
});

// 구글 로그인 요청
router.get('/loginGoogle', passport.authenticate("google", { scope : ["email", "profile"] }));

// 구글 로그인 콜백
router.get('/google-callback', (req, res) => {
    passport.authenticate('google', async function (err, user) {
        const result = await modelCall(userModel.socialCallback, req, res, err, user);
        res.end(result);
    })(req, res);
});

// 카카오 로그인 요청
router.get('/loginKakao', passport.authenticate("kakao"));

// 카카오 로그인 콜백
router.get('/kakao-callback', (req, res) => {
    passport.authenticate('kakao', async function (err, user) {
        const result = await modelCall(userModel.socialCallback, req, res, err, user);
        res.end(result);
    })(req, res);
});

// 네이버 로그인 요청
router.get('/loginNaver', passport.authenticate("naver"));

// 네이버 로그인 콜백
router.get('/naver-callback', (req, res) => {
    passport.authenticate('naver', async function (err, user) {
        const result = await modelCall(userModel.socialCallback, req, res, err, user);
        res.end(result);
    })(req, res);
});

module.exports = router;