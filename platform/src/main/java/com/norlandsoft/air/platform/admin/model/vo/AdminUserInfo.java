package com.norlandsoft.air.platform.admin.model.vo;

import lombok.Data;

/**
 * 管理员用户信息
 *
 * 仅包含展示字段，不含密码等敏感信息。
 *
 * Created by ChaiMingXu, on 2026/4/25
 */
@Data
public class AdminUserInfo {

  private String id;
  private String loginId;
  private String name;
  private String role;
  private String status;
  private String avatar;
}
