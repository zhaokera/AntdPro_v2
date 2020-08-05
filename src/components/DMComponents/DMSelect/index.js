import React, { Component } from 'react';
import DMButton from '@/components/DMComponents/DMButton';
import styles from './index.less';
import Ellipsis from '@/components/Ellipsis';
/**
 * 选择器Select参数(params)
 * 样式:style
 * 是否可用:disable
 * 数据:dataList
 *     例: [{title:"",value{}}]
 *          title:按钮标题
 *          value:所需对象
 * 点击事件:onChange({item,selectList})
 *          item:传入的value
 *          selectList:选中的对象数组
 */
export default class DMSelect extends Component {
  static defaultProps = {
    dataList: [],
    disable: false,
    type: 'default', // multi:多选 default:默认
    buttonType: 'btn', // 1.默认:btn  2.custom 3.mainColor
  };
  /**
   * 判断传入选中事件是否有变化
   */

  static getDerivedStateFromProps(nextProps) {
    const { disable } = nextProps;
    if (disable) {
      return {
        selectList: [],
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      selectList: this.props.selectList !== undefined ? this.props.selectList : [],
    };
  }

  // 清除选中
  clear() {
    this.setState({
      selectList: [],
    });
  }

  render() {
    const { dataList, style, onChange, children, type, btnStyle, buttonType } = this.props;
    let { selectList } = this.state;
    const that = this;
    return (
      <div
        className={styles.dmselect}
        style={{
          ...style,
        }}
      >
        {dataList.map((item, index) => {
          const isChecked = selectList.findIndex(val => val.title === item.title) !== -1;
          const ellipsis = <Ellipsis length={7} text={item.title} tooltip />;
          return (
            <DMButton
              style={{
                marginRight: 8,
                marginBottom: 8,
                width:105,
                ...btnStyle,
              }}
              key={index}
              title={ellipsis}
              checked={isChecked}
              type={buttonType}
              onPress={checked => {
                if (checked) {
                  if (type === 'default') {
                    selectList = [];
                  }
                  selectList.push(item);
                  that.setState({
                    selectList: selectList,
                  });
                } else {
                  for(var i=0;i<selectList.length;i++){
                      if(item.title == selectList[i].title){
                          console.log(i)
                          selectList.splice(i,1)
                      }
                  }
                  that.setState({
                    selectList: selectList.filter(a => a.title !== item.title),
                  });
                }
                if (onChange) onChange({ item, selectList });
                console.log(this.state.selectList)
              }}
            />

          );
        })}
        <div className={styles.children}>{children}</div>
      </div>
    );
  }
}
