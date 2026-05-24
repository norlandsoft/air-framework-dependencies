package com.norlandsoft.air.platform.model.dto;

import lombok.Data;

/**
 * 菜单查询DTO
 *
 * 用于菜单列表查询时的条件封装。
 * 所有字段均为可选，用于条件查询。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@Data
public class UserMenuQueryDTO {

  /**
   * 菜单ID
   */
  private String id;

  /**
   * 菜单名称（模糊查询）
   */
  private String name;

  /**
   * 父菜单ID
   */
  private String parent;

  /**
   * 排序字段
   */
  private Integer sortOrder;
}
