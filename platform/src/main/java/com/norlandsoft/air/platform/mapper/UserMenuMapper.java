package com.norlandsoft.air.platform.mapper;

import com.norlandsoft.air.platform.model.entity.UserMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户菜单数据访问层接口
 *
 * 对应 user_menu 表，提供菜单的增删改查操作。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@Mapper
public interface UserMenuMapper {

  /**
   * 根据ID查询菜单
   */
  UserMenu selectById(@Param("id") String id);

  /**
   * 查询所有菜单，按 parent + sortOrder 排序
   */
  List<UserMenu> selectAll();

  /**
   * 根据父菜单ID查询子菜单列表
   */
  List<UserMenu> selectByParent(@Param("parent") String parent);

  /**
   * 根据条件查询菜单列表
   */
  List<UserMenu> selectByCondition(UserMenu menu);

  /**
   * 插入菜单
   */
  int insert(UserMenu menu);

  /**
   * 更新菜单（仅更新非空字段）
   */
  int update(UserMenu menu);

  /**
   * 根据ID删除菜单
   */
  int deleteById(@Param("id") String id);

  /**
   * 统计菜单总数
   */
  long count();
}
