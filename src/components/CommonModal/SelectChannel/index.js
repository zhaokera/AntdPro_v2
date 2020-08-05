
import React, { Component } from 'react';
import { Row, Col, Select } from 'antd';
import styles from './index.less';
import request from '@/utils/request';
import moment, { now } from 'moment';
import { connect } from 'dva';



@connect(({ user }) => {
  return {
    currentUser: user.currentUser,
  };
})
class SelectChannel extends Component {
  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      channel: { platformname: '全部渠道', platform: "" },
      value1: { platformname: '全部渠道', platform: "" },
      valuejiahui:{platformname: '全部业态', platform: ""},
      value2: {},
      dataSource: [
        { title: '全部渠道', value: "" },
        { title: '苏宁', value: "sn" },
        { title: '小红书', value: "xhs" },
        { title: '拼多多', value: "pdd" },
        { title: '微店', value: "wd" },
        { title: '京东', value: "jd" },
        { title: '淘宝/天猫', value: "tb" },
        { title: '有赞', value: "yz" },
        { title: '微盟', value: "wm" },
        { title: '云店', value: "yd" },
        { title: '自建商城', value: "store" },
        { title: '线下门店', value: "unline" },
      ],
    }
  }
  componentDidMount() {
    this.GetBindShopList();
  }




  // 查询绑定店铺列表
  GetBindShopList = () => {
    const me = this;

    let queryParams = {
      Isdel: 0,
      PageIndex: 1,
      PageSize: 100,
    };
    // 直接调用request
    request('g1/crm.channelname.list.get', {
      method: 'POST',
      body: {},
    })
      .then(response11 => {
      me.setState({
        dataSource:response11
      })
        
      request('g1/crm.channel.shop.get', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {

        request('g2/wx.authority.shop.list', {
          method: 'POST',
          body: {},
        })
          .then(responseshop => {

            let dataSource = [...me.state.dataSource];
            dataSource.forEach(v => {

              if (v.platform == "unline") {
                //线下门店
                 if(responseshop&& responseshop.list){
                  v.platformname = v.platformname + "(" + responseshop.list.length + ")";
                  v.child = [];
                  responseshop.list.forEach(x=>{
                    v.child.push({
                      platformname: x.shopName,
                      platform: x.id
                    });

                  });
                 }

              } else {
                //线上门店      
                if (response && response.totalCount) {
                  let time =moment().format('YYYY/MM/DD HH:mm:ss');
                  let tempList = response.data.filter(j => j.platform == v.platform&&j.outhEndtime>time && j.outhState =="1");
                  if (tempList && tempList.length > 0) {
                    v.platformname = v.platformname + "(" + tempList.length + ")";
                    v.child = [];
                    let index = 0;//自建商城没有门店ID用下标临时代替
                    tempList.forEach(x => {
                          v.child.push({
                          platformname: x.shopname,
                          platform: x.platSellerid==null?index++:x.platSellerid
                        });
                                           
                    });
                  }

                }
              }
            });
            me.setState({
              dataSource: dataSource
            });

          });
            me.setState({
              dataSource: dataSource
            });

          })
          .catch((responseshop) => {
            console.log(responseshop);
          });
      })
      .catch((response) => {
        console.log(response);
      });

  }



  render() {
    const me = this;
    const { onChange } = this.props

    let data = (this.props.data && this.props.data.length > 0) ? this.props.data : this.state.dataSource;
    return (
      <Row type='flex' gutter={8}>
        <Col style={{ flex: 1 }}>
          <Select
            value={this.props.currentUser.masterCode == "100005"?me.state.valuejiahui.platformname:me.state.value1.platformname}
            style={{ width: '100%' }}
            placeholder='请选择渠道'
            onChange={(platform) => {
              const list = data.filter(k => platform === k.platform)[0];
              this.setState({
                channel: list,
                value1: { platformname: list.platformname, platform: list.platform },
                valuejiahui:{platformname: list.platformname, platform: list.platform },
                value2: {}
              })
              if (onChange) onChange([{ title: list.platformname, value: list.platform }])
            }}
          >
            {
              data!=null?data.map((item, key) => {
                return (
                  <Select.Option key={key} value={item.platform}>{item.platformname}</Select.Option>
                )
              }):''
            }
          </Select>
        </Col>
        {
          this.state.channel.child && this.state.channel.child.length > 0 ? (
            <Col span={12}>
              <Select
                value={me.state.value2.platformname}
                style={{ width: '100%' }}
                placeholder='请选择'
                showSearch={true}
                optionFilterProp="children"
                onChange={(platform) => {
                  const { channel, value1,valuejiahui } = this.state
                  const list = channel.child.filter(k => platform === k.platform)[0];
                  this.setState({
                    value2: list
                  })
                  if (onChange) onChange([this.props.currentUser.masterCode == "100005"?valuejiahui:value1, { title: list.platformname, value: list.platform }])
                }}
              >
                {
                 this.state.channel.child!=null?this.state.channel.child.map((item, key) => {
                    return (
                      <Select.Option key={key} value={item.platform}>{item.platformname}</Select.Option>
                    )
                  }):''
                }
              </Select>
            </Col>) : ''
        }
      </Row>
    )
  }
}

export default SelectChannel;
