package com.norlandsoft.air.platform.model.vo;

import lombok.Data;

/**
 * 菜单视图对象
 *
 * 用于前端展示菜单信息，与 AdminMenuVO 字段一致。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@Data
public class UserMenuVO {

  private String id;

  private String name;

  private String icon;

  private String parent;

  private Integer sortOrder;
}
