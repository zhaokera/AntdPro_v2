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
    if(this.props.dataEdit.propName)
    {
      this.setState({
        namelength:this.props.dataEdit.propName.length
      });
    }
    //console.log(1, this.props.dataEdit);
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        //console.log('Received values of form: ', values);
        //console.log('Merged values:', keys.map(key => names[key]));

      }
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        label="属性值"
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
        })(<Input maxLength={10} placeholder="请输入属性值" style={{ width: 220, marginRight: 8 }} />)}
        <a onClick={() => this.remove(k)}>删除</a>
      </Form.Item>
    ));
    return (
      <Form onSubmit={this.handleSubmit} className={styles.Blacklist_Modal} {...formItemLayout}>
        <Form.Item label="属性名称">
          {
            getFieldDecorator('PropName', {
              rules: [{ required: true, message: "请输入属性名称!" }],
              initialValue: this.props.dataEdit.propName || ''
            })(
              <Input
                placeholder="请输入属性名称"
                onChange={this.changeVal}
                style={{width:220}} 
                maxLength={5}
              />
            )
          }
           &nbsp;<a onClick={this.add}>添加属性值</a>
        </Form.Item>
        {/* <Form.Item label="属性值">
          {
            getFieldDecorator('PropType', {
              rules: [{ required: false, message: "请填写属性值!" }]
            })(
              <Input placeholder="请输入属性值" style={{width:220}} />
            )
          }
          &nbsp;<a onClick={this.add}>添加属性值</a>
        </Form.Item> */}
        {formItems}
        
      </Form>
    )
  }
}