import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, Checkbox, Row, Col, Modal, Table,message } from 'antd';
import { Tooltip as AntdTooltip } from 'antd';
import { connect } from 'dva';
import Ellipsis from '@/components/Ellipsis';
import styles from "./index.less"


const FormItem = Form.Item


@connect(({ loading, marketing }) => {
  return {
    loading: loading.models.marketing,
    marketing,
  };
})

@Form.create()
class DMSendMsg extends Component {
  state = {
    namelength:(this.props.nodeContent && this.props.nodeContent.NodeName)?this.props.nodeContent.NodeName.length:0,
    sign:'',
    content:'',
    smsLength:6,
    smsCount:1,
    smsShow:'',
    shieldDay: (this.props.nodeContent &&this.props.nodeContent.ShieldDay)?this.props.nodeContent.ShieldDay:0,
    isShieldDays: this.props.nodeContent && this.props.nodeContent.ShieldDay&&this.props.nodeContent.ShieldDay>0,
    IsShieldBlack:this.props.nodeContent && this.props.nodeContent.IsShieldBlack>0,
    visible: false,
    isShow: false,// 生成短链弹窗
    longLink: '',// 长链接
    searchPhone:'',
    currentPage:1,
    pageSize:10,
    totalCount:0,
    data: [],
    isNoUnsubscribe:this.props.isNoUnsubscribe,// 是否不返回退订回N false 返回 true 不返回
  }

 componentDidMount(){
   this.handleGetSmsTestList(1,this.state.pageSize);
   this.smsChange(); 
 }

