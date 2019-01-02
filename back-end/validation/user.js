/*
 * @Author: sky
 * @Date: 2018-12-27 18:07:39
 * @Description: 验证用户登录跟注册的参数是否合法
 */
const Validator = require('validator');
const isEmpty = require('./is-empty');


/**
 * 注册验证
 * @param {*} data 注册时所传递的数据
 */
function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!Validator.isLength(data.name, {
            min: 2,
            max: 30
        })) {
        errors.name = '名字的长度不能小于2位，并且不能大于30位!';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = '名字不能为空!';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = '邮箱不合法!';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = '邮箱不能为空!';
    }

    if (!Validator.isLength(data.password, {
            min: 6,
            max: 30
        })) {
        errors.password = '密码的长度不能小于6位，并且不能大于30位!';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = '密码不能为空!';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = '确认密码不能为空!';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = '两次密码不一致!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}

/**
 * 登录验证
 * @param {*} data 登录时所传递的数据
 */
function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = '邮箱不合法!';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = '邮箱不能为空!';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = '密码不能为空!';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}



module.exports = {
    validateRegisterInput,
    validateLoginInput
};