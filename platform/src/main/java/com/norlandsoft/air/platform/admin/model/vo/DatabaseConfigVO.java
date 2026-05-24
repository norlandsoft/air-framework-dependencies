package com.norlandsoft.air.platform.admin.model.vo;

import lombok.Data;

/**
 * 数据库配置视图对象
 *
 * 用于返回数据库连接配置给前端展示。
 *
 * Created by ChaiMingXu, on 2026/5/23
 */
@Data
public class DatabaseConfigVO {

  private String driver;
  private String host;
  private Integer port;
  private String database;
  private String schema;
  private String username;
  private String password;

  private Integer minIdle;
  private Integer maxIdle;
  private Integer maxTotal;
  private Long maxWaitMillis;
}
