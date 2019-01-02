/*
 * @Author: sky
 * @Date: 2018-12-27 23:57:08
 * @Description: 管理 前端-用户简介 的方法
 */
/* 工具方法 */
const tools = require('../../tools');

/* 用户模型 */
const User = require('../../models/api/User');
/* 个人简介模型 */
const Profile = require('../../models/api/Profile');

/* 引入验证方法 */
const validateProfile = require('../../validation/profile');


/* 导出方法 */
module.exports = {
    /* 查看个人简介 */
    checkProfile: async ctx => {
        let profile = await Profile.findOne({
            user: ctx.state.user.id
        }).populate('user', ['name', 'id']);

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
                result: '暂无个人简介。'
            };
        }
    },

    /* 添加个人简介 */
    appendProfile: async ctx => {
        const {
            errors,
            isValid
        } = validateProfile.validateProfileInput(ctx.request.body);

        // 判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                errors,
                result: '添加失败!'
            };
            return;
        }

        const profileFields = {};

        profileFields.user = ctx.state.user.id;

        if (ctx.request.body.handle !== undefined) {
            profileFields.handle = ctx.request.body.handle;
        }

        profileFields.company = ctx.request.body.company ? ctx.request.body.company : '';
        profileFields.website = ctx.request.body.website ? ctx.request.body.website : '';
        profileFields.location = ctx.request.body.location ? ctx.request.body.location : '';
        profileFields.status = ctx.request.body.status ? ctx.request.body.status : '';

        if (typeof ctx.request.body.skills !== 'undefined') {
            profileFields.skills = ctx.request.body.skills.split(',');
        }

        profileFields.bio = ctx.request.body.bio ? ctx.request.body.bio : '';
        profileFields.github = ctx.request.body.github ? ctx.request.body.github : '';

        profileFields.social = {};

        profileFields.social.wechat = ctx.request.body.wechat ? ctx.request.body.wechat : '';
        profileFields.social.QQ = ctx.request.body.QQ ? ctx.request.body.QQ : '';

        // 查询数据库
        const profile = await Profile.findOne({
            user: ctx.state.user.id
        });
        if (profile) {
            // 存在 更新
            const profileUpdate = await Profile.findOneAndUpdate({
                user: ctx.state.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });

            if (profileUpdate) {
                ctx.body = {
                    msg: 'success',
                    result: {
                        profile: profileUpdate
                    }
                };
            } else {
                ctx.body = {
                    msg: 'error',
                    result: '存储失败'
                };
            }
        } else {
            // 不存在 存储
            let profileSave = await new Profile(profileFields).save().populate('user', ['name', 'avatar', 'id']);

            if (profileSave) {
                ctx.body = {
                    msg: 'success',
                    result: {
                        profile: profileSave
                    }
                };
            } else {
                ctx.body = {
                    msg: 'error',
                    result: '存储失败'
                };
            }
        }
    },

    /* 删除个人简介 */
    deleteProfile: async ctx => {
        let profile2 = await Profile.findOne({
            user: ctx.state.user.id
        });

        if (profile2) {
            const profile = await Profile.deleteOne({
                user: ctx.state.user.id
            });
            if (profile.ok === 1) {
                ctx.body = {
                    msg: 'success',
                    result: '删除成功。'
                };
            }
        } else {
            ctx.body = {
                msg: 'error',
                result: '未找到该用户的个人信息，删除失败。'
            };
        }
    },

    /* 通过 handle 获取用户简介 */
    checkProfileByHandle: async ctx => {
        const handle = ctx.query.handle;

        const profile = await Profile.find({
            handle
        }).populate('user', ['name', 'avatar', 'id']);

        if (profile.length < 1) {
            ctx.status = 404;
            ctx.body = {
                msg: 'error',
                result: '未找到该用户信息'
            };
        } else {
            ctx.body = {
                msg: 'success',
                result: {
                    profile
                }
            };
        }
    },

    /* 通过 user_id 获取用户简介 */
    checkProfileByUserId: async ctx => {
        const user_id = ctx.query.user_id;

        let idLength = tools.idLength(ctx, user_id);
        if (idLength) return ctx.body = idLength;

        const profile = await Profile.findOne({
            user: user_id
        }).populate('user', ['name', 'avatar', 'id']);

        if (profile) {
            ctx.body = {
                msg: 'success',
                result: {
                    profile
                }
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                msg: 'error',
                result: '未找到该用户信息'
            };
        }
    },

    /* 添加个人经历 */
    appendExperience: async ctx => {
        const {
            errors,
            isValid
        } = validateProfile.validateExperienceInput(ctx.request.body);

        // 判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                errors,
                result: '添加失败!'
            };
            return;
        }

        const profileFields = {};
        profileFields.experience = [];

        const profile = await Profile.findOne({
            user: ctx.state.user.id
        });

        if (profile) {
            const newExp = {
                title: ctx.request.body.title,
                current: ctx.request.body.current,
                company: ctx.request.body.company,
                location: ctx.request.body.location,
                from: ctx.request.body.from,
                to: ctx.request.body.to,
                description: ctx.request.body.description
            };

            profileFields.experience.unshift(newExp);

            const profileUpdate = await Profile.updateOne({
                user: ctx.state.user.id
            }, {
                $push: {
                    experience: profileFields.experience
                }
            }, {
                $sort: 1
            });

            if (profileUpdate.ok === 1) {
                const profile = await Profile.findOne({
                    user: ctx.state.user.id
                }).populate('user', ['name', 'avatar', 'id']);

                if (profile) {
                    ctx.body = {
                        msg: 'success',
                        result: {
                            profile
                        }
                    };
                }
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                msg: 'error',
                result: '未找到该用户信息,请先添加用户信息。'
            };
        }
    },

    /* 删除个人经历 */
    deleteExperience: async ctx => {
        const exp_id = ctx.query.exp_id;

        let idLength = tools.idLength(ctx, exp_id);
        if (idLength) return ctx.body = idLength;

        const profile = await Profile.findOne({
            user: ctx.state.user.id
        });

        if (profile.experience.length > 0) {
            // 找出元素下标
            const removeIndex = profile.experience.map(item => item.id).indexOf(exp_id);

            // 删除
            profile.experience.splice(removeIndex, 1);
            // 更新数据库
            const profileUpdate = await Profile.findOneAndUpdate({
                user: ctx.state.user.id
            }, {
                $set: profile
            }, {
                new: true
            }).populate('user', ['name', 'avatar', 'id']);

            ctx.body = {
                msg: 'success',
                result: {
                    profileUpdate
                }
            };
        } else {
            ctx.body = {
                msg: 'error',
                result: '未找到该用户的个人经历，删除失败。'
            };
        }
    },

    /* 添加教育经历 */
    appendEducation: async ctx => {
        const {
            errors,
            isValid
        } = validateProfile.validateEducationInput(ctx.request.body);

        // 判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }
        const profileFields = {};
        profileFields.education = [];

        const profile = await Profile.findOne({
            user: ctx.state.user.id
        });

        if (profile) {
            const newEdu = {
                school: ctx.request.body.school,
                current: ctx.request.body.current,
                degree: ctx.request.body.degree,
                fieldofstudy: ctx.request.body.fieldofstudy,
                from: ctx.request.body.from,
                to: ctx.request.body.to,
                description: ctx.request.body.description
            };

            profileFields.education.unshift(newEdu);

            const profileUpdate = await Profile.updateOne({
                user: ctx.state.user.id
            }, {
                $push: {
                    education: profileFields.education
                }
            }, {
                $sort: 1
            });

            if (profileUpdate.ok === 1) {
                const profile = await Profile.findOne({
                    user: ctx.state.user.id
                }).populate('user', ['name', 'avatar', 'id']);

                if (profile) {
                    ctx.body = {
                        msg: 'success',
                        result: {
                            profile
                        }
                    };
                }
            }
        } else {
            ctx.status = 404;
            ctx.body = {
                msg: 'error',
                result: '未找到该用户信息,请先添加用户信息。'
            };
        }
    },

    /* 删除教育经历 */
    deleteEducation: async ctx => {
        const edu_id = ctx.query.edu_id;

        let idLength = tools.idLength(ctx, edu_id);
        if (idLength) return ctx.body = idLength;

        const profile = await Profile.findOne({
            user: ctx.state.user.id
        });

        if (profile.education.length > 0) {
            // 找出元素下标
            const removeIndex = profile.education.map(item => item.id).indexOf(edu_id);

            // 删除
            profile.education.splice(removeIndex, 1);
            // 更新数据库
            const profileUpdate = await Profile.findOneAndUpdate({
                user: ctx.state.user.id
            }, {
                $set: profile
            }, {
                new: true
            }).populate('user', ['name', 'avatar', 'id']);

            ctx.body = {
                msg: 'success',
                result: {
                    profileUpdate
                }
            };
        } else {
            ctx.body = {
                msg: 'error',
                result: '未找到该用户的个人教育经历，删除失败。'
            };
        }
    }
}