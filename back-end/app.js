/*
 * @Author: sky
 * @Date: 2018-12-28 00:13:19
 * @Description: app 项目启动入口
 */
const Koa = require('koa');


/* 中间件 */
const middleware = require('./middleware');

/* 链接数据库 */
const linkdb = require('./config/linkdb');
linkdb();

const port = process.env.PORT || 5000;


/* 实例化 app */
const app = new Koa();

/* 挂载中间件 */
middleware(app);


/* 启动监听 */
app.listen(port, () => console.log(`server is running at ${port} port...`));