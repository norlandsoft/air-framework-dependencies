package com.norlandsoft.air.platform.model.dto;

import lombok.Data;

/**
 * 菜单创建DTO
 *
 * 用于创建菜单时的请求参数封装。
 * ID字段可选，不提供时自动生成UUID。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@Data
public class UserMenuCreateDTO {

  /**
   * 菜单ID（可选，不提供则自动生成）
   */
  private String id;

  /**
   * 菜单名称
   */
  private String name;

  /**
   * 菜单图标
   */
  private String icon;

  /**
   * 父菜单ID
   */
  private String parent;

  /**
   * 排序字段
   */
  private Integer sortOrder;
}
