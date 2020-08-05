import React, { Component } from 'react';
import { Form, message } from 'antd';
import LeadinView from './LeadinView';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';

const LeadinForm = Form.create()(LeadinView);

@connect(
  ({ loading, blacklist }) => {
    // console.log("逻辑层：", taglist.data)
    return {
      loading: loading.models.blacklist,
      listData: blacklist.data
    };
  },
  null,
  null,
  { withRef: true }
)

class LeadinOverlay extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.show = this.show.bind(this);
  }

  show = () => {
    this.LeadinModal.show();
  };

  render() {
    const that = this;
    const { dispatch, loading } = this.props;
    return (
      <>
        <DMOverLay
          ref={ref => {
            this.LeadinModal = ref;
          }}
          confirmLoading={loading}
          title={"添加黑名单"}
          width={420}
          handleOk={e => {
            e.preventDefault();
            console.log("ok")
          }}
        >
          <LeadinForm />
        </DMOverLay>
      </>
    );
  }
}

export default LeadinOverlay;