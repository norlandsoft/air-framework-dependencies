package com.norlandsoft.air.platform.model.entity;

import lombok.Data;

/**
 * 用户菜单实体类
 *
 * 对应数据库表 user_menu，表示 UI 主菜单项。
 * 支持层级关系：一级菜单的 parent 为 "000000"，子菜单的 parent 为父菜单 ID。
 * 菜单数据以查询为主，初始化时插入数据库。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@Data
public class UserMenu {

  /**
   * 菜单ID，主键
   */
  private String id;

  /**
   * 菜单名称，用于前端显示
   */
  private String name;

  /**
   * 菜单图标标识
   */
  private String icon;

  /**
   * 父菜单ID，一级菜单的 parent 为 "000000"
   */
  private String parent;

  /**
   * 排序字段，数值越小越靠前
   */
  private Integer sortOrder;
}
