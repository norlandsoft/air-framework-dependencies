package com.norlandsoft.air.platform.admin.model.vo;

import lombok.Data;

/**
 * 管理员菜单项 VO
 *
 * 与平台 SysMenuVO 字段一致，供前端菜单栏统一展示。
 *
 * Created by ChaiMingXu, on 2026/5/23
 */
@Data
public class AdminMenuVO {

  private String id;
  private String name;
  private String icon;
  private String parent;
  private Integer sortOrder;
}
