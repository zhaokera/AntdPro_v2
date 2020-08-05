import React, { Component } from 'react';
import { Button, Form, Row, Col, Progress, Modal, Icon, Table, Badge, Alert, TreeSelect, Cascader, message } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LeadInOverlay from "./views/LeadInOverlay";
import DetailOverlay from "./views/DetailOverlay";
import styles from './index.less';
import Selectgoods from '@/components/DMComponents/DMSelectGoods';
import request from '@/utils/request';
import router from 'umi/router';

const statusMap = ['#f25519', '#ff0030', '#e60026', '#ff0000', '#1890ff', '#cb0507'];
const status = ['淘宝', '天猫', '苏宁', '有赞', '微盟', 'JD'];

@connect(({ loading, goodsleadin }) => {
  return {
    loading: loading.models.goodsleadin,
    goodsleadin,
  };
})

@Form.create()
class GoodsLeadin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      state: 'success', // success 导入成功  wraning 部分导入成功  error 失败
      modelVisible: false,


      pageSize: 10, // 页大小
      currentPage: 1,// 页码
      totalCount: 0,
      data: [],
      categoryData: [],
      // 详情列
      recordid: '',

      ckSelectAll: false,
      zsSelectAll: false,
      zsselectItemIds: [],  // 选中商品
      ckselectItemIds: [],  // 选中商品
      shortName: 'TB',
      categoryId: [],
      selectCount: 0,
      loading: false,
      sellerId: '',
      sellerNick: '',
      shopname: '',
      plantId: ''
    }
    this.columns = [
      {
        dataIndex: 'time',
        key: 'time',
        title: '商品导入时间',
        width: "16%"
      },
      {
        dataIndex: 'channelType',
        key: 'channelType',
        title: '商品导入渠道',
        render: (txt, record) => {
          let channernum = 0;

          if (txt === '0') {
            // 淘宝
            channernum = 0;
          } else if (txt === '1') {
            channernum = 1;
          } else if (txt === '2') {
            // 苏宁
            channernum = 2;
          } else if (txt === '3') {
            // 有赞
            channernum = 3;
          } else if (txt === '4') {
            // 微盟
            channernum = 4;
          }
          return (
            <div className={styles.goodsCol}>
              <div className={styles.title}>
                <i className={`${styles.iconCommon}`} style={{ background: statusMap[channernum] ? statusMap[channernum] : '' }}>{status[channernum] ? status[channernum] : ''}</i>
                {record.shopName}
              </div>
            </div>
          )
        }
      }, {
        dataIndex: 'itemCount',
        key: 'itemCount',
        title: '商品导入数量',
        width: "12%"
      }, {
        dataIndex: 'okCount',
        key: 'okCount',
        title: '导入成功数',
        width: "10%"
      }, {
        dataIndex: 'noCount',
        key: 'noCount',
        title: '导入失败数',
        width: "10%"
      }, {
        dataIndex: 'state',
        title: '导入状态',
        width: "16%",
        render: (txt, record) => {
          return (
            <>
              {txt === "1" ? (
                <Row type='flex' align='middle' gutter={16}>
                  <Col> <Icon type="loading" />&nbsp;导入中... </Col>
                  <Col style={{ width: 120 }}> <Progress percent={Number(((parseInt(record.okCount) + parseInt(record.noCount)) / parseInt(record.itemCount) * 100).toFixed())} /> </Col>
                </Row>
              ) : ''}
              {txt === "2" && record.noCount === "0" ? <Badge status="success" text={<span className={styles.success}>导入成功</span>} /> : ''}
              {txt === "2" && record.okCount === "0" ? <Badge status="error" text={<span className={styles.error}>导入失败</span>} /> : ''}
              {txt === "2" && record.okCount !== "0" && record.okCount !== record.itemCount ? <Badge status="warning" text={<span className={styles.warning}>部分导入成功</span>} /> : ''}
            </>
          )
        }
      }, {
        dataIndex: 'id',
        key: 'id',
        title: '操作',
        width: "200px",
        render: (txt, record) => {
          if (record.state === "2") {
            return <a onClick={() => this.detailOverlayShow(txt)}>查看明细</a>
          }
        }
      }
    ]
  }

  detailOverlayShow = (recordid) => {
    this.setState({ recordid }, () => {
      this.detailOverlay.refresh();
      this.detailOverlay.show()
    });

  }

  // 按钮事件
  btnClick = () => {
    this.setState({ modelVisible: true });
  }

  // 选择商品框确定
  handlerOk = () => {
    const {
      ckSelectAll, zsSelectAll, ckselectItemIds,
      zsselectItemIds, shortName, selectCount, sellerId, sellerNick, shopname, plantId
    } = this.selectgoods.state;

    
    // this.selectgoods.setState({
    //   ckSelectAll: false,
    //   zsSelectAll: false,
    //   ckselectItemIds: [],
    //   zsselectItemIds: [],
    //   shortName: '',
    //   selectCount: 0,
    //   sellerId: '',
    //   sellerNick: '',
    //   shopname: '',
    //   plantId: '',
    //   pageIndex: 1
    // });
    this.setState({
      ckSelectAll, zsSelectAll, ckselectItemIds, zsselectItemIds
      , shortName, selectCount, modelVisible: false, sellerId, sellerNick, shopname, plantId
    });
  }

  // 调整分类
  onChangeTreeSelect = (value) => {
    this.setState({ categoryId: value })
  }

  // 获取分类
  behindcategoryGet = () => {
    request('g1/crm.product.behindcategorytree.list', {
      method: 'POST',
      body: {},
    })
      .then(response => {
        this.setState({ categoryData: response });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  // 商品导入
  productImport = () => {
    const { ckSelectAll, zsSelectAll, ckselectItemIds, zsselectItemIds, shortName, selectCount, categoryId, sellerId, sellerNick, shopname, plantId } = this.state;

    if (selectCount === 0) {
      message.error("请选择要导入的商品");
      return;
    }

    if (categoryId.length === 0) {
      message.error("请选择商品分类");
      return;
    }

    request('g1/crm.product.platformproductimport.add', {
      method: 'POST',
      body: { ckSelectAll, zsSelectAll, ZsSelectItemIds: zsselectItemIds, CkSelectItemIds: ckselectItemIds, shortName, selectCount, categoryId: categoryId[categoryId.length - 1], sellerId, sellerNick, shopname, plantId },
    })
      .then(response => {
        this.props.form.setFieldsValue({ name: [] });
        this.setState({ categoryId: [], selectCount: 0 })
        message.success("商品正在导入中，请您耐心等待.");
        this.productRecordListGet();
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  // 获取导入记录表
  productRecordListGet = () => {
    const { currentPage, pageSize } = this.state;
    this.setState({ loading: true }, () => {
      // 直接调用request
      request('g1/crm.product.productrecordlist.get', {
        method: 'POST',
        body: { currentPage, pageSize },
      })
        .then(response => {
          this.setState({ ...response, loading: false });
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    });

  }

  // 获取导入记录表
  productRecordListGetNoLoad = () => {
    const { currentPage, pageSize } = this.state;
    // 直接调用request
    request('g1/crm.product.productrecordlist.get', {
      method: 'POST',
      body: { currentPage, pageSize },
    })
      .then(response => {
        this.setState({ ...response, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });

  }

  // 初始化
  componentDidMount() {
    this.behindcategoryGet();
    this.productRecordListGet();

    // 定时更新列表
    setInterval(() => {
      this.productRecordListGetNoLoad();
    }, 10000);
  }


  render() {
    const formItemlayout = {
      labelCol: {
        xl: 3,
        lg: 5
      },
      wrapperCol: {
        lg: 19
      },
      colon: false
    }
    const { form: { getFieldDecorator } } = this.props
    const me = this;
    return (
      <PageHeaderWrapper title={<span><a onClick={() => { router.push({ pathname: '/goods/manage/released' }) }}>商品发布</a>-线上渠道商品导入</span>}>
        <div className={styles.LeadIn}>
          <div className={styles.bg}>
            <Alert
              message='线上渠道商品导入提示'
              description={
                <div>
                  <p className='Mb-basewidth'>1.线上渠道商品同步需要您选择渠道中待同步的宝贝</p>
                  <p className='Mb-basewidth'>2.您可以选择商品同步的分类，也可以同步完成后为新商品指定分类</p>
                  <p className='Mb-basewidth'>3.已同步至系统库的商品将无法再次同步</p>
                </div>
              }
              showIcon
            />
            <Form className={styles.MT16} {...formItemlayout}>
              <Form.Item required label="选择商品" help={<span style={{ fontSize: 12 }}>选择您需要同步的渠道和商品</span>}>
                <Row type='flex' align='middle' className="Mb-basewidth" gutter={16}>
                  <Col><Button type='primary' ghost onClick={this.btnClick}>选择商品</Button></Col>
                  <Col>已选商品：<span style={{ color: '#FF4049' }}>{this.state.selectCount}个</span></Col>
                </Row>
              </Form.Item>
              <Form.Item label='选择待导入商品分类' help={<span style={{ fontSize: 12 }}>同步的商品将进入系统指定分类下，同步后商品分类支持调整</span>}>
                {getFieldDecorator('name', {
                  rules: [{ required: false, message: '请输入商品名称' }],
                })(
                  <Cascader options={this.state.categoryData}
                    placeholder="请选择"
                    style={{ width: 265 }}
                    placeholder="选择商品分类"
                    onChange={this.onChangeTreeSelect}
                  />
                )}

                {/* <TreeSelect
                  showSearch
                  style={{ width: 200 }}
                  value={this.state.categoryId}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="选择商品分类"
                  allowClear
                  treeDefaultExpandAll
                  onChange={this.onChangeTreeSelect}
                  treeData={this.state.categoryData}
                /> */}
              </Form.Item>
              <Form.Item label=" ">
                <Button type='primary' disabled={this.state.selectCount === 0} loading={this.state.loading} onClick={this.productImport}>开始商品导入</Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.bg}>
            <div className={styles.page_title_s}><b>线上渠道商品导入记录</b></div>
            <Table
              rowKey="id"
              loading={this.state.loading}
              columns={this.columns}
              dataSource={this.state.data}
              scroll={{ x: 1500 }}
              pagination={{
                size: 'small',
                pageSize: parseInt(this.state.pageSize),
                total: parseInt(this.state.totalCount),
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: () => { return `共${this.state.totalCount}条记录` },
                onChange: (currentPage, pageSize) => { this.setState({ currentPage, pageSize }, () => this.productRecordListGet()) },
                onShowSizeChange: (currentPage, pageSize) => { this.setState({ currentPage, pageSize }, () => this.productRecordListGet()) }
              }}

            />
          </div>
          <LeadInOverlay
            ref={(ref) => {
              this.leadinOverlay = ref
            }}
            state={this.state.state}
          />
          <DetailOverlay
            ref={(ref) => {
              this.detailOverlay = ref
            }}
            recordid={this.state.recordid}
            footer={false}
          />

          {/*  <Modal
            title="批量导入"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText='关闭'
            cancelText='取消导入'
          >
            <Progress percent={30} />
            <div className={styles.MT16}>数据导入中... 批量导入需要时间，请耐心等待，您可以在导入记录中查看导入进度</div>
          </Modal> */}
        </div>

        <Modal
          title="选择商品"
          width="1000px"
          visible={this.state.modelVisible}
          destroyOnClose
          onOk={this.handlerOk}
          onCancel={() => {
            this.setState({ modelVisible: false });
          }}
        >
          <Selectgoods wrappedComponentRef={ref => this.selectgoods = ref} />
        </Modal>

      </PageHeaderWrapper>
    )
  }
}
export default GoodsLeadin;