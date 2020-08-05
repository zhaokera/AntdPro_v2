/* eslint-disable no-undef */
import React, { Component, PureComponent } from 'react';
import { Button, Form, Upload, Row, Col, Progress, Modal, Icon, Table, Badge, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';
import request from '@/utils/request';

class ConditionElement extends PureComponent {
  static defaultProps = {
    onChange: undefined,
  };

  state = {
    fileList: []
  };

  render() {
    const { onChange } = this.props;
    const { fileList } = this.state;
    const props = {
      action: 'CustomerInport/UploadFile',
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
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      onChange: (info) => {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);

        // 2. Read from response and show file link
        // fileList = fileList.map(file => {
        //   if (file.response) {
        //     // Component will show file.url as link
        //     file.url = file.response.url;
        //   }
        //   return file;
        // });
        onChange(fileList)
        this.setState({ fileList });
      },
      fileList,
      multiple: true,
      accept: '.xls,.xlsx'
    };
    return (
      <Row>
        <Col xxl={8} xl={9} lg={10}>
          <Upload {...props}>
            <Button> <Icon type="upload" /> 选择上传文件 </Button>
          </Upload>
        </Col>
      </Row>
    );
  }
}

@connect(({ loading, excelleadin }) => {
  return {
    loading: loading.models.excelleadin,
    excelleadin,
  };
})
@Form.create()
class ExcelLeadin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      state: 'error', // success 导入成功  wraning 部分导入成功  error 失败
      currentPage: 1,  // 页码
      pageSize: 10,   // 页大小
      totalCount: 0,   // 总个数
      data: [],   // 数据
      loading: false
    }
    this.columns = [
      {
        dataIndex: 'time',
        title: '导入时间',
        width: "14%"
      }, {
        dataIndex: 'itemCount',
        title: '预计导入商品数',
        width: "14%"
      }, {
        dataIndex: 'okCount',
        title: '成功数',
        width: "12%"
      }, {
        dataIndex: 'noCount',
        title: '失败数',
        width: "12%"
      }, {
        dataIndex: 'fileName',
        title: '文件名',
      }, {
        dataIndex: 'state',
        title: '导入状态',
        width: "16%",
        render: (txt, record) => {
          return (
            <>
              {txt === '1' ? (
                <Row type='flex' align='middle' gutter={16}>
                  <Col> <Icon type="loading" />&nbsp;加载中... </Col>
                  <Col style={{ width: 120 }}> <Progress percent={30} />{parseInt(((parseInt(record.noCount) + parseInt(record.okCount)) / parseInt(record.itemCount)) * 100)}</Col>
                </Row>
              ) : ''}
              {txt === "2" && record.itemCount === record.okCount ? <Badge status="success" text={<span className={styles.success}>导入成功</span>} /> : ''}
              {txt === "2" && record.itemCount === record.noCount ? <Badge status="error" text={<span className={styles.error}>导入失败</span>} /> : ''}
              {txt === "2" && record.itemCount !== record.noCount && parseInt(record.noCount) + parseInt(record.okCount) === parseInt(record.itemCount) && parseInt(record.noCount) > 0 ? <Badge status="warning" text={<span className={styles.warning}>部分导入成功</span>} /> : ''}
            </>
          )
        }
      }, {
        dataIndex: 'id',
        title: '操作',
        fixed: 'right',
        width: "200px",
        render: (txt, record) => {
          return <a href='javascript:;' onClick={() => router.push({ pathname: `/goods/manage/exceldetail`, query: { id: record.id } })}>查看明细</a>
        }
      }
    ]
  }

  showModal = () => {
    const me = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.filelist.length === 0) {
          message.error('请选择要上传文件。');
          return;
        }

        if (values.filelist.length !== 1) {
          message.error('一次只能上传一个文件。');
          return;
        }

        const formData = new FormData();

        formData.append('file', values.filelist[0].originFileObj);

        this.setState({ loading: true }, () => {
          request('/FileUpload/UploadPublicFile', {
            method: 'POST',
            body: formData,
          })
            .then(response => {
              this.setState({ loading: false }, () => {
                if (response.result) {
                  this.importexcelproduct(response.result, values.filelist[0].name);
                } else {
                  message.error("文档上传失败,"+response.error.message||"请重新登录");
                }
              });
            })
            .catch(() => {
              this.setState({ loading: false });
            });

        });



      }
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });

    const { state } = this.state

    if (state === 'success') {
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
    }
    if (state === 'wraning') {
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
    }
    if (state === 'error') {
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
    }

  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 获取excel导入记录表
  ImportExcelProductRecordListGet = () => {
    const { currentPage, pageSize } = this.state;
    this.setState({ loading: true }, () => {
      // 直接调用request
      request('g1/crm.product.importexcelrecord.list', {
        method: 'POST',
        body: { currentPage, pageSize },
      })
        .then(response => {
          this.setState(response);
          this.setState({ loading: false });
        })
        .catch(() => {
          this.setState({ loading: false });
        });

    })
  }

  // excel 导入数据
  importexcelproduct = (url, FileName) => {
    request('g1/crm.product.importexcelproduct.get', {
      method: 'POST',
      body: { url, FileName },
    })
      .then(response => {
        if (response === "导入完成") {
          message.success(response);
          this.setState({ currentPage: 1 }, () => this.ImportExcelProductRecordListGet())
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }



  // 初始化
  componentDidMount() {
    this.ImportExcelProductRecordListGet();
  }

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
    const { form: { getFieldDecorator }, excelleadin: { data }
    } = this.props
    return (
      <PageHeaderWrapper title={<span><a onClick={() => { router.push({ pathname: '/goods/manage/released' }) }}>商品发布</a>-Excel导入</span>}>
        <div className={styles.LeadIn}>
          <div className={styles.bg}>
            <div className={styles.page_title_s}><b>选择导入</b></div>
            <Form {...formItemlayout}>
              <Form.Item label="上传模板">
                {
                  getFieldDecorator('filelist', {
                    rules: [
                      {
                        required: true,
                        message: '请选择文件',
                      },
                    ],
                  })(
                    <ConditionElement
                      ref={ref => {
                        this.fileRef = ref;
                      }}
                    />
                  )
                }
              </Form.Item>
              <Form.Item label='上传说明'>
                <div>1.请先下载上传模板，根据模板填写需要导入的信息<a href='https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/public/excel%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.zip'>&nbsp;下载模板&nbsp;</a></div>
                <div className={styles.LH32}>2.当前支持xls、xlsx格式文件(大小在50M以内)，请严格按照模版内容填入用户数据，否则可能会出现导入异常</div>
              </Form.Item>
              <Form.Item label=" ">
                <Button type='primary' onClick={this.showModal}>导入</Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.bg}>
            <div className={styles.page_title_s}><b>Excel导入记录</b></div>
            <Table
              rowKey="id"
              loading={this.state.loading}
              columns={this.columns}
              dataSource={this.state.data}
              scroll={{ x: 1500 }}
              pagination={{
                size: 'small',
                showTotal: () => { return `共${this.state.totalCount}条记录` },
                total:Number(this.state.totalCount),
                pageSize:Number(this.state.pageSize),
                showQuickJumper: true,
                showSizeChanger: true,
                onChange: (currentPage, pageSize) => { this.setState({ currentPage, pageSize }, () => this.ImportExcelProductRecordListGet()) },
                onShowSizeChange: (currentPage, pageSize) => { this.setState({ currentPage, pageSize }, () => this.ImportExcelProductRecordListGet()) }
              }}
            />
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

      </PageHeaderWrapper>
    )
  }
}

export default ExcelLeadin;