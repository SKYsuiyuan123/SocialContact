/*
 * @Author: sky
 * @Date: 2019-01-02 16:23:31
 * @Description: 用户评论
 */
const router = require('koa-router')();
const passport = require('koa-passport');

const postHome = require('./post-home');


/**
 * 使用授权
 * @access 私人 token 验证
 */
router.use(passport.authenticate('jwt', {
    session: false
}));


/**
 * @route GET /api/post/test
 * @desc 测试接口地址
 */
router.get('/test', async ctx => {
    ctx.body = '测试接口';
});


/**
 * @route GET /api/post?id=xxxxx
 * @desc 根据 id 获取 留言
 * id 评论 id
 */
router.get('/', postHome.checkPost);

/**
 * @route POST /api/post
 * @desc 创建 留言
 */
router.post('/', postHome.appendPost);

/**
 * @route DELETE /api/post?id=xxxxx
 * @desc 根据 id 删除 留言
 * id POST 的 id
 */
router.delete('/', postHome.deletePost);

/**
 * @route GET /api/post/all
 * @desc 获取 所有留言
 */
router.get('/all', postHome.checkPostAll);


/**
 * @route GET /api/post/like?id=xxx
 * @desc 点赞
 */
router.get('/like', postHome.appendLike);

/**
 * @route GET /api/post/unlike?id=xxx
 * @desc 取消点赞
 */
router.get('/unlike', postHome.deleteLike);


/**
 * @route POST /api/post/comment?id=xxx
 * @desc 评论
 * id: POST 的 id
 */
router.post('/comment', postHome.appendComment);

/**
 * @route DELETE /api/post/comment?id=xxx&comment_id=xxx
 * @desc 删除评论接口
 * id: POST 的 id
 * comment_id: 评论的 id
 */
router.delete('/comment', postHome.deleteComment);


module.exports = () => {
    return router.routes();
}