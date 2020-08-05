import React, { Component } from 'react';
import { Form, message } from 'antd';
import CouponView from './CouponView';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';

const CouponForm = Form.create()(CouponView);

// 优惠券弹窗
@connect(
  ({ loading, coupon }) => {
    return {
      loading: loading.models.coupon,
      couponData: coupon.data,
    };
  },
  null,
  null,
  { withRef: true }
)
class CouponOverLay extends Component {
  static defaultProps = {
    type: 'add',
  };

  constructor(props) {
    super(props);
    this.state = {
      checkState: false,
      visible: false,
      editData: this.props.editData.id === undefined ? undefined : this.props.editData,
      type: this.props.editData.id === undefined ? 'add' : 'edit', // 新增弹窗add 修改edit
    };
    this.show = this.show.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { editData, type } = nextProps;
    if (JSON.stringify(editData) !== JSON.stringify(prevState.editData)) {
      if (!editData) return null;

      return {
        editData: editData,
        type: type,
      };
    }
    if (type !== prevState.type) {
      return {
        type: type,
      };
    }
    return null;
  }

  show = () => {
    this.couponModal.show();
  };

  requestList = () => {
    const {
      dispatch,
      couponData: { queryParams },
    } = this.props;
    queryParams.currentPage = 1;
    dispatch({
      type: 'coupon/fetch',
      payload: queryParams,
    });
  };

  render() {
    const that = this;
    const { dispatch, loading } = this.props;
    const { editData, type } = this.state;
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

                if (type === 'add') {
                  dispatch({
                    type: 'coupon/couponAdd',
                    payload: values,
                    callBack: res => {
                      if (res === '操作成功') {
                        that.couponModal.hide();
                        that.requestList();
                      }
                    },
                  });
                } else {
                  // 调用修改api
                  that.couponModal.hide();
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

// Array.isArray(response) ? response : [],
