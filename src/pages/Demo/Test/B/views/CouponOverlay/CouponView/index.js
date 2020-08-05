import React, { PureComponent } from 'react';
import {
  Alert,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Radio,
  Checkbox,
  Icon,
  Tooltip,
} from 'antd';
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
    prizeArray: this.props.prizeArray === undefined ? [] : this.props.prizeArray, // 奖项
    isJackpot: this.props.isJackpot === undefined ? false : this.props.isJackpot, // 是否是奖池
    modelData:
      this.props.modelData === undefined
        ? {
            awardName: '',
            awardTotalNum: '',
            awardDenomination: '',
          }
        : this.props.modelData,
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
    }
    setFieldsValue(data);
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const { modelData, prizeArray, isJackpot } = this.state;
    const {
      awardName,
      awardUsingStartTime,
      awardUsingEndTime,
      awardGrade,
      awardProbability,
      conditions,
    } = modelData;
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
    let awardGradeVal = !prizeArray.length ? '' : prizeArray[0].val;
    if (awardGrade) {
      awardGradeVal = awardGrade;
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
          <FormItem {...formItemLayout} label="奖项" style={{ display: !isJackpot ? 'none' : '' }}>
            {getFieldDecorator('awardGrade', {
              rules: [
                {
                  required: isJackpot,
                  message: '请选择奖项',
                },
              ],
              initialValue: awardGradeVal,
            })(
              <Select placeholder="请选择" style={{ width: 146 }}>
                {prizeArray.map(item => {
                  return (
                    <Option key={item.val} value={item.val}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
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
          <FormItem
            {...formItemLayout}
            label="中奖概率"
            style={{ display: !isJackpot ? 'none' : '' }}
          >
            {getFieldDecorator('awardProbability', {
              type: 'number',
              rules: [
                {
                  required: isJackpot,
                  message: '请输入最多6位小数的中奖概率',
                  pattern: '^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,6})?$',
                },
              ],
              initialValue: !awardProbability ? '0.000001' : awardProbability,
            })(<Input style={{ width: 160 }} min={0} max={100} addonAfter={<span>%</span>} />)}
            <Tooltip title="中奖总概率可设置区间为0%至100%。本软件中奖概率是按数学中的概率统计学来计算的，并非硬性指标。比如概率为1%，并非100次抽奖有且只有1次中奖，也不是第100次抽奖才会中奖。而是每一次抽奖的机率都是平等的，第一次抽是1%,第100次、1万次抽也是1%。举个现实中抽奖的例子，抽奖箱中有100个球，其中1个是红球代表中奖，其它99个是白球代表不中奖，每一次只能从中抽取1个球，抽完后再放入箱中，下一个人再来抽(即每次抽奖箱中都有100个球，保证每次抽奖的概率平等性)，这样有可能第1个抽奖的就抽中了红球，或有可能第100个抽奖的都没抽中，也或100个人抽了已经有3个抽中了红球都有可能，都是属于统计学的概率问题。">
              <Icon type="question-circle-o" style={{ marginLeft: 16, color: '#9495A4' }} />
            </Tooltip>
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
