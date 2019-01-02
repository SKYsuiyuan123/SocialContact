# 用户的个人简介 权限: 验证用户 token

## 查看 个人简介

```
    url: GET /api/profile
    参数: 无
    成功:
    {
        msg: 'success',
        result: {
            profile
        }
    }
    失败:
    {
        msg: 'error',
        result: '暂无个人简介。'
    }
```

## 添加/更新 个人简介

```
    权限: 公开
    url: POST /api/profile
    参数:
    {
        email:      邮箱,
        password:   密码,
    }
    成功:
    {
        msg: 'success',
        result: {
            token: 用户 token
        }
    }
    失败:
    {
        msg: 'error',
        result: '失败原因'
    }
```