// 跟任务文档无关的接口
import request from '@/utils/request';

/**
 * 登录
 * @param {userName} 用户名
 * @param {password} 密码
 */
export function login ({userAccount, password}) {
    return request({
        url: '/login',
        method: 'post',
        data: {userAccount, password}
    });
};

/**
 * 登录后获取菜单权限
 */
export function fetchAccess () {
    return request({
        url: '/getResources',
        method: 'post'
    });
};

/**
 * 获取消息
 * @param {status} 消息状态：可选，0未读，1已读
 */
export function fetchMessages (param) {
    return request({
        url: '/getMessages',
        method: 'post',
        data: param
    });
};

/**
 * 更改消息状态
 * @param {id} 消息id 
 */
export function updateMessage ({id}) {
    return request({
        url: '/updateMessage',
        method: 'post',
        data: {id}
    });
};

// 字典管理
/**
 * 不分页获取所有字典数据
 */
export function fetchAllDicts () {
    return request({
        url: '/dict/getDicts',
        method: 'post'
    });
};

/**
 * 查询字典列表
 * @param {currentPage} 页码 
 * @param {pageSize} 每页大小 
 * @param {dictCode} 字典值
 * @param {dictName} 字典名
 */
export function fetchDictionarytList ({currentPage, pageSize, dictCode, dictName}) {
    return request({
        url: '/dict/queryTable',
        method: 'post',
        data: {currentPage, pageSize, dictCode, dictName}
    });
};

/**
 * 创建字典
 * @param {adminSecret} 密钥 
 * @param {dictCode} 字典值 
 * @param {dictName} 字典名
 * @param {dictDesc} 字典描述
 */
export function createDictionary ({adminSecret, dictCode, dictName, dictDesc}) {
    return request({
        url: '/dict/add',
        method: 'post',
        data: {adminSecret, dictCode, dictName, dictDesc}
    });
};

/**
 * 修改字典
 * @param {id} 字典id 
 * @param {adminSecret} 密钥 
 * @param {dictCode} 字典值 
 * @param {dictName} 字典名
 * @param {dictDesc} 字典描述
 */
export function updateDictionary ({adminSecret, dictCode, dictName, dictDesc, id}) {
    return request({
        url: '/dict/update',
        method: 'post',
        data: {adminSecret, dictCode, dictName, dictDesc, id}
    });
};

// 角色管理
/**
 * 获取所有权限列表
 */
export function fetchAuthority () {
    return request({
        url: '/sys/role/getModules',
        method: 'post'
    });
};

/**
 * 新增角色
 * @param {priIds} 权限id，多个用,连接 
 * @param {roleName} 角色名称
 * @param {roleDesc} 角色描述
 * @param {status} 角色状态
 */
export function createRole ({priIds, roleName, roleDesc, status}) {
    return request({
        url: '/sys/role/add',
        method: 'post',
        data: {priIds, roleName, roleDesc, status}
    });
};

/**
 * 修改角色
 * @param {id} 角色id 
 * @param {priIds} 权限id，多个用,连接 
 * @param {roleName} 角色名称 
 * @param {roleDesc} 角色描述 
 * @param {status} 角色状态
 */
export function updateRole ({id, priIds, roleName, roleDesc, status}) {
    return request({
        url: '/sys/role/update',
        method: 'post',
        data: {id, priIds, roleName, roleDesc, status}
    });
};

/**
 * 不分页查询所有角色
 */
export function fetchAllRoles () {
    return request({
        url: '/sys/role/getRoles',
        method: 'post'
    });
};

/**
 * 查询角色列表
 * @param {currentPage} 页码 
 * @param {pageSize} 每页大小 
 * @param {roleName} 角色名称
 * @param {status} 状态
 */
export function fetchRoleList ({currentPage, pageSize, roleName, status}) {
    return request({
        url: '/sys/role/queryTable',
        method: 'post',
        data: {currentPage, pageSize, roleName, status}
    });
};

/**
 * 获取指定角色权限
 * @param {roleId} 角色id 
 */
export function fetchRoleAuthority ({roleId}) {
    return request({
        url: '/sys/role/getRoleModules',
        method: 'post',
        data: {roleId}
    });
};

//用户相关
/**
 * 获取登录后用户信息
 */
export function fetchLoginUser () {
    return request({
        url: '/getLoginUser',
        method: 'post'
    });
};

/**
 * 修改用户密码
 * @param {userId} 用户id 
 * @param {oldPasswd} 旧密码 
 * @param {newPasswd} 新密码 
 */
export function updatePassword ({userId, oldPasswd, newPasswd}) {
    return request({
        url: '/sys/user/updatePwd',
        method: 'post',
        data: {userId, oldPasswd, newPasswd}
    });
};

/**
 * 新增用户
 * @param {mobile} 手机号
 * @param {userName} 用户姓名
 * @param {roleIds} 权限id，多个用,连接
 * @param {wechat} 微信号
 */
export function createUser ({mobile, userName, roleIds, wechat}) {
    return request({
        url: '/sys/user/addUser',
        method: 'post',
        data: {mobile, userName, roleIds, wechat}
    });
};

/**
 * 修改用户
 * @param {id} 用户id
 * @param {mobile} 手机号
 * @param {userName} 用户姓名
 * @param {roleIds} 权限id，多个用,连接
 * @param {wechat} 微信号
 */
export function updateUser ({id, mobile, userName, roleIds, wechat}) {
    return request({
        url: '/sys/user/updateUser',
        method: 'post',
        data: {id, mobile, userName, roleIds, wechat}
    });
};

/**
 * 查询用户列表
 * @param {currentPage} 页码 
 * @param {pageSize} 每页大小 
 * @param {status} 状态 1启用 0黑名单
 * @param {userName} 用户名称
 */
export function fetchUserList ({currentPage, pageSize, status, userName}) {
    return request({
        url: '/sys/user/queryTable',
        method: 'post',
        data: {currentPage, pageSize, status, userName}
    });
};

// 日志管理
/**
 * 查询所有操作类别
 */
export function fetchOptionTypes () {
    return request({
        url: '/sys/log/getOpTypes',
        method: 'post'
    });
};

/**
 * 查询日志列表
 * @param {currentPage} 页码 
 * @param {pageSize} 每页大小 
 * @param {startTime} 开始时间
 * @param {endTime} 结束时间
 * @param {opModule} 模块名称
 * @param {opType} 操作类别
 */
export function fetchLogList ({currentPage, pageSize, startTime, endTime, opModule, opType}) {
    return request({
        url: '/sys/log/queryTable',
        method: 'post',
        data: {currentPage, pageSize, startTime, endTime, opModule, opType}
    });
};


