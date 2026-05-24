package com.norlandsoft.air.platform.service.impl;

import com.norlandsoft.air.framework.sdk.util.IDGenerator;
import com.norlandsoft.air.platform.mapper.UserMenuMapper;
import com.norlandsoft.air.platform.model.entity.UserMenu;
import com.norlandsoft.air.platform.service.UserMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户菜单服务层实现类
 *
 * 提供菜单的增删改查操作，ID不提供时自动生成UUID，
 * sortOrder默认为0，parent默认为"000000"。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@RequiredArgsConstructor
@Service
public class UserMenuServiceImpl implements UserMenuService {

  private final UserMenuMapper userMenuMapper;

  @Override
  public UserMenu getMenuById(String id) {
    if (id == null || id.trim().isEmpty()) {
      return null;
    }
    return userMenuMapper.selectById(id);
  }

  @Override
  public List<UserMenu> getAllMenus() {
    return userMenuMapper.selectAll();
  }

  @Override
  public List<UserMenu> getMenusByParent(String parent) {
    if (parent == null || parent.trim().isEmpty()) {
      return null;
    }
    return userMenuMapper.selectByParent(parent);
  }

  @Override
  public List<UserMenu> getMenusByCondition(UserMenu menu) {
    return userMenuMapper.selectByCondition(menu);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public UserMenu createMenu(UserMenu menu) {
    if (menu == null) {
      throw new IllegalArgumentException("菜单信息不能为空");
    }

    // ID不提供时自动生成
    if (menu.getId() != null && !menu.getId().trim().isEmpty()) {
      UserMenu existingMenu = userMenuMapper.selectById(menu.getId());
      if (existingMenu != null) {
        throw new IllegalArgumentException("菜单ID已存在");
      }
    } else {
      menu.setId(IDGenerator.UUID());
    }

    // 设置默认值
    if (menu.getSortOrder() == null) {
      menu.setSortOrder(0);
    }
    if (menu.getParent() == null || menu.getParent().trim().isEmpty()) {
      menu.setParent("000000");
    }

    userMenuMapper.insert(menu);
    return menu;
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public UserMenu updateMenu(UserMenu menu) {
    if (menu == null || menu.getId() == null || menu.getId().trim().isEmpty()) {
      throw new IllegalArgumentException("菜单信息或菜单ID不能为空");
    }

    UserMenu existingMenu = userMenuMapper.selectById(menu.getId());
    if (existingMenu == null) {
      throw new IllegalArgumentException("菜单不存在");
    }

    userMenuMapper.update(menu);
    return userMenuMapper.selectById(menu.getId());
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public boolean deleteMenu(String id) {
    if (id == null || id.trim().isEmpty()) {
      return false;
    }

    UserMenu existingMenu = userMenuMapper.selectById(id);
    if (existingMenu == null) {
      return false;
    }

    int result = userMenuMapper.deleteById(id);
    return result > 0;
  }

  @Override
  public long getMenuCount() {
    return userMenuMapper.count();
  }
}
