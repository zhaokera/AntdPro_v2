import React, { Component } from 'react';
import { Select, Form, Icon, Tooltip, Checkbox} from 'antd';
// import router from 'umi/router';
import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class DMSelect extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xl: { span: 5 }
      },
      wrapperCol: {
        xl: { span: 19 }
      },
    };
    return (
      <>
        <Form {...formItemLayout}>
          <FormItem label="来源渠道" colon={false}>
            {getFieldDecorator('picstate', {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <div><i className={`${styles.taobaoIcon} ${styles.iconCommon}`}>淘宝</i>阿迪达斯官方旗舰店</div>
            )}
          </FormItem>
          <FormItem label="更新内容" colon={false}>
            {getFieldDecorator('updatacon', {
              rules: [
                {
                  required: 'true',
                  message: '请勾选更新内容',
                },
              ],
            })(
              <Checkbox.Group style={{ width: '80%',marginTop:5 }}>
                <Checkbox value="pictitle">商品标题</Checkbox>
                <Checkbox value="picbanner">商品主图</Checkbox>
                <Checkbox value="picdetail">商品详情</Checkbox>
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem label="选择渠道" colon={false}>

            {getFieldDecorator('chosechannel', {
              rules: [
                {
                  message: '请选择',
                },
              ],
            })(
              <Select placeholder="请选择" style={{ width: '73%' }}>
                <Option value="chennel1"><i className={`${styles.taobaoIcon} ${styles.iconCommon}`}>淘宝</i>阿迪达斯官方旗舰店</Option>
                <Option value="chennel2"><i className={`${styles.tmallIcon} ${styles.iconCommon}`}>天猫</i>阿迪达斯官方旗舰店</Option>
                <Option value="chennel3"><i className={`${styles.snIcon} ${styles.iconCommon}`}>苏宁</i>阿迪达斯官方旗舰店</Option>
                <Option value="chennel4"><i className={`${styles.youzanIcon} ${styles.iconCommon}`}>有赞</i>阿迪达斯官方旗舰店</Option>
                <Option value="chennel5"><i className={`${styles.weimengIcon} ${styles.iconCommon}`}>微盟</i>阿迪达斯官方旗舰店</Option>
              </Select>
            )}
            <Tooltip title="不设置渠道，更新内容将从接入渠道中随机获取">
              <Icon type="question-circle" style={{ marginLeft: 10, color: "#9495a4", fontSize: 16, cursor:'pointer' }} />
            </Tooltip>
          </FormItem>
        </Form>
      </>
    );
  }
}

export default DMSelect;