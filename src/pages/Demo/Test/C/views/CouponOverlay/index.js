import React, { Component } from 'react';
import { Form, message } from 'antd';
import CouponView from './CouponView';
import { DMOverLay } from '@/components/DMComponents';
import request from '@/utils/request';

const CouponForm = Form.create()(CouponView);

// 优惠券弹窗
class CouponOverLay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, // 弹窗的loading
      checkState: false,
      editData: this.props.editData.id === undefined ? undefined : this.props.editData,
    };
    this.show = this.show.bind(this);
  }

  // 为了防止父组件修改editData但是子组件不修改
  static getDerivedStateFromProps(nextProps, prevState) {
    const { editData } = nextProps;
    if (JSON.stringify(editData) !== JSON.stringify(prevState.editData)) {
      if (!editData) return null;
      return {
        editData: editData,
      };
    }
    return null;
  }

  // 调用优惠券新增Api
  requestCouponAdd(values) {
    const that = this;
    const { callBack } = this.props;
    this.setState({ loading: true });
    request('g2/wx.rights.award.coupon.add', {
      method: 'POST',
      body: values,
    }).then(response => {
      this.setState({ loading: false });
      if (response === '操作成功') {
        that.couponModal.hide();
        if (callBack) callBack('新增成功');
      }
    });
  }

  show = () => {
    this.couponModal.show();
  };

  render() {
    const that = this;
    const { callBack } = this.props;
    const { editData, loading } = this.state;
    return (
      <>
        <DMOverLay
          ref={ref => {
            this.couponModal = ref;
          }}
          confirmLoading={loading}
          title="创建优惠券"
          width={656}
          handleOk={e => {
            // 点击弹窗确认按钮
            e.preventDefault();
            if (!that.state.checkState) {
              message.error('请勾选确认奖品设置!');
              return;
            }
            this.prizeForm.props.form.validateFields((err, values) => {
              if (values.conditions.useCondition && values.conditions.useConditionValue === '') {
                message.error('请输入门槛条件!');
                return;
              }
              if (!err) {
                values.awardUsingStartTime = values.date[0].format('YYYY-MM-DD 00:00:00');
                values.awardUsingEndTime = values.date[1].format('YYYY-MM-DD 23:59:59');
                values.awardConditions = values.conditions.useCondition
                  ? values.conditions.useConditionValue
                  : 0;
                values.awardType = 'Coupon';

                // 判断如果传入的修改的对象，则状态是修改，否则状态就是新增
                if (editData.id === undefined) {
                  // 调用新增api
                  that.requestCouponAdd(values);
                } else {
                  // 调用修改api 修改暂时没api所以这边略过
                  that.couponModal.hide();
                  if (callBack) callBack('修改成功');
                }
              }
            });
          }}
        >
          <CouponForm
            wrappedComponentRef={ref => (this.prizeForm = ref)}
            modelData={editData}
            onChangeCheck={state => {
              that.setState({
                checkState: state,
              });
            }}
          />
        </DMOverLay>
      </>
    );
  }
}

export default CouponOverLay;
