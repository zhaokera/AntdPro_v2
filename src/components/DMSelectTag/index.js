import React, { Component, Fragment } from 'react';
import { Form, Input, Row, Col, Radio, InputNumber, DatePicker, TimePicker, Select } from 'antd';
import { DMOverLay } from '@/components/DMComponents';
import NewCrowd from '@/components/Crowd/NewCrowd';


/*
引用
        <DMSelectTag
         iscanvas={2}  //页面传0 画布传1 普通弹窗传2
          ref={(ref) => { this.selectTag = ref }}
          marketingNodeUpdate={v=>{console.log(v)}}
        />


*/

class DMSelectTag extends Component {
  static defaultProps = {
    loading: false
  }

  constructor(props) {
    super(props);
    this.state = {

    }
    this.show = this.show.bind(this);
  }

  show = () => {
    this.tagModal.show();
  };

  hide = () => {
    this.tagModal.hide();
  };


  // 条件筛选-确定-返回节点名称 人群id，
  handleCreateCrowd = (name, crowdId) => {

    let selectId = [crowdId];

    const me = this;
    let nodeContent = {
      NodeName: name,
      SelectId: selectId,
    };
    if (me.props.marketingNodeUpdate) {
      me.props.marketingNodeUpdate(nodeContent);
    }
    me.tagModal.hide()
  }

  // 确定
  handleOnOk = e => {
  }

  render() {
    const me = this;
    const { loading } = this.props
    let nodeName = (me.props.nodeContent && me.props.nodeContent.NodeName) ? me.props.nodeContent.NodeName : '';
    let crowdId = (me.props.nodeContent && me.props.nodeContent.SelectId && me.props.nodeContent.SelectId.length == 1) ? me.props.nodeContent.SelectId[0] : '';

    return (
      <Fragment>
        <DMOverLay
          ref={ref => {
            this.tagModal = ref;
          }}
          confirmLoading={loading}
          title="条件筛选"
          footer={this.props.activityState?(this.props.activityState!=0)?false:undefined:undefined}
          width={1100}
          handleOk={me.handleOnOk}
          footer={null}
        >
          <NewCrowd
            footer={this.props.activityState?(this.props.activityState!=0)?false:undefined:undefined}
            scroll={true}
            iscanvas={me.props.iscanvas}
            nodeName={nodeName}
            crowdId={crowdId}
            onCancel={() => me.tagModal.hide()}
            createCrowd={me.handleCreateCrowd}
            wrappedComponentRef={ref => (me.tagForm = ref)} />


        </DMOverLay>
      </Fragment>
    )
  }
}
export default DMSelectTag;