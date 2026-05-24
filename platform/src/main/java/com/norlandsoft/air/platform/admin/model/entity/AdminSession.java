package com.norlandsoft.air.platform.admin.model.entity;

import lombok.Data;

/**
 * 管理员会话（存 EmbeddedStorage）
 *
 * 用于序列化存入本地存储，时间字段为 epoch 毫秒。
 *
 * Created by ChaiMingXu, on 2026/4/25
 */
@Data
public class AdminSession {

  private String sessionId;
  private String userId;
  private String userName;
  private String userRole;
  private long createTime;
  private long lastAccessTime;
  private long expireTime;
}
