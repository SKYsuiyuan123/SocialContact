/*
 * @Author: sky
 * @Date: 2019-01-02 16:32:04
 * @Description: 验证评论提交的数据时候合法
 */
const Validator = require('validator');
const isEmpty = require('./is-empty');

function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (!Validator.isLength(data.text, {
            min: 10,
            max: 300
        })) {
        errors.text = '文本的长度不能小于10位且不能超过300位';
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = '文本不能为空';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};


module.exports = validatePostInput;