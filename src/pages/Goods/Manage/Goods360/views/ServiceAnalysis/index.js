import React, { Component } from 'react';
import { Row, Col, Radio, Select, Icon, Card, Table } from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import {
  Chart, Geom, Axis, Coord, Label, Legend, Tooltip,
  Guide,
} from 'bizcharts';
import SelectChannelNew from '@/components/CommonModal/SelectChannelNew';
import DataSet from "@antv/data-set";
import styles from './index.less';
import requests from '@/utils/request';

class ServiceAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectChannelValue1:[],//第一个渠道信息
      selectChannelValue2:[],//第二个渠道信息

      dataSource:[],
      refundAmount:0,
      refundCount:0,
      refundPresent:0,

      pieChartDataSource:[],//饼图数据
      rankingDataSource:[],//排名

      evaluateDataSource:[],//评价分析数据
      badReviewCount: 0, //差评数
      badReviewPresent: 0,//差评率
      badTagCount: 0,//负面标签数
      goodReviewCount: 0,//好评数
      goodReviewPresent: 0,//好评率
      goodTagCount: 0,//正面标签数
      reviewCount: 0,//评价总数
      time:7,   //搜索时间
      time2:7   //评价分析时间搜索
    }
  }
 
componentDidMount(){
  this.init();
  this.getrefundcountanalysis();
  this.getreviewanalysis();
}


selectChannel(){
  this.init();
  this.getrefundcountanalysis();
  // this.getreviewanalysis();
}

// 双折线图
init =()=>{
  let queryData ={
    OuterCode:this.props.GoodId,
    ChannelId:"",
    ShopId:""
  } 

  if(this.state.time !='0'){
    queryData.Day = this.state.time;
  }

  if (this.state.selectChannelValue1.length == 1) {
    queryData.ChannelId = this.state.selectChannelValue1[0].value;
  }
  if (this.state.selectChannelValue1.length == 2) {
    queryData.ChannelId = this.state.selectChannelValue1[0].platform;
    queryData.ShopId = this.state.selectChannelValue1[1].value;
  }
  requests('g1/crm.analysis.product.getrefundanalysis',{
    method:'POST',
    body:queryData,
  }).then(response=>{
      if(response){
          var array = [];
          if(response.refundList){
            response.refundList.forEach(e => {
              //分解数据
             var a = {
                time: e.bizDate,
                ykey: "金额",//amount
                xvalue: e.amount
              }
              array.push(a);
              var b ={
                time: e.bizDate,
                ykey: "次数",//count
                xvalue: e.count
              }
              array.push(b);
            });
          }
         
          this.setState({
            dataSource:array,
            refundAmount:response.refundAmount,
            refundCount:response.refundCount,
            refundPresent:response.refundPresent,
          });
        }
  })
}

//饼图
getrefundcountanalysis=()=>{
  var queryData ={
    OuterCode:this.props.GoodId,
    ChannelId:"",
    ShopId:""
  } 

  if(this.state.time !='0'){
    queryData.Day = this.state.time;
  }

  if (this.state.selectChannelValue1.length == 1) {
    queryData.ChannelId = this.state.selectChannelValue1[0].value;
  }
  if (this.state.selectChannelValue1.length == 2) {
    queryData.ChannelId = this.state.selectChannelValue1[0].platform;
    queryData.ShopId = this.state.selectChannelValue1[1].value;
  }
  requests('g1/crm.analysis.product.getrefundcountanalysis',{
    method:'POST',
    body:queryData,
  }).then(response=>{
      if(response){
         
          this.setState({
            pieChartDataSource:response.presentList,
            rankingDataSource:response.rankList,
          });
        }
  })
}

