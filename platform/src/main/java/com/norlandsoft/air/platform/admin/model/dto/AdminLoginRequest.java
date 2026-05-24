package com.norlandsoft.air.platform.admin.model.dto;

import lombok.Data;

/**
 * 管理员登录请求 DTO
 *
 * 与平台 UserLoginDTO 字段一致，供前端统一传参。
 *
 * Created by ChaiMingXu, on 2026/4/25
 */
@Data
public class AdminLoginRequest {

  /**
   * 用户 ID，admin 登录时为 admin
   */
  private String id;

  /**
   * 密码，前端传输前已 SHA256 加密
   */
  private String password;
}
