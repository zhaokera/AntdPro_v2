import React, { PureComponent } from 'react';
import { Alert, Form, Input, DatePicker, Select, InputNumber, Radio, Checkbox } from 'antd';
import moment from 'moment';
import styles from './index.less';

/**
 * 优惠券模版
 */
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class ConditionElement extends PureComponent {
  static defaultProps = {
    onChange: undefined,
  };

  state = {
    value: {
      useCondition: this.props.value === undefined ? 0 : this.props.value.useCondition,
      useConditionValue: this.props.value === undefined ? '' : this.props.value.useConditionValue,
    },
  };

  render() {
    const radioStyle = {
      height: '30px',
      lineHeight: '30px',
    };
    const { value } = this.state;
    const { onChange } = this.props;
    return (
      <Radio.Group
        defaultValue={value.useCondition}
        onChange={e => {
          const useCondition = e.target.value;
          value.useCondition = useCondition;
          this.setState({
            value: value,
          });
          if (onChange) onChange(value);
        }}
      >
        <Radio style={radioStyle} value={0}>
          无门槛
        </Radio>
        <Radio style={radioStyle} value={1}>
          有门槛
        </Radio>
        <br />
        满
        <InputNumber
          style={{ marginLeft: 8, marginRight: 8, width: 144 }}
          placeholder="请输入"
          parser={val => val.replace(/\D/g, '')}
          defaultValue={value.useConditionValue}
          onChange={result => {
            const useConditionValue = result;
            value.useConditionValue = useConditionValue;
            this.setState({
              value: value,
            });
            if (onChange) onChange(value);
          }}
        />
        使用
      </Radio.Group>
    );
  }
}

@Form.create()
class DMCreateCouponOverlay extends PureComponent {
  state = {
    total: 0,
    useCondition: 0,
    modelData: this.props.modelData,
  };

  componentDidMount() {
    const { modelData } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    const { awardDenomination, awardTotalNum } = modelData;

    const data = {
      awardDenomination: awardDenomination,
      awardTotalNum: awardTotalNum,
    };
    if (!modelData.id) {
      data.conditions = {
        useCondition: 0,
        useConditionValue: '',
      };
    } else {
      data.conditions = {
        useCondition: awardDenomination ? 1 : 0,
        useConditionValue: `${awardDenomination}`,
      };
    }
    setFieldsValue(data);
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const { modelData } = this.state;
    const { awardName, awardUsingStartTime, awardUsingEndTime, conditions } = modelData;
    const time1 = awardUsingStartTime === undefined ? '' : moment(awardUsingStartTime, dateFormat);
    const time2 = awardUsingEndTime === undefined ? '' : moment(awardUsingEndTime, dateFormat);
    let total = this.state.total;
    const awardDenomination = getFieldValue('awardDenomination');
    const awardTotalNum = getFieldValue('awardTotalNum');
    if (awardTotalNum && awardDenomination) {
      total = awardDenomination * awardTotalNum;
    } else if (awardDenomination) {
      total = awardDenomination;
    }
    const that = this;
    return (
      <div className={styles.coupon}>
        <Alert
          message="奖品发放成功后，无法撤回，请谨慎设置优惠券基本信息。"
          type="info"
          showIcon
        />
        <Form className={styles.formView}>
          <FormItem {...formItemLayout} label="奖品名称">
            {getFieldDecorator('awardName', {
              rules: [
                {
                  required: true,
                  message: '请输入优惠券名称',
                },
              ],
              initialValue: awardName,
            })(
              <Input
                placeholder="请输入优惠券名称"
                maxLength={10}
                style={{ width: 232 }}
                suffix={
                  <span style={{ color: '#9495A4' }}>
                    {!getFieldValue('awardName') ? 0 : getFieldValue('awardName').length}/10
                  </span>
                }
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="使用时间">
            {getFieldDecorator('date', {
              rules: [
                {
                  required: true,
                  message: '请选择时间',
                },
              ],
              initialValue: [time1, time2],
            })(
              <RangePicker
                format={dateFormat}
                style={{ width: 232 }}
                placeholder={['开始时间', '结束时间']}
                disabledDate={current => {
                  return current && current < moment().startOf('day');
                }}
                ranges={{
                  '7天': [moment(), moment().add(7, 'days')],
                  '15天': [moment(), moment().add(15, 'days')],
                  '30天': [moment(), moment().add(30, 'days')],
                }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="优惠金额">
            {getFieldDecorator('awardDenomination', {
              rules: [
                {
                  required: true,
                  message: '请选择优惠金额',
                },
              ],
              initialValue: modelData.awardDenomination,
            })(
              <Select placeholder="请选择优惠金额" style={{ width: 232 }}>
                <Option value="3">3</Option>
                <Option value="5">5</Option>
                <Option value="10">10</Option>
                <Option value="20">20</Option>
                <Option value="100">100</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="使用条件">
            {getFieldDecorator('conditions', {
              rules: [
                {
                  required: true,
                  message: '请选择使用条件',
                },
              ],

              initialValue: conditions,
            })(<ConditionElement />)}
          </FormItem>
          <FormItem {...formItemLayout} label="发行总量">
            {getFieldDecorator('awardTotalNum', {
              rules: [
                {
                  required: true,
                  message: '请输入发行总量',
                },
              ],
              initialValue: modelData.awardTotalNum,
            })(
              <InputNumber
                style={{
                  width: 232,
                }}
                parser={val => val.replace(/\D/g, '')}
                min={1}
                max={100000}
                placeholder="请输入/份"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="成本预算">
            <span className={styles.money}>{total}</span>元
            <br />
            <Checkbox
              onChange={e => {
                that.props.onChangeCheck(e.target.checked);
              }}
            >
              我已确认当前奖品设置，并知晓奖品成本预算
            </Checkbox>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default DMCreateCouponOverlay;