// 评价分析
getreviewanalysis=()=>{
  var queryData ={
    OuterCode:this.props.GoodId,
    ChannelId:"",
    ShopId:""
  } 

  if(this.state.time2 !='0'){
    queryData.Day = this.state.time2;
  }

  if (this.state.selectChannelValue2.length == 1) {
    queryData.ChannelId = this.state.selectChannelValue2[0].value;
  }
  if (this.state.selectChannelValue2.length == 2) {
    queryData.ChannelId = this.state.selectChannelValue2[0].platform;
    queryData.ShopId = this.state.selectChannelValue2[1].value;
  }
  requests('g1/crm.analysis.product.getreviewanalysis',{
    method:'POST',
    body:queryData,
  }).then(response=>{
      if(response){
        var array = [];
          if(response.reviewList){
            response.reviewList.forEach(e => {
              //分解数据
             var a = {
                time: e.bizDate,
                ykey: "好评数",//goodCount
                xvalue: e.goodCount
              }
              array.push(a);
              var b ={
                time: e.bizDate,
                ykey: "差评数",//badCount
                xvalue: e.badCount
              }
              array.push(b);
            });
          } 

          this.setState({
            evaluateDataSource:array,
            badReviewCount: response.badReviewCount,
            badReviewPresent: response.badReviewPresent,
            badTagCount: response.badTagCount,
            goodReviewCount: response.goodReviewCount,
            goodReviewPresent: response.goodReviewPresent,
            goodTagCount: response.goodTagCount,
            reviewCount: response.reviewCount,
          });
        }
  })
}

  render() {
    const me = this;
    return (
      <div className={styles.ServiceAnalysis}>
        <div className={styles.bgWhite}>
          <Row type='flex' gutter={8} className={styles.H18} align='middle'>
            <Col><b>退款分析</b></Col>
            <Col>
              <AntdTooltip title="服务分析统计的是退款成功的数据，不包括售中"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
            </Col>
          </Row>
          <Row type='flex' justify='space-between' className='Mt-basewidth2 Mb-basewidth2'>
            <Col style={{ flex: 1 }}>
              <Row type='flex' align='middle' gutter={8}>
                <Col>选择渠道</Col>
                <Col xxl={6} xl={8} lg={9}>
                <SelectChannelNew
                    onChange={(values) => {
                      me.setState({selectChannelValue1:values},()=>{
                        me.selectChannel();
                      });
                      console.log("选择渠道返回值", values)
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Radio.Group defaultValue="7">
                <Radio.Button value="7"  onClick={()=>this.setState({time:7},()=>this.selectChannel())}>近7天</Radio.Button>
                <Radio.Button value="15" onClick={()=>this.setState({time:15},()=>this.selectChannel())}>近15天</Radio.Button>
                <Radio.Button value="30" onClick={()=>this.setState({time:30},()=>this.selectChannel())}>近30天</Radio.Button>
                <Radio.Button value="0" onClick={()=>this.setState({time:0},()=>this.selectChannel())}>全部</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Row type='flex' className={styles.wrapper} align='middle'>
            <Col>退款次数&nbsp;<span className={styles.font20}>{this.state.refundCount}</span></Col>
            <Col offset={1}>退款金额&nbsp;&yen;<span className={styles.font20}>{this.state.refundAmount}</span></Col>
            <Col offset={1}>退款率&nbsp;<span className={styles.font20}>{this.state.refundPresent}%</span></Col>
          </Row>
          <LineRefund data={this.state.dataSource}/>

          <Row gutter={16} type='flex' className={`${styles.stretch} Mt-basewidth3`}>
            <Col span={12}>
              <Card size='small' title='退款次数占比' bodyStyle={{ padding: 0 }} headStyle={{ backgroundColor: '#F3F4F7', padding: '0 16px', fontSize: '12px', fontWeight: 'bold' }}>
                <DonutChart data ={this.state.pieChartDataSource} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size='small' title='退款次数排行' bodyStyle={{ padding: 16 }} headStyle={{ backgroundColor: '#F3F4F7', padding: '0 16px', fontSize: '12px', fontWeight: 'bold' }}>
                <Table
                  pagination={false}
                  dataSource={this.state.rankingDataSource}
                >
                  <Table.Column dataIndex='serial' title='排行' 
                    render={(text, record, index) => {
                      return index + 1;
                    }}
                  />
                  <Table.Column dataIndex='name' title='渠道类型' />
                  <Table.Column dataIndex='count' title='退款次数' />
                </Table>
              </Card>
            </Col>
          </Row>
        </div>
        <div className={styles.bgWhite}>
          <Row type='flex' gutter={8} className={styles.H18} align='middle'>
            <Col><b>评价分析</b></Col>
           
          </Row>
          <Row type='flex' justify='space-between' className='Mt-basewidth2 Mb-basewidth2'>
            <Col style={{ flex: 1 }}>
              <Row type='flex' align='middle' gutter={8}>
                <Col>选择渠道</Col>
                <Col xxl={6} xl={8} lg={9}>
                <SelectChannelNew
                    onChange={(values) => {
                      me.setState({selectChannelValue2:values},()=>{
                        me.getreviewanalysis();
                      });
                      console.log("选择渠道返回值", values)
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Radio.Group defaultValue="7">
                <Radio.Button value="7" onClick={()=>this.setState({time2:7},()=>this.getreviewanalysis())}>近7天</Radio.Button>
                <Radio.Button value="15"onClick={()=>this.setState({time2:15},()=>this.getreviewanalysis())}>近15天</Radio.Button>
                <Radio.Button value="30"onClick={()=>this.setState({time2:30},()=>this.getreviewanalysis())}>近30天</Radio.Button>
                <Radio.Button value="0"onClick={()=>this.setState({time2:0},()=>this.getreviewanalysis())}>全部</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Row type='flex' className={styles.wrapper} align='middle'>
            <Col>评价总数&nbsp;<span className={styles.font20}>{this.state.reviewCount}</span></Col>
            <Col offset={1}>好评数&nbsp;<span className={styles.font20}>{this.state.goodReviewCount}</span></Col>
            <Col offset={1}>好评率&nbsp;<span className={styles.font20}>{this.state.goodReviewPresent}%</span></Col>
            <Col offset={1}>差评数&nbsp;<span className={styles.font20}>{this.state.badReviewCount}</span></Col>
            <Col offset={1}>差评率&nbsp;<span className={styles.font20}>{this.state.badReviewPresent}%</span></Col>
            {/* <Col offset={1}>正面标签数&nbsp;<span className={styles.font20}>{this.state.goodTagCount}</span></Col>
            <Col offset={1}>负面标签数&nbsp;<span className={styles.font20}>{this.state.badTagCount}</span></Col> */}
          </Row>
          <Row className='Pl-basewidth2 Pr-basewidth2 Mb-basewidth2 Mt-basewidth2'>评价走势</Row>
          <LineChart data={this.state.evaluateDataSource}/>
          {/* <Row className='Pl-basewidth2 Pr-basewidth2 Mb-basewidth2 Mt-basewidth2'>负面标签分析</Row>
          <Bubbletext /> */}
        </div>
      </div>
    )
  }
}

export default ServiceAnalysis;


class LineRefund extends Component {
  render() {
    const cols = {
      browse: {
        range: [0, 1]
      }
    };
    let data =[];
    data.push({
      time:1,
      xvalue:20
    });
    return (
      <Chart height={390} padding={[40, 30, 20, 30]} data={this.props.data&&this.props.data.length>0?this.props.data:data} scale={cols} forceFit>
        <Legend position='top' />
        <Axis name="time" />
        <Axis name="xvalue" />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position="time*xvalue"
          size={2}
          color="ykey"
        />
      </Chart>
    )
  }
}

class LineChart extends Component {
  render() {
    const cols = {
      browse: {
        range: [0, 1],
      }
      
    };
    let data =[];
    data.push({
      time:1,
      xvalue:20
    });
    return (
      <Chart height={390} padding={[40, 30, 20, 30]} data={this.props.data&&this.props.data.length>0?this.props.data:data} scale={cols} forceFit>
        <Legend position='top' />
        <Axis name="time" />
        <Axis name="xvalue"/>
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position="time*xvalue"
          size={2}
          color="ykey"
        />
      </Chart>
    )
  }
}

class DonutChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    const noneData = [
      {
        name: "暂无数据",
        count: 20
      },
    ];

    const data = this.props.data&&this.props.data.length>0?this.props.data:noneData;
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "name",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          height={360}
          data={dv}
          scale={cols}
          forceFit
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
            color="name"
            tooltip={[
              "name*percent",
              (item, percent) => {
                percent = percent * 100 + "%";
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
              formatter={(val, item) => {
                return item.point.name + ": " + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

//负面标签分析
// class Bubbletext extends React.Component {
//   render() {
//     const { Line } = Guide;
//     const data = [
//       {
//         x: 95,
//         y: 95,
//         z: 13.8,
//         name: "BE",
//         country: "Belgium"
//       },
//       {
//         x: 86.5,
//         y: 102.9,
//         z: 14.7,
//         name: "DE",
//         country: "Germany"
//       },
//       {
//         x: 80.8,
//         y: 91.5,
//         z: 15.8,
//         name: "FI",
//         country: "Finland"
//       },
//       {
//         x: 80.4,
//         y: 102.5,
//         z: 12,
//         name: "NL",
//         country: "Netherlands"
//       },
//       {
//         x: 80.3,
//         y: 86.1,
//         z: 11.8,
//         name: "SE",
//         country: "Sweden"
//       },
//       {
//         x: 78.4,
//         y: 70.1,
//         z: 16.6,
//         name: "ES",
//         country: "Spain"
//       },
//       {
//         x: 74.2,
//         y: 68.5,
//         z: 14.5,
//         name: "FR",
//         country: "France"
//       },
//       {
//         x: 73.5,
//         y: 83.1,
//         z: 10,
//         name: "NO",
//         country: "Norway"
//       },
//       {
//         x: 71,
//         y: 93.2,
//         z: 24.7,
//         name: "UK",
//         country: "United Kingdom"
//       },
//       {
//         x: 69.2,
//         y: 57.6,
//         z: 10.4,
//         name: "IT",
//         country: "Italy"
//       },
//       {
//         x: 68.6,
//         y: 20,
//         z: 16,
//         name: "RU",
//         country: "Russia"
//       },
//       {
//         x: 65.5,
//         y: 126.4,
//         z: 35.3,
//         name: "US",
//         country: "United States"
//       },
//       {
//         x: 65.4,
//         y: 50.8,
//         z: 28.5,
//         name: "HU",
//         country: "Hungary"
//       },
//       {
//         x: 63.4,
//         y: 51.8,
//         z: 15.4,
//         name: "PT",
//         country: "Portugal"
//       },
//       {
//         x: 64,
//         y: 82.9,
//         z: 31.3,
//         name: "NZ",
//         country: "New Zealand"
//       }
//     ];
//     const cols = {
//       x: {
//         alias: "Daily fat intake",
//         // 定义别名
//         tickInterval: 5,
//         // 自定义刻度间距
//         nice: false,
//         // 不对最大最小值优化
//         max: 96,
//         // 自定义最大值
//         min: 62 // 自定义最小是
//       },
//       y: {
//         alias: "Daily sugar intake",
//         tickInterval: 50,
//         nice: false,
//         max: 165,
//         min: 0
//       },
//       z: {
//         alias: "Obesity(adults) %"
//       }
//     };
//     return (
//       <div>
//         <Chart

//           data={data}
//           padding={[20, 0, 80, 80]}
//           scale={cols}

//           forceFit
//         >
//           <Tooltip title="country" />
//           <Geom
//             type="point"
//             position="x*y"
//             color="#1890ff"
//             style={{
//               ineWidth: 1,
//               stroke: "#1890ff"
//             }}
//             shape="circle"
//             size={["z", [10, 40]]}
//             tooltip="x*y*z"
//             opacity={0.3}
//           >
//             <Label
//               content="name*country"
//               offset={0}
//               textStyle={{
//                 fill: "#1890FF"
//               }}
//             />
//           </Geom>
//         </Chart>
//       </div>
//     );
//   }
// }