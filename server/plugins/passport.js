require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('../plugins/jwt');
const userModel = require('../api/_model/userModel');

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