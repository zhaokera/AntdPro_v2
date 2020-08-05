import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Form } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import EnumLable from './EnumLable';
import CrowdArea from '@/components/Crowd/CrowdArea';
import RegionInt from './RegionInt';
import RadioCrowd from '@/components/Crowd/RadioCrowd';
import Relativ from '@/components/Crowd/Relativ';
import CrowdInpt from '@/components/Crowd/CrowdInpt';
import CrowdSelect from '@/components/Crowd/CrowdSelect';
import CrowdSelectEnum from '@/components/Crowd/CrowdSelectEnum';
import CrowdItemSelect from '@/components/Crowd/CrowdItemSelect';
import CrowdItems from '@/components/Crowd/CrowdItems';

function Dictionary() {
  this.add = add;
  this.datastore = new Array();
  this.find = find;
  this.remove = remove;
  this.count = count;
  this.clear = clear;
}
function add(key, value) {
  this.datastore[key] = value;
}

function find(key) {
  return this.datastore[key];
}

function remove(key) {
  delete this.datastore[key];
}

function count() {
  let n = 0;
  for (let key in Object.keys(this.datastore)) {
    ++n;
  }
  return n;
}

function clear() {
  for (let key in this.datastore) {
    delete this.datastore[key];
  }
}

let nodeType = {
  // 枚举类型数据
  ENUM: 'enum',
  // 范围
  REGIONINT: 'region_int', // 数字
  REGIONDOUBLE: 'region_double', // double
  REGIONTIME: 'region_time', // 时间
  REGIONTIMEDATE: 'region_time_date', // 只有日期的时间
  RADIO: 'radio', // 单选
  RELATIV: 'relativ', // 区间
  CROWDAREA: 'crowdarea', // 地域
  INPUTTAG: 'inputtag', // 文本输入框
  INPUTAREA: 'inputarea',
  SELECTTAG: 'selecttag', // 下拉选择框
  SELECTENUM: 'select_enum', // 下拉框+枚举
  TIMEITEM: 'time_item', // 时间+选择宝贝
  SELECTITEM: 'select_item', // 选择宝贝
};

