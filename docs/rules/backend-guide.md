# 后端开发规范 - Entity、DTO、VO 设计与前后端实现规则

## 一、总体原则

1. **分层架构**：严格遵循 Entity（实体层）、DTO（数据传输层）、VO（视图层）三层分离
2. **职责分离**：Entity 用于数据持久化，DTO 用于数据传输，VO 用于前端展示
3. **类型安全**：前后端类型定义必须保持一致
4. **API 规范**：所有后端接口统一使用 POST 请求，不遵循 RESTful 规范

## 二、后端实现规范

### 2.1 Entity（实体类）设计规范

**位置**：`com.norlandsoft.air.platform.model.entity` 或对应模块的 `entity` 包

**规范要求**：
- Entity 类只包含数据库字段映射，不包含业务逻辑
- 使用 `@Data` 注解（Lombok）
- 字段类型使用 Java 标准类型（String、Integer、LocalDateTime 等）
- 必须包含主键字段（通常为 `id`）
- 必须包含 `createTime` 和 `updateTime` 字段（LocalDateTime 类型）
- 状态字段使用字符串类型（如：`A`-启用、`F`-禁用、`D`-删除）
- 类注释必须包含：用途说明、设计思路、作者信息（ChaiMingXu）

**示例**：
```java
@Data
public class User {
  private String id;
  private String name;
  private String email;
  private String status; // A-启用，F-禁用，D-删除
  private LocalDateTime createTime;
  private LocalDateTime updateTime;
}
```

### 2.2 DTO（数据传输对象）设计规范

**位置**：`com.norlandsoft.air.platform.dto` 或对应模块的 `dto` 包

**命名规范**：
- 创建操作：`{EntityName}CreateDTO`（如：`UserCreateDTO`）
- 更新操作：`{EntityName}UpdateDTO`（如：`UserUpdateDTO`）
- 查询操作：`{EntityName}QueryDTO`（如：`UserQueryDTO`）
- 特殊操作：`{EntityName}{Operation}DTO`（如：`UserLoginDTO`）

**规范要求**：
- 只包含请求参数需要的字段，不包含数据库自动生成的字段（如 `createTime`、`updateTime`）
- `CreateDTO` 中主键 `id` 为可选字段（如果不提供则自动生成）
- `UpdateDTO` 中主键 `id` 为必填字段
- `QueryDTO` 中所有字段均为可选，用于条件查询
- 使用 `@Data` 注解（Lombok）
- 类注释必须包含：用途说明、作者信息（ChaiMingXu）

**示例**：
```java
@Data
public class UserCreateDTO {
  private String id; // 可选，如果不提供则自动生成
  private String name;
  private String email;
  private String status;
}
```

### 2.3 VO（视图对象）设计规范

**位置**：`com.norlandsoft.air.platform.vo` 或对应模块的 `vo` 包

**命名规范**：`{EntityName}VO`（如：`UserVO`）

**规范要求**：
- 包含前端展示需要的所有字段
- 不包含敏感信息（如密码）
- 可以包含格式化后的展示字段（如 `statusText`、`roleText`）
- 状态字段可以包含对应的文本描述（通过 getter 方法格式化）
- 使用 `@Data` 注解（Lombok）
- 类注释必须包含：用途说明、作者信息（ChaiMingXu）

**示例**：
```java
@Data
public class UserVO {
  private String id;
  private String name;
  private String email;
  private String status;
  private String statusText; // 格式化后的状态文本
  
  public String getStatusText() {
    if (statusText != null) return statusText;
    if (status == null) return "未知";
    switch (status) {
      case "A": return "启用";
      case "F": return "禁用";
      case "D": return "已删除";
      default: return status;
    }
  }
}
```

### 2.4 Converter（转换工具类）设计规范

**位置**：`com.norlandsoft.air.platform.commons` 或对应模块的 `commons` 包

**命名规范**：`{EntityName}Converter`（如：`UserConverter`）

**规范要求**：
- 提供静态方法进行 Entity、DTO、VO 之间的转换
- 方法命名：`toEntity(DTO)`、`toVO(Entity)`
- 使用 `BeanUtils.copyProperties()` 进行属性复制
- 处理 null 值情况
- 类注释必须包含：用途说明、作者信息（ChaiMingXu）

**示例**：
```java
public class UserConverter {
  public static User toEntity(UserCreateDTO dto) {
    if (dto == null) return null;
    User user = new User();
    BeanUtils.copyProperties(dto, user);
    return user;
  }
  
  public static UserVO toVO(User entity) {
    if (entity == null) return null;
    UserVO vo = new UserVO();
    BeanUtils.copyProperties(entity, vo);
    return vo;
  }
}
```

### 2.5 Controller 层实现规范

