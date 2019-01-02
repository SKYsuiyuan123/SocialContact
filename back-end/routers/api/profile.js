/*
 * @Author: sky
 * @Date: 2019-01-01 20:53:40
 * @Description: 用户的个人简介
 */
const router = require('koa-router')();
const passport = require('koa-passport');

const profileHome = require('./profile-home');


/**
 * 使用授权
 * @access 私人 token 验证
 */
router.use(passport.authenticate('jwt', {
    session: false
}));


/**
 * @route GET /api/profile/test
 * @desc 测试接口地址
 */
router.get('/test', async ctx => {
    ctx.body = '测试接口';
});

/**
 * @route GET /api/profile
 * @desc 获取 当前登录用户的个人信息
 */
router.get('/', profileHome.checkProfile);

/**
 * @route POST /api/profile
 * @desc 创建 或更新 当前登录用户的个人信息
 */
router.post('/', profileHome.appendProfile);

/**
 * @route DELETE /api/profile
 * @desc 删除 用户的个人信息
 */
router.delete('/', profileHome.deleteProfile);


/**
 * @route GET /api/profile/handle?handle=xxx
 * @desc 通过 handle 获取个人信息
 */
router.get('/handle', profileHome.checkProfileByHandle);

/**
 * @route GET /api/profile/user?user_id=xxx
 * @desc 通过 user_id 获取个人信息
 */
router.get('/user', profileHome.checkProfileByUserId);


/**
 * @route POST /api/profile/experience
 * @desc 添加个人经历
 */
router.post('/experience', profileHome.appendExperience);

/**
 * @route DELETE /api/profile/experience?exp_id=xxx
 * @desc  根据个人经历的 id 删除对应的个人经历
 */
router.delete('/experience', profileHome.deleteExperience);


/**
 * @route POST /api/profile/education
 * @desc 添加个人教育经历
 */
router.post('/education', profileHome.appendEducation);

/**
 * @route DELETE /api/profile/education?edu_id=xxx
 * @desc  根据个人教育经历的 id 删除对应的个人教育经历
 */
router.delete('/education', profileHome.deleteEducation);



module.exports = () => {
    return router.routes();
}