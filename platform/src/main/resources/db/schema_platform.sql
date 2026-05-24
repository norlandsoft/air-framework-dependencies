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

-- 初始菜单数据（通用脚手架示例菜单）
INSERT INTO user_menu (id, name, icon, parent, sort_order) VALUES
  ('menu_home',      '工作台',   'desktop',  '000000', 1),
  ('menu_example1',  '示例页面', 'appstore', '000000', 2),
  ('menu_example2',  '示例功能', 'tool',     '000000', 3),
  ('menu_setting',   '系统设置', 'settings', '000000', 99);
