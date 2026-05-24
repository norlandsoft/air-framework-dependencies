package com.norlandsoft.air.platform.model.dto;

import lombok.Data;

/**
 * 菜单更新DTO
 *
 * 用于更新菜单时的请求参数封装。
 * ID字段必填，其他字段仅更新非空值。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@Data
public class UserMenuUpdateDTO {

  /**
   * 菜单ID，必填
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
