
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
class SelectChannelImport extends Component {
  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      channel: { platformname: '全部渠道', platform: "" },
      value1: { platformname: '全部渠道', platform: "" },
      valuejiahui: { platformname: '全部业态', platform: "" },
      value2: {},
      dataSource: [
        
      ],
    }
  }

  componentDidMount() {
    this.GetBindShopList();
  }




  // 查询绑定店铺列表
  GetBindShopList = () => {
    const me = this;

    const queryParams = {
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
          dataSource: response11
        }, () => {
          request('g1/crm.channel.shop.get', {
            method: 'POST',
            body: queryParams,
          })
            .then(response => {
              const dataSource = this.state.dataSource;
              dataSource.forEach(v => {
                // 线上门店      
                if (response && response.totalCount) {
                  const time = moment().format('YYYY/MM/DD HH:mm:ss');
                  const tempList = response.data.filter(j => j.platform === v.platform && j.outhEndtime > time && j.outhState === "1");
                  if (tempList && tempList.length > 0) {
                    v.platformname = `${v.platformname}(${tempList.length})`;
                    v.child = [];
                    tempList.forEach(x => {
                      v.child.push({
                        id: x.id,
                        platformname: x.shopname,
                        platform: x.platform
                      });

                    });
                  }

                }
              })
              me.setState({
                dataSource: dataSource
              });

            })
            .catch((responseshop) => {
              console.log(responseshop);
            });

        })


      })
      .catch((response) => {
        console.log(response);
      });

  }



  render() {
    const me = this;
    const { onChange } = this.props

    const data = this.state.dataSource.filter(i => i.platformname !== '全部渠道');

    const childData = data.find(i => i.platform === this.state.value1.platform);
    const child = childData ? childData.child : null;
    return (
      <Row type='flex' gutter={8}>
        <Col style={{ flex: 1 }}>
          <Select
            onChange={(platform) => {
              const list = data.filter(k => platform === k.platform)[0];
              this.setState({ value1: { platformname: list.platformname, platform: list.platform },value2:{} });
              if (onChange) onChange([{ title: list.platformname, value: list.platform }]);
            }}
          >
            {
              data != null ? data.map((item, key) => {
                return (
                  <Select.Option key={key} value={item.platform}>{item.platformname}</Select.Option>
                )
              }) : ''
            }
          </Select>
        </Col>
        {
          child && child.length > 0 ? (
            <Col span={12}>
              <Select
                value={me.state.value2.platformname}
                style={{ width: '100%' }}
                placeholder='请选择'
                showSearch
                optionFilterProp="children"
                onChange={(platform) => {
                  const { value1 } = this.state
                  const list = child.filter(k => platform === k.id)[0];
                  this.setState({
                    value2: list
                  })
                  if (onChange) onChange([value1, list])
                }}
              >
                {
                  child && child.length > 0 ? child.map((item, key) => {
                    return (
                      <Select.Option key={key} value={item.id}>{item.platformname}</Select.Option>
                    )
                  }) : ''
                }
              </Select>
            </Col>) : ''
        }
      </Row>
    )
  }
}

export default SelectChannelImport;
