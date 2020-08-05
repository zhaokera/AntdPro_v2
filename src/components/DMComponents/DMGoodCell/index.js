import React, { PureComponent } from 'react';
import cs from 'classnames';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';
import selectImg from '../../../assets/activity/icon_selected_blue.png';

/**
 * 选择宝贝Cell参数(params)
 * 标题:title
 * 详情:detail
 * 是否选中:checked
 * 点击标题:clickTitle
 * 点击事件:onChange(checked)
 */

export default class DMGoodCell extends PureComponent {
  static defaultProps = {
    disable: false,
    checked: undefined,
    data: {
      icon: '',
      title: '',
      detail: '',
      price: 0,
    },
    clickTitle: undefined, // 点击标题
    onChange: undefined, // 点击Cell
  };

  constructor(props) {
    super(props);
    this.state = {
      isChecked: this.props.checked,
    };
    this.toggle = this.toggle.bind(this);
    this.clickTitle = this.clickTitle.bind(this);
  }

  /**
   * 判断传入选中事件是否有变化
   */

  static getDerivedStateFromProps(nextProps, prevState) {
    const { checked } = nextProps;
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
  toggle = () => {
    const { onChange, checked, disable } = this.props;
    if (disable) {
      return;
    }
    const { isChecked } = this.state;
    if (checked === undefined) {
      this.setState(
        {
          isChecked: !isChecked,
        },
        () => {
          if (onChange) onChange(this.state.isChecked, this.props.data);
        }
      );
    } else {
      if (onChange) onChange(!this.state.isChecked, this.props.data);
    }
  };

  /**
   * 点击标题
   */
  clickTitle = e => {
    const { clickTitle } = this.props;
    if (clickTitle) {
      if (e.stopPropagation) {
        e.stopPropagation(); // 阻止事件 冒泡传播
      } else {
        e.cancelBubble = true; // ie兼容
      }
      clickTitle();
    }
  };

  render() {
    const {
      children,
      style,
      data: { icon, title, detail, price },
    } = this.props;
    const { isChecked } = this.state;
    return (
      <div
        className={cs(styles.dmcell, isChecked ? `${styles.checked}` : '')}
        style={{
          ...style,
        }}
        onClick={this.toggle}
      >
        <img alt="" className={styles.icon} src={icon} />
        <div className={styles.rightView} onClick={this.clickTitle}>
          <Ellipsis tooltip lines={1} className={cs(styles.title)}>
            {title}
          </Ellipsis>
          <div className={styles.detail}>商家编码：
          <Ellipsis tooltip  lines={1} className={cs(styles.title)}>
          {detail}
          </Ellipsis>
          </div>
          <div className={styles.money}>
            价格：<span style={{ color: 'red' }}>¥{price}</span>
          </div>
          <div className={styles.imgDiv}>
            {isChecked ? <img alt="" style={{ width: 20, height: 20 }} src={selectImg} /> : null}
          </div>
          <div className={styles.bottom}>{children}</div>
        </div>
      </div>
    );
  }
}
