
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
class SelectChannelAll extends Component {
  static defaultProps = {
    value: [],
    onChange: undefined
  }

  constructor(props) {
    super(props)
    this.state = {
      shopdataSource: [],
      channel: [],
    }
  }
  componentDidMount() {
    this.GetBindShopList();
  }

  RemoveonChange = () => {
    this.setState({
      channel: []
    })
  }


  // 查询绑定店铺列表
  GetBindShopList = () => {
    const me = this;
    let query = {
      PlatFormType: 1
    };

    request('g1/crm.channel.customerchnnel.get', {
      method: 'POST',
      body: query,
    })
      .then(res => {
        // let index=0;
        // res.forEach(v=> {
        //   if (res && res[index].shopList!=null) {
        //     v.platformname = v.platformname + "(" + res[index].shopList.length + ")";
        // this.setState({
        //   value1:{platformname: v.platformname, platform: v.platform}
        // })
        // res[index].shopList.forEach(i=>{
        //       this.setState({
        //         value2:{platformname: i.platformname, platform: i.platform },
        //         channel:{platformname: i.platformname, platform: i.platform }
        //       })
        //     });
        //   }
        //   index++;
        // })
        this.setState({
          shopdataSource: res
        })
      });

  }



  render() {
    console.log(this.props)
    const { shopdataSource, channel, } = this.state
    const { value } = this.props
    const tempChannel = value.length > 1 ? value[1] : channel.length && channel[0].platformname || ''
    const show = value[0] && channel.length>0?true:false;
    return (
      <Row type='flex' gutter={8}>
        <Col style={{ flex: 1 ,maxWidth: 100}}>
          <Select style={{ width: '100%' }}
            defaultValue="全部渠道"
            value={value.length ? value[0] : undefined}
            onChange={(val) => {
              //this.props.onChange(platform.key)
              //const list = shopdataSource.filter(k => platform.key === k.platform);
              this.setState({
                channel: []
              })
              this.props.onChange([val])
              const list = shopdataSource.filter(k => val === k.platform);
              debugger
              if (list[0].shopList != null) {
                this.setState({
                  channel: JSON.parse(JSON.stringify(list[0].shopList))
                });
                // this.state.channel.map(item=>{
                //   if(item.platform==platform.key){
                //     this.props.onChange(platformname)
                //   }
                //   else{
                //     this.props.onChange(platform.key)
                //   }
                // });

              } else {
                this.setState({
                  channel: []
                })
              }
            }}
          >
            {
              shopdataSource && shopdataSource.map(item => {
                const platformname = item.platformname + (item.shopList == null ? "" : `(${item.shopList.length - 1})`);
                return (
                  <Select.Option key={item.platform} value={item.platform}>
                    {platformname}
                  </Select.Option>
                )
              })
            }
          </Select>
        </Col>
        {show ? (
          <Col span={12} style={{maxWidth: 100}}>
            <Select style={{ width: '100%' }} value={tempChannel}
              onChange={(val) => {
                //    this.state.shopdataSource.map(v=>{
                //     if(v.platform===platform.key){
                //       this.props.onChange(undefined,val)
                //     }
                //     else{
                //       this.props.onChange(undefined,platform.key);
                //     }
                //    })
                this.props.onChange([value[0], val]);
              }}>
              {
                channel && channel.map(item => {
                  return (
                    <Select.Option key={item.platform} value={item.platform} >
                      {item.platformname}
                    </Select.Option>
                  )
                })
              }

            </Select>
          </Col>) : ''
        }
      </Row>
    )
  }
}

export default SelectChannelAll;