/*
 * @Author: sky
 * @Date: 2019-01-02 13:15:33
 * @Description: 验证添加个人信息的 数据时候合法
 */
const Validator = require('validator');
const isEmpty = require('./is-empty');


/**
 * 验证个人信息
 * @param {*} data 需要验证的数据
 */
function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!Validator.isLength(data.handle, {
            min: 2,
            max: 40
        })) {
        errors.handle = 'handle的长度不能小于2位，并且不能大于40位!';
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'handle不能为空!';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'status不能为空!';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'skills不能为空!';
    }

    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = 'url不合法!';
        }
    }

    if (!isEmpty(data.tengxunkt)) {
        if (!Validator.isURL(data.tengxunkt)) {
            errors.tengxunkt = 'url不合法!';
        }
    }

    if (!isEmpty(data.wangyikt)) {
        if (!Validator.isURL(data.wangyikt)) {
            errors.wangyikt = 'url不合法!';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


/**
 * 验证个人经历
 * @param {*} data 需要验证的数据
 */
function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'title不能为空';
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'company不能为空';
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = 'from不能为空';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}


/**
 * 验证个人教育
 * @param {*} data 需要验证的数据
 */
function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = 'school不能为空';
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'degree不能为空';
    }

    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'fieldofstudy不能为空';
    }

    if (!Validator.isBoolean(data.current)) {
        errors.current = 'current的值为true或者false'
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = 'from不能为空';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}


module.exports = {
    validateProfileInput,
    validateExperienceInput,
    validateEducationInput
};