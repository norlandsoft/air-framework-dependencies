# Air Pro
> APP平台开发脚手架

全栈应用平台开发脚手架，提供完整的前后端框架、认证体系、菜单管理和系统设置功能。

## 技术栈

- **后端**: Java 21 + Spring Boot 4.1 + MyBatis + PostgreSQL + Redis
- **前端**: React 18 + TypeScript + UmiJS Max 4 + air-design

## 快速开始

### 后端

```bash
cd platform/../
mvn clean package -DskipTests
java -jar platform/target/air-pro-platform.jar
```

### 前端

```bash
cd frontend
npm install
npm start    # 开发模式，端口 6800
npm run build  # 生产构建
```

## 项目结构

- `platform/` - 后端 Spring Boot 应用
- `frontend/` - 前端 React 应用
- `docs/rules/` - 编码规范
