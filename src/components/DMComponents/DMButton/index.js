import React, { PureComponent } from 'react';
import cs from 'classnames';
import { Icon } from 'antd';
import { iconUrl } from '../common/iconfont';
import styles from './index.less';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconUrl,
});

/**
 * 按钮Button参数(params)
 * 标题:title
 * 点击事件:onPress(checked)
 * 类型:type 1.默认:btn  2.custom 3.mainColor
 */
export default class DMButton extends PureComponent {
  static defaultProps = {
    icon: undefined,
    checked: undefined,
    disable: false,
    onPress: undefined,
  };

  constructor(props) {
    super(props);
    const checked = this.props.checked === undefined ? false : this.props.checked;
    this.state = {
      isChecked: checked,
    };
  }

  /**
   * 判断传入选中事件是否有变化
   */

  static getDerivedStateFromProps(nextProps, prevState) {
    const { checked, disable } = nextProps;
    if (disable) {
      return null;
    }
    if (checked !== prevState.isChecked) {
      if (checked !== undefined)
        return {
          isChecked: nextProps.checked,
        };
    }
    return null;
  }

  /**
   * 切换点击事件
   */
  toggle = e => {
    if (e.stopPropagation) {
      e.stopPropagation(); // 阻止事件 冒泡传播
    } else {
      e.cancelBubble = true; // ie兼容
    }
    const { onPress, disable, checked } = this.props;
    const { isChecked } = this.state;
    if (!disable && checked === undefined) {
      this.setState(
        {
          isChecked: !isChecked,
        },
        () => {
          if (onPress) onPress(!isChecked);
        }
      );
    } else {
      if (onPress) onPress(!isChecked);
    }
  };

  /**
   * 按钮
   */
  renderBtn() {
    const { style, icon, title } = this.props;
    const { isChecked } = this.state;
    return (
      <div
        className={cs(styles.button, isChecked ? styles.checked : '')}
        style={{
          ...style,
        }}
        onClick={this.toggle}
      >
        {/**
         * 选中样式
         */}
        <div className={styles.overlay} hidden={!isChecked}>
          <IconFont className={styles.icon} type="icon-xuanzhong" />
        </div>

        {/**
         * 添加Icon
         */}
        {icon && <img alt="" className={styles.icon} src={icon} />}

        {/**
         * 标题
         */}
        <div className={styles.title}>{title}</div>
      </div>
    );
  }

  /**
   * 图片按钮
   */
  renderCustomBtn() {
    const { children } = this.props;
    const { isChecked } = this.state;
    return (
      <div>
        {/**
         * 选中样式
         */}
        <div className={styles.overlay} hidden={!isChecked} onClick={this.toggle}>
          <IconFont className={styles.icon} type="icon-xuanzhong" />
        </div>
        {children}
      </div>
    );
  }

  /**
   * 点击背景主色按钮
   */
  renderMainColorBtn() {
    const { title, style } = this.props;
    const { isChecked } = this.state;
    return (
      <div
        className={cs(styles.button, isChecked ? styles.mainChecked : '')}
        style={{
          ...style,
        }}
        onClick={this.toggle}
      >
        {title}
      </div>
    );
  }

  render() {
    const { type } = this.props;
    let renderViewByType = this.renderBtn();
    if (type === 'custom') {
      renderViewByType = this.renderCustomBtn();
    } else if (type === 'mainColor') {
      renderViewByType = this.renderMainColorBtn();
    }
    return renderViewByType;
  }
}
