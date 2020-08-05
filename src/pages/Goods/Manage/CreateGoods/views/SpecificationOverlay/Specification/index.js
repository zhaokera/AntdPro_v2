import React, { Component, PureComponent } from 'react';
import { Form, Input, Row, Col, Select, Button, Tag, message } from 'antd';
import styles from './index.less'
import { connect } from 'dva';

let id = 0;

@connect(({ loading, AttributeModels }) => {
  return {
    loading: loading.models.AttributeModels,
    AttributeModels,
  };
})

@Form.create()
export default class CreateAttributeOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      namelength: 0,
    }
  }

  //输入框数字计数
  changeVal = e => {
    this.setState({
      namelength: e.target.value.length,
    });
  };

  componentDidMount() {
    if (this.props.dataEdit.propName) {
      this.setState({
        namelength: this.props.dataEdit.propName.length
      });
    }
    console.log(1, this.props.dataEdit);
  }

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 18
      },
      colon: false
    }

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        label="规格值"
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请填写",
            },
          ],
        })(<Input maxLength={10} placeholder="请输入规格值" style={{ width: 220, marginRight: 8 }} />)}
        <a onClick={() => this.remove(k)}>删除</a>
      </Form.Item>
    ));


    return (
      <Form className={styles.Blacklist_Modal} {...formItemLayout}>
        <Form.Item label="规格名称">
          {
            getFieldDecorator('PropName', {
              rules: [{ required: true, message: "请输入规格名称!" }],
              initialValue: this.props.dataEdit.propName || ''
            })(
              <Input
                style={{ width: 220 }}
                placeholder="请输入规格名称"
                onChange={this.changeVal}
                maxLength={5}
              />
            )
          }
          &nbsp;<a onClick={this.add}>新增规格值</a>
        </Form.Item>

        {formItems}

      </Form>
    )
  }
}