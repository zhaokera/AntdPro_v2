import React from 'react';
import { DropDownProps } from 'antd/lib/dropdown';
import { ClickParam } from 'antd/es/menu';
import { SiderTheme } from 'antd/es/Layout/Sider';

export interface GlobalHeaderRightProps {
  dispatch?: (args: any) => void;
  currentUser?: {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    geographic?: any;
    tags?: any[];
    unreadCount: number;
  };
  onMenuClick?: (param: ClickParam) => void;
  theme?: SiderTheme;
}

export default class GlobalHeaderRight extends React.Component<GlobalHeaderRightProps, any> {}
