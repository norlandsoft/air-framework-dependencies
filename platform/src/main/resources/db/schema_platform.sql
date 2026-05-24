-- ============================================================
-- 用户菜单表
-- 对应实体：com.norlandsoft.air.platform.model.entity.UserMenu
-- ============================================================

DROP TABLE IF EXISTS user_menu;

CREATE TABLE user_menu
(
  id         VARCHAR(50)  PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  icon       VARCHAR(100),
  parent     VARCHAR(50)  NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_menu_parent ON user_menu (parent);

-- 初始菜单数据（非 admin 用户菜单，由 /rest/platform/menu/list 接口返回）
INSERT INTO user_menu (id, name, icon, parent, sort_order) VALUES
  ('menu_home', '首页', 'desktop', '000000', 1);
