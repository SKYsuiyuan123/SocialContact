# 用户接口

## 注册

```
    权限: 公开
    url: POST /api/user/register
    参数:
    {
        name:       用户名,
        email:      邮箱,
        password:   密码,
        password2:  确认密码,
        avatar:     头像地址（可选）
    }
    成功:
    {
        msg: 'success',
        result: {
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    }
    失败:
    {
        msg: 'error',
        result: '失败原因'
    }
```

## 登录

```
    权限: 公开
    url: POST /api/user/login
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

## 查看账号信息

```
    权限: 验证用户 token
    url: GET /api/user/current
    参数: 无
    成功:
    {
        msg: 'success',
        result: {
            id: 用户id,
            name: 用户名,
            email: 用户邮箱,
            avatar: 用户头像地址,
            registerDate: 用户注册日期
        }
    }
    失败:
    {
        token 验证失败。
    }
```