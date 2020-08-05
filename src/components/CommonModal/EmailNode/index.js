import React, { Component } from 'react';
import { Icon, Form, Select, Input, Button, Row, Col, Card, Checkbox, message } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import DMKindEditor from '@/components/kindEditor/src/MyReactComponent';
import { DMOverLay } from '@/components/DMComponents';
import RecordOverlay from './RecordOverlay';
import styles from './index.less';
import { connect } from 'dva';
import request from '@/utils/request';

const FormItem = Form.Item;

const controls = [
  'undo',
  'redo',
  'separator',
  'font-size',
  'line-height',
  'letter-spacing',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'separator',
  'superscript',
  'subscript',
  'remove-styles',
  'emoji',
  'separator',
  'text-indent',
  'text-align',
  'separator',
  'headings',
  'list-ul',
  'list-ol',
  'blockquote',
  'code',
  'separator',
  'separator',
  'hr',
  'separator',
  'media',
  'separator',
  'clear',
];
@connect(({ loading, email }) => {
  return {
    loading: loading.models.email,
    email,
  };
})
class ConditionElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: null,
      shieldDay: undefined,
      isShieldDays: false,
      IsShieldBlack: false,
      title: '',
      nodeName: '',
    };
  }

  componentWillMount() {
    this.setState({
      editorState: this.props.EmailContent
        ? this.props.EmailContent.EmailDetail
          ? this.props.EmailContent.EmailDetail
          : null
        : null,
      shieldDay: this.props.EmailContent
        ? this.props.EmailContent.ShieldDay
          ? this.props.EmailContent.ShieldDay
          : undefined
        : undefined,
      isShieldDays: this.props.EmailContent
        ? this.props.EmailContent.IsShieldDays
          ? this.props.EmailContent.IsShieldDays
          : false
        : false,
      IsShieldBlack: this.props.EmailContent
        ? this.props.EmailContent.IsShieldBlack
          ? this.props.EmailContent.IsShieldBlack
          : false
        : false,
      title: this.props.EmailContent
        ? this.props.EmailContent.Title
          ? this.props.EmailContent.Title
          : ''
        : '',
      nodeName: this.props.EmailContent
        ? this.props.EmailContent.NodeName
          ? this.props.EmailContent.NodeName
          : ''
        : '',
    });
  }

  // 输入框数字计数
  changeVals = e => {
    this.setState({
      nodeName: e.target.value,
    });
  };

  // 反选屏蔽天数
  checkedShieldDays = e => {
    this.setState({
      isShieldDays: e.target.checked,
    });
    if (!e.target.checked) {
      this.props.form.setFieldsValue({ shieldDay: 0 });
    } else {
      this.props.form.setFieldsValue({ shieldDay: 1 });
    }
  };

  checkedShieldBlack = e => {
    this.setState({
      IsShieldBlack: e.target.checked,
    });
  };

  testHandle = e => {
    const me = this;
    const { handleOk } = me.props;
    e.preventDefault();
    let fromData = {
      GetEmail: me.props.form.getFieldValue('emaillist'),
      EmailTitle: me.props.form.getFieldValue('title'),
      EmailDetail: me.props.form.getFieldValue('EmailDetail'),
    };
    if (!fromData.GetEmail) {
      message.error('测试邮箱不可为空');
      return;
    }

    if (fromData.EmailTitle.length > 200) {
      message.error('邮箱主题过长');
      return;
    }
    if (!fromData.EmailDetail) {
      message.error('邮箱内容不可为空');
      return;
    }
    let emailArray = fromData.GetEmail.trim().split(',');

    let isError = false;
    let myeml = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    emailArray.forEach(v => {
      if (!myeml.test(v)) {
        isError = true;
      }
    });
    if (isError) {
      message.error('邮箱格式不正确！');
      return;
    }
    if (emailArray.length > 5) {
      message.error('邮箱号最多5个！');
      return;
    }

    const requestData = {
      GetEmail: fromData.GetEmail,
      EmailTitle: fromData.EmailTitle,
      EmailDetail: fromData.EmailDetail,
    };

    me.props.dispatch({
      type: 'email/AddEmailTest',
      payload: requestData,
      callback: response => {
        if (response) {
          message.success('测试邮件提交成功');
        } else {
          message.error('测试邮件提交失败');
        }
      },
    });
  };

  uploadFn = param => {
    //console.log(param)
    if (
      !(
        param.file.type == 'image/png' ||
        param.file.type == 'image/jpg' ||
        param.file.type == 'image/jpeg' ||
        param.file.type == 'image/bmp' ||
        param.file.type == 'image/gif'
      )
    ) {
      message.error('图片格式不正确');
      return;
    }
    if (param.file.size > 10 * 1024 * 1024) {
      message.error('请传小于10M的图片');
      return;
    }

    const formData = new FormData();

    formData.append('file', param.file);

    request('/FileUpload/UploadPublicFile', {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (response.result) {
        param.success({
          url: response.result,
          meta: {
            id: '', // upLoadObject && upLoadObject.id,
            title: '', // upLoadObject && upLoadObject.fileName,
            alt: '', // upLoadObject && upLoadObject.fileName,
            loop: false, // 指定音视频是否循环播放
            autoPlay: false, // 指定音视频是否自动播放
            controls: false, // 指定音视频是否显示控制栏
            poster: '', // 指定视频播放器的封面
          },
        });
      } else {
        message.error('上传图片失败，请重新登录。');
      }
    });
  };
  kindEditorChange = e => {
    this.setState({
      editorState: e,
    });
    console.log(1, e);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemlayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      colon: false,
    };
    const that = this;
    return (
      <Form {...formItemlayout} className={styles.EmailNode}>
        {this.props.IsCanvas ? (
          <Form.Item label="节点名称">
            <Row>
              <Col span={10}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入节点名称!', whitespace: true }],
                  initialValue: this.state.nodeName,
                })(
                  <Input
                    allowClear
                    placeholder="请输入节点名称"
                    maxLength={20}
                    onChange={this.changeVals}
                    addonAfter={<span> {this.state.nodeName.length}/20 </span>}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
        ) : null}

        <Form.Item label="邮件主题">
          <Row>
            <Col span={10}>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入邮件主题!', whitespace: true }],
                initialValue: this.state.title,
              })(<Input allowClear placeholder="请输入邮件主题" />)}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="邮件内容">
          <Row>
            <Col span={23}>
              <Card size="small" bodyStyle={{ padding: 8 }}>
                {getFieldDecorator('EmailDetail', {
                  rules: [{ required: true, message: '请输入邮件内容!', whitespace: true }],
                  initialValue: this.state.editorState,
                })(
                  <DMKindEditor
                    content={this.state.editorState || ''}
                    onChange={this.kindEditorChange}
                    extraFileUploadParams={{
                      sessionkey: localStorage.getItem('full.crm.sessionkey'),
                    }}
                    afterSelectFile={() => {
                      alert(1);
                    }}
                    basePath="http://file.taocrm.com"
                    afterUpload={url => alert(url)}
                    fileManagerJson="/FileUpload/UploadPublicFile"
                    uploadJson="/FileUpload/UploadPublicFile"
                  />
                )}
              </Card>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="邮件测试">
          <Row type="flex" gutter={8}>
            <Col style={{ flex: 1 }}>
              {getFieldDecorator('emaillist')(
                <Input allowClear placeholder="请输入测试邮箱地址，多个用英文逗号隔开" />
              )}
            </Col>
            <Col>
              <Button type="primary" onClick={this.testHandle} className={styles.btn}>
                邮件测试
              </Button>
            </Col>
            <Col>
              <a
                onClick={() => {
                  this.recordOverlay.show();
                }}
              >
                邮件测试记录
              </a>
            </Col>
            <Col span={1}></Col>
          </Row>
        </Form.Item>
        <FormItem label="屏蔽设置">
          <Row type="flex" align="middle">
            <FormItem style={{ marginBottom: 0 }}>
              <Row type="flex" align="middle">
                <Checkbox checked={this.state.isShieldDays} onChange={this.checkedShieldDays}>
                  {' '}
                  屏蔽近{' '}
                </Checkbox>
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
                  //valuePropName: (nodeContent.IsShieldBlack==1)?'checked':'unchecked',
                  initialValue: this.state.IsShieldBlack,
                })(
                  <Checkbox checked={this.state.IsShieldBlack} onChange={this.checkedShieldBlack}>
                    <span className={styles.colorgry}>屏蔽黑名单客户</span>
                  </Checkbox>
                )}
              </Row>
            </FormItem>
          </Row>
        </FormItem>

        <RecordOverlay
          ref={ref => {
            this.recordOverlay = ref;
          }}
        />
      </Form>
    );
  }
}
const EmailForm = Form.create()(ConditionElement);

class EmailNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.show = this.show.bind(this);
  }

  show = () => {
    this.emailModal.show();
  };

  hide = () => {
    this.emailModal.hide();
  };

  handleOk = e => {
    const me = this;
    const { handleOk } = me.props;
    e.preventDefault();

    me.emailForm.props.form.validateFields((err, values) => {
      if (!err) {
        let fromData = me.emailForm.props.form.getFieldsValue();
        let returnData = {
          ShieldDay: fromData.shieldDay ? fromData.shieldDay : 0,
          IsShieldDays: fromData.shieldDay ? true : false, //fromData.isShieldDays,
          IsShieldBlack: fromData.isShieldBlack,
          Title: fromData.title,
          NodeName: fromData.name ? fromData.name : '',
          EmailDetail: fromData.EmailDetail,
        };
        if (me.props.emailNodeUpdate) {
          me.props.emailNodeUpdate(returnData);
        }
        if (handleOk) handleOk(returnData);
        me.emailModal.hide();
      }
    });
  };

  render() {
    return (
      <DMOverLay
        ref={ref => {
          this.emailModal = ref;
        }}
        title={this.props.Title ? this.props.Title : '编辑邮件'}
        width={890}
        handleOk={this.handleOk}
        footer={
          this.props.activityState ? (this.props.activityState != 0 ? null : undefined) : undefined
        }
      >
        <EmailForm
          IsCanvas={this.props.IsCanvas}
          EmailContent={this.props.EmailContent}
          wrappedComponentRef={ref => (this.emailForm = ref)}
        />
      </DMOverLay>
    );
  }
}

export default EmailNode;
