package com.norlandsoft.air.platform.admin.controller;

import com.norlandsoft.air.framework.sdk.web.ActionResponse;
import com.norlandsoft.air.platform.admin.model.vo.AdminMenuVO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 管理员菜单接口
 *
 * 返回 admin 用户的固定菜单列表（首页 + 系统设置），
 * 与非 admin 用户（从数据库读取）的菜单逻辑分离。
 */
@RestController
@RequestMapping("/admin/menu")
public class AdminMenuController {

  private static final List<AdminMenuVO> ADMIN_MENUS = List.of(
      createMenu("menu_home", "首页", "desktop", "000000", 1),
      createMenu("menu_setting", "系统设置", "settings", "000000", 99)
  );

  @PostMapping
  public ActionResponse<List<AdminMenuVO>> getMenu() {
    return ActionResponse.success(ADMIN_MENUS, "获取菜单列表成功");
  }

  private static AdminMenuVO createMenu(String id, String name, String icon, String parent, int sortOrder) {
    AdminMenuVO vo = new AdminMenuVO();
    vo.setId(id);
    vo.setName(name);
    vo.setIcon(icon);
    vo.setParent(parent);
    vo.setSortOrder(sortOrder);
    return vo;
  }
}
