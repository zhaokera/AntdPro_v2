import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';
import {
  Row, Col, Statistic, Select, Radio, Tabs, Spin, Icon,Empty,Popover
} from 'antd';
import AddMember from './AddMember'; // 添加成员
import Sale from './Sale'; // 销售额
import styles from './index.less';
import CreateActive from './CreateActive';
import request from '@/utils/request';
import { parse } from 'querystring';
import { getUrlByCode } from '@/utils/utils';
import { connect } from 'dva';
import { router } from 'umi';

const { Option } = Select;
const { TabPane } = Tabs;
@connect(({ user }) => {
  return {
    currentUser: user.currentUser,
  };
})
class index extends Component {
  state = {
    loadingnewcustomer: true,// 新增会员
    loadingsalevolume: true,// 首页销售额占比top5
    loadingshopachievement: true,
    loadinggetoverview: true,
    loadingpublic: true,
    loadingmes:true,
    sysmessage:[],
    amountanalysislist:[],
    shoplist:[]
  };

  componentDidMount() {
    this.getoverview();
    this.getnewcustomer(1);
    this.getsalevolume(1);
    //this.getshopachievement(1);
    this.getamountanalysis(1);
    this.getCommonlyused();
    this.getBindpublicSignal();
    this.getSysMessage();
    this.init();
  }

  // 新增会员
  getoverview = (ChannelId) => {
    let sdata = {
      ChannelId
    }
    this.setState({ loadinggetoverview: true });
    request('g1/crm.analysis.home.getoverview', {
      method: 'POST',
      body: sdata,
    }).then(rt => {
      if (rt) {
        this.setState({ rtgetoverview: rt, loadinggetoverview: false })
        // console.log(rt ,'会员');
      }
    });
  }

  // 新增会员
  getnewcustomer = (day) => {
    let sdata = {
      day
    }
    this.setState({ loadingnewcustomer: true });
    request('g1/crm.analysis.home.getnewcustomer', {
      method: 'POST',
      body: sdata,
    }).then(rt => {
      if (rt) {
        this.setState({ rtgetnewcustomer: rt, loadingnewcustomer: false })
      }
    });
  }

  // 首页销售额占比top5
  getsalevolume = (day) => {
    let sdata = {
      day
    }
    this.setState({ loadingsalevolume: true });
    request('g1/crm.analysis.home.getsalevolume', {
      method: 'POST',
      body: sdata,
    }).then(rt => {
      if (rt) {    
        this.setState({ rtgetsalevolume: rt, loadingsalevolume: false })
      }
    });
  }

