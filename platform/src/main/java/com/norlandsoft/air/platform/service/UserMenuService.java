package com.norlandsoft.air.platform.service;

import com.norlandsoft.air.platform.model.entity.UserMenu;

import java.util.List;

/**
 * 用户菜单服务层接口
 *
 * 提供菜单的增删改查操作。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
public interface UserMenuService {

  /**
   * 根据ID查询菜单
   */
  UserMenu getMenuById(String id);

  /**
   * 查询所有菜单，按 parent + sortOrder 排序
   */
  List<UserMenu> getAllMenus();

  /**
   * 根据父菜单ID查询子菜单列表
   */
  List<UserMenu> getMenusByParent(String parent);

  /**
   * 根据条件查询菜单列表
   */
  List<UserMenu> getMenusByCondition(UserMenu menu);

  /**
   * 创建菜单（ID不提供时自动生成，sortOrder默认0，parent默认"000000"）
   */
  UserMenu createMenu(UserMenu menu);

  /**
   * 更新菜单信息
   */
  UserMenu updateMenu(UserMenu menu);

  /**
   * 根据ID删除菜单
   */
  boolean deleteMenu(String id);

  /**
   * 统计菜单总数
   */
  long getMenuCount();
}
