import React, { Component } from 'react';
import { Row, Col, Radio, Table, Tag } from 'antd';
import { Chart, Geom, Axis, Coord, Label, Legend, Guide, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './index.less';
import { Record } from 'immutable';
import request from '@/utils/request';

class ChannelAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allAnalysis: [], // 全部渠道
      onlineAnalysis: [], // 线上渠道
      unlineAnalysis: [], // 线下渠道

      allChart: [],
      onlineChart: [],
      unlineChart: [],
    };
  }

  componentDidMount() {
    this.GetChannelAnalysis();
  }

  // 销售渠道分析
  GetChannelAnalysis = () => {
    const me = this;

    let queryParams = {
      ChannelId: '',
      ShopId: '',
      OuterCode: this.props.GoodId,
      Day: '',
    };
    // 直接调用request
    request('g1/crm.analysis.product.getchannelanalysis', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // data根据自己api的规则处理
        console.log(response);
        if (response) {
          me.setState(
            {
              allAnalysis: response.allChannelSaleChat,
              onlineAnalysis: response.onlineChannelSaleChat,
              unlineAnalysis: response.unlineChannelSaleChat,
            },
            () => {
              me.handleAllSelectChange(1);
              me.handleOnlineSelectChange(1);
              me.handleUnlineSelectChange(1);
            }
          );
        }
      })
      .catch(response => {
        console.log(response);
      });
  };

  // 全渠道饼图切换
  handleAllSelectChange = type => {
    console.log(type);
    const me = this;
    let skuChart = [];
    if (me.state.allAnalysis) {
      me.state.allAnalysis.forEach(v => {
        switch (type) {
          case 1: // 销量
            skuChart.push({
              item: v.name,
              count: Number(v.saleCount),
            });
            break;
          case 2: //销售额
            skuChart.push({
              item: v.name,
              count: Number(v.saleAmount),
            });
            break;
          case 3: //买家数
            skuChart.push({
              item: v.name,
              count: Number(v.memberCount),
            });
            break;
        }
      });
    }
    me.setState({ allChart: skuChart });
  };

  // 线上渠道饼图切换
  handleOnlineSelectChange = type => {
    console.log(type);
    const me = this;
    let skuChart = [];
    if (me.state.onlineAnalysis) {
      me.state.onlineAnalysis.forEach(v => {
        switch (type) {
          case 1: // 销量
            skuChart.push({
              item: v.name + '(' + v.channelName + ')',
              count: Number(v.saleCount),
            });
            break;
          case 2: //销售额
            skuChart.push({
              item: v.name + '(' + v.channelName + ')',
              count: Number(v.saleAmount),
            });
            break;
          case 3: //买家数
            skuChart.push({
              item: v.name + '(' + v.channelName + ')',
              count: Number(v.memberCount),
            });
            break;
        }
      });
    }
    me.setState({ onlineChart: skuChart });
  };
  // 线下渠道饼图切换
  handleUnlineSelectChange = type => {
    console.log(type);
    const me = this;
    let skuChart = [];
    if (me.state.unlineAnalysis) {
      me.state.unlineAnalysis.forEach(v => {
        switch (type) {
          case 1: // 销量
            skuChart.push({
              item: v.name,
              count: Number(v.saleCount),
            });
            break;
          case 2: //销售额
            skuChart.push({
              item: v.name,
              count: Number(v.saleAmount),
            });
            break;
          case 3: //买家数
            skuChart.push({
              item: v.name,
              count: Number(v.memberCount),
            });
            break;
        }
      });
    }
    me.setState({ unlineChart: skuChart });
  };

  render() {
    const me = this;
    return (
      <div className={styles.ChannelAnalysis}>
        <Row type="flex" gutter={16} className={styles.stretch}>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type="flex" align="middle" justify="space-between">
                <Col>
                  <b>全部渠道分析</b>
                </Col>
                <Col>
                  <Radio.Group
                    onChange={e => me.handleAllSelectChange(e.target.value)}
                    defaultValue={1}
                  >
                    <Radio.Button value={1}>销量占比</Radio.Button>
                    <Radio.Button value={2}>销售额占比</Radio.Button>
                    <Radio.Button value={3}>买家数占比</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
              <div className="Pl-basewidth2 Pr-basewidth2 Pb-basewidth2">
                <AllDonutChart data={me.state.allChart} />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type="flex" align="middle" justify="space-between">
                <Col>
                  <b>全渠道销量排行</b>
                </Col>
              </Row>
              <div className="Pl-basewidth2 Pr-basewidth2 Pb-basewidth2">
                <Table dataSource={me.state.allAnalysis} pagination={false}>
                  <Table.Column
                    dataIndex="key"
                    title="排行"
                    width="28%"
                    render={(text, record, index) => {
                      return index + 1;
                    }}
                  />
                  <Table.Column dataIndex="name" title="渠道类型" />
                  <Table.Column dataIndex="saleCount" title="销量" width="28%" />
                </Table>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} className={styles.stretch}>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type="flex" align="middle" justify="space-between">
                <Col>
                  <b>线上渠道分析</b>
                </Col>
                <Col>
                  <Radio.Group
                    onChange={e => me.handleOnlineSelectChange(e.target.value)}
                    defaultValue={1}
                  >
                    <Radio.Button value={1}>销量占比</Radio.Button>
                    <Radio.Button value={2}>销售额占比</Radio.Button>
                    <Radio.Button value={3}>买家数占比</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
              <div className="Pl-basewidth2 Pr-basewidth2 Pb-basewidth2">
                <OnlineDonutChart data={me.state.onlineChart} />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type="flex" align="middle" justify="space-between">
                <Col>
                  <b>线上销量排行 TOP 10</b>
                </Col>
              </Row>
              <div className="Pl-basewidth2 Pr-basewidth2 Pb-basewidth2">
                <Table
                  // dataSource={[
                  //   { key: 1, source: '淘宝', name: '阿迪达斯官方旗舰店', sales: 200, },
                  //   { key: 2, source: '微盟', name: '阿迪达斯官方旗舰店', sales: 200, },
                  //   { key: 3, source: '有赞', name: '阿迪达斯官方旗舰店', sales: 200, },
                  //   { key: 4, source: '天猫', name: '阿迪达斯官方旗舰店', sales: 200, },
                  //   { key: 5, source: '京东', name: '阿迪达斯官方旗舰店', sales: 200, },
                  // ]}
                  dataSource={me.state.onlineAnalysis}
                  pagination={false}
                >
                  <Table.Column
                    dataIndex="key"
                    title="排行"
                    width="28%"
                    render={(text, record, index) => {
                      return index + 1;
                    }}
                  />
                  <Table.Column
                    dataIndex="name"
                    title="店铺名"
                    render={(text, record) => {
                      return (
                        <div>
                          {record.channelName === '淘宝' ? (
                            <Tag color="#FF7D00">{record.channelName}</Tag>
                          ) : (
                            ''
                          )}
                          {record.channelName === '天猫' ? (
                            <Tag color="#FF0036">{record.channelName}</Tag>
                          ) : (
                            ''
                          )}
                          {record.channelName === '微信' ? (
                            <Tag color="#00ABDC">{record.channelName}</Tag>
                          ) : (
                            ''
                          )}
                          {record.channelName === '微盟' ? (
                            <Tag color="#00ABDC">{record.channelName}</Tag>
                          ) : (
                            ''
                          )}
                          {record.channelName === '有赞' ? (
                            <Tag color="#EC0000">{record.channelName}</Tag>
                          ) : (
                            ''
                          )}
                          {record.channelName === '京东' ? (
                            <Tag color="#FF3333">{record.channelName}</Tag>
                          ) : (
                            ''
                          )}
                          {text}
                        </div>
                      );
                    }}
                  />
                  <Table.Column dataIndex="saleCount" title="销量" width="28%" />
                </Table>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} className={styles.stretch}>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type="flex" align="middle" justify="space-between">
                <Col>
                  <b>线下渠道分析</b>
                </Col>
                <Col>
                  <Radio.Group
                    onChange={e => me.handleUnlineSelectChange(e.target.value)}
                    defaultValue={1}
                  >
                    <Radio.Button value={1}>销量占比</Radio.Button>
                    <Radio.Button value={2}>销售额占比</Radio.Button>
                    <Radio.Button value={3}>买家数占比</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
              <div className="Pl-basewidth2 Pr-basewidth2 Pb-basewidth2">
                <UnlineDonutChart data={me.state.unlineChart} />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.bgWhite}>
              <Row className={styles.LH48} type="flex" align="middle" justify="space-between">
                <Col>
                  <b>线下销量排行 TOP 10</b>
                </Col>
              </Row>
              <div className="Pl-basewidth2 Pr-basewidth2 Pb-basewidth2">
                <Table dataSource={me.state.unlineAnalysis} pagination={false}>
                  <Table.Column
                    dataIndex="key"
                    title="排行"
                    width="28%"
                    render={(text, record, index) => {
                      return index + 1;
                    }}
                  />
                  <Table.Column dataIndex="name" title="店铺名" />
                  <Table.Column dataIndex="saleCount" title="销量" width="28%" />
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChannelAnalysis;

class AllDonutChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    const data = [
      {
        item: '暂无数据',
        count: 1,
      },
    ];
    const dv = new DataView();
    dv.source(this.props.data.length > 0 ? this.props.data : data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
    };
    return (
      <div>
        <Chart height={360} data={dv} scale={cols} forceFit padding={['5%', '30%', '10%']}>
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = (percent * 100).toFixed(2) + '%';
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ': ' + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

class OnlineDonutChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    const data = [
      {
        item: '暂无数据',
        count: 1,
      },
    ];
    const dv = new DataView();
    dv.source(this.props.data.length > 0 ? this.props.data : data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
    };
    return (
      <div>
        <Chart height={360} data={dv} scale={cols} forceFit padding={['5%', '30%', '10%']}>
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = (percent * 100).toFixed(2) + '%';
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ': ' + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

class UnlineDonutChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    const data = [
      {
        item: '暂无数据',
        count: 1,
      }
    ];
    const dv = new DataView();
    dv.source(this.props.data.length > 0 ? this.props.data : data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = (val * 100).toFixed(2) + '%';
          return val;
        },
      },
    };
    return (
      <div>
        <Chart height={360} data={dv} scale={cols} forceFit padding={['5%', '30%', '10%']}>
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = (percent * 100).toFixed(2) + '%';
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ':' + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}