  getCommonlyused = () => {
    let sdata = {
    }
    this.setState({ loadingmyArray: true });
    request('g2/wx.authority.menu.get', {
      method: 'POST',
      body: sdata,
    }).then(rt => {
      if (rt) {
        rt.routes.map(e => {
          if (e.name == "首页") {
          }
          else {
            if (e.routes.length == 0 || e.routes == undefined) {
              if (e.topMenuPath == undefined) {
                e.sign = true;
              }
            }
            else {
              e.routes.map(ee => {
                if (ee.routes != undefined) {
                  if (ee.routes.length == 0) {
                    if (ee.topMenuPath == undefined) {
                      ee.sign = true;
                    }
                  }
                  else {
                    ee.routes.map(eee => {
                      if (eee.routes != undefined) {
                        if (eee.routes.length == 0) {
                          if (eee.topMenuPath == undefined) {
                            eee.sign = true;
                          }
                        }
                      }
                      else {
                        if (eee.topMenuPath == undefined) {
                          eee.sign = true;
                        }

                      }

                    })

                  }
                }

              })
            }

          }
        })
        // console.log(rt, '菜单');
        request('g1/crm.member.menu.get', {
          method: 'POST',
          body: {
            json: 1,
            subuserid: this.props.currentUser.userName
          },
        }).then(rtm => {
          if (rtm) {
            let myArray = new Array();

            JSON.parse(rtm).map(item => {
              rt.routes.map(e => {
                if (e.name == '首页' || (e.authority.length == 0)) {

                }
                else {
                  if (e.routes != undefined) {
                    if (e.routes.length == 0) {
                      if (e.menuCode == item) {
                        myArray.push(e);
                      }
                    }
                    if (e.routes.length > 0) {
                      e.routes.map(ee => {
                        if (ee.menuCode == item) {
                          myArray.push(ee);
                        }
                        if (ee.routes != undefined) {
                          if (ee.routes.length > 0) {
                            ee.routes.map(eee => {
                              if (eee.menuCode == item) {
                                myArray.push(eee);
                              }
                            })
                          }
                        }

                      })
                    }
                  }
                }
              })
            })

            // console.log(myArray,'查询结果');
            this.setState({ myArray, loadingmyArray: false });
          }
          else if (rtm == undefined) {
            this.setState({ loadingmyArray: false });
          }
        });
      }
    });
  }
  init = () => {
    request('g1/crm.channelname.list.get', {
        method: 'POST',
        body: {PlatFormType:3},
    })
    .then(response => { 
        this.setState({channel:response});

    })
    .catch((resoponseerror) => {
            console.log(resoponseerror);
        });
}
  // 首页门店业绩Top6
  // getshopachievement = (day) => {
  //   let sdata = {
  //     day
  //   }
  //   this.setState({ loadingshopachievement: true });
  //   request('g1/crm.analysis.home.getshopachievement', {
  //     method: 'POST',
  //     body: sdata,
  //   }).then(rt => {
  //     if (rt) {
  //       this.setState({ rtshopachievement: rt, loadingshopachievement: false })
  //     }
  //   });
  // }
  getamountanalysis = (time)=>{
    const queryParams = {time}
  
  this.setState({ loadingshopachievement: true });
  request('g1/crm.analysis.home.getamountanalysis',{
    method: 'POST',
      body: queryParams,
  }).then(response => {
    if(response){
      this.setState({
        amountanalysislist:response.data, 
        loadingshopachievement: false 
      })
    }
  });

  
  // request('g2/wx.authority.shop.list',{
  //   method: 'POST',
  //     body: {},
  // }).then(response => {
  //   if(response){
  //     const {amountanalysislist} = this.state;
  //     amountanalysislist && amountanalysislist.map(m=>{
  //       m.shopName = response.list.find(s=>s.id == m.shopId).shopName
  //     })
  //     this.setState({
  //       amountanalysislist
  //     })
  //   }
  // });

}



  getYesterdayCompare = (beforeYesterday, yesterday) => {

    let disparity = parseFloat(yesterday) - parseFloat(beforeYesterday);
     
    if (disparity < 0) {
      return <span> 较前一日下降{Math.abs(disparity.toFixed(2))}  <Icon type="caret-down" style={{ color: '#ff0000', fontSize: 16, marginLeft: 10 }} /></span>;
    } else if (disparity > 0) {
      return <span> 较前一日提升{disparity.toFixed(2).replace(/.0+$/g,"")} <Icon type="caret-up" style={{ color: '#52c41a', fontSize: 16, marginLeft: 10 }} /> </span>;
    } else {
      return `较前一日 --`;
    }
  }

  getBindpublicSignal = () => {
    let sdata = {
    }
    request('g2/wx.activity.publicSignal.getAll', {
      method: 'POST',
      body: sdata,
    }).then(rt => {
      if (rt) {
        this.setState({ publicSignal: rt, loadingpublic: false })
      }
    });
  }

  getSysMessage=()=>{
    let sdata = {
      currentPage:1,
      pageSize:5,
      MessAgeType:''
    }
    request('g1/crm.systemset.sysmessage.get', {
      method: 'POST',
      body: sdata,
    }).then(rt => {
      if (rt) {
        console.log("mes", rt)
        this.setState({ sysmessage: rt.data, loadingmes: false })
      }
    });
  }