@connect(({ loading, taglist }) => {
  return {
    loading: loading.models.taglist,
    taglist,
  };
})
@Form.create()
class LableSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasource: [], //可选择设置项
      labeldic: [], //设置信息分类
      labelinfo: this.props.labelInfo,
    };
  }
  componentDidMount() {
    this.getDataSet();
  }

  //获取可设置项
  getDataSet = () => {
    const me = this;
    let queryData = {
      tagtype: 1,
    };
    me.props.dispatch({
      type: 'taglist/GetLabelDataSet',
      payload: {
        ...queryData,
      },
      callback: response => {
        if (response) {
          let labeldic = new Dictionary();
          response.map(item => {
            const jsonitems = JSON.parse(JSON.stringify(item));
            let tabitem = JSON.parse(jsonitems.tagDesc);
            //已选择标签
            if (me.state.labelinfo != undefined) {
              const hascho = me.state.labelinfo.find(index => {
                return index.tag == item.tagName;
              });

              if (hascho != undefined) {
                tabitem = hascho;
              } else {
                tabitem.setnodecheckd = false;
              }
            } else {
              tabitem.setnodecheckd = false;
            }

            const valarr = [];
            valarr.push(tabitem);
            if (labeldic.find(tabitem.tab_type) == undefined) {
              labeldic.add(tabitem.tab_type, valarr);
            } else {
              const labelva = labeldic.find(tabitem.tab_type);
              labelva.push(valarr[0]);
              labeldic.add(tabitem.tab_type, labelva);
            }
          });
          me.setState({
            datasource: response,
            labeldic: labeldic,
          });
          this.props.onGetSetData(labeldic);
        }
      },
    });
  };

  // 获取设置信息
  GetNode = item => {
    // 获取设置项
    switch (item.tag_type) {
      case nodeType.ENUM:
        return <EnumLable data={item} />; // 枚举

      case nodeType.REGIONINT:
      case nodeType.REGIONTIME:
      case nodeType.REGIONDOUBLE:
      case nodeType.REGIONTIMEDATE:
        return <RegionInt data={item} />; // 范围
      case nodeType.RADIO:
        return <RadioCrowd data={item} />; // 单选
      case nodeType.RELATIV:
        return <Relativ data={item} />;
      case nodeType.CROWDAREA:
        return <CrowdArea data={item} />; // 地区
      case nodeType.INPUTTAG:
        return <CrowdInpt data={item} />;
      case nodeType.INPUTAREA:
        return <CrowdInpt data={item} />;
      case nodeType.SELECTTAG:
        return <CrowdSelect data={item} />;
      case nodeType.SELECTENUM:
        return <CrowdSelectEnum data={item} />;
      case nodeType.TIMEITEM:
        return <CrowdItemSelect data={item} />;
      case nodeType.SELECTITEM:
        return <CrowdItems data={item} />;
    }
  };

  onNodeChange(rule, value, callback) {
    if (!value.setnodecheckd) {
      callback();
      return;
    }
    if (
      (typeof value.selectvalue == 'object' && value.selectvalue.length > 0) ||
      (typeof value.selectvalue == 'number' && value.selectvalue != undefined) ||
      (typeof value.selectvalue == 'string' && value.selectvalue != '') ||
      ((value.tag_type == 'region_time' ||
        value.tag_type == 'time_item' ||
        value.tag_type == 'region_time_date') &&
        (value.selectvalue.length > 0 || value.selecttype == '4'))
    ) {
      if (
        (value.tag_type == 'region_int' || value.tag_type == 'region_double') &&
        value.selecttype == '1'
      ) {
        // 区间判断
        if (value.selectvalue[0] > value.selectvalue[1]) {
          callback('请设置正确的' + value.tag_name);
          return;
        }
      }
      //生日区间判断
      if (value.tag_type == 'region_time_date' && value.selecttype == '1') {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        let setst = moment('2019-' + value.selectvalue[0], dateFormat);
        let dddt = moment('2019-' + value.selectvalue[1], dateFormat);
        if (
          moment('2019-' + value.selectvalue[0], dateFormat) >
          moment('2019-' + value.selectvalue[1], dateFormat)
        ) {
          callback('请设置正确的' + value.tag_name);
          return;
        }
      }
      if (value.tag_type === 'select_enum' && value.selectenumvalue.length <= 0) {
        callback('请设置' + value.tag_name);
        return;
      }
      if (
        value.tag_type === 'time_item' &&
        ((value.selecttype != '4' && value.selecttimevalue.length <= 0) ||
          value.selectvalue.length === 0)
      ) {
        callback('请设置' + value.tag_name);
        return;
      }
      callback();
      return;
    } else {
      callback('请设置' + value.tag_name);
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemlayout = {
      labelCol: {
        xxl: 2,
        xl: 2,
        lg: 3,
        sm: 4,
      },
      wrapperCol: {
        xxl: 21,
        xl: 20,
        sm: 19,
      },
      colon: false,
    };
    const setnode = [];
    const me = this;
    // 组装设置条件
    for (var key in this.state.labeldic.datastore) {
      const childnode = [];
      this.state.labeldic.datastore[key].map(item => {
        childnode.push(
          <div className={styles.tradebox}>
            <Form.Item className={styles.setbox}>
              {getFieldDecorator(item.tag, {
                initialValue: item,
                rules: [{ validator: this.onNodeChange.bind(this) }],
              })(this.GetNode(item))}
            </Form.Item>
          </div>
        );
      });
      setnode.push(<Form.Item label={key}>{childnode}</Form.Item>);
    }

    return (
      <div className={`${styles.TagList}`}>
        <Form {...formItemlayout}>{setnode}</Form>
      </div>
    );
  }
}

export default Form.create()(LableSet);
