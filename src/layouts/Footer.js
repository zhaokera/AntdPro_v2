import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { version } from '../../package.json';
import GlobalFooter from '@/components/Layouts/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      // links={[
      //   {
      //     key: 'Pro 首页',
      //     title: 'Pro 首页',
      //     href: 'https://pro.ant.design',
      //     blankTarget: true,
      //   },
      //   {
      //     key: 'github',
      //     title: <Icon type="github" />,
      //     href: 'https://github.com/ant-design/ant-design-pro',
      //     blankTarget: true,
      //   },
      //   {
      //     key: 'Ant Design',
      //     title: 'Ant Design',
      //     href: 'https://ant.design',
      //     blankTarget: true,
      //   },
      // ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 江苏多卖软件有限公司
          <span style={{ color: '#f0f2f5' }}>{version}</span>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
