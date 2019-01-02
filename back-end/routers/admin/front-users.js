/*
 * @Author: sky
 * @Date: 2018-12-28 15:19:16
 * @Description: 管理前端的 用户
 */
const tools = require('../../tools');
const router = require('koa-router')();
const passport = require('koa-passport');

/* 前端用户模型 */
const User = require('../../models/api/User');


/**
 * @route GET /admin/frontUsers/all
 * @desc 查询所有用户的个人信息
 * @access 公开
 */
router.get('/all', async ctx => {
    // 查询前端 用户数据库
    let users = await User.find({});
    users = users.map(v => {
        return {
            name: v.name,
            email: v.email,
            avatar: v.avatar,
            registerDate: v.date,
            id: v._id
        };
    });
    if (users) {
        ctx.body = {
            msg: 'success',
            result: {
                users
            }
        };
    }
});


/**
 * @route GET /admin/frontUsers/:id
 * @desc 查询某个用户的个人信息
 * @access 公开
 */
router.get('/:id', async ctx => {
    let idLength = tools.idLength(ctx, id);
    if (idLength) return ctx.body = idLength;


    // 查询前端 用户数据库
    let users = await User.findById({
        _id: ctx.params.id
    });
    if (users) {
        ctx.body = {
            msg: 'success',
            result: {
                users
            }
        };
    } else {
        ctx.body = {
            msg: 'error',
            result: '没有此用户'
        };
    }
});


/**
 * @route DELETE /admin/frontUsers/:id
 * @desc 删除某个用户
 * @access 公开
 */
router.delete('/:id', async ctx => {
    let idLength = tools.idLength(ctx, id);
    if (idLength) return ctx.body = idLength;

    // 查询前端 用户数据库
    let users = await User.findById({
        _id: ctx.params.id
    });

    if (users) {
        const user = await User.deleteOne({
            _id: ctx.params.id
        });

        if (user.ok === 1) {
            ctx.body = {
                msg: 'success',
                result: '删除成功。'
            };
        }
    } else {
        ctx.body = {
            msg: 'error',
            result: '没有此用户'
        };
    }
});


module.exports = () => {
    return router.routes();
}