/*
 * @Author: sky
 * @Date: 2018-12-28 15:19:16
 * @Description: 管理前端的 用户
 */

const router = require('koa-router')();
const passport = require('koa-passport');

/* 前端用户模型 */
const User = require('../../models/api/User');
/* 个人简介模型 */
const Profile = require('../../models/api/Profile');


/**
 * @route GET /admin/profile/all
 * @desc 查询所有用户的个人简介
 * @access 公开
 */
router.get('/all', async ctx => {
    // 查询前端 个人信息数据库
    let profiles = await Profile.find({}).populate('user', ['name, avatar', 'email']);

    if (profiles.length < 1) {
        ctx.body = {
            msg: 'error',
            result: '暂未有用户填写个人信息。'
        };
    } else {
        ctx.body = {
            msg: 'success',
            result: {
                profiles
            }
        };
    }
});


/**
 * @route GET /admin/profile/:id
 * @desc 根据用户的个人简介id 查询 用户的个人简介
 * @access 公开
 */
router.get('/:id', async ctx => {
    // 查询前端 个人信息数据库
    const id = ctx.params.id;

    let idLength = tools.idLength(ctx, id);
    if (idLength) return ctx.body = idLength;

    let profile = await Profile.findById({
        _id: id
    }).populate('user', ['name, avatar', 'email']);

    if (profile) {
        ctx.body = {
            msg: 'success',
            result: {
                profile
            }
        };
    } else {
        ctx.body = {
            msg: 'error',
            result: '未找到该用户的个人简介。'
        };
    }
});


module.exports = () => {
    return router.routes();
}