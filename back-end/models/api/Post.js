/*
 * @Author: sky
 * @Date: 2019-01-02 16:18:22
 * @Description: Post model 用户评论
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const PostSchema = new Schema({
    user: {
        // 关联数据表
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = Post = mongoose.model('posts', PostSchema);