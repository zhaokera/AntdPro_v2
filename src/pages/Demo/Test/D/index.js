import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { } from 'antd';
import { connect } from 'dva';

@connect(({ area, loading }) => ({
  area,
  loading: loading.models.area,
}))
class area extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  // 组件渲染完成
  componentDidMount() {
    this.requestAddress();
  }

  requestAddress() {
    this.props.dispatch({
      type: 'area/SelectAddress',
      payload: {},
    });
  }



  render() {
    return (
      <PageHeaderWrapper title="查询所有地区" content="">
        <div>查询所有地区</div>
      </PageHeaderWrapper>
    );
  }
}

export default area;
