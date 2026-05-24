import {POST} from '@/utils/HttpRequest';
import {
  DatabaseConfigRequest,
  DatabaseConfigResponse,
  RedisConfigRequest,
  RedisConfigResponse,
} from '@/types/paas';

/**
 * PaaS 配置 DVA model
 *
 * 管理数据库和 Redis 连接配置的状态和 API 调用。
 *
 * Created by ChaiMingXu, on 2026/5/23
 */
export default {
  namespace: 'paas',

  state: {
    databaseConfig: {} as DatabaseConfigResponse,
    redisConfig: {} as RedisConfigResponse,
    loading: false,
  },

  effects: {
    * fetchDatabaseConfig({callback}: { callback?: (resp: any) => void }, {call, put}) {
      const resp = yield call(POST, '/admin/paas/database/get', {});
      if (resp?.success) {
        yield put({type: 'setDatabaseConfig', payload: resp.data || {}});
      }
      if (callback) callback(resp);
    },

    * saveDatabaseConfig(
      {payload, callback}: { payload: DatabaseConfigRequest, callback?: (resp: any) => void },
      {call, put}
    ) {
      const resp = yield call(POST, '/admin/paas/database/save', payload);
      if (resp?.success) {
        yield put({type: 'setDatabaseConfig', payload: resp.data || {}});
      }
      if (callback) callback(resp);
    },

    * fetchRedisConfig({callback}: { callback?: (resp: any) => void }, {call, put}) {
      const resp = yield call(POST, '/admin/paas/redis/get', {});
      if (resp?.success) {
        yield put({type: 'setRedisConfig', payload: resp.data || {}});
      }
      if (callback) callback(resp);
    },

    * saveRedisConfig(
      {payload, callback}: { payload: RedisConfigRequest, callback?: (resp: any) => void },
      {call, put}
    ) {
      const resp = yield call(POST, '/admin/paas/redis/save', payload);
      if (resp?.success) {
        yield put({type: 'setRedisConfig', payload: resp.data || {}});
      }
      if (callback) callback(resp);
    },
  },

  reducers: {
    setDatabaseConfig(state: any, {payload}: { payload: DatabaseConfigResponse }) {
      return {...state, databaseConfig: payload};
    },
    setRedisConfig(state: any, {payload}: { payload: RedisConfigResponse }) {
      return {...state, redisConfig: payload};
    },
    setLoading(state: any, {payload}: { payload: boolean }) {
      return {...state, loading: payload};
    },
  },
};
