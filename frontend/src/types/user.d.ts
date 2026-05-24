/**
 * 用户相关类型定义
 * 非 admin 用户由 Framework SSO 管理，此文件仅保留登录和 admin 相关类型
 * Created by ChaiMingXu, on 2026/5/24
 */

/**
 * 用户登录请求
 */
export interface UserLoginRequest {
  id: string;
  password: string;
}

/**
 * 用户响应对象
 * 兼容 SSO 和 admin 两种来源的用户信息
 */
export interface UserResponse {
  id: string;
  loginId?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  role?: string;
  [key: string]: any;
}

/**
 * 管理员密码修改请求
 */
export interface AdminPasswordChangeRequest {
  password: string;
}
