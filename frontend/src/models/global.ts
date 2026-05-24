import {POST} from "@/utils/HttpRequest";

export default {
  namespace: 'global',
  state: {
    layoutSize: {
      headerHeight: 40,
      footerHeight: 0,
      menuWidth: 40
    },
    frameSize: {
      width: 0,
      height: 0,
      slideHeight: 0
    },
    current: {
      page: 'menu_home',
    },
  },
  effects: {},
  reducers: {
    changeFrameSize(state: any, _: any) {
      const {current} = state;
      const frameWidth = window.innerWidth - state.layoutSize.menuWidth;
      const frameHeight = window.innerHeight - state.layoutSize.headerHeight - state.layoutSize.footerHeight;
      const slideHeight = window.innerHeight - state.layoutSize.headerHeight;

      return {
        ...state,
        frameSize: {
          width: frameWidth,
          height: frameHeight,
          slideHeight: slideHeight,
        }
      }
    },

    changeCurrentPage(state: any, {payload}: any) {
      return {
        ...state,
        current: {
          page: payload
        }
      }
    },

    resetCurrentPage(state: any) {
      return {
        ...state,
        current: {
          page: 'menu_home',
        }
      }
    },
  },
};
