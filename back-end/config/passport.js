/*
 * @Author: sky
 * @Date: 2018-12-27 16:43:02
 * @Description: passport 验证
 */

const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const mongoose = require('mongoose');
const User = mongoose.model('users');

// 引入加密名字
const keys = require('./keys');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }));
};