import React, { Component, PureComponent } from "react";
import { Button, Form, Upload, Popover, Row, Col, Progress, Modal, Icon, Table, Badge, message, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';

class ConditionElement extends PureComponent {
  static defaultProps = {
    onChange: undefined,
  };

  state = {
    fileList: [],
    accept: '.xls,.xlsx'
  };

  render() {
    const { onChange } = this.props;
    const { fileList } = this.state;
    const props = {
      accept: '.xls,.xlsx',
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [file],
        }));

        return false;
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
          if (onChange) onChange(info.fileList);
        }
      },
      fileList,
      multiple: true,
      accept: '.xls,.xlsx'
    };
    return (
      <Row>
        <Col xxl={8} xl={9} lg={10}>
          <Upload   {...props}>
            <Button> <Icon type="upload" /> 选择上传文件 </Button>
          </Upload>
        </Col>
      </Row>
    );
  }
}


@connect(
  ({ loading, CustomerInport }) => {
    return {
      loading: loading.models.CustomerInport,
      CustomerInport: CustomerInport
    };
  },
  null,
  null,
  { withRef: true }
)
@Form.create()
export default class
  LeadIn extends Component {
  static defaultProps = {
    HeaderTitle: '批量导入',
    TableTitle: '批量导入记录',

  }

  constructor(props) {
    super(props);
    this.state = {

      visible: false,
      state: 'error' // success 导入成功  wraning 部分导入成功  error 失败
    }

    this.columns = [
      {
        dataIndex: 'createTime',
        title: '导入时间',
        width: "14%"
      }, {
        dataIndex: 'totalCount',
        title: '预计导入数据条数',
        width: "14%"
      }, {
        dataIndex: 'successCount',
        title: '成功数',
        width: "14%"
      }, {
        dataIndex: 'error',
        title: '失败数',
        width: "14%",
        render: (txt, row, index) => {
          return (row.errorCount)
        }
      }, {
        dataIndex: 'oldfileName',
        title: '文件名',
      }, {
        dataIndex: 'status',
        title: '导入状态',
        width: "14%",
        render: (txt, row, index) => {
          switch (txt) {
            case '0':
              return (<div>等待执行</div>)
            case '1':
              return (<div><Icon type="loading" />&nbsp;执行中..</div>)
            case '2':
                if( row.successCount ==='0'){
                  return (<div> <Badge status="error" text={<Popover content='文件异常,请检查文件后重试'><span className={styles.error}>导入失败</span></Popover>} /></div>)
                }else if(row.totalCount!=row.successCount){
                  return (<div><span className={styles.warning}>部分成功</span></div>)
                }else{
                  return(<div><Badge status="success" text={<span className={styles.success}>导入成功</span>} /></div>) 
                }
            case '3':
              
              return (<div><Badge status="error" text={<Popover content='未使用模板文件，请重新上传'><span className={styles.error}>导入失败</span></Popover>} /></div>)
          }
          // return (
          //   <>
          //     {txt === 0 ? <div> &nbsp;等待执行</div> : ''}
          //     {txt === 1 ? <div><Icon type="loading" />&nbsp;执行中...</div> : ''}
          //     {txt === 2 && row.totalCount==row.successCount && row.totalCount!=0 ? <Badge status="success" text={<span className={styles.success}>导入成功</span>} /> : ''}
          //     {txt === 3 || (txt===2&&row.successCount ==0) ? <Badge status="error" text={<Popover content='文件异常,请检查文件后重试'><span className={styles.error}>导入失败</span></Popover>} /> : ''}
          //     { row.totalCount !=0 && row.totalCount!=row.successCount ? <Badge status="warning" text={<span className={styles.warning}>部分成功</span>} /> : ''}
          //   </>
          // )
        }
      }, {
        dataIndex: 'action',
        title: '操作',
        fixed: 'right',
        width: "200px",
        render: (txt, row, index) => {
          return (
            <Row gutter={16}>
              <Col>
                {row.status != 0 && row.status != 1 ?
                  <Popconfirm
                    title="确定删除该条记录?"
                    onConfirm={this.deleteinport.bind(this, row.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                  : ''}
              </Col>
              <Col>
                {row.errorCount > 0 && row.status != 0 && row.status != 1 ? <a href='javascript:;' onClick={() => this.onDownLoad(row.id)}>下载失败数据</a> : <a href='javascript:;'></a>}
                {/*{(row.errorCount > 0 && row.status == 3) || row.status == 4 ? <a href='javascript:;' onClick={() => this.onDownLoad(row.id)}>下载失败数据</a> : <a href='javascript:;'></a>}*/}
              </Col>
            </Row>

          )
        }
      }
    ]
  }
  //删除会员导入任务
  deleteinport(id) {
    const me = this;
    let queryData = {
      id: id,
      isdel: true
    };
    me.props.dispatch({
      type: 'CustomerInport/DeleteTask',
      payload: queryData,
      callback: (response) => {
        if (response) {
          me.props.listPageGetInportTask(me.props.data.currentPage, me.props.data.pageSize);
        }
      }
    });
  }

  onDownLoad = (taskid) => {
    const me = this;
    let queryData = {
      ExportType: 0,
      TaskId: taskid,
      ExportType: me.props.inportType
    };
    me.props.dispatch({
      type: 'CustomerInport/DownFile',
      payload: queryData,
      callback: (response) => {
        if (response) {
          window.open(response);
        }
      }
    });
  }
  // 上传
  handleUpload = (e) => {

    const me = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (me.fileRef.state.fileList.length == 0) {
          message.error('请选择文件');
          return;
        }
        let oldfileName = "";
        const formData = new FormData();
        me.fileRef.state.fileList.forEach(file => {
          oldfileName = file.name;
          formData.append('file', file);
        });
        let filenamearr = oldfileName.split('.');
        if (me.fileRef.state.accept.indexOf(filenamearr[filenamearr.length - 1]) < 0) {
          message.error('请上传正确格式的文件');
          return;
        }
        me.props.dispatch({
          type: 'CustomerInport/UploadFile',
          payload: formData,
          callback: (response) => {
            if (response) {
              me.fileRef.setState({
                fileList: []
              });
              //上传成功，新增导入任务
              me.props.AddTask(oldfileName, response.result);
            }
            else {

            }

          }
        });


        // reqwest({
        //   url: 'http://localhost:5000/FileUpload/UploadFile?sessionkey=234',
        //   method: 'post',
        //   crossOrigin: true,
        //   data: formData,
        //   processData: false,
        //   success: (response) => {
        //     console.log(response);
        //     message.success('upload successfully.');
        //   },
        //   error: (response) => {
        //     console.log(response);
        //     message.error('upload failed.');
        //   },
        // });

      }
    });

    // this.setState({
    //   visible: true,
    // });
  };






  handleOk = e => {
    this.setState({
      visible: false,
    });
    const { state } = this.state
    state == 'success' ? (
      Modal.success({
        title: '导入成功',
        okText: '知道了',
        content: (
          <div>
            <div>导入30条数据</div>
            <div>成功30  失败0</div>
          </div>
        ),
      })
    ) : ''
    state == 'wraning' ? (
      Modal.warning({
        title: '部分导入成功',
        okText: '知道了',
        content: (
          <div>
            <div>导入30条数据</div>
            <Row type="flex" gutter={16}>
              <Col>成功30</Col>
              <Col>失败0</Col>
              <Col><a href='javascript:;'>下载导入失败数据</a></Col>
            </Row>
          </div>
        )
      })
    ) : ''
    state == 'error' ? (
      Modal.error({
        title: '导入失败',
        okText: '知道了',
        content: (
          <div>
            <div>导入30条数据</div>
            <Row type="flex" gutter={16}>
              <Col>成功0</Col>
              <Col>失败30</Col>
              <Col><a href='javascript:;'>下载导入失败数据</a></Col>
            </Row>
          </div>
        )
      })
    ) : ''

  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const formItemlayout = {
      labelCol: {
        lg: 2
      },
      wrapperCol: {
        lg: 19
      },
      colon: false
    }
    const me = this;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div className={styles.LeadIn}>
        <div className={styles.bg}>
          <div className={styles.page_title_s}><b>{this.props.HeaderTitle}</b></div>
          {
            this.props.children
          }
          <Form {...formItemlayout}>
            <Form.Item label="上传模板" >
              {
                getFieldDecorator('fileList', {
                  rules: [
                    {
                      required: true,
                      message: '请选择文件',
                    },
                  ],
                })(
                  <ConditionElement ref={ref => {
                    me.fileRef = ref;
                  }} />
                )
              }
            </Form.Item>
            <Form.Item label='上传说明'>
              <div>1.请先下载上传模板，根据模板填写需要导入的信息<a href={this.props.inportType == 0 ? 
                'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/%E5%85%A8%E6%B8%A0%E9%81%93%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF-%E5%AF%BC%E5%85%A5%E6%96%B0%E5%AE%A2%E6%88%B7%E8%B5%84%E6%96%99%20.xlsx' 
                : 
                (this.props.inportType == 3 ? 
                'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/%E9%BB%91%E5%90%8D%E5%8D%95%E5%AF%BC%E5%85%A5.xlsx' 
                : 'https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/%E5%AE%A2%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF-%E8%A1%A5%E5%85%85%E5%AE%A2%E6%88%B7%E8%B5%84%E6%96%99%20.xlsx')}>&nbsp;下载模板&nbsp;</a></div>
              <div className={styles.LH32}>2.当前支持xls、xlsx格式文件(大小在50M以内)，请严格按照模板内容填入用户数据，否则可能会出现导入异常</div>
              <div className={styles.LH32}>3.手机号为会员唯一标识，如系统中已有手机号，将无法导入</div>
            </Form.Item>
            <Form.Item label=" ">
              <Row type='flex' gutter={16}>
                <Col><Button type='primary' onClick={this.handleUpload}>导入</Button></Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.bg}>
          <div className={styles.page_title_s}><b>{this.props.TableTitle}</b></div>
          <Table loading={this.props.loading}
            columns={this.columns}
            rowKey={r => r.id}
            dataSource={me.props.data.dataSource}
            pagination={{
              size: 'small',
              current: parseInt(me.props.data.currentPage),
              pageSize: me.props.data.pageSize,
              total: me.props.data.totalCount,
              showTotal: total => `共 ${me.props.data.totalCount} 条记录`,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: me.props.listPageGetInportTask,
              onShowSizeChange: me.props.listPageGetInportTask
            }} />
        </div>

        <Modal
          title="批量导入"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='关闭'
          cancelText='取消导入'
        >
          <Progress percent={30} />
          <div className={styles.MT16}>数据导入中... 批量导入需要时间，请耐心等待，您可以在导入记录中查看导入进度</div>
        </Modal>
      </div>
    )
  }
}