  render() {
    const that = this;
    const content = (
      <div>
        <img width={200} src='https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/public/%E5%9B%BE%E7%89%87/e436f4f1f3aa9a806d2b5c88f5d9bf72.png' alt='' />
      </div>
    );
    // <summary>
    // 前天成交订单数(笔)
    // </summary>
    let TradeBeforeCount = this.state.rtgetoverview ? this.state.rtgetoverview.tradeBeforeCount : 0;

    // <summary>
    // 昨日成交订单数
    // </summary>
    let NewTradeCount = this.state.rtgetoverview ? this.state.rtgetoverview.newTradeCount : 0;

    // <summary>
    // 前天成交金额(元)
    // </summary>
    let BeforeTradeMoneyCount = this.state.rtgetoverview ? this.state.rtgetoverview.beforeTradeMoneyCount : 0;
    // <summary>
    // 昨日成交金额
    // </summary>
    let NewTradeMoney = this.state.rtgetoverview ? this.state.rtgetoverview.newTradeMoney : 0;
    // <summary>
    // 前天成交会员数(人)
    // </summary>
    let BeforeTradeCustomerCount = this.state.rtgetoverview ? this.state.rtgetoverview.beforeTradeCustomerCount : 0;
    // <summary>
    // 昨日成交会员数
    // </summary>
    let NewTradeCustomerCount = this.state.rtgetoverview ? this.state.rtgetoverview.newTradeCustomerCount : 0;
    // <summary>
    // 昨日客单价(元)
    // </summary>
    let CustomerUnitMoney = this.state.rtgetoverview ? this.state.rtgetoverview.customerUnitMoney : 0;
    // <summary>
    // 前天客单价(元)
    // </summary>
    let BeforeCustomerUnitMoney = this.state.rtgetoverview ? this.state.rtgetoverview.beforeCustomerUnitMoney : 0;
    // <summary>
    // 前天新增储值金额(元)
    // </summary>
    let BeforeStoredValueMoneyCount = this.state.rtgetoverview ? this.state.rtgetoverview.beforeStoredValueMoneyCount : 0;
    // <summary>
    // 昨日新增储值金额
    // </summary>
    let NewStoredValueMoney = this.state.rtgetoverview ? this.state.rtgetoverview.newStoredValueMoney : 0;


    // let htmlshopw = this.state.rtshopachievement ? (this.state.rtshopachievement.length > 0 ? this.state.rtshopachievement.analysisList.map((e, i) => {
    //   let topnum = i < 1 ? <i className={styles.topNum}>{i + 1}</i> : <i>{i + 1}</i>
    //   return <div className={styles.storeItem}>
    //     <div className={styles.storeItemLeft}>{topnum}<span><Ellipsis length={15} tooltip>{e.shopName}</Ellipsis></span></div>
    //     <div className={styles.storeItemRight}>¥<span>{e.tradeAmount}</span></div>
    //   </div>
    // }) : null) : null;

    let htmlshopw = this.state.amountanalysislist ? (this.state.amountanalysislist.length > 0 ? this.state.amountanalysislist.map((e, i) => {
      let topnum = i < 1 ? <i className={styles.topNum}>{i + 1}</i> : <i>{i + 1}</i>
      return <div className={styles.storeItem}>
        <div className={styles.storeItemLeft}>{topnum}<span><Ellipsis length={15} tooltip>{e.shopName}</Ellipsis></span></div>
        <div className={styles.storeItemRight}>¥<span>{e.amountPayable}</span></div>
      </div>
    }) : null) : null;

    return (
      <PageHeaderWrapper title="首页">
        <CreateActive
          ref={ref => {
            that.CreateRef = ref;
          }}
          Showmenu={() => { this.getCommonlyused() }} // 更新页面常用菜单
        />
        <div className={styles.IndexPageBox}>
          <Row className={styles.IndexPageBoxCon}>
            <Col span={19} className={styles.IndexPageBoxLeft}>
              {/* 数据概览 */}
              <div className={styles.DataView}>
                <div className={styles.littleBox}>
                  <span>数据概览</span>  
                  <div>
                    <Select placeholder="请选择" defaultValue=""   onChange={(e) => { this.getoverview(e) }} style={{ width: 120 }}>
                                {/* <Option value="">所有渠道</Option> */}
                                {this.state.channel?this.state.channel.map((e)=>{
                            return(
                                <Option key={e.platform} value={e.platform}>{e.platformname}</Option>
                            )
                        }):null }
                    </Select>
                  </div>
                </div>
                <Spin spinning={this.state.loadinggetoverview} tip="加载中...">
                  <div className={styles.DataViewCon}>
                    <Tabs>
                      <TabPane tab={<><Statistic title="昨日成交订单数(笔)" value={this.state.rtgetoverview ? this.state.rtgetoverview.newTradeCount : '--'} /><div className={styles.compareNum}> {this.getYesterdayCompare(TradeBeforeCount, NewTradeCount)}</div></>} key="1" />
                      <TabPane tab={<><Statistic title="昨日成交金额(元)" value={this.state.rtgetoverview ? this.state.rtgetoverview.newTradeMoney : '--'} prefix='￥' /><div className={styles.compareNum}> {this.getYesterdayCompare(BeforeTradeMoneyCount, NewTradeMoney)}</div></>} key="2" />
                      <TabPane tab={<><Statistic title="昨日成交会员数(人)" value={this.state.rtgetoverview ? this.state.rtgetoverview.newTradeCustomerCount : '--'} /><div className={styles.compareNum}>{this.getYesterdayCompare(BeforeTradeCustomerCount, NewTradeCustomerCount)}</div></>} key="3" />
                      <TabPane tab={<><Statistic title="昨日客单价(元)" value={this.state.rtgetoverview ? this.state.rtgetoverview.customerUnitMoney : '--'} prefix='￥' /><div className={styles.compareNum}>{this.getYesterdayCompare(BeforeCustomerUnitMoney, CustomerUnitMoney)}</div></>} key="4" />
                      <TabPane tab={<><Statistic title="昨日新增储值金额(元)" value={this.state.rtgetoverview ? this.state.rtgetoverview.newStoredValueMoney : '--'} prefix='￥' /><div className={styles.compareNum}>{this.getYesterdayCompare(BeforeStoredValueMoneyCount, NewStoredValueMoney)}</div></>} key="5" />
                    </Tabs>
                  </div>
                </Spin>
              </div>
              <div className={styles.H16} />
              {/* 三个图表 */}
              <div className={styles.AllCharts}>
                {/* 新增会员 */}
                <div className={styles.NewMember}>
                  <div className={styles.littleBox}>
                    <span>新增会员</span>
                    <div className={styles.RightTab}>
                      <Radio.Group defaultValue="1" onChange={(e) => { this.getnewcustomer(e.target.value); }}>
                        <Radio.Button value="1">昨日</Radio.Button>
                        <Radio.Button value="7">近7天</Radio.Button>
                        <Radio.Button value="15">近15天</Radio.Button>
                        <Radio.Button value="30">近30天</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                  <div className={styles.NewMemberChart}>
                    <Spin spinning={this.state.loadingnewcustomer} tip="Loading...">
                      <AddMember days={this.state.rtgetnewcustomer} />
                    </Spin>

                  </div>
                </div>
                <div className={styles.NewMember}>
                  <div className={styles.littleBox}>
                    <span>销售额渠道占比TOP5</span>
                    <div className={styles.RightTab}>
                      <Radio.Group defaultValue="1" onChange={(e) => { this.getsalevolume(e.target.value); }}>
                        <Radio.Button value="1">昨日</Radio.Button>
                        <Radio.Button value="7">近7天</Radio.Button>
                        <Radio.Button value="15">近15天</Radio.Button>
                        <Radio.Button value="30">近30天</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                  <div className={styles.NewMemberChart}>
                    <Spin spinning={this.state.loadingsalevolume} tip="Loading...">
                      <Sale days={this.state.rtgetsalevolume} />
                    </Spin>
                  </div>
                </div>

                <div className={styles.NewMember}>
                  <div className={styles.littleBox}>
                    <span>门店业绩排行Top6</span>
                    <div className={styles.RightTab}>
                    <Radio.Group defaultValue="1" onChange={(e) => { this.getamountanalysis(e.target.value); }}  >
                        <Radio.Button value="1">昨日</Radio.Button>
                        <Radio.Button value="2">近7天</Radio.Button>
                        <Radio.Button value="3">近15天</Radio.Button>
                        <Radio.Button value="4">近30天</Radio.Button>
                      </Radio.Group> 
                      {/* <Radio.Group defaultValue="1" onChange={(e) => { this.getshopachievement(e.target.value); }}  >
                        <Radio.Button value="1">昨日</Radio.Button>
                        <Radio.Button value="7">近7天</Radio.Button>
                        <Radio.Button value="15">近15天</Radio.Button>
                        <Radio.Button value="30">近30天</Radio.Button>
                      </Radio.Group> */}
                    </div>
                  </div>
                  <Spin spinning={this.state.loadingshopachievement} tip="加载中...">
                    <div className={styles.storePM}>

                      {htmlshopw != null ? htmlshopw : <div>
                        <div style={{ width: '100%', height: '200px', textAlign: 'center', lineHeight: '200px',display:'flex',alignItems:'center',justifyContent:'center' }}>
                          {/* <img style={{ display: "block", textAlign: "center", position: "relative", top: "57px", left: "50%", marginLeft: "-19px" }} src='http://wevip.image.alimmdn.com/qqd/icon_qqdNote.png' />
                          暂无数据 */}
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div></div>}

                    </div>
                  </Spin>
                </div>

              </div>
              <div className={styles.H16} />
              {/* 常用功能 */}
              <div className={styles.CommonFun}>
                <div className={styles.littleBox}>
                  <span>常用功能</span>
                  <a
                    onClick={() => {
                      this.setState(
                        () => {
                          this.CreateRef.show();
                        }
                      );
                    }}
                  >自定义设置
                  </a>
                </div>  <Spin spinning={this.state.loadingmyArray} tip="加载中...">
                  <div className={styles.CommonFunCon}>

                    <Tabs style={{ width: '100%' }}>

                      {this.state.myArray ? this.state.myArray.map((e) => {
                        return (
                          <TabPane
                            tab={
                              <>
                                <div className={styles.comFunList}>
                                  <a href={`${getUrlByCode(e.subCode)}${e.path}`}>
                                    <img src={e.picurl} alt='' className={styles.ComIcon} />
                                    <span className={styles.Comspan}>{e.name}</span>
                                  </a>
                                </div>
                              </>
                            }
                            key={e.menuCode}
                          />
                        )
                      }) : <TabPane
                          tab={
                            <>
                              <div className={styles.comFunList}>
                                <a  >
                                  <span className={styles.Comspan}>无数据</span>
                                </a>
                              </div>
                            </>
                          }
                          key={1}
                        />}



                    </Tabs>

                  </div> </Spin>
              </div>
              <div className={styles.H16} />
              {/* 营销活动 */}
              <div className={styles.marketAct}>
                <div className={styles.littleBox}>
                  <span>营销活动</span>
                </div>
                <div className={styles.marketActCon}>
                  <a>
                    <div className={styles.marketActConList} onClick={() => { window.open(`${getUrlByCode('10000102')}/marketing/customermarketing/sencemarketing/addsence?senceType=0`, '_self'); }}>
                      <img alt='' src='http://wevip.image.alimmdn.com/qqd/market-icon1.png' className={styles.marketIcon} />
                      <div className={styles.marketRight} >
                        <span>入会有礼</span>
                        <i>多重好礼引导客户入会</i>
                      </div>
                    </div>
                  </a>
                  <a>
                    <div className={styles.marketActConList} onClick={() => { window.open(`${getUrlByCode('10000102')}/marketing/customermarketing/sencemarketing/addsence?senceType=1`, '_self'); }}>
                      <img alt='' src='http://wevip.image.alimmdn.com/qqd/market-icon2.png' className={styles.marketIcon} />
                      <div className={styles.marketRight} >
                        <span>升级有礼</span>
                        <i>等级升级即赠,增强客户粘性</i>
                      </div>
                    </div>
                  </a>
                  <a>
                    <div className={styles.marketActConList} onClick={() => { window.open(`${getUrlByCode('10000102')}/marketing/customermarketing/sencemarketing/addsence?senceType=2`, '_self'); }}>
                      <img alt='' src='http://wevip.image.alimmdn.com/qqd/market-icon3.png' className={styles.marketIcon} />
                      <div className={styles.marketRight}>
                        <span>生日营销</span>
                        <i>生日关怀,定向激活客户</i>
                      </div>
                    </div>
                  </a>
                  <a>
                    <div className={styles.marketActConList} onClick={() => { window.open(`${getUrlByCode('10000102')}/marketing/customermarketing/sencemarketing/addsence?senceType=3`, '_self'); }}>
                      <img alt='' src='http://wevip.image.alimmdn.com/qqd/market-icon4.png' className={styles.marketIcon} />
                      <div className={styles.marketRight} >
                        <span>节日营销</span>
                        <i>烘托节日气氛,回馈客户</i>
                      </div>
                    </div>
                  </a>

                  <a>
                    <div className={styles.marketActConList} onClick={() => { window.open(`${getUrlByCode('10000101')}/marketing/activity/sign`, '_self'); }}>
                      <img alt='' src='http://wevip.image.alimmdn.com/qqd/market-icon5.png' className={styles.marketIcon} />
                      <div className={styles.marketRight} >
                        <span>签到</span>
                        <i>签到享好礼,提升客户活跃度</i>
                      </div>
                    </div>
                  </a>

                  <a>
                    <div className={styles.marketActConList} onClick={() => { window.open(`${getUrlByCode('10000101')}/marketing/activity/turnplate/turnplatelist`, '_self'); }}>
                      <img alt='' src='http://wevip.image.alimmdn.com/qqd/market-icon6.png' className={styles.marketIcon} />
                      <div className={styles.marketRight} >
                        <span>抽奖</span>
                        <i>多重奖品抽取,增强客户粘性</i>
                      </div>
                    </div>
                  </a>


                </div>
              </div>
            </Col>
            <Col span={5} className={styles.IndexPageBoxRight}>
              {/* 微信未绑定情况 */}
              <Spin spinning={this.state.loadingpublic} tip="加载中...">
              {this.state.publicSignal ?
                <div className={styles.wxHaveData}>
                  <div className={styles.littleBox}>
                    <span>店铺绑定</span>
                  </div>
                  <div className={styles.wxHaveDataCon}>
                    <div className={styles.wxItem}>
                      <span style={{ marginRight: 10, height: 30, lineHeight: '30px' }}>小程序</span>
                      <div className={styles.wxleft} style={{ padding: ' 0 10px' }}>
                        <span className={styles.littlebox}>未绑定</span>
                        <img src="http://wevip.image.alimmdn.com/qqd/demo.jpg" alt='' className={`${styles.littleImg} ${styles.bighover}`} />
                        <img src="http://wevip.image.alimmdn.com/qqd/demo.jpg" alt='' className={styles.bigImg} />
                      </div>
                    </div>
                    <div className={styles.wxItem}>
                      <span style={{ marginRight: 10, height: 30, lineHeight: '30px' }}>公众号</span>
                      <div>
                        <div className={styles.wxleft} style={{ padding: '0 10px 0 0' }}>
                          {/* <span className={styles.littlebox}>某某某店铺啦啦啦</span> */}
                          

                          {this.state.publicSignal[0]? 
                          
                          <Select defaultValue={this.state.publicSignal[0].appName} style={{ width: '170px' }}>
                            {
                            this.state.publicSignal ?this.state.publicSignal.map((e,index)=>{
                              if(e.authorizeState=="authorized")
                              {
                                return(
                                  <Option key={index} value={e.appName}>{e.appName}</Option>
                                )       
                              }
                            }):null
                            }
                           </Select>  :""} 
                          <img src="http://wevip.image.alimmdn.com/qqd/demo.jpg" alt='' className={styles.littleImg} />
                        </div>
                        <a className={styles.addMore} onClick={() => { window.open(`${getUrlByCode('10000101')}/place/officialaccount/accountmanage`, '_self');}}>添加更多</a>
                      </div>
                    </div>
                  </div>
                </div>
                :
                <div className={styles.wxNoData}>
                  <img src="http://wevip.image.alimmdn.com/qqd/wx-icon.png" alt="" className={styles.wxImgBox} />
                  <div className={styles.wxText}>店铺还没有绑定小程序或公众号 !</div>
                  <div className={styles.wxBtn}>
                    <a>绑定小程序</a>
                    <a onClick={() => { window.open(`${getUrlByCode('10000101')}/place/officialaccount/accountmanage`, '_self');}}>绑定公众号</a>
                  </div>
                </div>
              }
              </Spin>
              <div className={styles.H16} />
              {/* 绑定后 */}

              {/* <div className={styles.H16} /> */}
              {/* app */}
              <div className={styles.appBox}>
               
               <Popover content={content} title="扫码下载导购APP">
                    <img src="http://wevip.image.alimmdn.com/qqd/app-icon.png" alt="" className={styles.appIcon} /> 
                  </Popover>

                 
                <div className={styles.appText}>
                  <span>导购助手APP客户端</span>
                  <i>智能导购，全面提升导购积极性</i>
                </div>
              </div>
              <div className={styles.H16} />
              {/* 客服中心 */}
              <div className={styles.kfCenter}>
                <div className={styles.littleBox}>
                  <span>联系我们</span>
                </div>
                <div className={styles.kfCon}>
                  <div className={styles.kfConList}>
                    <img src="http://wevip.image.alimmdn.com/qqd/kefu-icon1.png" alt="" className={styles.kficon} />
                    <span>工作时间 :  周一至周五 9:00 -21:00</span>
                  </div>
                  <div className={styles.kfConList}>
                    <img src="http://wevip.image.alimmdn.com/qqd/kefu-icon2.png" alt="" className={styles.kficon} />
                    <span>客服热线 :  400-900-5128</span>
                  </div>
                  <div className={styles.kfConList}>
                    <img src="http://wevip.image.alimmdn.com/qqd/kefu-icon3.png" alt="" className={styles.kficon} />
                    <span>客服 QQ :  3488283594</span>
                  </div>
                </div>
              </div>
              <div className={styles.H16} />
              {/* 帮助中心 */}
              <div className={styles.helpCenter}>
                <div className={styles.littleBox}>
                  <span>帮助中心</span>
                  {/* <a>更多</a> */}
                </div>
                <div className={styles.helpCon}>
                  {/* <ul>
                    <li><a href=''>多卖全渠道新手学习手？</a><span className={styles.newicon}>NEW</span></li>
                    <li><a href=''>如何申请绑定微信公众号？</a></li>
                    <li><a href=''>如何快速的导入商品？</a></li>
                    <li><a href=''>如何申请绑定微信公众号？</a></li>
                    <li><a href=''>如何快速的导入商品？</a></li>
                  </ul> */}
                  <div className={styles.helpConText}>敬请期待</div>
                </div>
              </div>
              <div className={styles.H16} />
              {/* 产品动态 */}
              <Spin spinning={this.state.loadingmes} tip="加载中...">
              <div className={styles.ProDynamics}>
                <div className={styles.ProCenter}>
                  <div className={styles.littleBox}>
                    <span>产品动态</span>
                    <a onClick={()=>{router.push(`/system/systemnews/systemnewscon`)}}>更多</a>
                  </div>
                  <div className={styles.kfCon}>
                    <ul>
                      {
                        this.state.sysmessage.map((e,index)=>{
                          return(
                        <li key={index}><a onClick={()=>{router.push(`/system/systemnews/newsdetails?tid=${e.id}`)}}>{e.messageName}</a>{e.isRead?"":<span className={styles.newicon}>NEW</span>}</li>
                          )
                        })
                      }
                      {/* <li><a href=''>多卖全渠道新手学习手？</a><span className={styles.newicon}>NEW</span></li>
                      <li><a href=''>如何申请绑定微信公众号？</a></li>
                      <li><a href=''>如何快速的导入商品？</a></li>
                      <li><a href=''>如何申请绑定微信公众号？</a></li>
                      <li><a href=''>如何快速的导入商品？</a></li> */}
                    </ul>
                  </div>
                </div>
              </div>
              </Spin>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default index;
