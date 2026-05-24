import {POST} from '@/utils/HttpRequest';
import {SysMenuResponse} from '@/types/menu';

export default {
  namespace: 'menu',

  state: {
    menuList: [] as SysMenuResponse[],
  },

  effects: {
    /**
     * 获取菜单列表
     * admin 用户调用 /admin/menu，其他用户调用 /rest/platform/menu/list
     */
    * fetchMenuList({callback}: { callback?: (resp: any) => void }, {call, put}) {
      const loginId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('air-pro-user') : null;
      const menuUrl = loginId === 'admin' ? '/admin/menu' : '/rest/platform/menu/list';
      const resp = yield call(POST, menuUrl, {});
      if (resp && resp.success) {
        const menuList: SysMenuResponse[] = resp.data || [];
        yield put({
          type: 'setMenuList',
          payload: menuList
        });
      }
      if (callback) callback(resp);
    },
  },

  reducers: {
    setMenuList(state: any, {payload}: { payload: SysMenuResponse[] }) {
      return {
        ...state,
        menuList: payload || [],
      };
    },
  },
};
