/*
 * @Author: sky
 * @Date: 2018-12-27 16:41:50
 * @Description: 前端的用户管理
 */
const router = require('koa-router')();
const passport = require('koa-passport');

const userHome = require('./user-home');


/**
 * @route GET /api/user/test
 * @desc 测试接口地址
 * @access 公开
 */
router.get('/test', async ctx => {
    ctx.body = '测试接口';
});


/**
 * @route POST /api/user/register
 * @desc 用户注册
 * @access 公开
 */
router.post('/register', userHome.register);

/**
 * @route POST /api/user/login
 * @desc 用户登录 返回 token
 * @access 公开
 */
router.post('/login', userHome.login);

/**
 * @route GET /api/user/current
 * @desc 用户登录 返回 用户个人信息
 * @access 私人 token 验证
 */
router.get('/current', passport.authenticate('jwt', {
    session: false
}), userHome.current);


module.exports = () => {
    return router.routes();
}