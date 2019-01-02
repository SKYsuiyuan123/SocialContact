/*
 * @Author: sky
 * @Date: 2018-12-27 16:43:02
 * @Description: 链接数据库
 */
const mongoose = require('mongoose');
const dbURI = require('./keys').mongoURI;


/**
 * 长连接
 */
function linkdb() {
    // 链接数据库
    mongoose.connect(dbURI, {
            useNewUrlParser: true
        })
        .then(() => console.log('Mongodb Connected...'))
        .catch(err => console.log(err));
}


module.exports = linkdb;