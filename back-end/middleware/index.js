/*
 * @Author: sky
 * @Date: 2018-12-28 00:14:14
 * @Description: 挂载项目中间件
 */
const logger = require('koa-logger');
const static = require('koa-static-cache');
const cors = require('@koa/cors');

/* 控制器 */
const controller = require('../controller/index');


module.exports = (app) => {
    /* 允许跨域 */
    app.use(cors());

    /* 请求时间 */
    app.use(async (ctx, next) => {
        console.log(new Date().toLocaleString());
        await next();
    });

    /* 请求日志 */
    app.use(logger());

    /* 静态文件 默认缓存并压缩 */
    app.use(static('public'));

    /* 挂载控制器 */
    app.use(controller());

    /* 错误处理 */
    app.use(async (ctx, next) => {
        await next();
        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = '404 Not Found';
        }
    });
}