**规范要求**：
- 所有接口统一使用 `@PostMapping`，不遵循 RESTful 规范
- 请求参数使用 DTO 对象，通过 `@RequestBody` 接收
- 返回类型统一使用 `ActionResponse<T>`，其中 T 为 VO 类型
- Controller 方法中必须进行 DTO 到 Entity 的转换（使用 Converter）
- Service 层返回 Entity，Controller 层转换为 VO 后返回
- 列表查询接口：参数为 `QueryDTO`（可为 null），返回 `List<VO>`
- 单个查询接口：参数为 `QueryDTO`（必须包含 id），返回 `VO`
- 创建接口：参数为 `CreateDTO`，返回 `VO`
- 更新接口：参数为 `UpdateDTO`，返回 `VO`
- 删除接口：参数为 `QueryDTO`（必须包含 id），返回 `Boolean`
- 所有接口必须包含异常处理和错误信息返回
- 类注释必须包含：用途说明、作者信息（ChaiMingXu）

**示例**：
```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/platform/user")
public class UserController {
  
  @PostMapping("/list")
  public ActionResponse<List<UserVO>> getUserList(@RequestBody(required = false) UserQueryDTO queryDTO) {
    try {
      List<User> userList = userService.getAllUsers();
      List<UserVO> userVOList = userList.stream()
          .map(UserConverter::toVO)
          .collect(Collectors.toList());
      return ActionResponse.success(userVOList, "获取用户列表成功");
    } catch (Exception e) {
      return ActionResponse.error("获取用户列表失败：" + e.getMessage());
    }
  }
  
  @PostMapping("/create")
  public ActionResponse<UserVO> createUser(@RequestBody UserCreateDTO createDTO) {
    try {
      User user = UserConverter.toEntity(createDTO);
      User createdUser = userService.createUser(user);
      UserVO userVO = UserConverter.toVO(createdUser);
      return ActionResponse.success(userVO, "创建用户成功");
    } catch (Exception e) {
      return ActionResponse.error("创建用户失败：" + e.getMessage());
    }
  }
}
```

### 2.6 Service 层实现规范

**规范要求**：
- Service 接口和实现类使用 Entity 作为参数和返回值
- Service 层不涉及 DTO 和 VO 的转换
- Service 层专注于业务逻辑处理
- 类注释必须包含：用途说明、作者信息（ChaiMingXu）

### 2.7 Mapper 层实现规范

**规范要求**：
- Mapper 接口和 XML 使用 Entity 作为参数和返回值
- Mapper 层只负责数据库操作，不涉及业务逻辑

## 三、前端实现规范

### 3.1 类型定义文件规范

**位置**：`frontend/src/types/{module}.ts`（如：`frontend/src/types/user.ts`）

**规范要求**：
- 必须定义与后端 DTO 和 VO 对应的 TypeScript 接口
- 接口命名与后端保持对应，后缀替换为Request或Response
- 字段类型使用 TypeScript 标准类型（string、number、Date 等）
- 可选字段使用 `?` 标记
- 时间字段使用 `string` 类型（ISO 格式）
- 文件注释必须包含：用途说明、作者信息（ChaiMingXu）

**示例**：
```typescript
export interface UserCreateRequest {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
}

export interface UserResponse {
  id: string;
  name?: string;
  email?: string;
  status?: string;
  statusText?: string;
  createTime?: string;
  updateTime?: string;
}
```

### 3.2 Model 层实现规范

**位置**：`frontend/src/models/{module}.ts`（如：`frontend/src/models/user.ts`）

**规范要求**：
- 使用 Dva.js 进行状态管理
- state 中存储的数据类型必须明确（使用 TypeScript 类型注解）
- effects 方法必须添加类型注解：
  - 参数类型：`{ payload: Request, callback?: (resp: any) => void }`
  - 返回类型：根据实际情况定义
- 所有 API 调用使用 `POST` 方法
- API 路径格式：`/rest/{module}/{operation}`（如：`/rest/platform/user/list`）
- 请求参数使用对应的 Request 类型
- 响应数据处理：检查 `resp.success`，获取 `resp.data`（类型为 Response）
- 类注释必须包含：用途说明、作者信息（ChaiMingXu）

**示例**：
```typescript
export default {
  namespace: 'user',
  
  state: {
    currentUser: null as UserResponse | null,
    userList: [] as UserResponse[],
  },
  
  effects: {
    *fetchUsers({ payload, callback }: { payload?: UserQueryRequest, callback?: (resp: any) => void }, { call, put }) {
      const resp = yield call(POST, '/rest/platform/user/list', payload || {});
      if (resp?.success) {
        const userList: UserVO[] = resp.data || [];
        yield put({ type: 'setUserList', payload: userList });
      }
      if (callback) callback(resp);
    },
    
    *createUser({ payload, callback }: { payload: UserCreateRequest, callback?: (resp: any) => void }, { call }) {
      const resp = yield call(POST, '/rest/platform/user/create', payload);
      if (callback) callback(resp);
    },
  },
};
```

### 3.3 组件层实现规范

