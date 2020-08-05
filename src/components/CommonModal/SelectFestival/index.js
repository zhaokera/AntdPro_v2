import React, { Component, Fragment } from 'react';
import { Radio, Form, Row, Col,message } from 'antd';
import { DMOverLay } from '@/components/DMComponents';
import styles from './index.less';

class ConditionElement extends Component {
  state = {
    data: [
      {
        name: '法定节日',
        children: [
          { name: '元旦', value: '元旦' },
          { name: '春节', value: '春节' },
          { name: '劳动节', value: '劳动节' },
          { name: '端午节', value: '端午节' },
          { name: '中秋节', value: '中秋节' },
          { name: '国庆节', value: '国庆节' },
        ]
      },
      {
        name: '西方节日',
        children: [
          { name: '情人节', value: '情人节' },
          { name: '万圣节', value: '万圣节' },
          { name: '圣诞节', value: '圣诞节' },
        ]
      },
      {
        name: '大众节日',
        children: [
          { name: '元宵节', value: '元宵节' },
          { name: '母亲节', value: '母亲节' },
          { name: '儿童节', value: '儿童节' },
          { name: '父亲节', value: '父亲节' },
          { name: '妇女节', value: '妇女节' },
          { name: '七夕节', value: '七夕节' },
          { name: '重阳节', value: '重阳节' },
          { name: '520', value: '520' },
          { name: '618大促', value: '618大促' },
          { name: '双十一', value: '双十一' },
          { name: '双十二', value: '双十二' },
        ]
      },

    ]
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.state;
    return (
      <Form>
        <Form.Item>
          {
            getFieldDecorator('day')(
              <Radio.Group>
                {
                  data.map((item, index) => (
                    <div key={index}>
                      <div className={styles.page_title_s}><b>{item.name}</b></div>
                      <Row type='flex' gutter={16}>
                        {
                          item.children.map((day, key) => (
                            <Col key={key} span={4}>
                              <Radio value={day.value}>{day.name}</Radio>
                            </Col>
                          ))
                        }
                      </Row>
                    </div>
                  ))
                }
              </Radio.Group>
            )
          }
        </Form.Item>
      </Form>
    )
  }
}
const RadioForm = Form.create()(ConditionElement)


class SelectFestival extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    this.show = this.show.bind(this);
  }

  show = () => {
    this.radioModal.show();
  };

  render() {
    const { width, handleOk } = this.props;
    const { loading } = this.state;
    return (
      <DMOverLay
        title='选择节日'
        width={width}
        ref={ref => {
          this.radioModal = ref;
        }}
        confirmLoading={loading}
        handleOk={(e) => {
          e.preventDefault();
          this.radioForm.props.form.validateFields((err, values) => {
            if (!err) {
              if(values.day==null)
              message.error('请选择节日');
              else
              {
                if (handleOk) handleOk(values.day);
                this.radioModal.hide();
              }
            }
          })
        }}
      >
        <RadioForm wrappedComponentRef={(ref) => { this.radioForm = ref }} />
      </DMOverLay>
    )
  }
}

export default SelectFestival;