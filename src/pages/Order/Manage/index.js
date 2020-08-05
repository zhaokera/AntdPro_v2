import React, { Component } from 'react';
import { Tabs, Button, Row, Col, Select, Input, InputNumber, Table, Form, DatePicker } from 'antd';
import { connect } from 'dva';
import request from '@/utils/request';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';
import Channel from '@/components/CommonModal/Channellist';
import { SelectChannel } from '@/components/CommonModal';
const { TabPane } = Tabs;
const InputGroup = Input.Group;
function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = decodeURI(window.location.search)
    .substr(1)
    .match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

@Form.create()
class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      TradeStatus: null,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      expandedRowKeys: [],
      selectChannelshow:true,
      selectChannelValue:[],

    }
  }

  componentDidMount() {
    let tid = getUrlParam("tid");
    debugger;
    if (tid != null&&tid!=undefined) {
      this.querytradeCus(tid);
    }
    else
    {
      this.props.form.setFieldsValue({ pro_type: "商品名称" })
      this.init(1, this.state.pageSize, this.state.TradeStatus);
    }

  }

  // 初始化订单
  init = (currentPage, pageSize, TradeStatus, OnPlatform, StartFinishTime, EndFinishTime, Tid, ItemTitle, BuyerInfo, PayType, PostType) => {
    this.setState({ loading: true, expandedRowKeys: [] });
    let sdata = {
      // ItemTitle:'1',
      TradeStatus, OnPlatform, StartFinishTime, EndFinishTime, Tid, ItemTitle, BuyerInfo, PayType, PostType,
      currentPage: currentPage,
      pageSize: pageSize
    };
    request('g1/crm.fulltrade.centerlist.get', {
      method: 'POST',
      body: { ...sdata },
    }).then(rt => {
      // console.log(rt);
      if (rt) {
        this.setState({
          data: rt.data, currentPage: rt.currentPage,
          pageSize: rt.pageSize, totalCount: rt.totalCount,
          TradeStatus, OnPlatform, StartFinishTime, EndFinishTime, Tid, ItemTitle, BuyerInfo, PayType, PostType, loading: false
        });
      }

    });
  }

  // 订单状态查询
  queryTradeStatus = (activeKey) => {
    this.init(1, this.state.pageSize, activeKey)
  }

  
  onCancel=()=>
{
  this.props.form.setFieldsValue({ BuyerInfo:'' });
  this.props.form.setFieldsValue({ time:null });
  this.props.form.setFieldsValue({ Tid:'' });
  this.props.form.setFieldsValue({ ItemTitle: '' });
  this.props.form.setFieldsValue({ state: null });
  this.props.form.setFieldsValue({ BuyerInfo: '' });


  this.setState({selectChannelshow:false},()=>{
    this.setState({
     selectChannelshow:true,
     selectChannelValue:[]

    })
   });
}


  // 客户画像跳转查询
  querytradeCus = (tid) => {
    const me = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      let MinModifyTime = null;
      let MaxModifyTime = null;
      if (values.time) {
        if (values.time.length > 0) {
          MinModifyTime = moment().format(values.time[0].format("YYYY-MM-DD") + " 00:00:00");
          MaxModifyTime = moment().format(values.time[1].format("YYYY-MM-DD") + " 23:59:59");
        }
      }
      this.init(1, this.state.pageSize, values.state, me.state.selectChannelValue[0]==undefined?"":(me.state.selectChannelValue[1]==undefined?me.state.selectChannelValue[0].value:me.state.selectChannelValue[1].value), MinModifyTime, MaxModifyTime, (tid ? tid.trim() : null), (values.ItemTitle ? values.ItemTitle.trim() : null), (values.BuyerInfo ? values.BuyerInfo.trim() : null), values.PayType, values.PostType)
    })
  }


  // 查询
  querytrade = () => {
    const me = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      let MinModifyTime = null;
      let MaxModifyTime = null;
      if (values.time) {
        if (values.time.length > 0) {
          MinModifyTime = moment().format(values.time[0].format("YYYY-MM-DD") + " 00:00:00");
          MaxModifyTime = moment().format(values.time[1].format("YYYY-MM-DD") + " 23:59:59");
        }
      }
      this.init(1, this.state.pageSize, values.state, me.state.selectChannelValue[0]==undefined?"":(me.state.selectChannelValue[1]==undefined?me.state.selectChannelValue[0].value:me.state.selectChannelValue[1].value), MinModifyTime, MaxModifyTime, (values.Tid ? values.Tid.trim() : null), (values.ItemTitle ? values.ItemTitle.trim() : null), (values.BuyerInfo ? values.BuyerInfo.trim() : null), values.PayType, values.PostType)
    })
  }

  render() {
    const me = this;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemlayout = {
      labelCol: {
        xxl: 5,
        xl: 5,
        sm: 6
      },
      wrapperCol: {
        xxl: 18,
        xl: 18,
        sm: 17
      },
      colon: false
    }
    const { data } = this.state;
    const { TradeStatus } = this.state;
    const { OnPlatform } = this.state;
    const { StartFinishTime } = this.state;
    const { EndFinishTime } = this.state;
    const { Tid } = this.state;
    const { ItemTitle } = this.state;
    const { BuyerInfo } = this.state;
    const { PayType } = this.state;
    const { PostType } = this.state;

    const renderContentOne = (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      if (row.level === 0) {
        obj.props.colSpan = 0;
      }
      return obj;
    };

    const renderContentContent = (value, row, index) => {
      const obj = {
        children: (
          <div className={styles.BuyerCell}>
            <span className={styles.BuyerSpan}>{row.receivername}</span>
            <span className={styles.BuyerSpan}>{row.receivermobile}</span>
            <span className={styles.BuyerSpan}>
              <Ellipsis text={row.receiveraddress} tooltip length={12} />
            </span>
          </div>
        ),
        props: { rowSpan: row.column },
      };
      if (row.level === 0) {
        obj.props.colSpan = 0;
      }
      if (index > 0) {
        obj.props.rowSpan = 0;
      }
      return obj;
    };

    const renderContentContent2 = (value, row, index) => {
      const obj = {
        children: (
          <div className={styles.OrderCell}>
            <span className={styles.OrderState1}>{row.tradestatus}</span>

          </div>
        ),
        props: { rowSpan: row.column },
      };
      if (row.level === 0) {
        obj.props.colSpan = 0;
      }
      if (index > 0) {
        obj.props.rowSpan = 0;
      }
      return obj;
    };

    const columns = [
      {
        title: '商品信息',
        dataIndex: 'skuName',
        key: 'skuName',
        width: '20%',
        render: (text, row) => {
          if (row.level === 0) { // 0是父级行
            return {
              children: (
                <div className={styles.Orderhead}>
                  <div className={styles.Orderheadfl}>
                    <span>订单号：{row.tid}</span>
                    <span>创建时间: {row.createtime}</span>
                    {/* <span>优惠金额: ￥{row.reducefull?row.reducefull:'0'}</span> */}
                    <font>订单来源: {row.onplatform ? <i className={`${styles.taobaoIcon} ${styles.iconCommon}`}>{row.onplatform}</i> : null}{row.sourcetrade}</font>
                    {/* <i className={`${styles.tmallIcon} ${styles.iconCommon}`}>天猫</i> */}
                    {/* <i className={`${styles.snIcon} ${styles.iconCommon}`}>苏宁</i> */}
                    {/* <i className={`${styles.youzanIcon} ${styles.iconCommon}`}>有赞</i> */}
                    {/* <i className={`${styles.weimengIcon} ${styles.iconCommon}`}>微盟</i> */}
                  </div>
                  <div className={styles.Orderheadfr}>
                    {/* <a href="javascript:;" onClick={() => { router.push('/Order/order/manage/ordredetail') }}>查看详情</a> */}
                  </div>
                </div>
              ),
              props: {
                colSpan: 7,
              },
            };
          }
          return {
            children: (
              <div className={styles.FistCell}>
                <div className={styles.Left}>
                  <img src={row.pictureurl} alt="商品主图" />
                </div>
                <div className={styles.Right}>
                  <a href="#" className={styles.PicName}>
                    <Ellipsis text={row.title} tooltip length={12} />
                  </a>
                  <div className={styles.Spec}><Ellipsis text={row.skuname} tooltip length={8} />  ￥{row.price} {row.count > 0 ? '*' + row.count : null}</div>
                  {/* <a href="" className={styles.PicName}>
                    {row.price}
                  </a>
                  <div className={styles.Spec}>{row.count}</div> */}
                </div>
              </div>
            ),
          }

        }
      }, {
        title: '买家信息',
        dataIndex: 'skuCode',
        key: 'skuCode',
        // width: '10%',
        render: renderContentContent,
      }, {
        title: '配送及支付方式',
        dataIndex: 'type',
        key: 'type',
        width: '20%',
        render: (value, row, index) => {
          const obj = {
            children: (
              value ? (
                <div>
                  <div>{value.pay}</div>
                  <div>{value.distribution}</div>
                </div>
              ) : ''
            ),
            props: { rowSpan: row.column },
          };
          if (row.level === 0) {
            obj.props.colSpan = 0;
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      }, {
        title: '订单状态',
        dataIndex: 'picUrl',
        width: '20%',
        key: 'picUrl',
        render: renderContentContent2,
      }, {
        title: '实收款',
        dataIndex: 'price',
        width: '20%',
        key: 'price',
        render: (value, row, index) => {
          const obj = {
            children: (
              <div className={styles.OrderCell}>&yen;{row.amountpay}<span style={{ color: '#686B78' }}>(含快递&yen;{row.postage})</span></div>
            ),
            props: { rowSpan: row.column },
          };
          if (row.level === 0) {
            obj.props.colSpan = 0;
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      }
    ]

    return (
      <PageHeaderWrapper title='订单管理'>
        <div className={styles.Manage}>
          <div className={styles.bg}>
            <Form {...formItemlayout}>
              <Row>
              <Col span={8}>
              <Form.Item label='渠道'>
                {
                  this.state.selectChannelshow && 
                    <SelectChannel
                   
                    onChange={(values) => {
                      me.setState({selectChannelValue:values},()=>{
                        // me.getCustomerDetailList();
                      });
                    }}
                   />                 
                }
              </Form.Item>
            </Col>
                <Col span={8}>
                  <Form.Item label='成交时间'>
                    {
                      getFieldDecorator('time')(
                        <DatePicker.RangePicker style={{ width: "100%" }} />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='订单编号'>
                    {
                      getFieldDecorator('Tid')(
                        <Input allowClear placeholder='请输入订单编号' />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='商品名称'>
                    <InputGroup compact>
                      {/* {
                        getFieldDecorator('pro_type', {
                          initialValue: "商品名称"
                        })(
                          <Select placeholder="商品名称" style={{ width: '100px' }}>
                            <Select.Option value="商品名称">商品名称</Select.Option>
                            <Select.Option value="商品ID">商品编码</Select.Option>
                          </Select>
                        )
                      } */}
                      {
                        getFieldDecorator('ItemTitle')(
                          // <Input allowClear placeholder={getFieldValue('pro_type') === '商品名称' ? '请输入商品名称' : '请输入商品编码'} />
                          <Input allowClear placeholder={'商品编码或者商品名称'} />
                        )
                      }
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='订单状态'>
                    {
                      getFieldDecorator('state', {
                        initialValue: null
                      })(
                        <Select>
                          <Select.Option value={null}>全部</Select.Option>
                          <Select.Option value={0}>待付款</Select.Option>
                          <Select.Option value={40}>待发货</Select.Option>
                          <Select.Option value={50}>已发货</Select.Option>
                          <Select.Option value={70}>交易成功</Select.Option>
                          <Select.Option value={10}>交易关闭</Select.Option>

                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='关键词'>
                    <Input.Group compact>
                      {/* {
                        getFieldDecorator('BuyerInfoType', {
                          initialValue: 0
                        })(
                          <Select style={{ width: '100px' }}>
                            <Select.Option value={0}>买家昵称</Select.Option>
                            <Select.Option value={1}>姓名</Select.Option>
                            <Select.Option value={2}>电话</Select.Option>
                          </Select>className={styles.w_auto}
                        )
                      } */}
                      {
                        getFieldDecorator('BuyerInfo')(
                          <Input allowClear placeholder={'姓名,买家昵称 或者手机号'} />
                        )
                      }
                    </Input.Group>

                  </Form.Item>
                </Col>
                {/* <Col span={8}>
                  <Form.Item label='支付方式'>
                    {
                      getFieldDecorator('PayType', {
                        initialValue: null
                      })(
                        <Select allowClear>
                          <Select.Option value={null}>全部</Select.Option>
                          <Select.Option value="0">支付宝</Select.Option>
                          <Select.Option value="10">微信</Select.Option>
                          <Select.Option value="20">现金</Select.Option>
                          <Select.Option value="30">银行卡</Select.Option>
                          <Select.Option value="40">余额</Select.Option>
                          <Select.Option value="50">无需支付</Select.Option>
                        </Select>
                        // 支付类型:0 支付宝,10 微信,20 现金,30 银行卡,40 余额,50 无需支付
                      )
                    }
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='配送方式'>
                    {
                      getFieldDecorator('PostType', {
                        initialValue: null
                      })(
                        <Select allowClear>
                          <Select.Option value={null}>全部</Select.Option>
                          <Select.Option value="0">自提</Select.Option>
                          <Select.Option value="10">快递配送</Select.Option>
                          <Select.Option value="20">无需物流</Select.Option>
                        </Select>
                        //配送方式:0 自提,10 快递配送,20 无需物流'
                      )
                    }
                  </Form.Item>
                </Col> */}
                <Col span={24}>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    <Row type='flex' gutter={8} justify='center'>
                      <Col><Button type='primary' onClick={this.querytrade} >查询</Button></Col>
                      <Col><Button onClick={() => this.onCancel()}>重置</Button></Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>

            </Form>

          </div>
          <div className={styles.bg}>
            {/* <Tabs onChange={this.queryTradeStatus} >
              <TabPane tab="待付款" key={0} />
              <TabPane tab="待发货" key={40} />
              <TabPane tab="已发货" key={50} />
              <TabPane tab="退款中" key={90} />
              <TabPane tab="交易成功" key={70} />
              <TabPane tab="交易关闭" key={10} />
            </Tabs> */}
            {/* 订单状态，0 待付款,10 交易关闭,20 待付尾款,30 已退款,40 待发货,50 待收货,60 待评价,70 交易成功,80 已删除,90 售后中,100 售后完成'; */}
            <Table
              rowKey={r => r.tid}
              loading={this.state.loading}
              columns={columns}
              dataSource={this.state.data}
              expandedRowKeys={this.state.expandedRowKeys}
              onExpandedRowsChange={(expandedRows) => { this.setState({ expandedRowKeys: expandedRows }) }}
              //expandRowByClick={true}
              onChange={(pagination, filters, sorter) => { this.init(pagination.current, pagination.pageSize, TradeStatus, me.state.selectChannelValue[0]==undefined?"":(me.state.selectChannelValue[1]==undefined?me.state.selectChannelValue[0].value:me.state.selectChannelValue[1].value), StartFinishTime, EndFinishTime, Tid, ItemTitle, BuyerInfo, PayType, PostType) }}
              pagination={{
                size: 'small', total: this.state.totalCount,
                pageSize: this.state.pageSize,
                current: this.state.currentPage,
                defaultCurrent: 1,
                showQuickJumper: true,
                showSizeChanger: true,
                // hideOnSinglePage:true,
                showTotal: total => `共 ${this.state.totalCount}条记录`
                , pageSizeOptions: ['10', '20', '50', '100'],
              }}
            />
          </div>
        </div>

      </PageHeaderWrapper>
    )
  }
}

export default Index;