**规范要求**：
- 组件中使用 `connect` 连接 Model，获取类型化的 state
- 调用 dispatch 时，payload 必须使用对应的 DTO 类型
- 从 state 中获取的数据类型为 VO
- 表单提交时，将表单值转换为对应的 DTO 类型

**示例**：
```typescript
import { UserCreateRequest, UserResponse } from '@/types/user';

const UserComponent: React.FC = (props) => {
  const { dispatch, userList } = props; // userList: UserResponse[]
  
  const handleCreate = (values: any) => {
    const createRequest: UserCreateRequest = {
      name: values.name,
      email: values.email,
    };
    
    dispatch({
      type: 'user/createUser',
      payload: createRequest,
    });
  };
};
```

## 四、API 接口命名规范

### 4.1 接口路径规范

**格式**：`/rest/{模块}/{操作}`

**操作命名**：
- 列表查询：`list`
- 单个查询：`get` 或 `info`
- 创建：`create`
- 更新：`update`
- 删除：`delete`
- 特殊操作：使用动词描述（如：`login`、`resetPassword`、`setRoles`）

**示例**：
- `/rest/platform/user/list` - 获取用户列表
- `/rest/platform/user/info` - 获取单个用户
- `/rest/platform/user/create` - 创建用户
- `/rest/platform/user/update` - 更新用户
- `/rest/platform/user/delete` - 删除用户
- `/rest/platform/user/login` - 用户登录
- `/rest/platform/user/setRoles` - 设置用户角色

### 4.2 请求参数规范

- 所有接口统一使用 POST 请求
- 请求参数通过 `@RequestBody` 传递（JSON 格式）
- 列表查询接口：参数可以为 null 或 `QueryDTO`
- 单个操作接口：参数必须包含必要的标识字段（如 `id`）

### 4.3 响应格式规范

- 统一使用 `ActionResponse<T>` 格式
- 成功响应：`{ success: true, data: T, message: string }`
- 失败响应：`{ success: false, message: string, code?: string }`
- `data` 字段类型：单个对象为 `VO`，列表为 `List<VO>`

## 五、代码注释规范

### 5.1 类注释要求

所有类必须包含以下信息：
- 类用途说明
- 设计思路（可选）
- 作者信息：`Created by ChaiMingXu, on {日期}`

**示例**：
```java
/**
 * 用户实体类
 *
 * 用于表示系统中的用户信息，实现用户数据持久化
 *
 * Created by ChaiMingXu, on {日期}
 */
```

### 5.2 方法注释要求

- 公共方法必须包含 Javadoc 注释
- 说明方法用途、参数、返回值
- 复杂业务逻辑需要说明实现思路

### 5.3 字段注释要求

- 重要字段必须包含注释
- 说明字段用途、取值范围、默认值等

## 六、注意事项

1. **不要使用 RESTful 规范**：所有接口统一使用 POST 请求
2. **类型一致性**：前后端类型定义必须保持一致，DTO 和 VO 字段名称必须对应
3. **转换工具**：必须使用 Converter 进行 Entity、DTO、VO 之间的转换，不要直接在 Controller 中转换
4. **异常处理**：所有 Controller 方法必须包含 try-catch 异常处理
5. **空值处理**：Converter 方法必须处理 null 值情况
6. **状态字段**：状态字段统一使用字符串类型（`A`、`F`、`D`），VO 中提供格式化方法
7. **时间字段**：Entity 使用 `LocalDateTime`，前端使用 `string` 类型（ISO 格式）
8. **主键字段**：CreateDTO 中 `id` 为可选，UpdateDTO 中 `id` 为必填

## 七、重构检查清单

在进行 Entity、DTO、VO 重构时，确保完成以下检查：

- [ ] 创建对应的 DTO 类（CreateDTO、UpdateDTO、QueryDTO）
- [ ] 创建对应的 VO 类
- [ ] 创建 Converter 转换工具类
- [ ] 更新 Controller 使用 DTO 和 VO
- [ ] 更新 Service 层继续使用 Entity（无需修改）
- [ ] 创建前端类型定义文件
- [ ] 更新前端 Model 添加类型注解
- [ ] 更新前端组件使用新的类型
- [ ] 检查所有相关接口调用
- [ ] 验证前后端类型一致性

## 八、示例项目结构

```
后端：
com.norlandsoft.air.platform
├── converter/
│   └── UserConverter.java
├── controller/
│   └── UserController.java
├── model/
│   ├── entity/
│   │   └── User.java
│   ├── dto/
│   │   ├── UserCreateDTO.java
│   │   ├── UserUpdateDTO.java
│   │   └── UserQueryDTO.java
│   ├── vo/
│   │   └── UserVO.java
├── service/
│   └── UserService.java
└── mapper/
    └── UserMapper.java

前端：
frontend/src/
├── types/
│   └── user.ts
├── models/
│   └── user.ts
└── pages/
    └── User/
        └── index.tsx
```

---