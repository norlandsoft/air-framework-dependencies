import {useEffect, useRef} from 'react';
import {Spin} from 'air-design';
import {connect} from '@umijs/max';
import Login from '@/pages/Login';
import BasicLayout from './BasicLayout';
import '@/setProxy';

/**
 * 安全布局组件
 *
 * 负责判断用户是否已登录，根据登录状态直接渲染对应的页面组件
 * - 未登录：渲染登录页面组件
 * - 已登录：渲染主应用布局组件（BasicLayout）
 *
 * 使用dva管理认证状态，不进行路由跳转，而是根据状态直接渲染不同的组件
 *
 * @author ChaiMingXu, on 2026/5/24
 */
const SecurityLayout: React.FC<any> = props => {

  const {
    dispatch,
    user
  } = props;

  const hasCheckedRef = useRef(false);
  const dispatchRef = useRef(dispatch);

  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  // 初始检查认证状态（仅执行一次）
  useEffect(() => {
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;

      const token = sessionStorage.getItem('air-pro-token');

      if (token) {
        dispatchRef.current({
          type: 'user/validateToken',
        });
      }
    }
  }, []);

  // 监听认证状态变化事件（由 HttpRequest 401 处理或其他组件触发）
  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && !detail.authenticated) {
        dispatchRef.current({type: 'user/clearUser'});
      }
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, []);

  // 监听storage变化（跨标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'air-pro-token') {
        dispatchRef.current({
          type: 'user/validateToken',
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (user.validatingToken) {
    return (
        <>
          <Spin spinning={true} fullscreen={true} tip="正在验证身份..."/>
        </>
    );
  }

  if (!user.isAuthenticated) {
    return <Login/>;
  }

  return <BasicLayout/>;
};

export default connect(({user}) => ({
  user,
}))(SecurityLayout);
