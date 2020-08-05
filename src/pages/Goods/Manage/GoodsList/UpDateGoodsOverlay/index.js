import React, { Component } from 'react';
import { Select, Form, Icon, Tooltip, Checkbox } from 'antd';
// import router from 'umi/router';
import styles from './index.less';
import moment from 'moment';
import request from '@/utils/request';
import SelectChannelImport from '@/components/CommonModal/SelectChannelImport';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class DMSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopData: null
    }
  }

  componentDidMount = () => {
    console.log(0, this.props.productInfo);
  }

  qdChaneg = (values) => {
    this.getPlatformShop(values);
  }

  // 获取门店信息
  getPlatformShop = (PlatType) => {
    this.setState({
      loading: true,
    });
    request('g1/crm.channel.shop.get', {
      method: 'POST',
      body: { PlatType: PlatType, Isdel: 0, PageIndex: 1, PageSize: 999 },
    }).then(response => {
      let t1 = moment();
      let datas = response.data.filter(i => moment(i.outhEndtime) > t1);
      if (datas.length === 0) {
        message.warning("暂无可用的店铺");
        return;
      }

      this.setState({
        shopData: datas,
        loading: false,
      });
    }).catch(() => {
      this.setState({ loading: false });
    });
  }


  getPlantId = (values) => {
    if (values && values.length === 2) {
      return values[1].id;
    }

    return '';
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let shop = this.props.shopData;
    if (this.state.shopData) {
      shop = this.state.shopData;
    }


    const formItemLayout = {
      labelCol: {
        xl: { span: 5 }
      },
      wrapperCol: {
        xl: { span: 19 }
      },
    };
    return (
      <>
        <Form {...formItemLayout}>
          <FormItem label="来源渠道" colon={false}>
            {
              this.props.productInfo.shopName &&
              <div><i className={`${styles.taobaoIcon} ${styles.iconCommon}`}>{this.props.productInfo.sourceName || '淘宝'}</i>{this.props.productInfo.shopName}</div>
            }
            {
              !this.props.productInfo.shopName &&
              <div>无</div>
            }
          </FormItem>
          <FormItem label="更新内容" colon={false}>
            {getFieldDecorator('updatacon', {
              rules: [
                {
                  required: 'true',
                  message: '请勾选更新内容',
                },
              ],
            })(
              <Checkbox.Group style={{ width: '80%', marginTop: 5 }}>
                <Checkbox value="0">商品标题</Checkbox>
                <Checkbox value="1">商品主图</Checkbox>
                <Checkbox value="2">商品详情</Checkbox>
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem label="选择渠道" colon={false}>
            {/* <Select placeholder="请选择" defaultValue="0" style={{ width: '73%', display: 'inline-block', marginRight: 10 }} onChange={this.qdChaneg}>
              <Option value="0">线上渠道</Option>
              <Option value="1">自建商城</Option>
            </Select> */}
            {getFieldDecorator('chosechannel', {
              rules: [
                {
                  message: '请选择渠道',
                  required: true,
                },
              ],
            })(
              <SelectChannelImport onChange={this.getPlantId} />
              // <Select placeholder="请选择" style={{ width: '73%' }}>
              //   {
              //     shop.map((r, i) => {
              //       // eslint-disable-next-line default-case
              //       switch (r.platform) {
              //         case 'tb':
              //           return <Option key={i} value={i}><i className={`${styles.taobaoIcon} ${styles.iconCommon}`}>淘宝</i>{r.shopname}</Option>
              //         case 'tm':
              //           return <Option key={i} value={i}><i className={`${styles.tmallIcon} ${styles.iconCommon}`}>天猫</i>{r.shopname}</Option>
              //         case 'jd':
              //           return <Option key={i} value={i}><i className={`${styles.jdIcon} ${styles.iconCommon}`}>京东</i>{r.shopname}</Option>
              //         case 'sn':
              //           return <Option key={i} value={i}><i className={`${styles.snIcon} ${styles.iconCommon}`}>苏宁</i>{r.shopname}</Option>
              //         case 'yz':
              //           return <Option key={i} value={i}><i className={`${styles.youzanIcon} ${styles.iconCommon}`}>有赞</i>{r.shopname}</Option>
              //         case 'wm':
              //           return <Option key={i} value={i}><i className={`${styles.weimengIcon} ${styles.iconCommon}`}>微盟</i>{r.shopname}</Option>
              //       }
              //     })
              //   }
              // </Select>
            )}
            {/*             <Tooltip title="不设置渠道，默认选第一个渠道更新商品信息">
              <Icon type="question-circle" style={{ marginLeft: 10, color: "#9495a4", fontSize: 16, cursor: 'pointer' }} />
            </Tooltip> */}
          </FormItem>
        </Form>
      </>
    );
  }
}

export default DMSelect;