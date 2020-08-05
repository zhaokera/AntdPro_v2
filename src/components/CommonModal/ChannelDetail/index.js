import React, { Component } from 'react';
import { Tabs, Button, Select, Input, Form, Row, Col, Table } from 'antd';
// import router from 'umi/router';
import styles from './index.less';
import request from '@/utils/request';

const TabPane = Tabs.TabPane;
const { Option } = Select;
const FormItem = Form.Item;

const statusMap = ['#f25519', '#ff0030', '#e60026', '#ff0000', '#1890ff', '#cb0507'];
const status = ['淘宝', '天猫', '苏宁', '有赞', '微盟', 'JD'];


@Form.create()
class DMSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data2: [],
      id: this.props.id === undefined ? undefined : this.props.id,
      code: this.props.code === undefined ? undefined : this.props.code,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalstoreCount:0,
      stause: undefined,//0,1,2
      orderType: 0,// 0升序 1降序
      orderField: 1,//排序字段 1 当前售价 2 销量 3 库存
      loading: false,
      count:0,//门店数量
      price:"",//门店价格
      sale:"",//门店售量

      key: "1"
    }
    this.columns = [
      {
        title: '渠道名称',
        dataIndex: 'channel',
        width: 250,
        render: (txt, record) => {
          // console.log('打印看下record',record)
          let channernum = 0;
          if (txt.channelname === '淘宝') {
            // 淘宝
            channernum = 0;
          } else if (txt.channelname === '天猫') {
            // 天猫
            channernum = 1;
          } else if (txt.channelname === '苏宁') {
            // 苏宁
            channernum = 2;
          } else if (txt.channelname === '有赞') {
            // 有赞
            channernum = 3;
          } else if (txt.channelname === '微盟') {
            // 微盟
            channernum = 4;
          } else {
            // JD
            channernum = 5;
          }
          return (
            <div className={styles.goodsCol}>
              <div className={styles.title}>

                {record.channeltype ? <i className={`${styles.iconCommon}`} style={{ background: statusMap[channernum] ? statusMap[channernum] : '' }}>{status[channernum] ? status[channernum] : ''}</i> : ''}
                {txt.title ? txt.title : ''}
                <span className={styles.codeSpan}>{txt.codenum ? txt.codenum : ''}</span>
              </div>
            </div>
          )
        }
      },
      {
        title: '商品状态',
        dataIndex: 'picstate',
        width: 200,
      },
      {
        title: '当前售价',
        dataIndex: 'currentprice',
        //sorter: (a, b) => a.currentprice.length - b.currentprice.length,
        width: 200,
      },
      {
        title: '销量',
        dataIndex: 'allsale',
        sorter: true,
        width: 200,
      },
      // {
      //   title: '库存',
      //   dataIndex: 'allstock',
      //   sorter: true,
      // }
    ]
    this.underlinecolumns = [
      {
        title: '门店名称',
        dataIndex: 'channel',
        width: 250,
        render: (txt, record) => {
        
          return (
            <div className={styles.goodsCol}>
              <div className={styles.title}>

                {record.channeltype ? <i className={`${styles.iconCommon}`} style={{ background: statusMap[channernum] ? statusMap[channernum] : '' }}>{status[channernum] ? status[channernum] : ''}</i> : ''}
                {txt.title ? txt.title : ''}
                <span className={styles.codeSpan}>{txt.codenum ? txt.codenum : ''}</span>
              </div>
            </div>
          )
        }
      },
   
      {
        title: '当前售价',
        dataIndex: 'currentprice',
        width: 200,
        // sorter: true,
      
      },
      {
        title: '销量',
        dataIndex: 'salesVolume',
        width: 200,
        sorter: true,
        render: (txt) => {
                  return (
            <div className={styles.goodsCol}>
              <div className={styles.title}>

                <span className={styles.codeSpan}>{txt ? txt : '0'}</span>
              </div>
            </div>
          )
        }
        // sorter: (a, b) => a.salesVolume.length - b.salesVolume.length,
      },
      // {
      //   title: '库存',
      //   dataIndex: 'allstock',
      //   sorter: (a, b) => a.allstock.length - b.allstock.length,
      // }
    ]
  }

  // 为了防止父组件修改editData但是子组件不修改
  static getDerivedStateFromProps(nextProps, prevState) {
    const { id } = nextProps;
    if (JSON.stringify(id) !== JSON.stringify(prevState.id)) {
      if (!id) return null;
      return {
        id: id,
      };
    }
    return null;
  }

  getData(currentPage, pageSize) {
    const that = this;
    let queryParams = {};
    // 分页的参数
    queryParams.CurrentPage = currentPage;
    queryParams.PageSize = pageSize;
    queryParams.Pid = this.state.id;
    queryParams.OrderType = this.state.orderType;
    queryParams.OrderField = this.state.orderField;
    queryParams.ChannelType = Number(that.state.key) - 1;

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      queryParams.Status = that.state.key == "1" ? values.picstate : values.picstate1;
      queryParams.Name = that.state.key == "1" ? values.channelname : values.channelname1;

    });



    //console.log(queryParams);
    // table loading
    this.setState({ loading: true });

    // 直接调用request
    request('g1/crm.product.productonlinechannel.list', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // data根据自己api的规则处理


        that.setState({ data: that.filterListModel(response.data), loading: false, currentPage: Number(response.currentPage), pageSize: Number(response.pageSize), totalCount: Number(response.totalCount) });
      })
      .catch(() => {
        this.setState({ loading: false });
      });

  }

  getProDateForUnline(currentPage, pageSize) {
    const that = this;
    
    let queryParams = {
      pageIndex: currentPage,
      pageSize: pageSize,
      productCodeOrName: this.state.code,
      spuId: this.state.id,
      columnKey: null,
      ordertype: null
    };

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      queryParams.shopName = values.shopname;
    })
    if (that.state.orderField !== 1) {
      queryParams.columnKey = that.state.orderField == 10 ? 0 : 1;
      queryParams.ordertype = that.state.orderType;
    }
    this.setState({ loading: true });

    // 直接调用request
    request('g1/crm.product.productstoresare.get', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (pageSize == 99999) {
          that.listMode(response.data);
        } else {
          that.setState({ data2: this.storeListModel(response.data), loading: false, currentPage: Number(response.currentPage), pageSize: Number(response.pageSize), totalstoreCount: Number(response.totalCount) });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });

  }

  listMode(data) {
    console.log(data)
    let list = [];
    let min = 0;//最低价
    let max = 0;//最高价
    let allnum = 0.0;//售量
    data.map(item => {
      if (min === 0 && max === 0) {
        min = item.minPrice;
        max = item.maxPrice;
      } else {
        if (item.minPrice < min) {
          min = item.minPrice
        }
        if (item.maxPrice > max) {
          max = item.maxPrice
        }
      }
      if (item.skuList != null && item.skuList.length > 0) {
        item.skuList.map(sitem => {
          allnum +=sitem.salesVolume?sitem.salesVolume:0;
        });
    
      }
      //allnum +=item.salesVolume;
    });
     let price = '￥' + min + '~￥' + max;
    this.setState({
      price:price,
      sale:allnum,
      count:data.length
    });
  }

  storeListModel(data) {
    console.log(data)
    let list = [];
    data.map(item => {

      // let a = {};
      // let b = {};
      // a.shopName = item.shopName;
      // a.key = item.id;
      // a.salesVolume = item.salesVolume;
      // a.currentprice = '￥' + item.minPrice + '~￥' + item.maxPrice;
      // a.channeltype = true;
      // if (item.skuList != null && item.skuList.length > 0) {
      //   let d = [];
      //   item.skuList.map(sitem => {

      //     // let c = {};
      //     // let e = {};
      //     // c.key = sitem.id;
      //     // e.productName = sitem.productName;
      //     // e.codenum = sitem.skuCode;
      //     // c.shopName = e;
      //     // c.price = '￥' + sitem.price;
      //     // c.salesVolume = sitem.salesVolume;
      //     // d.push(c);
      //   });
      //   a.children = d;
      // }
      // list.push(a);


      let a = {};
      let b = {};
      a.key = item.id;

      b.title = item.shopName;
      a.key = item.id;
      a.channel = b;
      a.key = item.id;
     
      a.currentprice = '￥' + item.minPrice + '~￥' + item.maxPrice;
      var nu =0.0;
      if (item.skuList != null && item.skuList.length > 0) {
        let d = [];
        item.skuList.map(sitem => {

          let c = {};
          let e = {};
          c.key = sitem.id;
          e.title = sitem.productName;
          e.codenum = sitem.skuCode;
          c.channel = e;
          c.currentprice = '￥' + sitem.price;
          c.allsale = sitem.sales;
          c.salesVolume=sitem.salesVolume;
          nu +=sitem.salesVolume?sitem.salesVolume:0;
          c.allstock = sitem.stock;
          d.push(c);
        });
        if(nu==0.0){
          a.salesVolume = item.salesVolume;
        }else{
          a.salesVolume = nu;
        }
        a.children = d;
      }
      list.push(a);


    })
    console.log(list);
    return list;
  }


  filterListModel(data) {
    console.log(data)
    let list = [];
    data.map(item => {

      let a = {};
      let b = {};
      b.title = item.shopName;
      b.channelname = item.source == 0 ? "淘宝" : item.source == 1 ? "天猫" : item.source == 2 ? "苏宁" : item.source == 3 ? "有赞" : "微盟";
      a.key = item.id;
      a.channel = b;
      a.codenum = "";
      a.picstate = item.status == 0 ? "上架" : item.status == 1 ? "下架" : "不在售";
      a.allsale = item.totalSales;
      a.allstock = item.totalStock;
      a.currentprice = '￥' + item.minPrice + '~￥' + item.maxPrice;
      a.channeltype = true;
      if (item.skuList != null && item.skuList.length > 0) {
        let d = [];
        item.skuList.map(sitem => {

          let c = {};
          let e = {};
          c.key = sitem.id;
          e.title = sitem.skuName;
          e.codenum = sitem.skuCode;
          c.channel = e;
          c.currentprice = '￥' + sitem.price;
          c.allsale = sitem.sales;
          c.allstock = sitem.stock;
          d.push(c);
        });
        a.children = d;
      }
      list.push(a);

    })
    console.log(list);
    return list;
  }


  componentDidMount() {
    this.getData(1, 10);
    this.getProDateForUnline(1, 99999);
    this.getProDateForUnline(1,10);
  }


  monchange = (currentPage, pageSize, sorter) => {
    const me = this;
    //console.log(pagination, filters, sorter);
    let ck = null;
    let order = null;

    if (sorter) {
      ck = sorter.columnKey == "allsale" ? 2 : 3;
      order = sorter.order === "ascend" ? 0 : 1;
    }
    this.setState({ orderField: ck, orderType: order }, () => { me.getData(currentPage, pageSize) })
  }
  changeKey = (currentPage, pageSize, sorter) => {
    const me = this;
    //console.log(pagination, filters, sorter);
    let ck = null;
    let order = null;

    if (sorter) {
      ck = sorter.columnKey == "unitPrice" ? 10 : 11;
      order = sorter.order === "ascend" ? 0 : 1;
    }
    this.setState({ orderField: ck, orderType: order }, () => { me.getProDateForUnline(currentPage, pageSize) })
  }
  render() {
    const me = this;
    const {
      form: { getFieldDecorator },
    } = this.props;



    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 6 },
        xl: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 18 },
        xl: { span: 18 }
      },
    };
    return (
      <>

        <Tabs activeKey={this.state.key} onChange={e => this.setState({ key: e }, () => { me.getData(1, 10) })}>
          <TabPane tab="全部渠道" key="1" >
            <Form {...formItemLayout}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="商品状态" colon={false}>
                    {getFieldDecorator('picstate', {
                      rules: [
                        {
                          message: '请选择商品状态',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="0">上架</Option>
                        <Option value="1">仓库中</Option>
                        <Option value="2">不在售</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="渠道名称" colon={false}>
                    {getFieldDecorator('channelname', {
                      rules: [
                        {
                          message: '请输入渠道名称',
                        },
                      ],
                    })(
                      <Input maxLength={20} placeholder="请输入渠道名称" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="" colon={false}>
                    <Button type="primary" htmlType="submit" loading={this.state.loading} onClick={() => me.getData(me.state.currentPage, me.state.pageSize)}>
                      查询
                    </Button>
                    <Button className='Ml-basewidth' onClick={() => this.props.form.resetFields(['channelname', 'picstate'])}>
                      重置
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>

            <Table
              columns={this.columns}
              dataSource={this.state.data}
              pagination={{
                size: 'small',
                total: this.state.totalCount,
                showTotal: total => `共 ${total} 条记录`,
                pageSize: this.state.pageSize,
                current: this.state.currentPage,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                style: { marginTop: '10px', float: 'right' }
              }}
              onChange={(pagination, filters, sorter) => { this.monchange(pagination.current, pagination.pageSize, sorter) }}

              className={styles.tableBox}
            />
            <table className={styles.UnderLine}>
              <tbody>
                <tr>
            <td width="250"><span style={{ paddingLeft: 27 }}>线下门店（{this.state.totalstoreCount}）<a href='javascript:;' onClick={() => { me.setState({ key: '3' }, () => { me.getProDateForUnline(1, 10) }) }}>门店明细</a></span></td>
                  <td width="200" />
                  <td width="200">{this.state.price}</td>
                  <td width="200">{this.state.sale}</td>
                  {/* <td>0</td> */}
                </tr>
              </tbody>
            </table>
          </TabPane>
          <TabPane tab="线上渠道" key="2">
            <Form {...formItemLayout}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="商品状态" colon={false}>
                    {getFieldDecorator('picstate1', {
                      rules: [
                        {
                          message: '请选择商品状态',
                        },
                      ],
                    })(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="0">上架</Option>
                        <Option value="1">仓库中</Option>
                        <Option value="2">不在售</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="渠道名称" colon={false}>
                    {getFieldDecorator('channelname1', {
                      rules: [
                        {
                          message: '请输入渠道名称',
                        },
                      ],
                    })(
                      <Input maxLength={20} placeholder="请输入渠道名称" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="" colon={false}>
                    <Button type="primary" htmlType="submit" loading={this.state.loading} onClick={() => me.getData(me.state.currentPage, me.state.pageSize)}>
                      查询
                    </Button>
                    <Button className='Ml-basewidth' onClick={() => this.props.form.resetFields(['channelname1', 'picstate1'])}>
                      重置
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Table
              columns={this.columns}
              dataSource={this.state.data}
              pagination={{
                size: 'small',
                total: this.state.totalCount,
                showTotal: total => `共 ${total} 条记录`,
                pageSize: this.state.pageSize,
                current: this.state.currentPage,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                style: { marginTop: '10px', float: 'right' }
              }}
              onChange={(pagination, filters, sorter) => { this.monchange(pagination.current, pagination.pageSize, sorter) }}
              className={styles.tableBox}
            />
          </TabPane>
          <TabPane tab='线下门店' key="3">
            <Form {...formItemLayout}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="门店名称" colon={false}>
                    {getFieldDecorator('shopname', {
                      rules: [
                        {
                          message: '请输入门店名称',
                        },
                      ],
                    })(
                      <Input placeholder="请输入门店名称" style={{ width: '100%' }} />
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="" colon={false}>
                    <Button type="primary" htmlType="submit" loading={this.state.loading} onClick={() => me.getProDateForUnline(me.state.currentPage, me.state.pageSize)}>
                      查询
                    </Button>
                    <Button className='Ml-basewidth' onClick={() => this.props.form.resetFields(['shopname'])}>
                      重置
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Table
              columns={this.underlinecolumns}
              dataSource={this.state.data2}
              pagination={{
                size: 'small',
                total: this.state.totalstoreCount,
                showTotal: total => `共 ${total} 条记录`,
                pageSize: this.state.pageSize,
                current: this.state.currentPage,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                style: { marginTop: '10px', float: 'right' }
              }}
              onChange={(pagination, filters, sorter) => { this.changeKey(pagination.current, pagination.pageSize, sorter) }}
              className={styles.tableBox}
            />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default DMSelect;