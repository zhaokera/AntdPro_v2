import React, { Component } from 'react';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/Layouts/GlobalHeader';
import styles from './Header.less';

const { Header } = Layout;

class HeaderView extends Component {
  state = {
    visible: true,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    // 退出登录
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
        callBack: () => {
          message.error('退出登录成功');
        },
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  render() {
    const { handleMenuCollapse, setting } = this.props;
    const { fixedHeader } = setting;
    const { visible } = this.state;
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header
        style={{ padding: 0, width, zIndex: 2, height: 56 }}
        className={fixedHeader ? styles.fixedHeader : ''}
      >
        <GlobalHeader
          onCollapse={handleMenuCollapse}
          onMenuClick={this.handleMenuClick}
          {...this.props}
        />
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ user, global, setting }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  setting,
}))(HeaderView);
