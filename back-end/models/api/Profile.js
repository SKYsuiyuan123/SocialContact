/*
 * @Author: sky
 * @Date: 2019-01-01 20:16:09
 * @Description: profiles model 个人简介
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// 实例化数据模板
const ProfileSchema = new Schema({
    user: {
        // 关联 users 数据表
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    github: {
        type: String
    },
    experience: [{
        current: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String
        },
        description: {
            type: String
        }
    }],
    education: [{
        current: {
            type: Boolean,
            default: true
        },
        school: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String
        },
        description: {
            type: String
        }
    }],
    social: {
        wechat: {
            type: String
        },
        QQ: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = Profile = mongoose.model('profiles', ProfileSchema);