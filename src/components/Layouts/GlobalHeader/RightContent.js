import React, { PureComponent } from 'react';
import { Spin, Menu, Icon, Avatar, Row, Col } from 'antd';
import request from '@/utils/request';
import { getUrlByCode } from '@/utils/utils';
import router from 'umi';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const { currentUser, onMenuClick, theme } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const servicelist = (
      <Menu className={styles.menu} selectedKeys={[]}>
        <Menu.Item key="phone">
          <Icon type="phone" /> 400-900-5128
        </Menu.Item>
        <Menu.Item key="qq">
          <Icon type="qq" /> 3488283594
        </Menu.Item>
      </Menu>
    )
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }

    return (
      <div className={className}>
        {currentUser.shortName ? (
          <Row type='flex' justify='end' gutter={16} className={styles.name}>
            <Col>{currentUser.brandName}</Col>
            <Col
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.open(`${getUrlByCode('10000102')}/system/systemnews/systemnewscon`, '_self');
              }}
            >
              <Row type='flex' align='middle' gutter={8}>
                <Col><Icon type="bell" /></Col>
                <Col>消息</Col>
              </Row>
            </Col>
            <Col>
              <HeaderDropdown overlay={servicelist}>
                <Row type='flex' align='middle' gutter={8}>
                  <Col><Icon type="customer-service" /></Col>
                  <Col>联系我们</Col>
                </Row>
              </HeaderDropdown>
            </Col>
            <Col>
              <HeaderDropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    alt="avatar"
                    // icon="user"
                    src={currentUser.logUrl}
                  />
                  <span>欢迎您，{currentUser.shortName}</span>
                </span>
              </HeaderDropdown>
            </Col>
          </Row>

        ) : (
            <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
          )}
      </div>
    );
  }
}
