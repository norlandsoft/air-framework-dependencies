/**
 * 基本信息设置页面
 *
 * 用于用户基本信息的管理，包括姓名、邮箱、电话、头像等
 * 非 admin 用户信息由 Framework SSO 管理，当前为只读展示
 *
 * Created by ChaiMingXu, on 2026/5/24
 */

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Avatar, Form, Input, Radio} from 'air-design';
import {UserResponse} from '@/types/user';
import {getAvatarUrl, extractAvatarId} from '@/utils/UserUtils';

interface BasicInfoProps {
  dispatch: any;
  currentUser: UserResponse | null;
}

export interface BasicInfoRef {
  handleSave: () => Promise<void>;
  loading: boolean;
}

const BasicInfo = forwardRef<BasicInfoRef, BasicInfoProps>((props, ref) => {
  const {currentUser} = props;

  const [infoForm] = Form.useForm();
  const [loading] = useState(false);

  const avatarOptions = [
    {value: 'u01', label: '头像1'},
    {value: 'u02', label: '头像2'},
    {value: 'u03', label: '头像3'},
    {value: 'u04', label: '头像4'},
    {value: 'u05', label: '头像5'},
    {value: 'u06', label: '头像6'},
  ];

  useEffect(() => {
    if (currentUser) {
      infoForm.setFieldsValue({
        id: currentUser.loginId || currentUser.id,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        avatar: extractAvatarId(currentUser.avatar)});
    }
  }, [currentUser, infoForm]);

  // 暂时为只读模式，等待 SSO 用户信息更新接口就绪后改为可编辑
  const handleSaveInfo = async (): Promise<void> => {};

  useImperativeHandle(ref, () => ({
    handleSave: handleSaveInfo,
    loading}));

  if (!currentUser) {
    return (
        <div className="user-settings-content">
          <div className="user-settings-empty">未获取到用户信息</div>
        </div>
    );
  }

  return (
      <div className="user-settings-content">
        <div className="user-settings-content-header">
          <h2 className="user-settings-content-title">基本信息</h2>
          <p className="user-settings-content-description">
            非 admin 用户信息由 Framework 统一管理
          </p>
        </div>

        <Form
            form={infoForm}
            layout="horizontal"
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
            className="user-settings-form"
        >
          <Form.Item name="id" label="登录ID" rules={[{required: true}]}>
            <Input disabled placeholder="登录ID"/>
          </Form.Item>

          <Form.Item
              name="name"
              label="姓名"
              rules={[{required: true, message: '请输入姓名'}]}
          >
            <Input disabled placeholder="请输入姓名"/>
          </Form.Item>

          <Form.Item
              name="email"
              label="邮箱"
              rules={[
                {type: 'email', message: '请输入有效的邮箱地址'},
              ]}
          >
            <Input disabled placeholder="请输入邮箱（可选）"/>
          </Form.Item>

          <Form.Item
              name="phone"
              label="电话"
              rules={[
                {pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码'},
              ]}
          >
            <Input disabled placeholder="请输入电话号码（可选）"/>
          </Form.Item>

          <Form.Item name="avatar" label="头像">
            <Radio.Group disabled>
              {avatarOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    <Avatar
                        size={32}
                        src={getAvatarUrl(option.value)}
                        style={{marginRight: 6}}
                    />
                  </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

        </Form>
      </div>
  );
});

BasicInfo.displayName = 'BasicInfo';

export default BasicInfo;
