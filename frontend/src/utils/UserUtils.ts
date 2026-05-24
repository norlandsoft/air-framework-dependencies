/**
 * 用户信息统一处理工具
 *
 * 提供头像编号与完整 URL 之间的转换函数，确保所有组件使用一致的头像处理逻辑。
 * 后端 avatar 字段统一为短编号形式（如 "u01"、"admin"），前端通过本工具组装完整 URL。
 *
 * Created by ChaiMingXu, on 2026/5/24
 */

/** 默认头像编号 */
const DEFAULT_AVATAR_ID = 'u01';

/**
 * 根据头像编号组装完整的头像 URL
 *
 * @param avatarId 头像编号（短编号如 "u01"、"admin"，或完整路径如 "/icons/avatar/u01.svg"）
 * @returns 完整的头像 URL
 */
export function getAvatarUrl(avatarId?: string): string {
  if (!avatarId) {
    return `/icons/avatar/${DEFAULT_AVATAR_ID}.svg`;
  }
  // 已经是完整路径，直接返回
  if (avatarId.startsWith('/')) {
    return avatarId;
  }
  // 短编号，组装完整路径
  return `/icons/avatar/${avatarId}.svg`;
}

/**
 * 从头像路径或编号中提取短编号
 *
 * 用于表单组件（如 Radio.Group）的值匹配。
 * 输入可以是完整路径或短编号。
 *
 * @param avatar 头像路径或编号
 * @returns 短编号（如 "u01"、"admin"）
 */
export function extractAvatarId(avatar?: string): string {
  if (!avatar) {
    return DEFAULT_AVATAR_ID;
  }
  // 尝试从完整路径中提取编号
  const match = avatar.match(/\/icons\/avatar\/(.+)\.svg/);
  if (match) {
    return match[1];
  }
  // 不是完整路径，当作短编号直接返回
  return avatar;
}
