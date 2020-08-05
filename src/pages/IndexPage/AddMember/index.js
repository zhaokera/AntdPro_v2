import React, { Component } from 'react';
import {
  Empty
  } from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from 'bizcharts';
import DataSet from '@antv/data-set';
import request from '@/utils/request';
class RingCharts extends Component {

  state = {
    data: [

    ],
    moneyx: 0,
  }

  componentDidMount() {
    //this.init(1);
  }

  componentWillReceiveProps(newProps) {
    // // this.init(newProps.days)
    // console.log(newProps.days, '子组件xx')
    let d;
    let rt = newProps.days;
    if (rt) {
      d = [];
      let count = 0;
      rt.analysisList.map((e) => {
        d.push({ item: `${e.channelName == "收银端"?"POS代客注册":e.channelName} | ${e.percent}% | ${e.memberCount} `, count: parseFloat(e.memberCount) });// 拼接饼图
        count += parseFloat(e.memberCount);// 计算总数
      });
      this.setState({ data: d, count: count });
      // console.log(d);
    }
  }

  init = (Day) => {
    if (Day) {
      let sdata = {
        Day
      }
      this.setState({ loading: true });
      request('g1/crm.analysis.home.getnewcustomer', {
        method: 'POST',
        body: sdata,
      }).then(rt => {
        let d;
        if (rt) {
          d = [];
          let count = 0;
          rt.analysisList.map((e) => {
            d.push({ item: `${e.channelId} | ${e.percent}% | ${e.memberCount} `, count: parseFloat(e.memberCount) });// 拼接饼图
            count += parseFloat(e.memberCount);// 计算总数
          });
          this.setState({ data: d, count: count });
          // console.log(d);
        }
      });
    }
  }

  render() {
    let htmlshow =`<div style="color:#999;font-size:14px;text-align: center;width: 10em;">新增会员总数<br><span style="color:#3c3b57;font-size:16px">${this.state.count}</span></div>`
    const { DataView } = DataSet;
    const { Html } = Guide;

    const dv = new DataView();
    dv.source(this.state.data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
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
      this.state.count ?
        <div>
          <Chart
            height={188}
            data={dv}
            scale={cols}
            padding={[0, 200, 0, 0]}
            forceFit
          >
            <Coord type={"theta"} radius={0.9} innerRadius={0.8} />
            <Axis name="percent" />
            <Legend
              position="right"
              offsetY={-30}
              offsetX={30}
            />
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style='background-color:{color};' class='g2-tooltip-marker'></span>{name} </li>"
            />
            <Guide>
              <Html
                position={["50%", "50%"]}
                html={htmlshow}
                alignX="middle"
                alignY="middle"
              />
            </Guide>
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*percent",
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
            />
          </Chart>
        </div> : <div> <div style={{width: '100%', height: '200px', textAlign: 'center', lineHeight: '200px',display:'flex',alignItems:'center',justifyContent:'center'}}>
          {/* <img style={{display:"block",textAlign:"center",position:"relative",top:"57px",left:"50%",marginLeft:"-19px"}} src='http://wevip.image.alimmdn.com/qqd/icon_qqdNote.png'/>
          暂无数据 */}
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div></div>
    );
  }
}

export default RingCharts;
