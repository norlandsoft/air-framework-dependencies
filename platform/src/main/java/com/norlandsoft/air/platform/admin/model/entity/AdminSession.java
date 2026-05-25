package com.norlandsoft.air.platform.admin.model.entity;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 管理员会话（存 EmbeddedStorage）
 *
 * Created by ChaiMingXu, on 2026/4/25
 */
@Data
public class AdminSession {

  private String sessionId;
  private String userId;
  private String userName;
  private String userRole;
  private LocalDateTime createTime;
  private LocalDateTime lastAccessTime;
  private LocalDateTime expireTime;
}
