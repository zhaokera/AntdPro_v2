
import React, { Component } from 'react';
import { Button, Form, Row, Col, Input, Table, Badge } from 'antd';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';
import Ellipsis from '@/components/Ellipsis';
// import styles from './index.less';
@connect(({ loading, email }) => {
  return {
    loading: loading.models.email,
    email,
  };
})
class ConditionElement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage:1,
      pageSize:10,
      totalCount:0,
      selectEmail:"",
      data: []
    }
  }

  componentDidMount() {
    this.onSelectData(1,10,"");
  }

  handleSubmit = e => {
    const me=this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        me.onSelectData(1,10,values.email);
      }
    });
  }

  onSelectData=(currentPage,pageSize,selectEmail)=>{
    const me = this;
    currentPage=currentPage?currentPage:me.state.currentPage;
    pageSize=pageSize?pageSize:me.state.pageSize;
    selectEmail=selectEmail?selectEmail:"";

    me.props.dispatch({
      type: 'email/ListGetEmailTest',
      payload: {
        TestEmail: selectEmail,
        PageIndex:currentPage,
        PageSize:pageSize
      },
      callback: (response) => {
        if (response) {
          this.setState({
            currentPage:currentPage,
            pageSize:pageSize,
            selectEmail:selectEmail,
            totalCount:response.totalCount,
            data:response.data
          });
        }
      }
    });


  }
  
  onReset=()=>{
    const me=this;
    me.props.form.resetFields();
    me.onSelectData(1,10,"");
  }

  render() {
    const columns = [
      {
        dataIndex: 'getEmail',
        width: "20%",
        title: '测试邮箱地址'
      }, 
      {
        dataIndex: 'emailTitle',
        title: '邮件主题',
        render:(txt) => {
          return (
            <div><Ellipsis length={20} tooltip>{txt}</Ellipsis></div>
          )
      }
    }, {
        dataIndex: 'createTime',
        title: '发送时间',
        width: "20%",
      }, {
        dataIndex: 'sendState',
        title: '发送结果',
        width: "18%",
        render: (txt) => {
          return (
            <div>
              {txt === "0" ? <Badge status='default' text='等待发送' /> : ""}
              {txt === "1" ? <Badge status='default' text='发送中' /> : ""}
              {txt === "2" ? <Badge status='success' text='发送成功' /> : ""}
              {txt === "3"||txt==null ? <Badge status='error' text='发送失败' /> : ""}
            </div>
          )
        }
      }
    ]
    const { getFieldDecorator } = this.props.form;
    const formItemlayout = {
      labelCol: { xxl: 5, xl: 5, sm: 6 },
      wrapperCol: { xxl: 18, xl: 18, sm: 17 },
      colon: false
    }
    return (
      <Form {...formItemlayout} onSubmit={this.handleSubmit}>
        <Row type='flex'>
          <Col span={12}>
            <Form.Item label='邮箱'>
              {
                getFieldDecorator('email')(
                  <Input allowClear placeholder='请输入测试邮箱地址' />
                )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Row type='flex' gutter={8}>
                <Col><Button type='primary' htmlType="submit">查询</Button></Col>
                <Col><Button onClick={this.onReset}>重置</Button></Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
        <Table
            dataSource={this.state.data}
            columns={columns}
            scroll={{ y: 400 }}
            pagination={{
              size: 'small',
              total: this.state.totalCount,
              showTotal: total => '共 '+total+' 条记录',
              pageSize: this.state.pageSize,
              defaultCurrent: 1,
              showQuickJumper: true,
              showSizeChanger: true,
              current: this.state.currentPage,
              onChange: (page, pageSize) => this.onSelectData(page, pageSize,this.state.selectEmail),
              pageSizeOptions: ['10', '20', '50', '100'],
              onShowSizeChange: (page, pageSize) => this.onSelectData(page, pageSize,this.state.selectEmail),
              style: { marginTop: '10px', float: 'right' },
            }}
          />
      </Form>
    )
  }
}
const RecordForm = Form.create()(ConditionElement)


class RecordOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {


    }
    this.show = this.show.bind(this)
  }

  show = () => {
    this.recordModal.show();
  }



  render() {


    return (
      <DMOverLay
        ref={(ref) => { this.recordModal = ref }}
        title='邮件测试记录'
        width={800}
      >
        <RecordForm wrappedComponentRef={(ref) => { this.recordForm = ref }} />
      
      </DMOverLay>
    )
  }
}

export default RecordOverlay;