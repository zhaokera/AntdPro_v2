import React, { PureComponent } from 'react';
import { Modal,Button } from 'antd';

class DMOverLay extends PureComponent {
  static defaultProps = {
    width: '80%',
    title: '',
    maskClosable: false,
    okText:'确定',
    cancelText:'取消'
    // confirmLoading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    // this.loading = this.loading.bind(this);
    // this.stopLoading = this.stopLoading.bind(this);
  }

  show = () => {
    this.setState({
      visible: true,
    });
  };

  hide = () => {
    this.setState({
      // confirmLoading: false,
      visible: false,
    });
    
  };

  // stopLoading = () => {
  //   this.setState({
  //     confirmLoading: false,
  //   });
  // };

  // loading = () => {
  //   this.setState({
  //     confirmLoading: true,
  //   });
  // };

  render() {
    const {
      title,
      width,
      handleOk,
      handleCancel,
      children,
      maskClosable,
      confirmLoading,
      footer,
      cancelText,
      okText
    } = this.props;
    const { visible } = this.state;
    return (
      <>
     
      <Modal
        destroyOnClose
        footer={footer}
        width={width}
        title={title}
        visible={visible}
        maskClosable={maskClosable}
        confirmLoading={confirmLoading}
        okButtonProps={{
          htmlType: 'submit',
          style: {
            borderRadius: 2,
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: 2,
          },
        }}
        onOk={e => {
          if (handleOk) handleOk(e);
          else this.hide();
        }}
        onCancel={e => {
          this.hide();
          if (handleCancel) handleCancel(e);
        }}
        cancelText={cancelText}
        okText={okText}
      >
        {children}
      </Modal>
      </>
    );
  }
}

export default DMOverLay;
