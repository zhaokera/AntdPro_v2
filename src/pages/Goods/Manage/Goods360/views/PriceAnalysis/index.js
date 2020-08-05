import React, { Component } from 'react';
import { Row, Col, Radio, Select, Icon } from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import SelectChannelNew from '@/components/CommonModal/SelectChannelNew';
import request from '@/utils/request';
import {
  Chart, Geom, Axis, Legend, Tooltip,
} from 'bizcharts';
import styles from './index.less';
class PriceAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ChannelId: "",
      ShopId: "",
      OuterCode: this.props.GoodId,
      Day: 7,
      selectChannelValue1: [],
      dateSource: [{ year: " ", sales: 0 }],//第一个图表数据源
      dateSourceSvg: [{ year: " ", sales: 0 }],//第二个图表数据源
      dateSourceUnline: [{ year: " ", sales: 0 }],//第三个图表数据源
      onlineSvgSalePrice: '',
      svgSalePrice: '',
      unlineSvgSalePrice: ''
    }
  }

  componentDidMount() {
    this.getSameAnalysis();
    this.getpriceanalysis();
  }

  // 获取售价同期销量
  getSameAnalysis = () => {
    let selectChannelValue1 = this.state.selectChannelValue1;
    const queryParams = {
      ChannelId: selectChannelValue1[0] == undefined ? "" : (selectChannelValue1.length == 2 ? selectChannelValue1[0].platform : selectChannelValue1[0].value),
      ShopId: selectChannelValue1[1] == undefined ? "" : selectChannelValue1[1].value,
      OuterCode: this.state.OuterCode,
    };

    if (this.state.Day !== 0) {
      queryParams.Day = this.state.Day;
    }

    // 直接调用request
    request('g1/crm.analysis.product.getsameanalysis', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (response) {
          let date = [];
          for (let i = 0; i < response.sameSale.length; i++) {
            date.push({ year: response.sameSale[i].price + "", sales: response.sameSale[i].count })
          }
          this.setState({
            dateSource: date
          })
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }

  //平均售价分析\线下平均售价分析
  getpriceanalysis = () => {
    const queryParams = {
      ChannelId: "",
      ShopId: "",
      OuterCode: this.state.OuterCode,
      Day: ""
    };
    // 直接调用request
    request('g1/crm.analysis.product.getpriceanalysis', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (response) {
          //处理线上平均数据
          let date = [];
          for (let i = 0; i < response.svgSale.length; i++) {
            date.push({ year: "【" + response.svgSale[i].channelName + "】" + response.svgSale[i].name, sales: response.svgSale[i].price })
          }
          //处理线下平均数据
          let dateunline = [];
          for (let i = 0; i < response.unlineAvgPriceResponse.avgPriceList.length; i++) {
            dateunline.push({ year: response.unlineAvgPriceResponse.avgPriceList[i].avgPrice+"", sales: response.unlineAvgPriceResponse.avgPriceList[i].shopNum })
          };

          this.setState({
            dateSourceSvg: date,
            dateSourceUnline: dateunline,
            onlineSvgSalePrice: response.onlineSvgSalePrice,
            svgSalePrice: response.svgSalePrice,
            unlineSvgSalePrice: response.unlineSvgSalePrice
          })

        }
      })
      .catch((response) => {
        console.log(response);
      });
  }



  render() {
    return (
      <div className={styles.PriceAnalysis}>
        <div className={styles.bgWhite}>
          <Row type='flex' gutter={8} className={styles.H18} align='middle'>
            <Col><b>售价同期销量</b></Col>
            <Col>
              <AntdTooltip title="分析商品不同价格带来的商品销量"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
            </Col>
          </Row>
          <Row type='flex' justify='space-between' className='Mt-basewidth2 Mb-basewidth2'>
            <Col style={{ flex: 1 }}>
              <Row type='flex' align='middle' gutter={8}>
                <Col>选择渠道</Col>
                <Col xxl={6} xl={8} lg={9}>
                  <SelectChannelNew
                    onChange={(values) => {
                      this.setState({ selectChannelValue1: values }, () => {
                        this.getSameAnalysis();
                      });
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Radio.Group defaultValue={this.state.Day} onChange={(values) => {
                this.setState({ Day: values.target.value }, () => {
                  this.getSameAnalysis();
                });
              }}>
                <Radio.Button value={7}>近7天</Radio.Button>
                <Radio.Button value={15}>近15天</Radio.Button>
                <Radio.Button value={30}>近30天</Radio.Button>
                <Radio.Button value={0}>全部</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <BarChartFirst dateSource={this.state.dateSource} />
        </div>
        <div className={styles.bgWhite}>
          <Row type='flex' gutter={8} className={styles.H18} align='middle'>
            <Col><b>平均售价分析</b></Col>
            <Col style={{ paddingTop: 4 }}>
              <AntdTooltip title="分析不同渠道商品的平均价格"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
            </Col>
          </Row>
          <Row type='flex' className={styles.wrapper} align='middle'>
            <Col>
              <Row type='flex' gutter={8} align='middle'>
                <Col>平均售价 ￥<span className={styles.font20}>{this.state.svgSalePrice}</span></Col>
                <Col style={{ paddingTop: 4 }}>
                  <AntdTooltip title="总商品售价/商品数"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
                </Col>
              </Row>
            </Col>
            <Col offset={1}>
              <Row type='flex' gutter={8} align='middle'>
                <Col>线上平均售价 ￥<span className={styles.font20}>{this.state.onlineSvgSalePrice}</span></Col>
                <Col style={{ paddingTop: 4 }}>
                  <AntdTooltip title="线上总商品售价/商品数"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
                </Col>
              </Row>
            </Col>
            <Col offset={1}>
              <Row type='flex' gutter={8} align='middle'>
                <Col>线下平均售价 ￥<span className={styles.font20}>{this.state.unlineSvgSalePrice}</span></Col>
                <Col style={{ paddingTop: 4 }}>
                  <AntdTooltip title="线下门店总商品售价/商品数"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ height: 16 }} className='Mt-basewidth3 Mb-basewidth Ml-basewidth' align='middle'>线上平均售价分析</Row>
          <BarChartSecond dateSource={this.state.dateSourceSvg} />
          <Row style={{ height: 16 }} className='Mt-basewidth3 Mb-basewidth Ml-basewidth' align='middle'>线下平均售价分析</Row>

          <BarChartThird dateSource={this.state.dateSourceUnline} />
        </div>
      </div>
    )
  }
}

export default PriceAnalysis;

class BarChartFirst extends React.Component {
  render() {
    const data = this.props.dateSource
    const cols = {
      year: { alias: '销售价' },
      sales: { alias: '销售量' },
    };
    return (
      <div>
        <Chart height={400} padding={[30, 50, 50, 30]} data={data} scale={cols} forceFit>
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

class BarChartSecond extends React.Component {
  render() {
    const data = this.props.dateSource;
    const cols = {
      sales: {
        alias: '平均价'
      }
    };
    return (
      <div>
        <Chart height={500} padding={[30, 50, 50, 36]} data={data} scale={cols} forceFit>
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

class BarChartThird extends React.Component {
  render() {
    const data = this.props.dateSource;
    console.log('data',data);
    const cols = {
      sales: {
        alias: '门店数量'
      }
    };
    return (
      <div>
        <Chart height={400} padding={[30, 50, 50, 30]} data={data} scale={cols} forceFit>
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