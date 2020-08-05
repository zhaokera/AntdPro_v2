import React, { Component } from 'react';
import { Checkbox, InputNumber, Button } from 'antd';
import DMSelectCoupon from '../DMSelectCoupon';
import logo from '../../../assets/common/logo_crm.png';
import styles from './index.less';

class index extends Component {
  state = {
    value: {
      isIntegralSelected: false, // 是否选择积分
      integralVal: 0, // 积分值
      isCouponSelected: false, // 是否选择优惠券
      couponVal: {}, // 优惠券值
      isGoodsSelected: false, // 是否选择实物
      goodsVal: {}, // 实物值
    },
  };

  render() {
    const { onChange } = this.props;
    const { value } = this.state;
    const {
      couponName,
      couponUseTime,
      couponRange,
      couponLevel,
      surplusQuantitiy,
    } = value.couponVal;
    const that = this;
    return (
      <>
        <DMSelectCoupon
          ref={ref => {
            this.selectCouponView = ref;
          }}
          // width={1250}
          checked={value.couponVal}
          handleOk={coupon => {
            value.couponVal = coupon;
            that.setState(value);
            if (onChange) onChange(value);
          }}
        />
        <div className={styles.div}>
          <div>
            <Checkbox
              onChange={e => {
                value.isIntegralSelected = e.target.checked;
                that.setState(value);
                if (onChange) onChange(value);
              }}
            >
              积分
            </Checkbox>
            <InputNumber
              className="Ml-basewidth"
              min={1}
              onChange={val => {
                value.integralVal = val;
                that.setState(value);
                if (onChange) onChange(value);
              }}
            />
            <span className="Ml-basewidth fs-12">个积分</span>
          </div>
          <div className="Mt-basewidth2">
            <Checkbox
              onChange={e => {
                value.isCouponSelected = e.target.checked;
                that.setState(value);
                if (onChange) onChange(value);
              }}
            >
              门店优惠券
            </Checkbox>
            <br />
            {value.couponVal.id ? (
              <div className={styles.couponDiv}>
                {`${couponName}，有效期${couponUseTime}，${couponRange}，适用范围:${couponLevel}，剩余${surplusQuantitiy}张`}
                <Button
                  type="link"
                  onClick={() => {
                    this.selectCouponView.show();
                  }}
                >
                  重新选择
                </Button>
              </div>
            ) : (
              <Button
                className={styles.selBtn}
                type="dashed"
                onClick={() => {
                  this.selectCouponView.show();
                }}
              >
                选择优惠券
              </Button>
            )}
          </div>
          <div className="Mt-basewidth2">
            <Checkbox
              onChange={e => {
                value.isGoodsSelected = e.target.checked;
                that.setState(value);
                if (onChange) onChange(value);
              }}
            >
              实物奖品
            </Checkbox>
            <br />
            {value.goodsVal.id ? (
              <div className={styles.goodsDiv}>
                <div>
                  <img src={logo} alt="test" style={{ width: 66, height: 66 }} />
                </div>
                <div className={styles.goodsRview}>
                  <span className="Mt-basewidth">新年装饰摆设摆件LED夜灯</span>
                  <span>展示价格：220元/件</span>
                  <span>剩余库存：200</span>
                </div>
                <Button
                  // className={styles.goodsBtn}
                  type="link"
                  onClick={() => {
                    // 测试才这样写
                    value.goodsVal = {};
                    that.setState(value);
                    if (onChange) onChange(value);
                    // this.selectCouponView.show();
                  }}
                >
                  重新选择
                </Button>
              </div>
            ) : (
              <Button
                className={styles.selBtn}
                type="dashed"
                onClick={() => {
                  // 测试才这样写
                  value.goodsVal = { id: 5 };
                  that.setState(value);
                  if (onChange) onChange(value);
                  // this.selectCouponView.show();
                }}
              >
                选择实物奖品
              </Button>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default index;
