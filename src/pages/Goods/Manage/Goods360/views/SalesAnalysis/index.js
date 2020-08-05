import moment from 'moment';
import React, { Component } from 'react';
import { Row, Col, Select, Radio, Table, Tabs, Icon, DatePicker, Button, message } from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import {
  Chart, Geom, Axis, Coord, Label, Legend, Guide, Tooltip,
} from 'bizcharts';
import SelectChannelNew from '@/components/CommonModal/SelectChannelNew';
import DataSet from "@antv/data-set";
import styles from './index.less';
import request from '@/utils/request';
import router from 'umi/router';
import Ellipsis from '@/components/Ellipsis';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
class SalesAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectChannelValue1: [],// 选择渠道店铺组件返回值
      selectChannelValue2: [],// 选择渠道店铺组件返回值
      selectDay1: 7,
      selectDay2: 7,
      saleAnalysis: {},
      skuAnalysis: {},
      time: null,

      saleTable: [],//核销概况table
      skuTable: [], // sku销售详情
      skuChart: [], //sku饼图
      clickType: "totalCartCount"//核心概况点击
    }
  }

  handleChangeTab = (item) => {
    if (item == "1") {
      this.setState({ clickType: "totalCartCount" });
    } else if (item == "2") {
      this.setState({ clickType: "totalCollectCount" });
    } else if (item == "3") {
      this.setState({ clickType: "totalTradeNum" });
    } else if (item == "4") {
      this.setState({ clickType: "totalTradeAmount" });
    } else if (item == "5") {
      this.setState({ clickType: "totalBuyerCount" });
    } else if (item == "6") {
      this.setState({ clickType: "totalTradeCount" });
    } else {
      this.setState({ clickType: "totalCartCount" });
    }
  }
  componentDidMount() {
    this.GetSaleAnalysis();
    this.GetSkuAnalysis();
  }


  // 商品销售分析
  GetSaleAnalysis = () => {
    const me = this;

    let queryParams = {
      ChannelId: "",
      ShopId: "",
      OuterCode: this.props.GoodId,
      Time: "",
    };

    if (me.state.selectDay1 !== 0) {
      queryParams.Day = me.state.selectDay1;
    }
    if (me.state.selectDay1 == -1 && me.state.time == null) {
      message.error("请输入自定义时间范围");
      return;
    }
    if (me.state.time != null) {
      queryParams.Time = me.state.time[0].format('YYYY-MM-DD 00:00:00') + "&" + me.state.time[1].format('YYYY-MM-DD 23:59:59');
    }

    if (me.state.selectChannelValue1.length == 1) {
      queryParams.ChannelId = me.state.selectChannelValue1[0].value;
    }
    if (me.state.selectChannelValue1.length == 2) {
      queryParams.ChannelId = me.state.selectChannelValue1[0].platform;
      queryParams.ShopId = me.state.selectChannelValue1[1].value;
    }



    // 直接调用request
    request('g1/crm.analysis.product.getsaleanalysis', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // data根据自己api的规则处理
        console.log(response);
        if (response) {
          me.setState({
            saleAnalysis: response.saleTable,
            saleTable: response.saleTable.analysisList
          });
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }

  // 商品SKU销售分析
  GetSkuAnalysis = () => {
    const me = this;
    let queryParams = {
      ChannelId: "",
      ShopId: "",
      OuterCode: this.props.GoodId,
    };

    if (me.state.selectDay2 !== 0) {
      queryParams.Day = me.state.selectDay2;
    }

    if (me.state.selectChannelValue2.length == 1) {
      queryParams.ChannelId = me.state.selectChannelValue2[0].value;
    }
    if (me.state.selectChannelValue2.length == 2) {
      queryParams.ChannelId = me.state.selectChannelValue2[0].platform;
      queryParams.ShopId = me.state.selectChannelValue2[1].value;
    }


    // 直接调用request
    request('g1/crm.analysis.product.getskuanalysis', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // data根据自己api的规则处理
        console.log(response);
        if (response) {
          me.setState({
            skuAnalysis: response.skuTable,
            skuTable: response.skuTable.analysisList
          }, () => me.handleSKUSelectChange(1));
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }

  // sku饼图切换
  handleSKUSelectChange = (type) => {
    const me = this;
    let skuChart = [];
    if (me.state.skuTable) {

      me.state.skuTable.forEach(v => {

        // eslint-disable-next-line default-case
        switch (type) {
          case 1:
            skuChart.push({
              item: v.skuName ? v.skuName : v.skuOuterCode,
              count: Number(v.tradeNum)
            }); break;
          case 2:
            skuChart.push({
              item: v.skuName ? v.skuName : v.skuOuterCode,
              count: Number(v.tradeAmount)
            }); break;
          case 3:
            skuChart.push({
              item: v.skuName ? v.skuName : v.skuOuterCode,
              count: Number(v.buyerCount)
            }); break;
        }

      })
    }
    me.setState({ skuChart: skuChart });

  }

  disabledDate = (current) => {
    // Can not select days before today and today
    return current > moment().subtract(1, 'days').endOf('day');
  }



  render() {
    const me = this;
    let platform = "";
    if (me.state.selectChannelValue1.length > 0) {
      platform = me.state.selectChannelValue1[0].value;// 控制只有云店 有加购 和收藏数据
    }
    return (
      <div className={styles.SalesAnalysis}>
        <div className={styles.header}>
          <div className='Mb-basewidth2'><b>核心概况</b> </div>

          <Row type='flex' justify='space-between' className='Mb-basewidth2'>
            <Col style={{ flex: 1 }}>
              <Row type='flex' align='middle' gutter={8}>
                <Col>选择渠道</Col>
                <Col xxl={6} xl={8} lg={9}>
                  <SelectChannelNew
                    onChange={(values) => {
                      me.setState({ selectChannelValue1: values }, () => {
                        me.GetSaleAnalysis();
                      });
                      console.log("选择渠道返回值", values)
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Radio.Group onChange={e => me.setState({ selectDay1: e.target.value, time: null }, () => {
                if (e.target.value != '-1') {
                  me.GetSaleAnalysis();
                }

              })} value={me.state.selectDay1}>
                <Radio.Button value={7}>近7天</Radio.Button>
                <Radio.Button value={15}>近15天</Radio.Button>
                <Radio.Button value={30}>近30天</Radio.Button>
                {/* <Radio.Button value={0}>全部</Radio.Button> */}
                <Radio.Button value={-1}>自定义</Radio.Button>
              </Radio.Group>
              &nbsp;&nbsp;
              {me.state.selectDay1 == '-1' &&
                <RangePicker
                  style={{ width: '50%' }}
                  disabled={me.state.isDisabled}

                  disabledDate={this.disabledDate}
                  value={me.state.time}
                  onChange={(values) => {
                    me.setState({ time: values }, () => {
                      if (values.length > 0) {
                        // me.GetSaleAnalysis();
                      }

                    });
                    console.log("选择时间返回值", values)
                  }} />}
            </Col>
            <Button type='primary' onClick={() => { me.GetSaleAnalysis(); }} >确定</Button>
          </Row>
          <Tabs onChange={this.handleChangeTab}>
            {(platform == "" || platform == "yd") &&
              <TabPane
                tab={
                  <>
                    <div className={styles.title}>
                      <AntdTooltip title="客户加购商品数量"> 加购数 <Icon className={styles.icon} type="question-circle" /> </AntdTooltip>
                    </div>
                    <div className={styles.num}>{me.state.saleAnalysis.totalCartCount ? me.state.saleAnalysis.totalCartCount : 0}</div>
                  </>
                }
                key="1"
              />
            }
            {(platform == "" || platform == "yd") &&
              <TabPane
                tab={
                  <>
                    <div className={styles.title} >
                      <AntdTooltip title="客户收藏商品数量"> 收藏数 <Icon className={styles.icon} type="question-circle" /> </AntdTooltip>
                    </div>
                    <div className={styles.num}>{me.state.saleAnalysis.totalCollectCount ? me.state.saleAnalysis.totalCollectCount : 0}</div>
                  </>
                }
                key="2"
              />
            }
            <TabPane
              tab={
                <>
                  <div className={styles.title}>
                    <AntdTooltip title="商品销售数量"> 商品销量 <Icon className={styles.icon} type="question-circle" /> </AntdTooltip>
                  </div>
                  <div className={styles.num}>{me.state.saleAnalysis.totalTradeNum ? me.state.saleAnalysis.totalTradeNum : 0}</div>
                </>
              }
              key="3"
            />
            <TabPane
              tab={
                <>
                  <div className={styles.title}>
                    <AntdTooltip title="商品交易金额"> 商品交易额 <Icon className={styles.icon} type="question-circle" /> </AntdTooltip>
                  </div>
                  <div className={styles.num}>{me.state.saleAnalysis.totalTradeAmount ? me.state.saleAnalysis.totalTradeAmount : 0}</div>
                </>
              }
              key="4"
            />
            <TabPane
              tab={
                <>
                  <div className={styles.title}>
                    <AntdTooltip title="购买该商品的买家数量"> 商品买家数 <Icon className={styles.icon} type="question-circle" /> </AntdTooltip>
                  </div>
                  <div className={styles.num}>{me.state.saleAnalysis.totalBuyerCount ? me.state.saleAnalysis.totalBuyerCount : 0}</div>
                </>
              }
              key="5"
            />
            <TabPane
              tab={
                <>
                  <div className={styles.title}>
                    <AntdTooltip title="带有该商品的成交订单数"> 成交订单数 <Icon className={styles.icon} type="question-circle" /> </AntdTooltip>
                  </div>
                  <div className={styles.num}>{me.state.saleAnalysis.totalTradeCount ? me.state.saleAnalysis.totalTradeCount : 0}</div>
                </>
              }
              key="6"
            />

          </Tabs>
          <LineChart data={me.state.saleTable} clicktype={this.state.clickType} />
          <Table
            style={{ marginTop: 16 }}
            dataSource={me.state.saleTable}
            pagination={false}
            scroll={{ x: 1400 }}
          >
            <Table.Column dataIndex='bizDate' title='日期' />
            {(platform == "" || platform == "yd") &&
              <Table.Column dataIndex='cartCount' title='加购数' />}
            {(platform == "" || platform == "yd") &&
              <Table.Column dataIndex='collectCount' title='收藏数' />}
            <Table.Column dataIndex='tradeNum' title='商品销量' />
            <Table.Column dataIndex='tradeAmount' title='商品交易额（元）' />
            <Table.Column dataIndex='buyerCount' title='商品买家数' />
            <Table.Column dataIndex='tradeCount' title='成交订单数' />
          </Table>
        </div>
        <Row type='flex' gutter={16} className={styles.footer}>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type='flex' align='middle' justify="space-between">
                <Col><b>SKU 销售详情</b></Col>
                <Col>
                  <Radio.Group onChange={e => me.setState({ selectDay2: e.target.value }, () => {
                    me.GetSkuAnalysis();
                  })} value={me.state.selectDay2}>
                    <Radio.Button value={7}>近7天</Radio.Button>
                    <Radio.Button value={15}>近15天</Radio.Button>
                    <Radio.Button value={30}>近30天</Radio.Button>
                    <Radio.Button value={0}>全部</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
              <div className='Pl-basewidth2 Pr-basewidth2 Pb-basewidth2'>
                <Row type='flex' align='middle' gutter={8} className='Mb-basewidth2'>
                  <Col>选择渠道</Col>
                  <Col span={12}>
                    <SelectChannelNew
                      onChange={(values) => {
                        me.setState({ selectChannelValue2: values }, () => {
                          me.GetSkuAnalysis();
                        });
                        console.log("选择渠道返回值", values)
                      }}
                    />
                  </Col>
                </Row>
                <Table
                  dataSource={me.state.skuTable}
                  pagination={false}
                >
                  <Table.Column dataIndex='sku' title='SKU信息' render={(text, record) => {
                    let skuInfo = record.skuName + "</br>" + record.skuOuterCode;
                    return <div dangerouslySetInnerHTML={{ __html: skuInfo }}></div>
                  }
                  } />
                  <Table.Column dataIndex='tradeNum' title='销量' width='22%' />
                  <Table.Column dataIndex='tradeAmount' title='交易额' width='22%' />
                  <Table.Column dataIndex='buyerCount' title='买家数' width='22%' />
                </Table>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type='flex' align='middle' justify="space-between">
                <Col><b>SKU 分析</b></Col>
              </Row>
              <div className='Pl-basewidth2 Pr-basewidth2 Pb-basewidth2'>
                <Row type='flex' align='middle' gutter={8} className='Mb-basewidth2'>
                  <Col>
                    <Select onChange={e => me.handleSKUSelectChange(e)} defaultValue={1} className={styles.W120}>
                      <Select.Option value={1}>SKU销量占比</Select.Option>
                      <Select.Option value={2}>SKU交易额占比</Select.Option>
                      <Select.Option value={3}>SKU买家数占比</Select.Option>
                    </Select>
                  </Col>
                </Row>
                <DonutChart data={me.state.skuChart} />
              </div>
            </div>
          </Col>
        </Row>
      </div>

    )
  }
}

export default SalesAnalysis;



class LineChart extends Component {
  render() {
    let type = this.props.clicktype;
    let data = [];
    let name = "";
    if (this.props.data && this.props.data.length > 0) {
      this.props.data.forEach(v => {
        if (type == "totalTradeNum") {
          data.push({
            item: v.bizDate,
            count: Number(v.tradeNum)
          });
          name = "商品销量";
        } else if (type == "totalTradeAmount") {
          data.push({
            item: v.bizDate,
            count: Number(v.tradeAmount)
          });
          name = "商品交易额";
        } else if (type == "totalBuyerCount") {
          data.push({
            item: v.bizDate,
            count: Number(v.buyerCount)
          });
          name = "商品买家数";
        } else if (type == "totalTradeCount") {
          data.push({
            item: v.bizDate,
            count: Number(v.tradeCount)
          });
          name = "成交订单数";
        } else if (type == "totalCartCount") {
          data.push({
            item: v.bizDate,
            count: Number(v.cartCount)
          });
          name = "加购数";
        } else if (type == "totalCollectCount") {
          data.push({
            item: v.bizDate,
            count: Number(v.collectCount)
          });
          name = "收藏数";
        } else {
          data.push({
            item: v.bizDate,
            count: Number(v.cartCount)
          });
          name = "加购数";
        }
      });
    } else {
      data.push({
        item: 1,
        count: 20
      });
    }

    const cols = {
      count: {
        alias: name
      }
    };
    return (
      <Chart height={400} padding={[30, 30, 20, 60]} data={data} scale={cols} forceFit>
        <Legend position='top-right' />
        <Axis name="item" />
        <Axis name="count" />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position="item*count"
        />

      </Chart>
    )
  }
}

class DonutChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    const data = [
      {
        item: "暂无数据",
        count: 1
      },
    ];
    const dv = new DataView();
    dv.source(this.props.data.length > 0 ? this.props.data : data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + "%";
          return val;
        }
      }
    };
    return (
      <div>
        {/* <Ellipsis length={10} tooltip> 啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊 </Ellipsis> */}
        <Chart
          height={360}
          data={dv}
          scale={cols}
          forceFit
          padding={[0, 100, 0, 100]}
        >
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              "item*percent",
              (item, percent) => {
                percent = (percent * 100).toFixed(2) + "%";
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              offset={100}
              htmlTemplate={(text, item, index) => {
                var point = item.point; // 每个弧度对应的点
                let aa = () => {
                  return (
                    <span>测试</span>
                  )
                }
                console.log('text', text)
                console.log('item', item)
                console.log('index', index)
                console.log('point', point)
                var percent = point['percent'];
                let str = point['item']
                percent = (percent * 100).toFixed(2) + '%';

                // return '<span class="title" style="display: inline-block;">'
                // + '<Ellipsis length={10} tooltip>' + str + '</Ellipsis>'  +  percent + '</span>'

                // return aa

                return '<span style="display:flex">' +
                  '<span class="title" style="display: inline-block;white-space: nowrap; text-overflow: ellipsis;overflow: hidden;word-break: break-all; width:50px">'
                  + str + '</span>' + '<span>' + percent + '</span>' + '</span>'
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}
