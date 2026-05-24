import {POST} from '@/utils/HttpRequest';
import {Notice} from 'air-design';
import {SHA} from '@/utils/CryptoUtils';
import {
  AdminPasswordChangeRequest,
  UserLoginRequest,
  UserResponse
} from '@/types/user';
import {UserSettingsResponse, UserSettingsUpdateRequest} from '@/types/userSettings';

/**
 * 用户Model
 *
 * 管理用户相关的状态和业务逻辑，包括登录、登出、获取用户信息等
 * 非 admin 用户的登录和身份验证由 Framework SSO 处理
 *
 * @author ChaiMingXu, on 2026/5/24
 */
export default {
  namespace: 'user',

  state: {
    currentUser: null as UserResponse | null,
    isAuthenticated: !!sessionStorage.getItem('air-pro-token'),
    loading: false,
    validatingToken: false,
    userSettings: null as UserSettingsResponse | null,
    userSettingsLoading: false,
  },

  effects: {
    /**
     * 用户登录
     *
     * admin 走本地 /admin/user/login，其余走 SSO 代理 /rest/auth/login
     * 密码在本 effect 中进行 SHA256 加密
     */
    * login({payload}: { payload: UserLoginRequest }, {call, put}) {

      const {id, password} = payload;
      const newPassword = SHA(password);

      const loginDTO: UserLoginRequest = {
        id: id,
        password: newPassword
      };

      // admin 走网关 /admin/user/login，其余走 SSO 代理 /rest/auth/login
      const isAdmin = id?.toLowerCase?.() === 'admin';
      const loginUrl = isAdmin ? '/admin/user/login' : '/rest/auth/login';
      const resp = yield POST(loginUrl, loginDTO);

      if (resp?.success) {
        const data = resp.data || {};
        const token = data.token || '';
        const user: UserResponse = data.user || data || null;

        if (token) {
          sessionStorage.setItem('air-pro-token', token);
        }

        if (user && user.id) {
          sessionStorage.setItem('air-pro-uid', String(user.id));
        }

        if (user && user.loginId) {
          sessionStorage.setItem('air-pro-user', String(user.loginId));
        }

        yield put({
          type: 'setUser',
          payload: user});

        window.dispatchEvent(new CustomEvent('auth-state-changed', {
          detail: {authenticated: true}}));
      } else {
        Notice.error('登录失败', resp?.message || '登录失败，请检查用户名和密码');
      }
    },

    /**
     * 用户登出
     */
    * logout(_, {put}) {
      sessionStorage.clear();

      yield put({
        type: 'clearUser'});

      yield put({
        type: 'global/resetCurrentPage'});

      window.dispatchEvent(new CustomEvent('auth-state-changed', {
        detail: {authenticated: false}}));
    },

    /**
     * 验证token有效性
     */
    * validateToken(_, {call, put, select}) {
      const currentState = yield select((state: any) => state.user);
      if (currentState.validatingToken) {
        return;
      }

      const token = sessionStorage.getItem('air-pro-token');
      const loginId = sessionStorage.getItem('air-pro-user');

      if (!token || !loginId) {
        if (currentState.isAuthenticated) {
          yield put({
            type: 'clearUser'});
          window.dispatchEvent(new CustomEvent('auth-state-changed', {
            detail: {authenticated: false}}));
        }
        return;
      }

      yield put({
        type: 'setValidatingToken',
        payload: true});

      try {
        const resp = yield call(POST, '/rest/auth/current', {});

        if (resp?.success) {
          const user: UserResponse = resp.data || null;

          if (user && user.id) {
            sessionStorage.setItem('air-pro-uid', String(user.id));
          }

          if (user && user.loginId) {
            sessionStorage.setItem('air-pro-user', String(user.loginId));
          }

          const wasAuthenticated = currentState.isAuthenticated;
          const userChanged = !currentState.currentUser ||
              !currentState.currentUser.id ||
              currentState.currentUser.id !== user.id;

          yield put({
            type: 'setUser',
            payload: user});

          if (userChanged || !wasAuthenticated) {
            window.dispatchEvent(new CustomEvent('auth-state-changed', {
              detail: {authenticated: true}}));
          }
        } else {
          const wasAuthenticated = currentState.isAuthenticated;

          sessionStorage.removeItem('air-pro-token');
          sessionStorage.removeItem('air-pro-user');
          sessionStorage.removeItem('air-pro-uid');

          if (wasAuthenticated) {
            yield put({
              type: 'clearUser'});

            window.dispatchEvent(new CustomEvent('auth-state-changed', {
              detail: {authenticated: false}}));
          }
        }
      } finally {
        yield put({
          type: 'setValidatingToken',
          payload: false});
      }
    },

    /**
     * 修改 admin 用户密码
     */
    * changeAdminPassword({payload, callback}: {
      payload: AdminPasswordChangeRequest,
      callback?: (resp: any) => void
    }, {call}) {
      const changeDTO: AdminPasswordChangeRequest = {...payload};
      if (changeDTO.password && changeDTO.password.trim()) {
        changeDTO.password = SHA(changeDTO.password);
      }

      const resp = yield call(POST, '/admin/user/changePassword', changeDTO);
      if (callback) callback(resp);
    },

    /**
     * 获取用户设置
     */
    * fetchUserSettings({payload, callback}: { payload: { userId: string }, callback?: (resp: any) => void }, {
      call,
      put
    }) {
      yield put({type: 'setUserSettingsLoading', payload: true});
      const resp = yield call(POST, '/rest/platform/user/settings/get', payload);
      if (resp?.success) {
        const userSettings: UserSettingsResponse = resp.data || null;
        yield put({type: 'setUserSettings', payload: userSettings});
      }
      yield put({type: 'setUserSettingsLoading', payload: false});
      if (callback) callback(resp);
    },

    /**
     * 更新用户设置
     */
    * updateUserSettings({payload, callback}: {
      payload: UserSettingsUpdateRequest,
      callback?: (resp: any) => void
    }, {call, put}) {
      yield put({type: 'setUserSettingsLoading', payload: true});
      const resp = yield call(POST, '/rest/platform/user/settings/update', payload);
      if (resp?.success) {
        const userSettings: UserSettingsResponse = resp.data || null;
        yield put({type: 'setUserSettings', payload: userSettings});
      }
      yield put({type: 'setUserSettingsLoading', payload: false});
      if (callback) callback(resp);
    }},

  reducers: {
    setUser(state, {payload}) {
      const token = sessionStorage.getItem('air-pro-token');
      return {
        ...state,
        currentUser: payload,
        isAuthenticated: !!token};
    },

    setToken(state, {payload}) {
      return {
        ...state,
        isAuthenticated: !!payload};
    },

    clearUser(state) {
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false};
    },

    setLoading(state, {payload}) {
      return {
        ...state,
        loading: payload};
    },

    setValidatingToken(state, {payload}) {
      return {
        ...state,
        validatingToken: payload};
    },

    setUserSettings(state, {payload}) {
      return {
        ...state,
        userSettings: payload};
    },

    setUserSettingsLoading(state, {payload}) {
      return {
        ...state,
        userSettingsLoading: payload};
    }}};