  // 短信测试记录弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
      isShow: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      isShow: false,
    });
  };

  // 节点名称输入框数字计数
  changeVal = e => {
    this.setState({
      namelength: e.target.value.length,
    });
  };

  // 反选屏蔽天数
  checkedShieldDays = e => {
    this.setState({
      isShieldDays: e.target.checked,
    });
    if (!e.target.checked) {
      this.props.form.setFieldsValue({ shieldDay:0 });
    }else{
      this.props.form.setFieldsValue({ shieldDay:1 });
    }
  };
  checkedShieldBlack =e=>{
    this.setState({
      IsShieldBlack: e.target.checked,
    });
  }


  // 生成短链
  GetShortUrl=()=>{
    const me=this;
    const { dispatch } = this.props;


    if(me.state.longLink.trim().length<1){
      message.error("请输入长链接！");
      return;
    }
    let queryData = {
      url:me.state.longLink,
    };
    dispatch({
      type: 'marketing/GetShortUrl',
      payload: { ...queryData },
      callback: (response) => {
          
        me.props.form.setFieldsValue({'longLink':me.state.longLink});
        me.props.form.setFieldsValue({'shortLink':response});

        let  content=this.props.form.getFieldValue("content");
        let newContent=content+' '+response.shortUrl+' ';
        me.props.form.setFieldsValue({'content':newContent});
        me.smsChange(newContent,2);
        console.log(response);
        this.setState({ isShow: false })

      }
    });

  }

  // 短信内容后新增特殊占位符  #会员姓名# 
  addSpecialCharacter=(str)=>{
    const me=this;
    let  content=this.props.form.getFieldValue("content");
    let newContent=content+str;
    me.props.form.setFieldsValue({'content':newContent});
    me.smsChange(newContent,2);
  }


  // 短信签名、内容change
  smsChange=(value,type)=>{
    const me=this;
    if(value && value.indexOf("退订回N")>-1){

      value=value.replace(/退订回N/g,"");
    }

     let  sign=this.props.form.getFieldValue("sign");
     let  content=this.props.form.getFieldValue("content");
     let Unsubscribe=this.state.isNoUnsubscribe?"":"退订回N";

     if(type==1){
      sign=value;
     }else if(type==2){
       content=value;
     }
     let  smsLength=2+Unsubscribe.length +sign.length+(content?content.length:0);


         //计算短信条数
    let smsCount=smsLength<=70?1:(Math.ceil(smsLength/67))
    let smsShow="【"+sign+"】"+content+Unsubscribe;
    this.setState({
      smsLength:smsLength,
      smsCount:smsCount,
      smsShow:((content==""||content==null || content==undefined)&&(sign==""||sign==null))?"":smsShow
    });
     
  }
  

   // 新增测试短信
   handleAddSmsTest=()=>{
     const me=this;
     let queryData = {
      TestPhone:me.props.form.getFieldValue("testPhone"),
      SmsName:me.props.form.getFieldValue("sign"),
      SmsContent:"【" + me.props.form.getFieldValue("sign")+"】" + me.props.form.getFieldValue("content"),
      Mobile:me.props.form.getFieldValue("testPhone"),
    };

    // if(queryData.SmsContent.indexOf("退订回N")>-1)
    // {
    //   message.error("短信内容不能包括退订回N,系统会自动生成");
    //   return;
    // }
    if(queryData.TestPhone.trim().length<1){
      message.error("请输入手机号！");
      return;
    }
     let phoneArray = queryData.TestPhone.trim().replace("，", ",").split(',');

     let isError = false;
     let myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
     phoneArray.forEach(v => {
       if (!myreg.test(v)) {
         isError = true;
       }
     });
     if(isError){
      message.error("手机号格式不正确！");
      return;
     }
     if(phoneArray.length>5){
      message.error("测试手机号最多5个！");
      return;
     }
  


    if(queryData.SmsName.trim().length<1){
      message.error("请输入短信签名！");
      return;
    }
    if(queryData.SmsContent.trim().length<1){
      message.error("请输入短信内容！");
      return;
    }
    let Unsubscribe=this.state.isNoUnsubscribe?"":"退订回N";
    queryData.SmsContent=queryData.SmsContent+Unsubscribe;

    me.props.dispatch({
      type: 'marketing/AddSmsTest',
      payload: { ...queryData },
      callback: (response) => {
          if(response){
            message.success("新增测试短信成功！");
           me.handleGetSmsTestList(1,me.state.pageSize);
          }
        console.log(response);
      }
    });
   }

 // 获取测试短信列表
   handleGetSmsTestList=(CurrentPage,PageSize)=>{
      const me=this;
      let queryData = {
        TestPhone:me.state.searchPhone.trim(),
        PageIndex:CurrentPage,
        PageSize:PageSize,
      };


      me.props.dispatch({
        type: 'marketing/GetSmsTestList',
        payload: { ...queryData },
        callback: (response) => {
            if(response){
              me.setState({
                currentPage:response.currentPage,
                pageSize:response.pageSize,
                totalCount:response.totalCount,
                data:response.data,
              });
            }
          console.log(response);
        }
      });


   }


   validatesign =(rule, value, callback)=>{
    if (value && value.length>20 ) {
      callback('签名超过最大长度20!');
    } else {
      callback();
    }
   }

  render() {
    const me=this;
    const nodeContent=this.props.nodeContent?this.props.nodeContent:{};
    const { getFieldDecorator } = this.props.form;
    const formItemlayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22
      },
      colon: false
    }
    const columns = [
      {
        dataIndex: 'testPhone',
        width: "200px",
        title: '测试手机号码',
        render: (txt,record) => {
          return  (<Ellipsis  length={20} tooltip>{txt}</Ellipsis>)

        }
      }, {
        dataIndex: 'smsContent',
        title: '发送内容',
         render: (txt,record) => {
           return  (<Ellipsis  length={32} tooltip>{txt}</Ellipsis>)
         }
      }, {
        dataIndex: 'createTime',
        title: '发送时间',
        width: "180px",
      }, {
        dataIndex: 'errorMsg',
        title: '发送结果',
        width: "100px",
        render: (txt) => {
          return (
            txt ? <span>{txt}</span>:<span style={{ color: "#5ac697" }}>发送成功</span>
          )
        }
      }
    ]

    const str= nodeContent.Content?nodeContent.Content.replace(/退订回N/g,""):"";
  
    return (
      <div>
        <Form {...formItemlayout}>
          {me.props.iscanvas &&
          <Form.Item label='节点名称'>
            <Row>
              <Col span={10}>
                {
                  getFieldDecorator('name', {
                    initialValue:nodeContent.NodeName?nodeContent.NodeName:'',
                    rules: [{ required: true, message: '请输入节点名称！',whitespace: true, }],
                  })(
                    <Input
                      allowClear
                      placeholder="请输入节点名称"
                      maxLength={20}
                      onChange={this.changeVal}
                      addonAfter={
                        <span className={styles.labelNum}>
                          {this.state.namelength}/20
                        </span>
                      }
                    />
                  )
                }
              </Col>
            </Row>
          </Form.Item>
          }
          <Form.Item label='短信签名'>
            <Row>
              <Col span={10}>
                {
                  getFieldDecorator('sign',
                  {
                    initialValue:nodeContent.Sign?nodeContent.Sign:'',
                    rules: [
                      {
                        required: true,
                        message: '请输入短信签名',
                        whitespace: true,
                      },{
                        validator: this.validatesign,
                      },
                    ],
                  })(
                    <Input
                      allowClear
                      maxLength={20}
                      onChange={e=>me.smsChange(e.target.value,1)}
                      placeholder="请输入短信签名"
                    />
                  )
                }
              </Col>
            </Row>
          </Form.Item>
          <Form.Item  >
            <Row>
              <Col  >
                {
                  getFieldDecorator('Unsubscribe',
                  {
                    initialValue:this.state.isNoUnsubscribe?"":"退订回N",
                    
                  })(
                    <Input
                      hidden
                    />
                  )
                }
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label='短信内容'>
            <Row>
              <Col span={16}>
                <div className={styles.editPageLeft}>
                  <div className={`${styles.editCon} ${styles.editConCur}`}>
                    <div className={styles.editConCurTop}>
                      <div className={styles.signTitle}>
                        <div className={styles.signTitleLeft}>
                          <a onClick={()=>me.addSpecialCharacter("#会员姓名#")} href='javascript:;'>#会员姓名#</a>
                        </div>
                        <div className={styles.signTitleRight}>
                          <a
                            href="javascript:;"
                            className={`${styles.signTitleList} ${styles.signTitleList1}`}
                            onClick={() => { this.setState({ isShow: true }) }}
                          > 生成短链 
                          </a>
                        </div>
                      </div>
                      <div className={styles.signCon}>
                        <div className={styles.shortNewCon}>
                          {getFieldDecorator('content', {
                            initialValue:str,
                            getValueFromEvent:val=>{
                              let value  =val.target.value;
                              if(value && value.indexOf("退订回N")>-1){
                                return value.replace(/退订回N/g,"");
                              }
                              return value;
                            },
                            rules: [
                              {
                                required: true,
                                message: '请输入短信内容',
                                whitespace: true,
                              },
                            ],
                          })(
                            <Input.TextArea
                              maxLength={500}
                              placeholder="年终大促，买点年货回家过年。 3.cn/L2i2Nvs "
                              className={styles.moreInputBox}
                              onChange={e=>me.smsChange(e.target.value,2)}
                            />
                          )}

                        </div>
                         {this.state.isNoUnsubscribe?null:(<div className={styles.Unsubscribe}><Button type="normal">退订回N</Button></div>)} 
                      </div>
                    </div>
                    <div className={styles.editConCurBottom}>
                      <span> 已输入：<i style={{color:'#3477FD'}}>{me.state.smsLength}</i>个字(包含签名) 当前计费：{me.state.smsCount} 条 </span>
                      <AntdTooltip
                        title={
                          <Fragment>
                            <p className={styles.balloontip}>1、单条70个字,超出70个字将按照67个字每条计算 </p>
                            <p className={styles.balloontip}>2、一个汉字,数字,字母,空格都算一个字</p>
                            <p className={styles.balloontip}>3、带标签的短信按实际发出的长度计算!</p>
                          </Fragment>
                        }
                      >
                        <a href="javascript:;"  className={`${styles.newsNote} ${styles.ml10}`}> 计费规则 </a>
                      </AntdTooltip>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.editPageRight}>
                  <div className={styles.editnewscontainer}>
                    <div className={styles.editconlist}>
                      {/* {neirong ? (sign ? sign : '') + neirong + ' 回复T退订' : ''} */}
                      {me.state.smsShow}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label='短信测试'>
            <Row type='flex' gutter={8}>
              <Col span={13}>
                {
                  getFieldDecorator("testPhone",{initialValue: ''})(
                    <Input allowClear placeholder="测试手机号，最多5个，多个手机号用逗号(,)隔开" />
                  )
                }
              </Col>
              <Col><Button type='primary' onClick={()=>me.handleAddSmsTest()} >短信测试</Button></Col>
              <Col><a href='javascript:;' onClick={this.showModal}>短信测试记录</a></Col>
            </Row>
          </Form.Item>
          <FormItem label="屏蔽设置">
            <Row type="flex" align="middle">
              <FormItem style={{ marginBottom: 0 }}>
                <Row type="flex" align="middle">
                  <Checkbox checked={this.state.isShieldDays} onChange={this.checkedShieldDays}> 屏蔽近 </Checkbox>
                </Row>
              </FormItem>
              <FormItem style={{ marginBottom: 0 }}>
                <Row type="flex" align="middle">
                  {getFieldDecorator('shieldDay', {
                    initialValue: this.state.shieldDay,
                  })(
                    <Select
                      disabled={!this.state.isShieldDays}
                      onChange={this.changeShieldDays}
                      style={{ width: 80 }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 15].map(item => {
                        return (
                          <Select.Option key={item} value={item}>
                            {' '}
                            {item}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                  <span className={styles.ML10}>&nbsp;&nbsp;天 已发送客户</span>
                </Row>
              </FormItem>
              <FormItem style={{ marginBottom: 0, marginLeft: 44 }}>
                <Row type="flex" align="middle">
                  {getFieldDecorator('isShieldBlack', {
                   // valuePropName: (nodeContent.IsShieldBlack==1)?'checked':'unchecked',
                     initialValue:this.state.IsShieldBlack
                  })(
                    <Checkbox checked={this.state.IsShieldBlack} onChange={this.checkedShieldBlack} >
                      <span className={styles.colorgry}>屏蔽黑名单客户</span>
                    </Checkbox>
                  )}
                </Row>
              </FormItem>
            </Row>
          </FormItem>
       

        <Modal
          title="短信测试记录"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
        >
          <Row type='flex' gutter={16} style={{ marginBottom: 16 }}>
            <Col span={10}><Input allowClear value={me.state.searchPhone} onChange={e=>me.setState({searchPhone:e.target.value})} placeholder='请输入测试手机号码' /></Col>
            <Col><Button type='primary' onClick={()=>me.handleGetSmsTestList(1,me.state.pageSize)} >查询</Button></Col>
            <Col><Button onClick={()=>{
                    
                    me.setState({searchPhone:""},()=>me.handleGetSmsTestList(1,me.state.pageSize))
            }}   >重置</Button></Col>
          </Row>
          <Table
            dataSource={this.state.data}
            columns={columns}
            pagination={{
              size: 'small',
              total: this.state.totalCount,
              showTotal: total => `共 ${total} 条记录`,
              pageSize: this.state.pageSize,
              defaultCurrent: 1,
              showQuickJumper: true,
              showSizeChanger: true,
              current: this.state.currentPage,
              onChange: (page, pageSize) => this.handleGetSmsTestList(page, pageSize),
              pageSizeOptions: ['10', '20', '50', '100'],
              onShowSizeChange: (page, pageSize) => this.handleGetSmsTestList(page, pageSize),
              style: { marginTop: '10px', float: 'right' },
            }}
          />
        </Modal>
        <Modal
          title="生成短链"
          visible={this.state.isShow}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={560}
          color={"#3477FD"}
          
        >
          <Row type='flex' align='middle' gutter={8}>
            <Col>需要转换的网址</Col>
            <Col span={14}>
            <Input onChange={e => { me.setState({ longLink: e.target.value }) }} placeholder='请输入需要转换的网址' allowClear />
                {getFieldDecorator('longLink', {
                  initialValue: nodeContent.LongLink?nodeContent.LongLink:'',
                })}
                {getFieldDecorator('shortLink', {
                 initialValue: nodeContent.ShortLink?nodeContent.ShortLink:'',
                })}
              </Col>
            <Col><Button onClick={()=>me.GetShortUrl()} type='primary'>立即转换</Button></Col>
          </Row>
        </Modal>
        </Form>
      </div>
    )
  }
}


export default DMSendMsg;