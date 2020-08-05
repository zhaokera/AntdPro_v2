import React, { Component } from 'react';
import { Row, Col, Select, Radio, Icon } from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import request from '@/utils/request';
import {
  Chart, Geom, Axis, Tooltip,
} from 'bizcharts';
import SelectChannelNew from '@/components/CommonModal/SelectChannelNew';
import styles from './index.less';
class PurchaseAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ChannelId: "",
      ShopId: "",
      selectChannelValue1:[],
      OuterCode: this.props.GoodId,
      Day: 7,
      repeatDay:"",
      repeatPresent:"",
      dateSource:[{year:" ",sales:0}],//第一个图表数据源
    }
  }
  componentDidMount()
  {
    this.GetRepeatAnalysis();
   
  }

  //获取售价同期销量
  GetRepeatAnalysis= () => {
    let selectChannelValue1=this.state.selectChannelValue1;
    const queryParams = {
      ChannelId: selectChannelValue1[0]==undefined?"":(selectChannelValue1.length==2?selectChannelValue1[0].platform:selectChannelValue1[0].value),
      ShopId:  selectChannelValue1[1]==undefined?"":selectChannelValue1[1].value,
      OuterCode: this.state.OuterCode
      // Day: this.state.Day
     
    };
    // 直接调用request
    request('g1/crm.analysis.product.getrepeatanalysis', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (response) {
        let date=[];
         for(let i=0;i<response.repeatList.length;i++)
         {         
            date.push({year:response.repeatList[i].name,sales:response.repeatList[i].present})
         }
         this.setState({
          dateSource:date,
          repeatDay:response.repeatDay,
          repeatPresent:response.repeatPresent
         })
        }else{
          this.setState({
            dateSource:[{year:" ",sales:0}],
            repeatDay:"",
            repeatPresent:""
           })
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }

  render() {
    return (
      <div className={styles.PurchaseAnalysis}>
        <Row className='Mb-basewidth2' type='flex' align='middle' justify="space-between">
          <Col style={{ flex: 1 }}>
            <Row type='flex' align='middle' gutter={8}>
              <Col>选择渠道</Col>
              <Col xxl={6} xl={8} lg={9}>
              <SelectChannelNew
                    onChange={(values) => {
                      this.setState({selectChannelValue1:values},()=>{
                       this.GetRepeatAnalysis();
                      });
                    }}
                  />
              </Col>
            </Row>
          </Col>
          <Col>
          {/* <Radio.Group defaultValue={this.state.Day} onChange={(values) => {
                      this.setState({Day:values.target.value},()=>{
                       this.GetRepeatAnalysis();
                      });
                    }}>
                <Radio.Button value={7}>近7天</Radio.Button>
                <Radio.Button value={15}>近15天</Radio.Button>
                <Radio.Button value={30}>近30天</Radio.Button>
          </Radio.Group> */}
          </Col>
        </Row>
        <Row type='flex' className={styles.wrapper} align='middle'>
          <Col>
            <AntdTooltip title="复购总周期（天数）/总复购交易次数">平均复购周期&nbsp;<span className={styles.font20}>{this.state.repeatDay}天</span>&nbsp;<Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
          </Col>
          <Col offset={1}>
            <AntdTooltip title="复购交易次数/总交易次数">复购率&nbsp;<span className={styles.font20}>{this.state.repeatPresent}%</span>&nbsp;<Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
          </Col>
        </Row>
        <BarChart dateSource={this.state.dateSource}/>
      </div>
    )
  }
}

export default PurchaseAnalysis;

class BarChart extends React.Component {
  render() {
    const data = this.props.dateSource
    const cols = {
      sales: {
        alias: '平均时间'
      }
    };
    return (
      <div>
        <Chart height={360} padding={[30, 30, 30, 30]} data={data} scale={cols} forceFit>
          <Axis name="year" />
          <Axis name="sales" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="year*sales" />
        </Chart>
      </div>
    );
  }
}