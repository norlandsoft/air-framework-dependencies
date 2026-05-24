import React from 'react';
import {connect} from "umi";

import Home from "@/pages/Home";
import SettingsPage from "@/pages/Admin/Settings";
import Error404 from "./Error404";

const WorkContent: React.FC<any> = props => {

  const {
    current,
    frameSize,
    layoutSize
  } = props;

  return (
      <div style={{
        position: 'fixed',
        left: layoutSize.menuWidth,
        top: layoutSize.headerHeight,
        width: frameSize.width,
        height: frameSize.height
      }}>
        {
          (() => {
            switch (current.page) {
              case 'menu_home':
                return <Home/>
              case 'menu_setting':
                return <SettingsPage/>
              default:
                return <Error404/>
            }
          })()
        }
      </div>
  );
}

export default connect(({global}) => ({
  current: global.current,
  frameSize: global.frameSize,
  layoutSize: global.layoutSize
}))(WorkContent);
