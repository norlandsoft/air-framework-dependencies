package com.norlandsoft.air.platform.admin.controller;

import com.norlandsoft.air.framework.sdk.web.ActionResponse;
import com.norlandsoft.air.platform.admin.model.vo.AdminMenuVO;
import com.norlandsoft.air.platform.model.entity.UserMenu;
import com.norlandsoft.air.platform.service.UserMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 管理员菜单接口
 *
 * 从数据库 user_menu 表读取菜单列表，供前端菜单栏展示。
 * 菜单数据通过 /rest/platform/menu 接口管理。
 *
 * Created by ChaiMingXu, on 2026/5/23
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/menu")
public class AdminMenuController {

  private final UserMenuService userMenuService;

  /**
   * 获取 admin 用户菜单列表（从数据库读取）
   */
  @PostMapping
  public ActionResponse<List<AdminMenuVO>> getMenu() {
    try {
      List<UserMenu> menuList = userMenuService.getAllMenus();

      List<AdminMenuVO> voList = menuList.stream().map(menu -> {
        AdminMenuVO vo = new AdminMenuVO();
        vo.setId(menu.getId());
        vo.setName(menu.getName());
        vo.setIcon(menu.getIcon());
        vo.setParent(menu.getParent());
        vo.setSortOrder(menu.getSortOrder());
        return vo;
      }).toList();

      return ActionResponse.success(voList, "获取菜单列表成功");
    } catch (Exception e) {
      return ActionResponse.error("获取菜单列表失败：" + e.getMessage());
    }
  }
}
