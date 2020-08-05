import React, { Component } from 'react';
import { Progress, Modal, Row, Col } from 'antd';
import { DMOverLay } from '@/components/DMComponents';

class LeadInOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      state: this.props.state
    };
    this.show = this.show.bind(this);
  }


  show = () => {
    this.addModal.show();
  };

  

  render() {
    const { loading } = this.state
    return (
      <>
        <DMOverLay
          ref={ref => {
            this.addModal = ref;
          }}
          confirmLoading={loading}
          title="添加自建商城"
          width={450}
          handleOk={e => {
            e.preventDefault();
            const { state } = this.state

            if (state === 'success') {
              Modal.success({
                title: '导入成功',
                okText: '知道了',
                content: (
                  <div>
                    <div>导入30条数据</div>
                    <div>成功30  失败0</div>
                  </div>
                ),
              })
            }
            if (state === 'wraning') {
              Modal.warning({
                title: '部分导入成功',
                okText: '知道了',
                content: (
                  <div>
                    <div>导入30条数据</div>
                    <Row type="flex" gutter={16}>
                      <Col>成功30</Col>
                      <Col>失败0</Col>
                      <Col><a href='javascript:;'>下载导入失败数据</a></Col>
                    </Row>
                  </div>
                )
              })
            }
            if (state === 'error') {
              Modal.error({
                title: '导入失败',
                okText: '知道了',
                content: (
                  <div>
                    <div>导入30条数据</div>
                    <Row type="flex" gutter={16}>
                      <Col>成功0</Col>
                      <Col>失败30</Col>
                      <Col><a href='javascript:;'>下载导入失败数据</a></Col>
                    </Row>
                  </div>
                )
              })
            }
          }}
        >
          <div>
            <Progress percent={30} />
            <div className='Mb-basewidth2'>数据导入中... 批量导入需要时间，请耐心等待，您可以在导入记录中查看导入进度</div>
          </div>
        </DMOverLay>
      </>
    );
  }
}

// export default Form.create()(AddOverlay);
export default LeadInOverlay;
