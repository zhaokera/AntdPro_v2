/* eslint-disable class-methods-use-this */
import React from 'react';
import { Layout, Icon, Tooltip } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { cookie, getUrlByCode, getEndChildrenPath, getUrlRelativePath } from '@/utils/utils';
import router from 'umi/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import selected from '../assets/common/icon_selected.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/Layouts/SiderMenu';
import PageLoading from '@/components/PageLoading';
import Ellipsis from '@/components/Ellipsis';
import getPageTitle from '@/utils/getPageTitle';
import styles from './BasicLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
      route: { routes, path },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, path, pathname },
      callBack: route => {
        if (pathname === '/') {
          router.push(route.path);
        }
      },
    });
  }

  // 根据规则处理2级菜单
  getViceMenuData(viceMenuData) {
    let viceMenuArray = [];
    viceMenuData.forEach(item => {
      if (item.children && item.children.length) {
        item.children.forEach(cItem => {
          if (cItem.children) {
            viceMenuArray.push(cItem);
            viceMenuArray = viceMenuArray.concat(cItem.children);
          } else {
            viceMenuArray.push(cItem);
          }
        });
      }
    });
    return viceMenuArray;
  }

  // 根据路径查询2级菜单
  getViceMenuDataByPath() {
    let viceMenuData = [];
    const {
      menuData,
      location: { pathname },
    } = this.props;
    menuData.forEach(item => {
      if (pathname.startsWith(item.path)) {
        viceMenuData = item;
      }
    });
    return viceMenuData;
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  clickNavigationMenu = viceMenuData => {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'menu/getViceMenuData',
      payload: { viceMenuData },
    });
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      navTheme,
      children,
      loading,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      viceMenuData,
      fixedHeader,
      collapsed,
    } = this.props;

    let viceMenuArray = [];
    if (!viceMenuData.length && menuData.length && pathname === '/') {
      viceMenuArray = this.getViceMenuData([menuData[0]]);
    } else if (!viceMenuData.length && menuData.length) {
      const res = this.getViceMenuDataByPath();
      viceMenuArray = this.getViceMenuData([res]);
    } else if (viceMenuData.length) {
      viceMenuArray = this.getViceMenuData(viceMenuData);
    }
    const viceMenuMapArray = viceMenuArray.filter(item => !item.topMenuPath);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    let isHideViceMenu = false;
    if (viceMenuMapArray.length) {
      isHideViceMenu = viceMenuMapArray[0].name === '首页';
    }
    const that = this;
    const layout = (
      <Layout>
        <SiderMenu
          theme={navTheme}
          onCollapse={this.handleMenuCollapse}
          clickNavigationMenu={this.clickNavigationMenu}
          menuData={menuData}
          isMobile={isMobile}
          {...this.props}
        />
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            isMobile={isMobile}
            {...this.props}
          />
          <div className={styles.contentView}>
            <div className={isHideViceMenu ? styles.hide : styles.viceMenu}>
              {viceMenuMapArray.map((item, vIndex) => {
                const key = vIndex * 10;
                const itemPath = this.conversionPath(item.path);
                const { target } = item;
                const index = viceMenuArray.findIndex(v => v.path === pathname);
                let isTopMenu = false;
                if (index !== -1) {
                  const selectedMenu = viceMenuArray[index];
                  isTopMenu = item.path === selectedMenu.topMenuPath;
                }
                return (
                  <div
                    className={
                      itemPath === pathname || isTopMenu ? styles.menuSelected : styles.menu
                    }
                    key={key}
                  >
                    {item.children && item.children.length ? (
                      <span className={styles.unClickSpan}>{item.name}</span>
                    ) : (
                      <a
                        className={styles.link}
                        onClick={() => {
                          if (target) {
                            window.open(itemPath, '_self');
                          } else if (itemPath === pathname) {
                            router.replace(itemPath);
                          } else {
                            router.push(itemPath);
                          }
                        }}
                      >
                        <span className={styles.menuMainSpan}>
                          <Ellipsis length={4} tooltip>
                            {item.name}
                          </Ellipsis>
                        </span>
                        <img
                          style={{ display: itemPath !== pathname ? 'none' : '' }}
                          className={styles.selected}
                          src={selected}
                          alt="selected"
                        />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={isHideViceMenu ? styles.rigthHomeView : styles.rigthView}>
              <Content className={styles.content} style={contentStyle}>
                {menuData && menuData.length ? children : null}
              </Content>
              <Footer />
            </div>
          </div>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                {loading ? <PageLoading /> : <div className={classNames(params)}>{layout}</div>}
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu: menuModel, loading, user }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  loading: loading.models.menu,
  viceMenuData: menuModel.viceMenuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
