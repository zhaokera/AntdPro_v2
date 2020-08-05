import React, { Component } from 'react';
import { DMButton, DMSelect, DMSelectCoupon } from '@/components/DMComponents';
import { Divider, Card, message, Button } from 'antd';
import { connect } from 'dva';

// import styles from './index.less';

@connect(({ user }) => {
  return {
    currentUser: user.currentUser,
  };
})
class index extends Component {
  state = {
    couponSelected: {},
    couponListSelected: [], // 多选2
  };

  render() {
    const that = this;
    const { currentUser } = this.props;
    const { couponListSelected } = this.state;
    let userInfoJson = '';
    if (currentUser) {
      userInfoJson = JSON.stringify(currentUser);
    }
    let checkedList = [];
    checkedList = couponListSelected.map(v => v.id).join();
    return (
      <Card>
        <Divider>按钮</Divider>
        <DMButton
          title="普通按钮"
          onPress={checked => {
            message.success(checked ? '选中' : '取消选中');
          }}
        />

        <Divider>单选按钮</Divider>

        <DMSelect
          style={{
            width: 300,
          }}
          dataList={[
            { title: '测试1', value: {} },
            { title: '测试2', value: {} },
            { title: '测试3', value: {} },
          ]}
          onChange={({ item }) => {
            message.success(`当前选中${JSON.stringify(item)}`);
          }}
        />

        <Divider>多选按钮</Divider>

        <DMSelect
          style={{
            width: 300,
          }}
          dataList={[
            { title: '测试4', value: {} },
            { title: '测试5', value: {} },
            { title: '测试6', value: {} },
          ]}
          type="multi"
          onChange={({ item }) => {
            message.success(`当前选中${JSON.stringify(item)}`);
          }}
        />
        <Divider>选择优惠券</Divider>
        <Button
          type="primary"
          onClick={() => {
            this.selectCouponView.show();
          }}
        >
          选择优惠券
        </Button>
        <DMSelectCoupon
          ref={ref => {
            this.selectCouponView = ref;
          }}
          // width={1250}
          checked={this.state.couponSelected}
          handleOk={coupon => {
            that.setState({
              couponSelected: coupon,
            });
          }}
        />
        <Divider>选择优惠券多选</Divider>
        <Button
          type="primary"
          onClick={() => {
            this.multiCouponView.show();
          }}
        >
          选择优惠券多选
        </Button>
        <DMSelectCoupon
          ref={ref => {
            this.multiCouponView = ref;
          }}
          // width={1250}
          type="multi"
          checkedList={checkedList}
          handleOk={list => {
            that.setState({
              couponListSelected: list,
            });
            console.log('list', list);
          }}
        />
        <Divider>获取用户信息</Divider>
        <span>{userInfoJson}</span>
      </Card>
    );
  }
}

export default index;
