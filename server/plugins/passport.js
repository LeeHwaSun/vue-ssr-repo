require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('../plugins/jwt');
const userModel = require('../api/_model/userModel');
const { Strategy : JWTStrategy, ExtractJwt } = require('passport-jwt');
const { SECRET_KEY } = process.env;

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

    passport.use(new JWTStrategy(
        {
            //jwtFromRequest : ExtractJwt.fromHeader("authorization"),
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : SECRET_KEY
        },
        async(payload, done) => {
            try {
                const { user_id } = payload;
                const user = await userModel.getUserBy({ user_id });
                if (!user) {
                    throw new Error('회원 토큰이 유효하지 않습니다.');
                }
                return done(null, user)
            } catch (e) {
                return done(e);
            }
        }
    ));

    app.use(async (req, res, next) => {
        if (req.headers.authorization) {
            passport.authenticate('jwt', (err, user) => {
                if (user) {
                    // 로그인 처리
                    req.login(user, { session : false }, (err) => {});
                } else {
                    // 로그아웃 처리
                    try {
                        req.logout();
                    } catch (e) {}
                }
                next();
            })(req, res, next);
        } else if (req.cookies.token) {
            try {
                // 인증
                const payload = jwt.verify(req.cookies.token);                
                const { user_id } = payload;
                const user = await userModel.getUserBy({ user_id });
                if (!user) {
                    throw new Error('회원 토큰이 유효하지 않습니다.');
                }
                req.login(user, { session : false }, (err) => { });

            } catch (e) {}
            next();
        } else {
            next();
        }
    });
}