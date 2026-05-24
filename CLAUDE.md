# AirPro - APP平台开发脚手架

## 项目概述

AirPro 是一个全栈应用平台开发脚手架，提供完整的前后端框架、认证体系、菜单管理和系统设置功能。基于此脚手架可快速搭建各类业务平台。

## 技术栈

### 后端
- **Java 21** + **Spring Boot 4.1.0-M4**
- **MyBatis** (ORM) + **PostgreSQL** (主数据库)
- **H2** (嵌入式数据库，admin会话/缓存)
- **Redis** (Jedis) + **Log4j2**
- **framework-sdk** (SSO认证、JWT、工具类)
- Java 包名: `com.norlandsoft.air`

### 前端
- **React 18** + **TypeScript** + **UmiJS Max 4**
- **DVA** (状态管理)
- **air-design** (基于 Ant Design 5 的定制组件库，`prefixCls="air"`)
- **Less** + CSS Modules (所有样式前缀 `air-`)

## 项目结构

```
AirPro/
├── pom.xml                    # 根 Maven POM（父项目）
├── platform/                  # 后端 Spring Boot 应用
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/norlandsoft/air/
│       │   ├── AirPro.java                           # 主启动类
│       │   └── platform/
│       │       ├── config/                           # 配置
│       │       ├── controller/                       # REST 控制器
│       │       ├── service/                          # 业务服务
│       │       ├── mapper/                           # MyBatis Mapper
│       │       ├── model/                            # 实体、DTO、VO
│       │       ├── admin/                            # 管理员模块
│       │       └── infra/                            # 基础设施（数据源、Redis、认证）
│       └── resources/
│           ├── application.yml
│           ├── banner.txt
│           ├── log4j2.xml
│           └── db/schema_platform.sql                # 数据库初始化脚本
├── frontend/                  # 前端 React 应用
│   ├── .umirc.ts              # UmiJS 配置（路由、代理、标题）
│   ├── package.json
│   └── src/
│       ├── layouts/           # 布局组件（SecurityLayout、BasicLayout、HeadBar、MenuBar）
│       ├── models/            # DVA models（user、menu、global、paas）
│       ├── pages/             # 页面组件（Home、Login、Admin、Example1、Example2）
│       ├── types/             # TypeScript 类型定义
│       └── utils/             # 工具函数（HttpRequest、CryptoUtils、UserUtils）
└── docs/
    └── rules/                 # 编码规范
        ├── backend-guide.md
        └── frontend-guide.md
```

## 关键端口

- 后端: `9800`
- 前端 dev server: `6800`（代理到后端 9800）

## 认证机制

- **admin 用户**: 本地密码认证，JWT Token，密码存于 H2
- **普通用户**: 通过 Framework SSO 代理认证
- 前端 sessionStorage 键前缀: `air-pro-*`

## 菜单系统

菜单数据存储在 PostgreSQL `user_menu` 表中，通过后端 API 动态获取。
初始菜单种子数据在 `schema_platform.sql` 中定义。

## 构建命令

```bash
# 后端
cd /opt/AirPro && mvn clean package -DskipTests

# 前端
cd /opt/AirPro/frontend && npm install && npm run build
```
