require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('../plugins/jwt');
const userModel = require('../api/_model/userModel');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const { GOOGLE_CLIENT_ID, 
        GOOGLE_CLIENT_SECRET_KEY, 
        KAKAO_OAUTH_CLIENT_ID,
        KAKAO_OAUTH_CLIENT_SECRET_KEY,
        CALLBACK_URL,
        NAVER_CLIENT_ID,
        NAVER_CLIENT_SECRET_KEY } = process.env;

module.exports = (app) => {
    app.use(passport.initialize());

    passport.use(new LocalStrategy(
        {
            usernameField : 'user_id',
            passwordField : 'user_pwd'
        },
        async(user_id, user_pwd, done) => {
            try {
                user_pwd = jwt.generatePassword(user_pwd);
                const user = await userModel.getUserBy({user_id, user_pwd});
                return done(null, user);
            } catch (e) {
                console.log(e.message);
                return done(null, null, '아이디 또는 비밀번호가 올바르지 않습니다.');
            }
        }
    ));

    passport.use(new GoogleStrategy(
        {
            clientID : GOOGLE_CLIENT_ID,
            clientSecret : GOOGLE_CLIENT_SECRET_KEY,
            callbackURL : `${CALLBACK_URL}/api/user/google-callback`,
            passReqToCallback : true
        },
        async function (request, accessToken, refreshToken, profile, done) {
            if (profile && profile.id) {
                const user = await userModel.loginGoogle(request, profile);
                return done(null, user);
            } else {
                return done('구글 로그인 실패', null);
            }
        }
    ));

    passport.use(new KakaoStrategy(
        {
            clientID : KAKAO_OAUTH_CLIENT_ID,
            clientSecret : KAKAO_OAUTH_CLIENT_SECRET_KEY,
            callbackURL : `${CALLBACK_URL}/api/user/kakao-callback`,
            passReqToCallback : true
        },
        async function (request, accessToken, refreshToken, profile, done) {
            if (profile && profile.id) {
                const user = await userModel.loginKakao(request, profile);
                return done(null, user);
            } else {
                return done('카카오 로그인 실패', null);
            }
        }
    ));

    passport.use(new NaverStrategy(
        {
            clientID : NAVER_CLIENT_ID,
            clientSecret : NAVER_CLIENT_SECRET_KEY,
            callbackURL : `${CALLBACK_URL}/api/user/naver-callback`,
            passReqToCallback : true
        },
        async function (request, accessToken, refreshToken, profile, done) {
            if (profile && profile.id) {
                const user = await userModel.loginNaver(request, profile);
                return done(null, user);
            } else {
                return done('네이버 로그인 실패', null);
            }
        }
    ))

    app.use(async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return next();
        const { user_id } = jwt.verify(token);
        if (!user_id) return next();
        try {
            const user = await userModel.getUserBy({ user_id });
            req.login(user, { session : false }, (err) => {});
        } catch (e) {
            console.log('Authorization Error :', e);
        }
        next();
    });
}