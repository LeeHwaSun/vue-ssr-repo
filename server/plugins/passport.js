require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('../plugins/jwt');
const userModel = require('../api/_model/userModel');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { GOOGLE_CLIENT_ID, 
        GOOGLE_CLIENT_SECRET_KEY, 
        DEV_ENV, 
        VUE_APP_SERVER_PORT } = process.env;

const CALLBACK_URL = DEV_ENV == 'DEV' ? `http://localhost:${VUE_APP_SERVER_PORT}` : `https://mystudyhome.kro.kr`;

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
                return done('로그인 실패', null);
            }
        }
    ));

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