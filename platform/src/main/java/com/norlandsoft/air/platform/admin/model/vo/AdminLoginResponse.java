package com.norlandsoft.air.platform.admin.model.vo;

import lombok.Data;

/**
 * 管理员登录响应
 *
 * Created by ChaiMingXu, on 2026/4/25
 */
@Data
public class AdminLoginResponse {

  private String token;
  private AdminUserInfo user;
}
