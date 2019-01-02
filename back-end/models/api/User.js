/*
 * @Author: sky
 * @Date: 2018-12-27 17:43:06
 * @Description: users model 用户账号信息
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema  实例化数据模板
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = User = mongoose.model('users', UserSchema);