import React, { Component } from 'react';
import { Tabs, Button, List, Select, Input, Form, Row, Col, message } from 'antd';
import DMGoodCell from '@/components/DMComponents/DMGoodCell';
// import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import styles from './index.less';
import request from '@/utils/request';
import SelectChannelImport from '@/components/CommonModal/SelectChannelImport';

const TabPane = Tabs.TabPane;
const { Option } = Select;
const FormItem = Form.Item;
/*
  submit   查询回调
*/

@Form.create()
class DMSelect extends Component {
  state = {
    isShelves: true, // 是否上架商品
    itemData: [],

    totalCount: 0,
    pageIndex: 1,
    pageSize: 9,
    productName: '', // 商品名称
    isSelectNowPage: false,  // 是否选择当前页
    loading: false,
    shopData: [],


    ckSelectAll: false,
    zsSelectAll: false,
    ckselectItemIds: [],  // 选中商品
    zsselectItemIds: [],
    shortName: 'tb',
    selectCount: 0,
    sellerId: '',
    sellerNick: '',
    shopname: '',
    plantId: '',
    mode: '1',
    placeholder: ''
  }

  getData = () => {
    const { ckSelectAll, zsSelectAll, selectItemIds, shortName } = this.state;
    this.props.submit(ckSelectAll, zsSelectAll, selectItemIds, shortName);
  }

