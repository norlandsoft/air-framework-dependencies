# 前端开发规范

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.3.1 | UI 框架 |
| UmiJS Max | 4.6.7 | 应用框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Ant Design | 5.29.1 | UI 组件库 |
| DVA | - | 状态管理 (Redux + Redux-Saga) |
| Less | - | CSS 预处理器 |

## 目录结构

```
frontend/
├── src/
│   ├── components/        # 公共组件
│   ├── layouts/           # 布局组件
│   ├── models/            # DVA 全局状态模型
│   ├── pages/             # 页面组件
│   │   └── XxxPage/       # 页面目录
│   │       ├── index.tsx  # 页面入口
│   │       ├── index.less # 页面样式
│   │       └── models/    # 页面级 model（可选）
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   └── global.less        # 全局样式入口
├── .umirc.ts              # UmiJS 配置
└── tsconfig.json          # TypeScript 配置
```

## 命名规范

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `BasicLayout.tsx`, `MenuBar.tsx` |
| 样式文件 | 小写 | `index.less`, `ChatView.less` |
| Model 文件 | camelCase | `chat.ts`, `platform.ts` |
| 工具文件 | PascalCase | `HttpRequest.ts`, `StringUtils.ts` |
| 类型定义 | camelCase + `.d.ts` | `user.d.ts`, `dict.d.ts` |

### 变量和函数命名

```typescript
// 变量：camelCase
const frameSize = props.frameSize;
const currentUser = user.currentUser;

// 函数：camelCase，事件处理以 handle 开头
const handleWindowResize = () => { ... }
const sendQuestion = (question: string) => { ... }

// 接口：PascalCase + Props/Request/Response 后缀
interface MenuBarProps { ... }
interface UserLoginRequest { ... }
interface UserResponse { ... }
```

### CSS 类名

使用 `air-` 前缀 + kebab-case：

```less
.air-code-editor { }
.air-menu-bar { }
.air-menu-item { }
```

## 组件规范

### 函数组件写法

```tsx
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

interface ChatProps {
  dispatch: any;
  frameSize: number;
  chat: any;
}

const Chat: React.FC<ChatProps> = props => {
  const { dispatch, frameSize, chat } = props;
  const [inputHeight, setInputHeight] = useState<number>(20);

  useEffect(() => {
    dispatch({ type: 'chat/fetchTopicList' });
    return () => {
      dispatch({ type: 'chat/clearTopic' });
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* ... */}
    </div>
  );
};

export default connect(({ global, chat, session }) => ({
  frameSize: global.frameSize,
  chat,
  session
}))(Chat);
```

### forwardRef 用法

```tsx
import React, { forwardRef, useImperativeHandle } from 'react';

interface CodeEditorRef {
  getContent: () => string;
}

const CodeEditor = forwardRef<CodeEditorRef, any>((props, ref) => {
  useImperativeHandle(ref, () => ({
    getContent: () => content,
  }));

  return <div>...</div>;
});
```

## 状态管理 (DVA)

### Model 结构

```typescript
// src/models/chat.ts
export default {
  namespace: 'chat',

  state: {
    topicList: [],
    currentTopic: null,
    chatList: [],
    loading: false
  },

  effects: {
    // 异步操作（Generator 函数）
    *fetchTopicList(_: any, { call, put }: any) {
      const resp = yield call(POST, '/rest/lang/topic/list', {});
      if (resp?.success) {
        yield put({
          type: 'saveTopicList',
          payload: resp.data
        });
      }
    },
  },

  reducers: {
    // 同步状态更新
    saveTopicList(state: any, { payload }: any) {
      return { ...state, topicList: payload };
    },

    setLoading(state: any, { payload }: any) {
      return { ...state, loading: payload };
    },
  },
};
```

### 组件连接 Model

```tsx
import { connect } from 'umi';

const MyComponent: React.FC<any> = props => {
  const { dispatch, chat } = props;

  // 调用 effect
  dispatch({ type: 'chat/fetchTopicList' });

  // 调用带参数的 effect
  dispatch({
    type: 'chat/sendMessage',
    payload: { content: 'Hello' },
  });
};

export default connect(({ chat, global }) => ({
  chat,
  frameSize: global.frameSize,
}))(MyComponent);
```

## API 调用

### HTTP 请求封装

```typescript
import { POST, GET, SSE_POST } from '@/utils/HttpRequest';

// POST 请求
const resp = await POST('/rest/platform/user/login', {
  id: username,
  password: encryptedPassword,
});

// GET 请求
const resp = await GET('/rest/platform/config');

// SSE 流式请求
yield call(SSE_POST, '/rest/lang/completion', payload, (data) => {
  // 处理流式数据
});
```

### API 路径约定

| 前缀 | 服务 | 示例 |
|------|------|------|
| `/rest` | 平台 REST API | `/rest/platform/user/login` |
| `/admin` | 管理接口 | `/admin/paas/database/get` |
| `/session` | 会话验证 | `/session/current` |
| `/team` | AirTeams 服务 | `/team/agent/create` |

## 样式规范

### Less + CSS Modules

```tsx
// 导入样式
import styles from './index.less';

// 使用 CSS Modules
<div className={styles.container}>
  <div className={styles.topic}>...</div>
</div>
```

### 全局样式

```less
// global.less
@import (css) "~air-design/dist/index.css";
@import "global-antd";   // Ant Design 覆盖
@import "global-styles"; // 自定义全局样式
```

### CSS 变量

```less
:root {
  --font-scale: 1;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}

.my-component {
  font-family: var(--font-family);
  font-size: var(--font-size-form);
}
```

## TypeScript 规范

### 类型定义

```typescript
// types/user.d.ts

/**
 * 用户登录请求
 */
export interface UserLoginRequest {
  /**
   * 用户ID，用于登录
   */
  id: string;
  /**
   * 用户密码，前端传输前经过sha256加密
   */
  password: string;
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
```

### 路径别名

```typescript
// tsconfig.json 已配置
import { POST } from '@/utils/HttpRequest';
import { UserInfo } from '@/types/user';
```

## 代码风格

- 使用 2 空格缩进
- 使用单引号
- 语句末尾不加分号（TypeScript 会自动处理）
- 组件导出使用 `export default`
- 优先使用函数组件和 Hooks

## 常用命令

```bash
# 安装依赖
cd frontend && npm install

# 开发模式
npm run start

# 构建生产版本
npm run build

# 类型检查
npx tsc --noEmit
```
