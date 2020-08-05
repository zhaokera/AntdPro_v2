import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Alert, Tabs, Table, Button, Select, Row, Col, Tag, Message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';
import request from '@/utils/request';
import moment from 'moment';
import { SelectChannel } from '@/components/CommonModal';
import SelectChannelImport from '@/components/CommonModal/SelectChannelImport';

const { TabPane } = Tabs;
const statusMap = ['#f25519', '#ff0030', '#e60026', '#ff0000', '#1890ff', '#cb0507'];
const status = ['淘宝', '天猫', '苏宁', '有赞', '微盟', 'JD'];
class WaitLead extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      platformShopList: [],
      platformType: undefined,
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      isSku: false,
      rowSkuList: [],
      rowSpuList: [],

      goods_data: [],
      sku_data: [],
      shopData: [],
      // channel: '',
      // shortName: 'tb',
      // sellerId: '',
      // sellerNick: '',
      // shopname: '',
      // plantId: '',
       selectChannelValue:[],
    }

    this.goods_columns = [
      {
        dataIndex: 'goods',
        title: '待导入商品',
        render: (txt) => {
          return (
            <Row type='flex' className={styles.goodsCol}>
              {txt.src ? <Col className={styles.pic}><img src={txt.src} alt='' /> </Col> : ''}
              <Col className={styles.title}>
                {txt.title || ''}
              </Col>
            </Row>
          )
        }
      }, {
        dataIndex: 'encoding',
        title: '商品编码',
        width: '13%'
      }, {
        dataIndex: 'source',
        title: '商品来源',
        width: '15%',
        render: (txt) => {
          return (
            <>
              <Tag className={styles.logo_tags} color={statusMap[txt.logo] ? statusMap[txt.logo] : '' }>{status[txt.logo] ? status[txt.logo] : ''}</Tag>
              <span>{txt.name}</span>
            </>
          )
        }
      }, {
        dataIndex: 'price',
        title: '价格',
        width: '12%',
        render: (txt) => {
          return (txt.min && txt.max ? <span>&yen;{txt.min}&nbsp;&nbsp;~&nbsp;&nbsp;&yen;{txt.max}</span> : <span>&yen;{txt}</span>)
        }
      }, 
      // {
      //   dataIndex: 'inventory',
      //   title: '库存',
      //   width: '11%'
      // }, {
      //   dataIndex: 'sales',
      //   title: '销量',
      //   width: '11%'
      // }, 
      {
        dataIndex: 'key',
        title: '操作',
        width: '150px',
        fixed: 'right',
        render: (txt, r) => {
          return (
            !r.disabled && <a onClick={() => { this.importSigle(txt) }} href='javascript:;'>导入</a>
          )
        }
      }
    ]

    this.sku_columns = [
      {
        dataIndex: 'goods',
        title: '待导入SKU',
        render: (txt) => {
          return (
            <Row type='flex' className={styles.goodsCol}>
              {txt.src ? <Col className={styles.pic}><img src={txt.src} alt='' /> </Col> : ''}
              <Col className={styles.title}>
                {txt.title ? txt.title : ''}
              </Col>
            </Row>
          )
        }
      },
      {
        dataIndex: "encoding",
        title: "商品编码",
        width: '13%'
      },
      {
        dataIndex: "source",
        title: "SKU来源",
        width: '15%',
        render: (txt) => {
          return (
            txt ? (
              <>
                <Tag className={styles.logo_tags} color={statusMap[txt.logo] ? statusMap[txt.logo] : '' }>{status[txt.logo] ? status[txt.logo] : ''}</Tag>
                <span>{txt.name}</span>
              </>
            ) : ''
          )
        }
      },
      {
        dataIndex: "price",
        title: "价格",
        width: '11%',
        render: (txt) => {
          return (
            txt.min && txt.max ? <span>&yen;{txt.min}&nbsp;&nbsp;~&nbsp;&nbsp;&yen;{txt.max}</span> : <span>&yen;{txt}</span>
          )
        }
      },
      // {
      //   dataIndex: 'inventory',
      //   title: '库存',
      //   width: '11%'
      // },
      // {
      //   dataIndex: 'sales',
      //   title: '销量',
      //   width: '11%'
      // },
      {
        dataIndex: 'key',
        title: '操作',
        width: '150px',
        fixed: 'right',
        render: (txt, r) => {
          return (
            !r.disabled && <a onClick={() => { this.importSigle(txt) }} href='javascript:;'>导入</a>
          )
        }
      },
    ]
  }

  componentDidMount = () => {
    this.getGoodsDataList();
  }


  pageOnChange = (p, s) => {
    this.setState({
      currentPage: p,
      pageSize: s,
    }, () => {
      this.getGoodsDataList();
    });
  }

  tabChange = (e) => {
    this.setState({
      isSku: e == '2',
      currentPage: 1
    }, () => {
      this.getGoodsDataList();
    });
  }

  //获取商品列表
  getGoodsDataList = () => {
    this.setState({ loading: true });
    let channelId = '';
    let shopId = '';
    if (this.state.selectChannelValue) {
      if (this.state.selectChannelValue.length == 1) {
        channelId = this.state.selectChannelValue[0].value;
      }
      if (this.state.selectChannelValue.length == 2) {
        channelId = this.state.selectChannelValue[0].platform;
        shopId = this.state.selectChannelValue[1].value;
      }

    }
    let queryParams = {
      ChannelId:channelId,
      ShopId: shopId,
      CurrentPage: this.state.currentPage,
      PageSize: this.state.pageSize,
      IsSku: this.state.isSku,
    }
    // console.log("xxxxxx",queryParams)
    // 直接调用request
    request('g1/crm.product.productwaitpagelist.list', {
      method: 'POST',
      body: queryParams,
    }).then(response => {
      // data根据自己api的规则处理
      let dl = [];
      response.data.map((r) => {
        let dlOne = {
          key: r.id,
          goods: {
            src: r.mainImage,
            title: r.name
          },
          disabled: this.state.isSku,
          encoding: r.spuCode,
          source: { logo: r.inSaleChannels, name: r.shopName },
          price: { min: r.minPrice, max: r.maxPrice },
          inventory: r.totalStock,
          sales: r.totalSaleCount,
          children: []
        };
        dlOne.children = Array.from(r.skuList, (r0) => {
          return {
            key: r0.id,
            goods: {
              title: r0.skuValue
            },
            price: r0.price || '-',
            source: { logo: r0.inSaleChannels, name: r0.shopName },
            inventory: r0.stock,
            sales: r0.sales,
            disabled: !this.state.isSku,
            encoding: r0.skuCode
          }
        });
        dl.push(dlOne);
      });
      this.setState({
        goods_data: this.state.isSku ? [] : dl,
        sku_data: this.state.isSku ? dl : [],
        totalCount: response.totalCount,
        loading: false
      });
    })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  platformChange = (e) => {
    this.setState({
      platformType: e
    }, () => {
      this.getGoodsDataList();
    });
  };

  rowSelectChange = (e) => {
    if (this.state.isSku) {
      this.setState({
        rowSkuList: e
      });
    }
    else {
      this.setState({
        rowSpuList: e
      });
    }
  }
  importAll = () => {
    if (this.state.totalCount < 1) {
      Message.error("没有数据需要导入");
      return;
    }
    this.importBase(true, [], () => {
      this.setState({
        currentPage: 1
      }, () => {
        this.getGoodsDataList();
      });
    });
  }

  importSigle = (id) => {
    this.importBase(false, [id]);
  }

  importArray = () => {
    this.importBase(false, this.state.isSku ? this.state.rowSkuList : this.state.rowSpuList, () => {
      this.setState({
        rowSkuList: this.state.isSku ? [] : this.state.rowSkuList,
        rowSpuList: this.state.isSku ? this.state.rowSpuList : [],
      }, () => {
        this.getGoodsDataList();
      });
    });
  }

  importBase = (isAll, ids, callback) => {
    let that = this;
    if (!isAll && ids.length < 1) {
      Message.error("请选择商品");
      return;
    }
    Modal.confirm({
      title: "是否确定导入?",
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        that.setState({
          loading: true
        });
        let sdata = {
          isAll: isAll
        };
        let rurl = '';
        if (this.state.isSku) {
          rurl = 'g1/crm.product.productskuimport.add';
          sdata.skuids = ids;

        }
        else {
          rurl = 'g1/crm.product.productimport.add';
          sdata.pids = ids;
        }
        request(rurl, {
          method: 'POST',
          body: sdata,
        }).then(response => {
          that.setState({
            loading: false
          });
          if (response) {
            Message.success('导入成功');
            if (callback) {
              callback();
            }
            else {
              this.getGoodsDataList();
            }
          }
        }).catch(() => {
          that.setState({ loading: false });
        });
      },
    });
  }

  pageBack = () => {
    router.goBack();
  }


  render() {
    const rowSelection = {
      getCheckboxProps: record => ({
        disabled: record.disabled === true, // Column configuration not to be checked
      }),
      onChange: (r) => {
        this.rowSelectChange(r)
      }
    }

    const btnBack = (<div onClick={this.pageBack}>待导入商品 &nbsp;&nbsp;<a>返回</a></div>)
    return (
      <PageHeaderWrapper title={btnBack}>
        {/* <a href='javascript:;'>导入</a> */}
        <div className={styles.WaitLead}>
          <Alert
            message={
              <div className={styles.MB8}>
                <p>1.系统每天自动获取已接入渠道新增的商品信息，实时更新系统商品，完善系统商品库资料</p>
                <p>2.若获取渠道新增商品的编码或SKU编码在系统商品中已存在，将自动把系统商品与相应渠道进行关联 </p>
                <p>3.若获取渠道新增商品的编码或SKU编码不存在于系统商品，将新增商品信息或商品SKU信息</p>
              </div>
            }
            type="info"
            showIcon
            className={styles.MB16}
          />

          <div className={styles.bg}>
            <Tabs defaultActiveKey="1" onChange={this.tabChange}>
              <TabPane tab="商品信息" key="1" >
                <Row type='flex' gutter={16} className={styles.MB16}>
                  <Col xxl={4} xl={4} sm={5}>

                    <SelectChannel style={{ width: "100%" }}      
                      onChange={(values) => {
                        this.setState({selectChannelValue:values},()=>{
                          this.getGoodsDataList()
                        });
                      }}/>
                  
               
                  </Col>
                  <Col><Button onClick={this.importArray} type="primary" loading={this.state.loading}>批量导入</Button></Col>
                  <Col><Button onClick={this.importAll} type="primary" loading={this.state.loading}>一键导入</Button></Col>
                </Row>
                <Table
                  columns={this.goods_columns}
                  dataSource={this.state.goods_data}
                  rowSelection={rowSelection}
                  className={styles.goods_table}
                  size='small'
                  loading={this.state.loading}
                  pagination={{
                    size: 'small',
                    total: parseInt(this.state.totalCount),
                    showTotal: total => `共 ${total} 条记录`,
                    pageSize: this.state.pageSize,
                    defaultCurrent: 1,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    current: this.state.currentPage,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: (p, s) => {
                      this.pageOnChange(p, s);
                    },
                    onShowSizeChange: (p, s) => {
                      this.pageOnChange(p, s);
                    }
                  }}
                  scroll={{ x: 1200 }}
                />
              </TabPane>
              <TabPane tab="SKU信息" key="2">
                <Row type='flex' gutter={16} className={styles.MB16}>
                  <Col xxl={4} xl={4} sm={5}>
 
                    <SelectChannel style={{ width: "100%" }}      
                      onChange={(values) => {
                        this.setState({selectChannelValue:values},()=>{
                          this.getGoodsDataList()
                        });
                      }}/>
                  </Col>
                  <Col><Button onClick={this.importArray} type="primary" loading={this.state.loading}>批量导入</Button></Col>
                  <Col><Button onClick={this.importAll} type="primary" loading={this.state.loading}>一键导入</Button></Col>
                </Row>
                <Table
                  columns={this.sku_columns}
                  dataSource={this.state.sku_data}
                  rowSelection={rowSelection}
                  className={styles.goods_table}
                  size='small'
                  loading={this.state.loading}

                  pagination={{
                    size: 'small',
                    total: parseInt(this.state.totalCount),
                    showTotal: total => `共 ${total} 条记录`,
                    pageSize: this.state.pageSize,
                    defaultCurrent: 1,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    current: this.state.currentPage,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    onChange: (p, s) => {
                      this.pageOnChange(p, s);
                    },
                    onShowSizeChange: (p, s) => {
                      this.pageOnChange(p, s);
                    }
                  }}

                  scroll={{ x: 1200 }}
                />
              </TabPane>
            </Tabs>
          </div>

        </div>
      </PageHeaderWrapper>
    )
  }
}

export default WaitLead;