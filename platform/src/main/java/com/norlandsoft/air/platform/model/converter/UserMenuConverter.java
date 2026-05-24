package com.norlandsoft.air.platform.model.converter;

import com.norlandsoft.air.platform.model.dto.UserMenuCreateDTO;
import com.norlandsoft.air.platform.model.dto.UserMenuQueryDTO;
import com.norlandsoft.air.platform.model.dto.UserMenuUpdateDTO;
import com.norlandsoft.air.platform.model.entity.UserMenu;
import com.norlandsoft.air.platform.model.vo.UserMenuVO;
import org.springframework.beans.BeanUtils;

/**
 * 菜单对象转换工具类
 *
 * 提供 Entity、DTO、VO 之间的转换方法。
 * 使用 BeanUtils.copyProperties 进行属性复制。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
public class UserMenuConverter {

  private UserMenuConverter() {
  }

  /**
   * 创建DTO转Entity
   */
  public static UserMenu toEntity(UserMenuCreateDTO dto) {
    if (dto == null) return null;
    UserMenu menu = new UserMenu();
    BeanUtils.copyProperties(dto, menu);
    return menu;
  }

  /**
   * 更新DTO转Entity
   */
  public static UserMenu toEntity(UserMenuUpdateDTO dto) {
    if (dto == null) return null;
    UserMenu menu = new UserMenu();
    BeanUtils.copyProperties(dto, menu);
    return menu;
  }

  /**
   * 查询DTO转Entity
   */
  public static UserMenu toEntity(UserMenuQueryDTO dto) {
    if (dto == null) return null;
    UserMenu menu = new UserMenu();
    BeanUtils.copyProperties(dto, menu);
    return menu;
  }

  /**
   * Entity转VO
   */
  public static UserMenuVO toVO(UserMenu entity) {
    if (entity == null) return null;
    UserMenuVO vo = new UserMenuVO();
    BeanUtils.copyProperties(entity, vo);
    return vo;
  }
}
