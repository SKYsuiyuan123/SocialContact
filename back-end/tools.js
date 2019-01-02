/*
 * @Author: sky
 * @Date: 2018-12-27 19:10:13
 * @Description: 常用工具方法
 */
const crypto = require('crypto');

/**
 * md5 加密
 */
exports.md5Encryption = data => {
    const hash = crypto.createHash('md5');
    hash.update(data);
    const str = hash.digest('hex');
    return str;
}


/**
 * 验证参数 id 长度是否正确
 */
exports.idLength = (ctx, id = '') => {
    if (id.length !== 24) {
        return {
            msg: 'error',
            result: {
                id: '参数Id长度不正确'
            }
        };
    }
}