package com.norlandsoft.air.platform.controller;

import com.norlandsoft.air.framework.sdk.web.ActionResponse;
import com.norlandsoft.air.platform.model.converter.UserMenuConverter;
import com.norlandsoft.air.platform.model.dto.UserMenuCreateDTO;
import com.norlandsoft.air.platform.model.dto.UserMenuQueryDTO;
import com.norlandsoft.air.platform.model.dto.UserMenuUpdateDTO;
import com.norlandsoft.air.platform.model.entity.UserMenu;
import com.norlandsoft.air.platform.model.vo.UserMenuVO;
import com.norlandsoft.air.platform.service.UserMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户菜单控制器
 *
 * 提供菜单管理的API接口，路径前缀：/rest/platform/menu
 * 支持菜单的增删改查操作。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/platform/menu")
public class UserMenuController {

  private final UserMenuService userMenuService;

  /**
   * 查询菜单列表（支持条件查询）
   */
  @PostMapping("/list")
  public ActionResponse<List<UserMenuVO>> getMenuList(@RequestBody(required = false) UserMenuQueryDTO queryDTO) {
    try {
      List<UserMenu> menuList;
      if (queryDTO != null) {
        UserMenu condition = UserMenuConverter.toEntity(queryDTO);
        menuList = userMenuService.getMenusByCondition(condition);
      } else {
        menuList = userMenuService.getAllMenus();
      }

      List<UserMenuVO> voList = menuList != null
          ? menuList.stream().map(UserMenuConverter::toVO).collect(Collectors.toList())
          : List.of();

      return ActionResponse.success(voList, "获取菜单列表成功");
    } catch (Exception e) {
      return ActionResponse.error("获取菜单列表失败：" + e.getMessage());
    }
  }

  /**
   * 查询菜单详情
   */
  @PostMapping("/get")
  public ActionResponse<UserMenuVO> getMenu(@RequestBody UserMenuQueryDTO queryDTO) {
    if (queryDTO == null || queryDTO.getId() == null || queryDTO.getId().trim().isEmpty()) {
      return ActionResponse.error("菜单ID不能为空");
    }

    try {
      UserMenu menu = userMenuService.getMenuById(queryDTO.getId());
      if (menu == null) {
        return ActionResponse.error("菜单不存在");
      }
      return ActionResponse.success(UserMenuConverter.toVO(menu), "获取菜单成功");
    } catch (Exception e) {
      return ActionResponse.error("获取菜单失败：" + e.getMessage());
    }
  }

  /**
   * 创建菜单
   */
  @PostMapping("/create")
  public ActionResponse<UserMenuVO> createMenu(@RequestBody UserMenuCreateDTO createDTO) {
    try {
      UserMenu menu = UserMenuConverter.toEntity(createDTO);
      UserMenu createdMenu = userMenuService.createMenu(menu);
      return ActionResponse.success(UserMenuConverter.toVO(createdMenu), "菜单创建成功");
    } catch (IllegalArgumentException e) {
      return ActionResponse.error(e.getMessage());
    } catch (Exception e) {
      return ActionResponse.error("创建菜单失败：" + e.getMessage());
    }
  }

  /**
   * 更新菜单
   */
  @PostMapping("/update")
  public ActionResponse<UserMenuVO> updateMenu(@RequestBody UserMenuUpdateDTO updateDTO) {
    try {
      UserMenu menu = UserMenuConverter.toEntity(updateDTO);
      UserMenu updatedMenu = userMenuService.updateMenu(menu);
      return ActionResponse.success(UserMenuConverter.toVO(updatedMenu), "菜单更新成功");
    } catch (IllegalArgumentException e) {
      return ActionResponse.error(e.getMessage());
    } catch (Exception e) {
      return ActionResponse.error("更新菜单失败：" + e.getMessage());
    }
  }

  /**
   * 删除菜单
   */
  @PostMapping("/delete")
  public ActionResponse<Boolean> deleteMenu(@RequestBody UserMenuQueryDTO queryDTO) {
    if (queryDTO == null || queryDTO.getId() == null || queryDTO.getId().trim().isEmpty()) {
      return ActionResponse.error("菜单ID不能为空");
    }

    try {
      boolean result = userMenuService.deleteMenu(queryDTO.getId());
      if (result) {
        return ActionResponse.success(true, "菜单删除成功");
      }
      return ActionResponse.error("菜单不存在或删除失败");
    } catch (Exception e) {
      return ActionResponse.error("删除菜单失败：" + e.getMessage());
    }
  }
}
