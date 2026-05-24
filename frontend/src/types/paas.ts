/**
 * PaaS 配置相关类型定义
 *
 * 数据库和 Redis 连接配置的请求/响应类型，与后端 DTO/VO 字段对应。
 *
 * Created by ChaiMingXu, on 2026/5/23
 */

/** 数据库配置保存请求 */
export interface DatabaseConfigRequest {
  driver?: string;
  host?: string;
  port?: number;
  database?: string;
  schema?: string;
  username?: string;
  password?: string;
  minIdle?: number;
  maxIdle?: number;
  maxTotal?: number;
  maxWaitMillis?: number;
}

/** 数据库配置响应 */
export interface DatabaseConfigResponse {
  driver?: string;
  host?: string;
  port?: number;
  database?: string;
  schema?: string;
  username?: string;
  password?: string;
  minIdle?: number;
  maxIdle?: number;
  maxTotal?: number;
  maxWaitMillis?: number;
}

/** Redis 配置保存请求 */
export interface RedisConfigRequest {
  host?: string;
  port?: number;
  password?: string;
  database?: number;
  maxTotal?: number;
  maxIdle?: number;
  minIdle?: number;
  maxWaitMillis?: number;
}

/** Redis 配置响应 */
export interface RedisConfigResponse {
  host?: string;
  port?: number;
  password?: string;
  database?: number;
  maxTotal?: number;
  maxIdle?: number;
  minIdle?: number;
  maxWaitMillis?: number;
}
