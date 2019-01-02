/*
 * @Author: sky
 * @Date: 2018-12-28 00:15:27
 * @Description: 管理所有的路由模块 - 控制器
 */
const router = require('koa-router')();
const bodyparser = require('koa-bodyparser');
const passport = require('koa-passport');


// 要先初始化一下数据模型，不然 下边的 passport 初始化 就会报错
const user = require('../models/api/User');


/* 解析 post */
router.use(bodyparser());

// passport 初始化
router.use(passport.initialize());
router.use(passport.session());

/* 回调 到 config/passport.js */
require('../config/passport')(passport);




/* 前端模块 */

const apiUser = require('../routers/api/user');
/* 用户相关 */
router.use('/api/user', apiUser());

const apiProfile = require('../routers/api/profile');
/* 个人简介相关 */
router.use('/api/profile', apiProfile());

const apiPost = require('../routers/api/post');
/* 个人简介相关 */
router.use('/api/post', apiPost());



/* 后端管理模块 */

const AdminFrontUsers = require('../routers/admin/front-users');
/* 管理前端用户 */
router.use('/admin/frontUsers', AdminFrontUsers());

const adminProfile = require('../routers/admin/front-profile');
/* 个人简介相关 */
router.use('/admin/profile', adminProfile());



module.exports = () => {
    return router.routes();
};