  // 获取平台商品数据
  GetPlatformProduct = () => {
    const { productName, pageSize, pageIndex, isShelves, plantId } = this.state;
    if (plantId=="") {
      message.error("选择渠道和商品");
      return;
    }
    this.setState({ loading: true }, () => {
      request('g1/crm.product.platformproduct.get', {
        method: 'POST',
        body: { productName, pageSize, pageIndex, isShelves, plantId },
      })
        .then(response => {
          // console.log(response)
          if(response){
            this.setState({
              itemData: response.items,
              totalCount: response.totalResults,
              loading: false
            });
          }else{
            this.setState({
              itemData: [],
              totalCount: 0,
              loading: false
            });
          }
         

          this.changeSelectNowPage();
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    })

  }

  // 获取平台门店数据
  GetPlatformShop = (PlatType) => {
    request('g1/crm.channel.shop.get', {
      method: 'POST',
      body: { PlatType, Isdel: 0, PageIndex: 1, PageSize: 999 },
    })
      .then(response => {
        //const datas = response.data;

        const t1 = moment();
        const datas = response.data.filter(i => moment(i.outhEndtime) > t1);
        if (datas.length === 0) {
          message.warning("暂无可用的店铺");
          return;
        }
        const sellerId = datas[0].platSellerid;
        const sellerNick = datas[0].platSellernick;
        const shortName = datas[0].platform;
        const shopname = datas[0].shopname;
        const plantId = datas[0].id;
        this.props.form.setFieldsValue({ channel: datas[0].id });
        this.setState({ shopData: datas, sellerId, sellerNick, shortName, shopname, plantId }, () => {
          this.GetPlatformProduct();
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    //this.GetPlatformShop(0);
  }


  static defaultProps = {
  }

  // 查询
  handleSubmit = e => {
    e.preventDefault();
    this.GetPlatformProduct();
  };

  // 重置查询
  resetFields = () => {
    this.props.form.resetFields();
  }

  // 选中事件
  listOnchange = (checked, id, itemData) => {
    // eslint-disable-next-line prefer-const
    let { zsselectItemIds, ckselectItemIds, selectCount, isShelves, zsSelectAll, ckSelectAll } = this.state;

    if (isShelves === true) {
      if (zsSelectAll === true) {
        if (zsselectItemIds.findIndex(i => i === id) < 0) {
          zsselectItemIds.push(id);
          selectCount -= 1;
          this.setState({ zsselectItemIds, selectCount });
        } else {
          zsselectItemIds = zsselectItemIds.filter(i => i !== id);
          selectCount += 1;
          this.setState({ zsselectItemIds, selectCount });
        }

      } else {
        const item = itemData.find(i => i.id === id);
        const sitem = zsselectItemIds.find(i => i === id);
        if (checked) {
          if (!sitem) {
            zsselectItemIds.push(item.id);
          }
        } else {
          if (sitem) {
            zsselectItemIds = zsselectItemIds.filter(i => i !== id);
          }
        }
        selectCount = zsselectItemIds.length + ckselectItemIds.length;
        this.setState({ zsselectItemIds, selectCount });
      }

    } else {
      if (ckSelectAll === true) {
        if (ckselectItemIds.findIndex(i => i === id) < 0) {
          ckselectItemIds.push(id);
          selectCount -= 1;
          this.setState({ ckselectItemIds, selectCount });
        } else {
          ckselectItemIds = ckselectItemIds.filter(i => i !== id);
          selectCount += 1;
          this.setState({ ckselectItemIds, selectCount });
        }
      } else {
        const item = itemData.find(i => i.id === id);
        const sitem = ckselectItemIds.find(i => i === id);
        if (checked) {
          if (!sitem) {
            ckselectItemIds.push(item.id);
          }
        } else {
          if (sitem) {
            ckselectItemIds = ckselectItemIds.filter(i => i !== id);
          }
        }
        selectCount = zsselectItemIds.length + ckselectItemIds.length;
        this.setState({ ckselectItemIds, selectCount });
      }
    }



  }

  // 选中当前页
  selectNowPage = (itemData) => {
    // eslint-disable-next-line prefer-const
    let { zsselectItemIds, ckselectItemIds, selectCount, isShelves, isSelectNowPage } = this.state;
    let { ckSelectAll, zsSelectAll } = this.state;

    if (isShelves === true) {
      // 如果是上架全选状态 取消上架全选的状态
      if (zsSelectAll === true) {
        zsSelectAll = false;
        zsselectItemIds = [];
      }
      // 如果不是全选当前页 全选 否则反选
      if (isSelectNowPage === false) {
        // 遍历当前数据源 已选中的不管 为选中的新增
        itemData.forEach(i => {
          if (zsselectItemIds.length > 0) {
            const item = zsselectItemIds.find(j => j === i.id);
            if (!item) {
              zsselectItemIds.push(i.id);
            }
          } else {
            zsselectItemIds.push(i.id);
          }
        });
        isSelectNowPage = true;
      } else {
        // 去除当前选中
        if (zsselectItemIds.length > 0) {
          zsselectItemIds = zsselectItemIds.filter(i => itemData.findIndex(j => j.id === i) < 0);
        }
        isSelectNowPage = false;
      }
      selectCount = zsselectItemIds.length + ckselectItemIds.length;
      this.setState({ zsselectItemIds, isSelectNowPage, selectCount, zsSelectAll });
    } else {
      // 如果是上架全选状态 取消上架全选的状态
      if (ckSelectAll === true) {
        ckSelectAll = false;
        ckselectItemIds = [];
      }

      if (isSelectNowPage === false) {
        itemData.forEach(i => {
          if (ckselectItemIds.length > 0) {
            const item = ckselectItemIds.find(j => j === i.id);
            if (!item) {
              ckselectItemIds.push(i.id);
            }
          } else {
            ckselectItemIds.push(i.id);
          }
        });
        isSelectNowPage = true;
      } else {
        if (ckselectItemIds.length > 0) {
          ckselectItemIds = ckselectItemIds.filter(i => itemData.findIndex(j => j.id === i) < 0);
        }
        isSelectNowPage = false;
      }
      selectCount = zsselectItemIds.length + ckselectItemIds.length;
      this.setState({ ckselectItemIds, isSelectNowPage, selectCount, ckSelectAll });
    }
  }

  // 一键全选所有商品
  selectAll = () => {
    // eslint-disable-next-line prefer-const
    let { zsSelectAll, ckSelectAll, totalCount, selectCount, isShelves, isSelectNowPage } = this.state;
    if (isSelectNowPage === true) {
      isSelectNowPage = false;
    }
    if (isShelves === true) {
      if (zsSelectAll === true) {
        selectCount -= totalCount;
        this.setState({ zsSelectAll: false, zsselectItemIds: [], selectCount, isSelectNowPage });
      }
      else {
        selectCount += totalCount;
        this.setState({ zsSelectAll: true, selectCount, zsselectItemIds: [], isSelectNowPage });
      }
    } else {
      if (ckSelectAll === true) {
        selectCount -= totalCount;
        this.setState({ ckSelectAll: false, ckselectItemIds: [], selectCount, isSelectNowPage });
      }
      else {
        selectCount += totalCount;
        this.setState({ ckSelectAll: true, selectCount, ckselectItemIds: [], isSelectNowPage });
      }
    }
  }

  // tab切换事件
  tabChange = (key) => {
    this.setState({ itemData: [], mode: key, productName: '' }, () => {

      if (key === "1") {
        this.setState({ isShelves: true, pageIndex: 1, isSelectNowPage: false }, () => this.GetPlatformProduct())
      } else if (key === "2") {
        this.setState({ isShelves: false, pageIndex: 1, isSelectNowPage: false }, () => this.GetPlatformProduct())
      }
    });

  }


  qdChaneg = (value) => {
    this.setState({ mode: '1' });
    this.GetPlatformShop(value);
  }

  // 改变当前页选中状态
  changeSelectNowPage = () => {
    let { isSelectNowPage } = this.state;
    const { isShelves, itemData, zsselectItemIds, ckselectItemIds } = this.state;

    isSelectNowPage = true;
    if (isShelves === true) {
      itemData.forEach(i => {
        if (zsselectItemIds.findIndex(j => j === i.id) < 0) {
          isSelectNowPage = false;
        }
      });
    } else {
      itemData.forEach(i => {
        if (ckselectItemIds.findIndex(j => j === i.id) < 0) {
          isSelectNowPage = false;
        }
      });
    }

    this.setState({ isSelectNowPage });
  }

  selectChaneg = (value, option) => {
    this.props.form.setFieldsValue({ channel: value });
    const { shopData } = this.state;
    const shop = shopData.find(i => i.id === value);

    this.setState({
      shortName: shop ? shop.platform : '',
      ckSelectAll: false,
      zsSelectAll: false,
      ckselectItemIds: [],
      zsselectItemIds: [],
      selectCount: 0,
      sellerId: shop ? shop.platSellerid : '',
      sellerNick: shop ? shop.platSellernick : '',
      shopname: shop ? shop.shopname : '',
      plantId: shop.id
    }, () => {
      this.GetPlatformProduct();
    })
  }

  render() {
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

    let me = this;
    const { zsselectItemIds, ckselectItemIds, isSelectNowPage, zsSelectAll, ckSelectAll, shopData, mode, placeholder } = me.state;

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={8}>
              <FormItem label="选择渠道" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} colon={false}>
                {getFieldDecorator('channel', {
                  rules: [
                    {
                      required: true,
                      message: '请选择渠道',
                    },
                  ],
                })(
                  <SelectChannelImport
                    onChange={(values) => {
                      if (values && values.length === 2) {
                        let placeholder = '请输入名称';
                        if (values[1].platform === 'yz') {
                          placeholder = '请输入编码';
                        }
                        me.setState({ pageIndex: 1, shopname: values[1].platformname, mode: '1', isShelves: true, plantId: values[1].id, placeholder, shortName: values[1].platform, itemData: [], productName: '' }, () => {
                          me.GetPlatformProduct();
                        });
                      } else {
                        me.setState({ mode: '1', isShelves: true, plantId: '', itemData: [], productName: '', shopname: '', pageIndex: 1 })
                      }

                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs onChange={this.tabChange} activeKey={mode}>
          <TabPane tab="已上架" key="1">
            <div className={`${styles.BoxAll} Mb-basewidth2`}>
              <div>
                <Button loading={this.state.loading} className='Mr-basewidth' onClick={() => this.selectNowPage(this.state.itemData)}>{isSelectNowPage ? "取消当前页" : "全选当前页"}</Button>
                <Button loading={this.state.loading} onClick={() => this.selectAll(1)}>{zsSelectAll ? '取消全选所有商品' : '一键全选所有商品'}</Button>
              </div>
              <div>
                <Input.Search style={{ width: 200 }} value={me.state.productName} placeholder={placeholder} onChange={(e) => this.setState({ productName: e.target.value })} onSearch={() => { this.setState({ pageIndex: 1 }, () => this.GetPlatformProduct()) }} />
              </div>
            </div>
            <List
              loading={this.state.loading}
              grid={{ gutter: 16, column: 3 }}
              pagination={{
                current:this.state.pageIndex,
                pageSize: this.state.pageSize, // 每页显示9个
                size: 'small',
                total: this.state.totalCount,
                onChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.GetPlatformProduct()) },
                onShowSizeChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.GetPlatformProduct()) }
              }}
              dataSource={this.state.itemData}
              renderItem={item => (
                <List.Item>
                  <DMGoodCell
                    key={item.id}
                    checked={(zsSelectAll ? (!(zsselectItemIds.findIndex(i => i === item.id) >= 0)) : zsselectItemIds.findIndex(i => i === item.id) >= 0)}
                    data={{
                      title: item.title,
                      icon: item.picUrl,
                      detail: item.outerId,
                      price: item.price,
                    }}
                    onChange={(checked) => this.listOnchange(checked, item.id, this.state.itemData)}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="仓库中" key="2" disabled={this.state.shortName === 'yz'}>
            <div className={`${styles.BoxAll} Mb-basewidth2`}>
              <div>
                <Button loading={this.state.loading} className='Mr-basewidth' onClick={() => this.selectNowPage(this.state.itemData)}>{isSelectNowPage ? "取消当前页" : "全选当前页"}</Button>
                <Button loading={this.state.loading} onClick={() => this.selectAll(2)}>{ckSelectAll ? '取消全选所有商品' : '一键全选所有商品'}</Button>
              </div>
              <div>
                <Input.Search style={{ width: 200 }} value={me.state.productName} placeholder={placeholder} onChange={(e) => this.setState({ productName: e.target.value })} onSearch={this.GetPlatformProduct} />
              </div>
            </div>
            <List
              loading={this.state.loading}
              grid={{ gutter: 16, column: 3 }}
              pagination={{
                pageSize: this.state.pageSize, // 每页显示9个
                size: 'small',
                total: this.state.totalCount,
                onChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.GetPlatformProduct()) },
                onShowSizeChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.GetPlatformProduct()) }
              }}
              dataSource={this.state.itemData}
              renderItem={item => (
                <List.Item>
                  <DMGoodCell
                    key={item.id}
                    checked={(ckSelectAll ? true : ckselectItemIds.findIndex(i => i === item.id) >= 0)}
                    data={{
                      title: item.title,
                      icon: item.picUrl,
                      detail: item.outerId,
                      price: item.price,
                    }}
                    onChange={(checked) => this.listOnchange(checked, item.id, this.state.itemData)}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default DMSelect;