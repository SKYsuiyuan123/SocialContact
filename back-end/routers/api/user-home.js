/*
 * @Author: sky
 * @Date: 2018-12-27 23:57:08
 * @Description: 管理 前端-用户 的方法
 */
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');


/* 工具方法 */
const tools = require('../../tools');

/* 用户模型 */
const User = require('../../models/api/User');

/* 引入验证方法 */
const validateUser = require('../../validation/user');

/* 加密名字 */
const keys = require('../../config/keys');


/* 导出方法 */
module.exports = {
    /* 注册 */
    register: async ctx => {
        const {
            errors,
            isValid
        } = validateUser.validateRegisterInput(ctx.request.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                errors,
                result: '注册失败。'
            };
            return;
        }

        let result = await User.findOne({
            email: ctx.request.body.email
        });
        if (result) {
            // 邮箱已被使用
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                result: '注册失败，该邮箱已被占用！'
            };
        } else {
            // 邮箱可用

            let avatar = gravatar.url(ctx.request.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            // 加密
            const password = tools.md5Encryption(ctx.request.body.password);
            const newUser = new User({
                name: ctx.request.body.name,
                email: ctx.request.body.email,
                avatar,
                password
            });

            // 存储数据库
            let user = await newUser.save()
            if (user) {
                ctx.body = {
                    msg: 'success',
                    result: {
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar
                    }
                };
            } else {
                ctx.body = {
                    msg: 'error',
                    result: '存储失败!'
                };
            }
        }
    },

    /* 登录 */
    login: async ctx => {
        const {
            errors,
            isValid
        } = validateUser.validateLoginInput(ctx.request.body);

        // 判断 isValid 是否通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                errors,
                result: '登录失败。'
            };
            return;
        }

        let user = await User.findOne({
            email: ctx.request.body.email
        });
        if (!user) {
            // 用户不存在
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                result: '登录失败，当前用户不存在！'
            };
        } else {
            // 比对密码
            const password = tools.md5Encryption(ctx.request.body.password);
            if (password === user.password) {
                // jwt.sign('规则', '加密名字', '过期时间', '回调函数')
                const rule = {
                    id: user.id,
                    name: user.name
                };

                // 生成 token
                const token = jwt.sign(rule, keys.secretOrKey, {
                    expiresIn: 36000
                });

                ctx.body = {
                    msg: 'success',
                    result: {
                        token: 'Bearer ' + token
                    }
                };
            } else {
                // 密码错误
                ctx.status = 400;
                ctx.body = {
                    msg: 'error',
                    result: '登录失败，密码错误!'
                };
            }
        }
    },

    /* 获取个人信息 */
    current: async ctx => {
        ctx.body = {
            msg: 'success',
            result: {
                id: ctx.state.user.id,
                name: ctx.state.user.name,
                email: ctx.state.user.email,
                avatar: ctx.state.user.avatar,
                registerDate: ctx.state.user.date
            }
        };
    }
}