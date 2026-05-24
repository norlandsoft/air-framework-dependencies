/**
 * 用户设置整合页面
 *
 * 采用左右分栏布局：左侧为功能列表，右侧为设置区域
 * 非 admin 用户由 Framework SSO 管理，密码设置已移除
 *
 * Created by ChaiMingXu, on 2026/5/24
 */
import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'umi';
import {Avatar} from 'air-design';
import {Button} from 'air-design';
import {UserResponse} from '@/types/user';
import {getAvatarUrl} from '@/utils/UserUtils';
import BasicInfo, {BasicInfoRef} from './BasicInfo';
import DisplaySettings, {DisplaySettingsRef} from './DisplaySettings';
import './index.less';

interface UserSettingsIndexProps {
  dispatch: any;
  currentUser: UserResponse | null;
  frameSize: {
    width: number;
    height: number;
  };
}

type SettingsTab = 'basic' | 'display';

interface SettingsPageConfig {
  id: SettingsTab;
  label: string;
  component: React.ComponentType<any>;
}

const UserSettingsIndex: React.FC<UserSettingsIndexProps> = (props) => {
  const {dispatch, currentUser, frameSize} = props;

  const [activeTab, setActiveTab] = useState<SettingsTab>('basic');
  const [loading, setLoading] = useState(false);
  const [childLoading, setChildLoading] = useState(false);
  const basicInfoRef = useRef<BasicInfoRef>(null);
  const displaySettingsRef = useRef<DisplaySettingsRef>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLoading = getCurrentLoading();
      setChildLoading(prev => {
        if (prev !== currentLoading) {
          return currentLoading;
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeTab]);

  const settingsPages: SettingsPageConfig[] = [
    {
      id: 'basic',
      label: '基本信息',
      component: BasicInfo,
    },
    {
      id: 'display',
      label: '显示设置',
      component: DisplaySettings,
    },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      if (activeTab === 'basic' && basicInfoRef.current) {
        await basicInfoRef.current.handleSave();
      } else if (activeTab === 'display' && displaySettingsRef.current) {
        await displaySettingsRef.current.handleSave();
      }
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLoading = (): boolean => {
    if (activeTab === 'basic' && basicInfoRef.current) {
      return basicInfoRef.current.loading;
    } else if (activeTab === 'display' && displaySettingsRef.current) {
      return displaySettingsRef.current.loading;
    }
    return false;
  };

  const isButtonLoading = loading || childLoading;

  const renderContent = () => {
    const currentPage = settingsPages.find((page) => page.id === activeTab);
    if (!currentPage) return null;

    const Component = currentPage.component;
    if (activeTab === 'basic') {
      return <Component ref={basicInfoRef} dispatch={dispatch} currentUser={currentUser}/>;
    } else if (activeTab === 'display') {
      return <Component ref={displaySettingsRef} dispatch={dispatch} currentUser={currentUser}/>;
    }
    return <Component dispatch={dispatch} currentUser={currentUser}/>;
  };

  if (!currentUser) {
    return (
        <div
            className="user-settings-container"
            style={{height: frameSize?.height || '100%'}}
        >
          <div className="user-settings-empty">未获取到用户信息</div>
        </div>
    );
  }

  return (
      <div
          className="user-settings-container"
          style={{height: frameSize?.height || '100%'}}
      >
        {/* 左侧导航菜单 */}
        <div className="user-settings-sidebar">
          <div className="user-settings-sidebar-header">
            <Avatar
                size={40}
                src={getAvatarUrl(currentUser.avatar)}
                style={{marginBottom: 8}}
            />
            <div className="user-settings-sidebar-user-name">
              {currentUser.name || currentUser.id}
            </div>
            <div className="user-settings-sidebar-user-id">
              {currentUser.loginId || currentUser.id}
            </div>
          </div>

          <div className="user-settings-sidebar-account">
            {currentUser.role === 'admin' && (
                <div className="user-settings-account-item">
                  <span className="user-settings-account-label">角色：</span>
                  <span className="user-settings-account-value">管理员</span>
                </div>
            )}
            <div className="user-settings-account-item">
              <span className="user-settings-account-label">状态：</span>
              <span className="user-settings-account-value">
              {currentUser.status === 'A' ? '启用' : currentUser.status === 'F' ? '禁用' : '未知'}
            </span>
            </div>
          </div>

          <div className="user-settings-sidebar-nav">
            <div className="user-settings-nav-section">
              {settingsPages.map((page) => (
                  <div
                      key={page.id}
                      className={`user-settings-nav-item ${activeTab === page.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(page.id)}
                  >
                    {page.label}
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div className="user-settings-main">
          <div className="user-settings-main-content">
            {renderContent()}
          </div>
          <div className="user-settings-button-bar">
            <Button
                type="primary"
                onClick={handleSave}
                disabled={isButtonLoading}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
  );
};

export default connect(({global, user}) => ({
  frameSize: global.frameSize,
  currentUser: user.currentUser,
}))(UserSettingsIndex);
