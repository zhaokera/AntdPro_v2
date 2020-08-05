
import React, { Component } from 'react';
import { Table, Row, Col, Radio, Select, Icon, Progress } from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import {
  Chart, Geom, Axis, Coord, Label, Legend, Guide, Tooltip,
} from 'bizcharts';
import SelectChannelNew from '@/components/CommonModal/SelectChannelNew';
import DataSet from "@antv/data-set";
import styles from './index.less';
import request from '@/utils/request';
import numeral from 'numeral';

class CustomersAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectChannelValue: [],// 选择渠道店铺组件返回值
      selectDay: 7,
      areaList: [], // 区域
      customerList: [], // 客户
      levelList: [],  // 等级
    }
  }

  componentDidMount() {
    this.GetCrowdAnalysis();
  }


  // 客群分析
  GetCrowdAnalysis = () => {
    const me = this;

    let queryParams = {
      ChannelId: "",
      ShopId: "",
      OuterCode: this.props.GoodId,
    };

    if (me.state.selectDay !== 0) {
      queryParams.Day = me.state.selectDay;
    }

    if (me.state.selectChannelValue.length == 1) {
      queryParams.ChannelId = me.state.selectChannelValue[0].value;
    }
    if (me.state.selectChannelValue.length == 2) {
      queryParams.ChannelId = me.state.selectChannelValue[0].platform;
      queryParams.ShopId = me.state.selectChannelValue[1].value;
    }


    // 直接调用request
    request('g1/crm.analysis.product.getcrowdanalysis', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // data根据自己api的规则处理
        console.log(response);
        if (response) {

          let levelList = [];
          response.levelList.forEach(v => {
            levelList.push({
              item: v.name,
              count: v.count
            });
          });
          const data = {
            name: "暂无数据",
            count: 0
          }

          me.setState({
            levelList: levelList,
            customerList: response.customerList,
            areaList: response.areaList ? response.areaList : data
          });


        }
      })
      .catch((response) => {
        console.log(response);
      });
  }




  render() {
    const me = this;
    const areaColor = ["#0A74DE", "#2485E2", "#51A2E9", "#84C3F1"];
    let totalBuyerCount = 0;
    this.state.areaList.forEach(v => {
      totalBuyerCount += v.count;
    });

    return (
      <div className={styles.CustomersAnalysis}>
        {/* <Row type='flex' gutter={8} className={styles.H18} align='middle'>
            <Col><b>售价同期销量</b></Col>
            <Col>
              <AntdTooltip title="prompt text"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
            </Col>
          </Row> */}
        <div className={`${styles.bgWhite} P-basewidth2`}>
          <Row type='flex' justify='space-between'>
            <Col style={{ flex: 1 }}>
              <Row type='flex' align='middle' gutter={8}>
                <Col>选择渠道</Col>
                <Col xxl={6} xl={8} lg={9}>
                  <SelectChannelNew
                    onChange={(values) => {
                      me.setState({ selectChannelValue: values }, () => {
                        me.GetCrowdAnalysis();
                      });
                      console.log("选择渠道返回值", values)
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Radio.Group onChange={e => me.setState({ selectDay: e.target.value }, () => {
                me.GetCrowdAnalysis();
              })} defaultValue={me.state.selectDay}>
                <Radio.Button value={7}>近7天</Radio.Button>
                <Radio.Button value={15}>近15天</Radio.Button>
                <Radio.Button value={30}>近30天</Radio.Button>
                <Radio.Button value={0}>全部</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        <Row type='flex' gutter={16} className='Mb-basewidth2'>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type='flex' align='middle' justify="space-between">
                <Col><b>等级分布</b></Col>
              </Row>
              <div className='Pl-basewidth2 Pr-basewidth2 Pb-basewidth2'>
                <DonutChart data={me.state.levelList} />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type='flex' align='middle' gutter={8}>
                <Col><b>新老客分布</b></Col>
                <Col><AntdTooltip title="购买该商品的新客和老客数量"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip></Col>
              </Row>
              <div className='Pl-basewidth2 Pr-basewidth2 Pb-basewidth2'>
                <BarChart data={me.state.customerList} />
              </div>
            </div>
          </Col>
        </Row>
        <div className={`${styles.bgWhite} P-basewidth2`}>
          <Row type='flex' gutter={8} className={styles.H18} align='middle'>
            <Col><b>客户地域分布</b></Col>
            <Col>
              <AntdTooltip title="商品在不同地域的买家数量"><Icon style={{ color: '#9495A4' }} type="question-circle" /> </AntdTooltip>
            </Col>
          </Row>
          <Row type='flex' justify='center' align='middle'>
            <Col xl={17}>  <MapChart areaList={me.state.areaList} /></Col>
            <Col xl={6} offset={1} style={{ width: 260 }}>
              <Row type='flex' justify='space-between' className='Mb-basewidth'>
                <Col>地域</Col>
                <Col>买家数</Col>
              </Row>
              {me.state.areaList.length > 0 && me.state.areaList.map((v, i) => {
                if (i >= me.state.areaList.length) {
                  return;
                }

                return (<Row type='flex' justify='space-between'>
                  <Col>{v.name} <Progress style={{ width: 200 }} percent={v.count * 100 / totalBuyerCount} showInfo={false} strokeColor={areaColor[i]} /></Col>
                  <Col>{v.count}</Col>
                </Row>);
              })}
              {me.state.areaList.length == 0 &&
                <Table
                  columns={[]}
                  dataSource={[]}
                  pagination={false}
                />
              }

              {/* <Row type='flex' justify='space-between'>
                <Col>江苏 <Progress style={{ width: 200 }} percent={30} showInfo={false} strokeColor="#0A74DE" /></Col>
                <Col>200</Col>
              </Row>
              <Row type='flex' justify='space-between'>
                <Col>北京 <Progress style={{ width: 200 }} percent={30} showInfo={false} strokeColor="#2485E2" /></Col>
                <Col>200</Col>
              </Row>
              <Row type='flex' justify='space-between'>
                <Col>四川 <Progress style={{ width: 200 }} percent={30} showInfo={false} strokeColor="#51A2E9" /></Col>
                <Col>200</Col>
              </Row>
              <Row type='flex' justify='space-between'>
                <Col>河南 <Progress style={{ width: 200 }} percent={30} showInfo={false} strokeColor="#84C3F1" /></Col>
                <Col>200</Col>
              </Row> */}
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default CustomersAnalysis;

class BarChart extends React.Component {
  render() {
    const data = [
      {
        name: " ",
        count: 0
      }
    ];
    const cols = {
      count: {
        alias: '数量'
      }
    };
    return (
      <div>
        <Chart height={360} padding={[30, 30, 30, 50]} data={this.props.data.length > 0 ? this.props.data : data} scale={cols} forceFit>
          <Axis name="name" />
          <Axis name="count" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="name*count" />
        </Chart>
      </div>
    );
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
              formatter={(val, item) => {
                return item.point.item + ": " + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}


const { AMapUI } = window;

const constructGeoJSON = (features) => {
  if (!features) return false;
  if (Array.isArray(features)) {
    return {
      type: 'FeatureCollection',
      features: [...features],
    };
  }
  return features;
};

// 传入adcode获取geojson，部分数据需要处理一下

const getGeojsonByCode = (adcode = 100000, withSub = true) => {
  if (!AMapUI) {
    return Promise.reject();
  }
  // 文档：https://lbs.amap.com/api/javascript-api/reference-amap-ui/geo/district-explorer
  return new Promise((resolve, reject) => {
    AMapUI.load('ui/geo/DistrictExplorer', (DistrictExplorer) => {
      const districtExplorer = new DistrictExplorer();
      districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
        if (error) {
          reject();
        }
        let res = null;
        if (withSub) {
          res = areaNode.getSubFeatures();
        } else {
          res = areaNode.getParentFeature();
        }
        resolve(constructGeoJSON(res));
      });
    });
  });
};

class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chinaGeo: null,
    };
  }

  componentDidMount() {
    getGeojsonByCode(100000, true).then((res) => {
      this.setState({ chinaGeo: res });
    });
  }

  processGeoData = (geoData, dataValue) => {
    const { features } = geoData;
    features.forEach((one) => {
      one.value = 0;
      const name = one && one.properties && one.properties.name;
      dataValue.forEach((item) => {
        if (name.includes(item.name)) {
          one.value = item.value;
        }
      });
    });

    const geoDv = new DataSet.View().source(geoData, { type: 'GeoJSON' });
    return geoDv;
  }


  render() {
    const area = [
      { key: '10105', name: '广东', value: 0.0000 },
      { key: '10125', name: '四川', value: 0.0000 },
      { key: '10102', name: '安徽', value: 0.0000 },
      { key: '10130', name: '浙江', value: 0.0000 },
      { key: '10112', name: '湖北', value: 0.0000 },
      { key: '10124', name: '上海', value: 0.0000 },
      { key: '10103', name: '福建', value: 0.0000 },
      { key: '10131', name: '重庆', value: 0.0000 },
      { key: '10115', name: '江苏', value: 0.1000 },
      { key: '10123', name: '陕西', value: 0.2000 },
      { key: '10121', name: '山东', value: 0.0000 },
      { key: '10109', name: '河北', value: 0.0000 },
      { key: '10116', name: '江西', value: 0.0000 },
      { key: '10113', name: '湖南', value: 0.0000 },
      { key: '10129', name: '云南', value: 0.0000 },
      { key: '10101', name: '北京', value: 0.0000 },
      { key: '10104', name: '甘肃', value: 0.0000 },
      { key: '10114', name: '吉林', value: 0.0000 },
      { key: '10107', name: '贵州', value: 0.0000 },
      { key: '10106', name: '广西', value: 0.0000 },
      { key: '10110', name: '河南', value: 0.0000 },
      { key: '10117', name: '辽宁', value: 0.0000 },
      { key: '10118', name: '内蒙古', value: 0.0000 },
      { key: '10128', name: '新疆', value: 0.0000 },
      { key: '10111', name: '黑龙江', value: 0.0000 },
      { key: '10126', name: '天津', value: 0.0000 },
      { key: '10122', name: '山西', value: 0.0000 },
      { key: '10108', name: '海南', value: 0.0000 },
      { key: '10119', name: '宁夏', value: 0.0000 },
      { key: '10120', name: '青海', value: 0.0000 },
      { key: '10127', name: '西藏', value: 0.0000 },
    ];
    let areaList = [];
    if (this.props.areaList) {
      let max = 1;

      this.props.areaList.forEach(v => {
        if (v.count > max) {
          max = v.count;
        }
        areaList.push({
          name: v.name,
          value: v.count
        });
      });
    }
    const { chinaGeo } = this.state;
    if (!chinaGeo) {
      return '数据加载中...';
    }
    const data = this.processGeoData(chinaGeo, areaList);
    const scale = {
      latitude: {
        sync: true,
        nice: false,
      },
      longitude: {
        sync: true,
        nice: false,
      },
      value: {
        formatter: val => val,
      },
    };

    return (
      <Chart height={600} width={700} style={{ margin: "auto" }} scale={scale} data={data}>
        <Geom
          type="polygon"
          position="longitude*latitude"
          style={{ lineWidth: 1, stroke: '#505050' }}
          // color={['value', ['#31c5f8', '#61d3f8', '#89dcfd', '#b0e8f8', '#d8f3ff']]}
          color={['value', ['#d9f4ff', '#33c5f6']]}
          tooltip={[
            'name*value',
            (name, value) => ({
              name,
              value: numeral(value || 0).format('0'),
            }),
          ]}
        >
          <Tooltip showTitle={false} />
          <Legend
            position="bottom-left"
            offsetY={-130}
            offsetX={-60}
            slidable={false}
            width={320}
          />
        </Geom>
      </Chart>
    )
  }
}