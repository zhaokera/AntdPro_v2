import React, { Component } from 'react';
import { Button, Form, Select, InputNumber, Input, Row, Col, Table, Tooltip, Icon,message } from 'antd';
import SelectChannelNew from '@/components/CommonModal/SelectChannelNew';
import styles from '../../index.less';
import { request } from 'http';
import requests from '@/utils/request';

@Form.create()
class CommodityAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
         dataSource:[],
         selectChannelValue:[],//渠道信息
         totalNum:0,
         selectChannelshow:true,
    }
  }
  componentDidMount(){
      this.init();
  }

  init=()=>{

    
    var queryData ={
      OuterCode:this.props.GoodId,
      ChannelId:"",
      ShopId:"",
      Day:"",
      Condition:this.props.form.getFieldValue('keyword'),
      MinRelatedMemberCount:this.props.form.getFieldValue('value1'),
      MaxRelatedMemberCount:this.props.form.getFieldValue('value2'),
      MinRelatedPresent:this.props.form.getFieldValue('value3'),
      MaxRelatedPresent:this.props.form.getFieldValue('value4')
    } 
    if (this.state.selectChannelValue.length == 1) {
      queryData.ChannelId = this.state.selectChannelValue[0].value;
    }
    if (this.state.selectChannelValue.length == 2) {
      queryData.ChannelId = this.state.selectChannelValue[0].platform;
      queryData.ShopId = this.state.selectChannelValue[1].value;
    }
    if(queryData.MaxRelatedMemberCount<queryData.MinRelatedMemberCount){
      message.error("连带人数最大值必须大于最小值");
      return;
    }
    if(queryData.MaxRelatedPresent<queryData.MinRelatedPresent){
      message.error("连带率最大值必须大于最小值");
      return;
    }
    requests('g1/crm.analysis.product.getrelationanalysis',{
      method:'POST',
      body:queryData,
    }).then(response=>{
        if(response){
            var a = response;
            this.setState({
              dataSource:response.analysisList,
              totalNum:response.totalRelatedMemberCount
            });
          }
    })
  }

    resetBut=()=>{
      const me=this;
        this.props.form.resetFields();

        me.setState({selectChannelshow:false},()=>{
         me.setState({
          selectChannelshow:true
         })
        });
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    const me = this;
    const formItemlayout = {
      labelCol: { xxl: 5, xl: 5, sm: 6 },
      wrapperCol: { xxl: 18, xl: 18, sm: 17 },
      colon: false
    }
    return (
      <div className={styles.CommodityAnalysis} style={{ backgroundColor: '#fff' }}>
        <Form {...formItemlayout}>
          <Row>
            <Col span={8}>
           
              <Form.Item label='选择渠道'>
                {this.state.selectChannelshow && 
                 <SelectChannelNew
                   
                 onChange={(values) => {
                   me.setState({selectChannelValue:values},()=>{
                     me.init();
                   });
                 }}
                />
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='连带人数'>
                <Row type='flex' gutter={8}>
                  <Col>
                    {
                      getFieldDecorator('value1')(
                        <InputNumber min={0} max={100000000} precision={0}/>
                      )
                    }
                  </Col>
                  <Col>-</Col>
                  <Col>
                    {
                      getFieldDecorator('value2')(
                        <InputNumber min={0} max={100000000} precision={0}/>
                      )
                    }
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='连带率'>
                <Row type='flex' gutter={8}>
                  <Col>
                    {
                      getFieldDecorator('value3')(
                        <InputNumber min={0} max={100}/>
                      )
                    }
                  </Col>
                  <Col>-</Col>
                  <Col>
                    {
                      getFieldDecorator('value4')(
                        <InputNumber min={0} max={100}/>
                      )
                    }
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='名称/编码'>
                <Input.Group compact>
                 
                  {
                    getFieldDecorator('keyword')(
                      <Input allowClear className={styles.widthAutos} maxLength={60} placeholder='请输入名称/编码' />
                    )
                  }
                </Input.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label=' '>
                <Row type='flex' gutter={16}>
                  <Col><Button type='primary' onClick={() => { this.init() }}>查询</Button></Col>
                  <Col><Button onClick={() => this.resetBut()}>重置</Button></Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Table
          pagination={false}
          dataSource={this.state.dataSource}
        >
          <Table.Column
            dataIndex='productName'
            title='连带商品'
            render={(text, record) => {
              return (
                <Row type='flex' gutter={8}>
                  <Col style={{ flexShrink: 1 }}><img className={styles.proImg} src={record.productImg} alt='' /></Col>
                  <Col>
                    <div>{text}</div>
                    <div style={{ color: '#FF4049' }}>¥{record.minPrice}-￥{record.maxPrice}</div>
                  </Col>
                </Row>
              )
            }}
          />
          <Table.Column dataIndex='relatedProductOuterCode' title='编码' width='20%' />
          <Table.Column dataIndex='relatedMemberCount' title={<Tooltip title='同时购买了商品A和商品B的人数'>连带人数 &nbsp;<Icon type="question-circle" /></Tooltip>} width='20%' />
          <Table.Column dataIndex='relationPresent' sorter={(a,b)=>a.relationPresent-b.relationPresent} title={<Tooltip title='购买了商品A且购买了商品B的人数/购买了商品A的人数'>连带率 &nbsp;<Icon type="question-circle" /></Tooltip>} width='20%' render={(text) => (<span>{text}%</span>)} />
        </Table>
      </div>
    )
  }
}

export default CommodityAnalysis;