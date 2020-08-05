import React from 'react';

export interface GlobalHeaderProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  logo?: string;
  onMenuClick?: ({ key: string }) => void;
}

export default class GlobalHeader extends React.Component<GlobalHeaderProps, any> {}
