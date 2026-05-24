package com.norlandsoft.air.platform.admin.model.vo;

import lombok.Data;

/**
 * Redis 配置视图对象
 *
 * 用于返回 Redis 连接配置给前端展示。
 *
 * Created by ChaiMingXu, on 2026/5/23
 */
@Data
public class RedisConfigVO {

  private String host;
  private Integer port;
  private String password;
  private Integer database;

  private Integer maxTotal;
  private Integer maxIdle;
  private Integer minIdle;
  private Long maxWaitMillis;
}
