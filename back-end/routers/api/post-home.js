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
/* 评论模型 */
const Post = require('../../models/api/Post');


/* 引入验证方法 */
const validatePostInput = require('../../validation/post');


/* 导出方法 */
module.exports = {
    /* 添加留言 */
    appendPost: async ctx => {
        const {
            errors,
            isValid
        } = validatePostInput(ctx.request.body);

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

        const newPost = new Post({
            text: ctx.request.body.text,
            name: ctx.request.body.name,
            avatar: ctx.request.body.avatar,
            user: ctx.state.user.id
        });

        let result = await newPost.save();
        if (result) {
            ctx.body = {
                msg: 'success',
                result
            };
        } else {
            ctx.body = {
                msg: 'error',
                result: '存储失败。'
            };
        }
    },

    /* 获取留言 */
    checkPost: async ctx => {
        const id = ctx.query.id;

        let idLength = tools.idLength(ctx, id);
        if (idLength) return ctx.body = idLength;

        const result = await Post.findById(id);

        if (result) {
            ctx.body = {
                msg: 'success',
                result
            };
        } else {
            ctx.body = {
                msg: 'error',
                result: '找不到该 id 对应的用户留言!'
            };
        }
    },

    /* 删除留言 */
    deletePost: async ctx => {
        const id = ctx.query.id;

        let idLength = tools.idLength(ctx, id);
        if (idLength) return ctx.body = idLength;

        /* 当前用户是否拥有个人信息 */
        const profile = await Profile.find({
            user: ctx.state.user.id
        });
        if (profile.length > 0) {
            // 查找此人留言
            const post = await Post.findById(id);

            if (!post) {
                return ctx.body = {
                    msg: 'error',
                    result: '当前留言并不存在!'
                };
            }

            // 判断是不是当前用户操作
            if (post.user.toString() !== ctx.state.user.id) {
                ctx.status = 401;
                ctx.body = {
                    msg: 'error',
                    result: {
                        notauthorized: '用户非法操作!'
                    }
                };
                return;
            }

            let result = await Post.remove({
                _id: id
            });

            if (result.ok === 1) {
                ctx.body = {
                    msg: 'success',
                    result: '删除成功!'
                };
            } else {
                ctx.body = {
                    msg: 'error',
                    result: '删除失败!'
                };
            }
        } else {
            ctx.body = {
                msg: 'error',
                result: '个人信息不存在!'
            }
        }
    },

    /* 获取所有留言 */
    checkPostAll: async ctx => {
        let result = await Post.find().sort({
            date: -1
        });

        if (result.length > 0) {
            ctx.body = {
                msg: 'success',
                result
            };
        } else {
            ctx.body = {
                msg: 'error',
                result: '还没有用户留言!'
            };
        }
    },

    /* 点赞 */
    appendLike: async ctx => {
        const id = ctx.query.id;

        let idLength = tools.idLength(ctx, id);
        if (idLength) return ctx.body = idLength;

        // 查询用户信息
        const profile = await Profile.find({
            user: ctx.state.user.id
        });

        if (profile.length > 0) {
            const post = await Post.findById(id);
            console.log(post);

            const isLike = post.likes.filter(like => like.user.toString() === ctx.state.user.id).length > 0;

            if (isLike) {
                ctx.status = 400;
                ctx.body = {
                    msg: 'error',
                    result: {
                        alreadyliked: '该用户已赞过'
                    }
                };
                return;
            }

            post.likes.unshift({
                user: ctx.state.user.id
            });

            const postUpdate = await Post.findOneAndUpdate({
                _id: id
            }, {
                $set: post
            }, {
                new: true
            });

            ctx.body = {
                msg: 'success',
                result: {
                    postUpdate
                }
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                msg: 'error',
                result: '用户信息不存在!'
            };
        }
    },

    /* 取消点赞 */
    deleteLike: async ctx => {
        const id = ctx.query.id;

        let idLength = tools.idLength(ctx, id);
        if (idLength) return ctx.body = idLength;

        // 查询用户信息
        const profile = await Profile.find({
            user: ctx.state.user.id
        });

        if (profile.length > 0) {
            const post = await Post.findById(id);
            const isLike = post.likes.filter(like => like.user.toString() === ctx.state.user.id).length === 0;

            if (isLike) {
                ctx.status = 400;
                ctx.body = {
                    msg: 'error',
                    result: {
                        alreadyliked: '该用户尚未点赞！'
                    }
                };
                return;
            }

            // 获取要删掉的 user id
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(id);

            post.likes.splice(removeIndex, 1);

            const postUpdate = await Post.findOneAndUpdate({
                _id: id
            }, {
                $set: post
            }, {
                new: true
            });

            ctx.body = {
                msg: 'success',
                result: {
                    postUpdate
                }
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                msg: 'error',
                result: '用户信息不存在!'
            };
        }
    },

    /* 评论 */
    appendComment: async ctx => {
        const id = ctx.query.id;

        let idLength = tools.idLength(ctx, id);
        if (idLength) return ctx.body = idLength;

        if (ctx.request.body.text === undefined || ctx.request.body.text.trim().length === 0) {
            return ctx.body = {
                msg: 'error',
                result: '评论必须提交评论内容'
            };
        }

        const post = await Post.findById(id);
        const newComment = {
            text: ctx.request.body.text,
            name: ctx.request.body.name || '',
            avatar: ctx.request.body.avatar || '',
            user: ctx.state.user.id
        };

        post.comments.unshift(newComment);

        const postUpdate = await Post.findOneAndUpdate({
            _id: id
        }, {
            $set: post
        }, {
            new: true
        });
        ctx.body = {
            msg: 'success',
            result: {
                postUpdate
            }
        };
    },

    /* 删除评论 */
    deleteComment: async ctx => {
        const id = ctx.query.id;
        const comment_id = ctx.query.comment_id;

        let idLength = tools.idLength(ctx, id);
        if (idLength) return ctx.body = idLength;

        const post = await Post.findById(id);
        if (!post) {
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                result: {
                    commentnotexists: '总体评论不存在!'
                }
            };
            return;
        }
        const isComment = post.comments.filter(comment => comment._id.toString() === comment_id).length == 0;

        if (isComment) {
            ctx.status = 400;
            ctx.body = {
                msg: 'error',
                result: {
                    commentnotexists: '该评论不存在!'
                }
            };
            return;
        }

        // 找到该评论信息
        const removeIndex = post.comments.map(item => item._id.toString()).indexOf(comment_id);

        // 删除
        post.comments.splice(removeIndex, 1);
        const postUpdate = await Post.findByIdAndUpdate({
            _id: id
        }, {
            $set: post
        }, {
            new: true
        });
        ctx.body = {
            msg: 'success',
            result: {
                postUpdate
            }
        };
    }
}