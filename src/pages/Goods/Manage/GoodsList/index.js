import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { Button, Form, Select, Input, Row, Col, Table, Icon, Cascader, InputNumber, TreeSelect, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DMOverLay } from '@/components/DMComponents';
import SelectStore from './SelectStore';
// import { SelectFestival, SelectEntity, SelectStore } from '@/components/CommonModal';
import { DMSelectCoupon } from '@/components/DMComponents';
import UpDateGoods from './UpDateGoodsOverlay';
import { connect } from 'dva';
import styles from './index.less';
import { Categories, ChannelDetail } from '@/components/CommonModal';
import request from '@/utils/request';
import moment from 'moment';
import DMTransfer from '@/components/DMComponents/DMTransfer';
// const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;



// 编辑单元格开始
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow); // 更新行


class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editdata = this.state.editing;
    const editing = !editdata;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    let that = this;
    const { record, handleSave } = that.props;
    that.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      that.toggleEdit();
      handleSave({ id: record.id, name: values.name });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record } = this.props;
    const { editing } = this.state;
    return editing ? (
      <span>
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `名称必须填写`,
              },
            ],
            initialValue: record.name,
          })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
        </Form.Item>
      </span>
    ) : (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
          <span>{children}</span>
          <span className={`${styles.codeSpan} ${styles.codeSpanColor}`}>{record.price ? record.price : ''}</span>
          <Icon type="edit" className={`${styles.linkColor} ${styles.Edit}`} onClick={this.toggleEdit} />
        </div>
      );

  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      children,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

@connect(
  ({ loading, goodslistModel }) => {
    return {
      loading: loading.models.goodslistModel,
      goodslistModel: goodslistModel
    };
  },
  null,
  null,
  { withRef: true }
)
@Form.create()
class GoodsList extends PureComponent {
  constructor(props) {
    super(props);
    let me = this;
    this.state = {
      editdisplay: 'none', // 发送消息页面先隐藏
      edittext: 'inline-block',// 需要编辑的文字
      value: '',
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      data: [],
      selectedRowKeys: [],
      optionsData: [],
      id: "",
      code: "",
      countDataObj: {},
      storelist: [],
      cascaderSelectValue: [],
      visible: false,
      shopData: [],
      updateGoodsData: {},
      selectedRowKeysn: []
    }
    this.columns = [
      {
        title: '主图',
        dataIndex: 'mainImage',
        width: 100,
        render: (txt) => {
          return (
            <Row type='flex' className={styles.goodsCol}>
              <Col className={styles.title}>
                <span className={styles.pic}> {txt ? <img src={txt} alt="" /> : ""}</span>
              </Col>
            </Row>
          )
        }
      },
      {
        title: '名称&售价',
        dataIndex: 'name',
        editable: true,
        render: (txt) => {
          return (
            <Row className={styles.title} style={{ wordBreak: 'break-all' }}>
              {/* 二级展开 */}
              <span className={styles.codeSpan}>{txt ? txt : ''}</span>
              <span className={styles.codeSpan}>{txt.spuCode ? txt.spuCode : ''}</span>
            </Row>
          )
        }
      },
      {
        title: '编码',
        dataIndex: 'spuCode',
        width: '12%',
        render: (txt) => {
          return <div style={{ wordBreak: 'break-all' }}>
            {txt}
          </div>
        }
      },
      {
        title: '总销量',
        dataIndex: 'totalSaleCount',
        sorter: true,
        width: '10%',
      },
      // {
      //   title: '总库存',
      //   dataIndex: 'totalStock',
      //   sorter: true,
      // },
      {
        title: '在售渠道',
        dataIndex: 'inSaleChannels',
        width: '16%',
        render: (txt, record) => {
          return (
            <div style={{ width: '100%' }}>
              {
                txt.length > 0 &&
                <span className={styles.channelBox}>
                  {txt.map((Item, index) => {
                    return (
                      <i key={index}>{Item}</i>
                    )
                  }
                  )}
                </span>
              }
              {!record.disabled && <a onClick={() =>
                this.setState(
                  {
                    id: record.id,
                    code: record.spuCode
                  },
                  () => {
                    this.selectGoodsModal.show();
                  }
                )}>详情</a>}
            </div>
          )
        }
      },
      {
        title: '最近修改时间',
        dataIndex: 'modifyTime',
        sorter: true,
        width: '16%',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        fixed: 'right',
        width: 210,
        render: (txt, record) => {
          return (
            !record.disabled && <div className={styles.operateBox}>
              <a onClick={() => router.push('/goods/manage/goods360?GoodId=' + record.id)}>商品详情</a>
              <a onClick={() => router.push({ pathname: '/goods/manage/create', query: { id: record.id } })}>编辑</a>
              <a onClick={() => this.setState({ updateGoodsData: record }, () => { this.updateGoodsModal.show() })}>更新信息</a>
              <a onClick={() =>
                this.setState({ storelist: record.distributionShops, id: record.id },
                  () => {
                    this.selectStore.show(record.distributionShops, record.id);
                  })}>分配门店</a>
            </div>
          )
        }
      }
    ];
  }

  componentWillMount() {
    this.getProductCategoryList();
    this.getCountDataObj();
    this.requestPageList(this.state.currentPage, this.state.pageSize);
    this.getPlatformShop();
  };

  //获取门店信息
  getPlatformShop = () => {
    this.setState({
      loading: true,
    });
    request('g1/crm.channel.shop.get', {
      method: 'POST',
      body: { PlatType: 0, Isdel: 0, PageIndex: 1, PageSize: 999 },
    }).then(response => {
      let t1 = moment();
      let datas = response.data.filter(i => moment(i.outhEndtime) > t1);
      if (datas.length === 0) {
        //message.warning("暂无可用的店铺");
        return;
      }

      this.setState({
        shopData: datas,
        loading: false,
      });
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  // 获取平台门店数据
  getCountDataObj = () => {
    let sdata = { PlatType: 0, Isdel: 0, PageIndex: 1, PageSize: 999 };
    request('g1/crm.product.productwaitimportcount.get', {
      method: 'POST',
      body: {},
    }).then(response => {
      this.setState({
        countDataObj: response || {},
      });
    })
  }

  // 获取列表
  requestPageList = (currentPage, pageSize, sorter) => {
    let that = this;
    that.props.form.validateFields((err, values) => {
      let queryProductData = {
        CurrentPage: currentPage,
        PageSize: pageSize,
        name: values.themename,//名称
        BarCode: values.themename,//编码
        StockD: values.stockbefore,//库存
        StockG: values.stockafter,
        CategoryId: (values.goodsclassify || []).length > 0 ? values.goodsclassify[values.goodsclassify.length - 1] : undefined,//类目
        MinPrice: values.pricebefore,//售价
        MaxPrice: values.priceafter,
        SalesD: values.salebefore,//销量
        SalesG: values.saleafter,

        OrderType: undefined,//0升序 1降序
        OrderField: undefined,//排序字段 1 当前售价 2 销量 3 库存
      };
      if ((values.stockbefore >= 0 || values.stockafte >= 0) && values.stockbefore > (values.stockafter == null ? undefined : values.stockafter)) {
        message.error('库存区间错误');
        return;
      }
      if ((values.pricebefore >= 0 || values.priceafter >= 0) && values.pricebefore > (values.priceafter == null ? undefined : values.priceafter)) {
        message.error('售价区间错误');
        return;
      }
      if ((values.salebefore >= 0 || values.saleafter >= 0) && values.salebefore > (values.saleafter == null ? undefined : values.saleafter)) {
        message.error('销量区间错误');
        return;
      }

      if (sorter && sorter.column) {
        if (sorter.column.dataIndex == 'totalSaleCount') {
          queryProductData.OrderField = 2;
        }
        else if (sorter.column.dataIndex == 'totalStock') {
          queryProductData.OrderField = 3;
        } else if (sorter.column.dataIndex == 'modifyTime') {
          queryProductData.OrderField = 4;
        }
        if (sorter.order == 'descend') {
          queryProductData.OrderType = 1;
        }
        else if (sorter.order == 'ascend') {
          queryProductData.OrderType = 0;
        }
      }
      this.props.dispatch({
        type: 'goodslistModel/ProductMasterListModel',
        payload: queryProductData,
        callback: (response) => {
          if (response) {

            const dl = Array.from(response.data, (r1, i1) => {
              const cl = r1.skuList ?
                Array.from(r1.skuList, (r2, i2) => {
                  return {
                    id: i1 + '_' + i2,
                    spuCode: r2.skuCode || '',
                    name: r2.skuName || '',
                    totalSaleCount: r2.sales || 0,
                    totalStock: r2.stock || 0,
                    inSaleChannels: r2.inSaleChannels || [],
                    modifyTime: '',
                    disabled: true,

                  }
                }) : [];
              return {
                ...r1,
                children: cl
              };
            });
            console.log(dl);
            this.setState({
              currentPage: response.currentPage,
              pageSize: response.pageSize,
              totalCount: response.totalCount,
              data: dl
            });
          }
        }
      });
    });
  };

  //修改名称
  handleSave = (e) => {
    let that = this;
    let sdata = {
      id: e.id,
      name: e.name
    }
    request('g1/crm.product.productname.update', {
      method: 'POST',
      body: sdata,
    }).then(response => {
      if (response) {
        message.success("修改成功");
        that.requestPageList(that.state.currentPage, that.state.pageSize);
      }
    }).catch(() => {

    });
  };

  // 批量删除
  BatchRemove = () => {
    let that = this;
    if (that.state.selectedRowKeys.length < 1) {
      message.error("请选择需要删除的商品");
      return;
    }
    let queryData = {
      Ids: that.state.selectedRowKeys
    };
    Modal.confirm({
      title: "是否确定删除?",
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        that.props.dispatch({
          type: 'goodslistModel/DeleteProductService',
          payload: queryData,
          callback: (response) => {
            if (response) {
              message.success("删除成功！");
              let cp = that.state.selectedRowKeys.length >= that.state.data.length ? that.state.currentPage - 1 : that.state.currentPage;
              that.setState({
                selectedRowKeys: [],
                currentPage: cp || 1,
              }, () => {
                that.requestPageList(that.state.currentPage, that.state.pageSize);
              });
            }
          }
        });
      }
    });
  }

  //商品导入处理
  gotoWaitLead = () => {
    router.push('/goods/manage/waitlead')
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  // 获取类目树形结构
  getProductCategoryList = () => {
    const me = this;
    let queryData = {
    };
    me.props.dispatch({
      type: 'goodslistModel/ProductBehindCategoryTreeListModel',
      payload: queryData,
      callback: (response) => {
        if (response) {
          me.setState({
            optionsData: response,
            //optionA:data
          });
        }
      }
    });
  }

  // 调整分类
  onChangeTreeSelect = (value) => {
    let that = this;
    
    let cid = value[value.length - 1];
    that.setState({
      cascaderSelectValue: value,
    });
    let queryData = {
      Ids: that.state.selectedRowKeys,
      CategoryId: cid
    }
    that.props.dispatch({
      type: 'goodslistModel/UpdateCategoryService',
      payload: queryData,
      callback: (response) => {
        if (response) {
          message.success("调整成功！");
          that.setState({
            selectedRowKeys: [],
            cascaderSelectValue: []
          });
          that.requestPageList(that.state.currentPage, that.state.pageSize);
        }
      }
    });
  }
  //分配门店
  saveSelectStore = (pid, list) => {

    list = list.substr(0, list.length - 1);

    var sdata = {
      ProductId: pid,
      ShopIds: list
    }
    if(list!=""){

    request('g1/crm.product.productmast.distribution', {
      method: 'POST',
      body: sdata,
    }).then(response => {
      if (response) {
        message.info("商品已分配");
        this.requestPageList(this.state.currentPage, this.state.pageSize);
      } else {

        message.error("商品分配失败");
      }
    })
    
  }else{
    message.error('请选择门店');
  }
  }
  fn(data) {
    this.setState({
      ids: data //把父组件中的parentText替换为子组件传递的值
    }, () => {
      console.log(this.state.parentText);//setState是异步操作，但是我们可以在它的回调函数里面进行操作
    });

  }
  //更新商品
  updateGoodsRequset = (e) => {
    e.preventDefault();
    this.prizeForm.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (values.chosechannel && values.chosechannel.length !== 2) {
        message.error('请选择渠道');
        return;
      }

      this.setState({
        loading: true,
      });

      const sdata = {
        PlantId: values.chosechannel[1].id,
        // ShortName: pf.platform,//渠道标识 tb,jd,sn.yz,wm
        // SellerId: pf.platSellerid,
        // SellerNick: pf.platSellernick,
        OuterId: this.state.updateGoodsData.spuCode,
        Id: this.state.updateGoodsData.id,
        type: values.updatacon
      }
      request('g1/crm.product.productupdatebyouterid.update', {
        method: 'POST',
        body: sdata,
      }).then(response => {
        this.setState({
          loading: false,
        });
        if (response) {
          message.success("更新成功");
          this.requestPageList(this.state.currentPage, this.state.pageSize);
          this.updateGoodsModal.hide();
        }

      }).catch(() => {
        this.setState({ loading: false });
      });
    });
  }
  openmodel = () => {
    if (this.state.selectedRowKeys.length < 1) {
      message.error("请先选择商品");
      return;
    }
    const { visible } = this.state;
    this.setState({
      visible: true,
    });
    this.child.showModel();
  }
  onRef = (ref) => {
    this.child = ref;
  }
 
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { loading } = this.props || false;

    const options = this.state.optionsData;

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,

      onChange: (checkedValues, selectedRows) => {
        let selectedRowKeysn = this.state.selectedRowKeys;
      
        let selectedRowKeysA = [];
        for (var i = 0; i < checkedValues.length; i++) {
          selectedRowKeysA.push(checkedValues[i]);
        }
      
          this.setState({
            selectedRowKeys: selectedRowKeysA
          })
       
      },
      getCheckboxProps: record => ({
        disabled: record.disabled === true, // Column configuration not to be checked
      }),
    };

    const {
      form: { getFieldDecorator },
      onChange
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 5 },
        xl: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 19 },
        xl: { span: 19 }
      },
      colon: false
    };

    const that = this;

    return (
      <Fragment>
        <DMOverLay
          ref={ref => {
            this.selectGoodsModal = ref;
          }}
          title="渠道详情"
          width={1000}
          footer={null}
        >
          <ChannelDetail id={that.state.id} code={this.state.code} />
        </DMOverLay>


        <SelectStore
          ref={(ref) => that.selectStore = ref}
          width={1200}
          type="multi"
          checkedList={that.state.storelist}
          checkedshopList={that.state.storelist}
          handleOk={(list, listseclect) => {
            if (list.length > 0) {
              var li = "";
              list.forEach(e => {
                if (e != undefined) {
                  li += e + ",";
                }
              });
              this.saveSelectStore(this.state.id, li);
            } else {
              this.saveSelectStore(this.state.id, "");
            }

          }}
          handleCancel={(list, listseclect) => {
            this.setState({
              storelist: list,
              completeShop: listseclect,
            }, () => {
              if (onChange) onChange([value, list])
            });
          }
          }
        />


        {/* <DMOverLay  ref={ref => {
          this.selectstore = ref;
        }}
          title="选择门店"
          width={1000}
         >
          <DMSelectStore ref={ref => { this.selectstore = ref }}
          handleOk={ this.saveSelectStore}
          id={that.state.id}  />
          </DMOverLay> */}



        <DMOverLay
          ref={ref => {
            this.updateGoodsModal = ref;
          }}
          title="更新商品信息"
          width={500}
          handleOk={that.updateGoodsRequset}
          confirmLoading={this.state.loading}
        >
          <UpDateGoods wrappedComponentRef={ref => (this.prizeForm = ref)} productInfo={that.state.updateGoodsData} shopData={that.state.shopData} />
        </DMOverLay>
        <Categories
          ref={ref => {
            that.couponOverLay = ref;
          }}
          goodsId={this.state.selectedRowKeys}
        />
        <PageHeaderWrapper title='商品管理'>
          <div className={styles.marketPageAll}>
            <Form {...formItemLayout}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8}>
                  <FormItem label="商品分类" colon={false}>
                    {getFieldDecorator('goodsclassify')(
                      <Cascader options={options}
                        placeholder="请选择商品分类"
                      />
                    )}
                  </FormItem>
                </Col>
                {/* <Col md={8} sm={24}>
                  <FormItem label="库存" colon={false} className={styles.formitemBox}>
                    <FormItem style={{ display: 'inline-block' }} className={styles.InputBoxWidth}>
                      {getFieldDecorator('stockbefore')(
                        <InputNumber precision={0} max={999999999} min={0} placeholder="请输入库存" style={{ width: '100%' }} />
                      )}
                    </FormItem>
                    <span className={styles.midspan}>-</span>
                    <FormItem style={{ display: 'inline-block' }} className={styles.InputBoxWidth}>
                      {getFieldDecorator('stockafter')(
                        <InputNumber precision={0} max={999999999} min={0} placeholder="请输入库存" style={{ width: '100%' }} />
                      )}
                    </FormItem>
                  </FormItem>
                </Col> */}
                <Col md={8}>
                  <FormItem label="销量" colon={false} className={styles.formitemBox}>
                    <FormItem style={{ display: 'inline-block' }} className={styles.InputBoxWidth}>
                      {getFieldDecorator('salebefore')(
                        <InputNumber precision={0} max={999999999} min={0} placeholder="请输入销量" style={{ width: '100%' }} />
                      )}
                    </FormItem>
                    <span className={styles.midspan}>-</span>
                    <FormItem style={{ display: 'inline-block' }} className={styles.InputBoxWidth}>
                      {getFieldDecorator('saleafter')(
                        <InputNumber precision={0} max={999999999} min={0} placeholder="请输入销量" style={{ width: '100%' }} />
                      )}
                    </FormItem>
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="售价" colon={false} className={styles.formitemBox}>
                    <FormItem style={{ display: 'inline-block' }} className={styles.InputBoxWidth}>
                      {getFieldDecorator('pricebefore')(
                        <InputNumber precision={2} max={999999999} min={0} placeholder="请输入售价" style={{ width: '100%' }} />
                      )}
                    </FormItem>
                    <span className={styles.midspan}>-</span>
                    <FormItem style={{ display: 'inline-block' }} className={styles.InputBoxWidth}>
                      {getFieldDecorator('priceafter')(
                        <InputNumber precision={2} max={999999999} min={0} placeholder="请输入售价" style={{ width: '100%' }} />
                      )}
                    </FormItem>
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label="名称/编码" colon={false}>
                    {getFieldDecorator('themename')(
                      <Input placeholder="请输入名称/编码" maxLength={60} style={{ width: '100%' }} allowClear />
                    )}
                  </FormItem>
                </Col>
                <Col md={8}>
                  <FormItem label=' ' {...formItemLayout} >
                    <Button loading={loading} type="primary" onClick={() => that.requestPageList(1, this.state.pageSize)}>
                      查询
                    </Button>
                    <Button className='Ml-basewidth' onClick={this.handleReset}>
                      重置
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div className={styles.midBoxCon}>
              <div className={styles.midBoxLeft}>
                <Button className='Mr-basewidth' loading={loading} type="primary" onClick={() => router.push('/goods/manage/create')}>新增商品</Button>
                <Button className='Mr-basewidth' onClick={this.BatchRemove}>批量删除</Button>
                <Button onClick={this.openmodel.bind(this)}>批量调整分类</Button> &nbsp;&nbsp;
                {/* <Cascader disabled={this.state.selectedRowKeys.length < 1} options={options}
                  value={this.state.cascaderSelectValue}
                  placeholder="请选择"
                  onChange={this.onChangeTreeSelect}
                  style={{ width: 265 }}
                /> */}
                <DMTransfer
                  onRef={this.onRef}
                  visible={this.state.visible}
                  news={this}
                  onCancle={this.getProductCategoryList}
                  option={options}
                >
                </DMTransfer>
              </div>
              <div className={styles.midBoxRight}>
                <i>待导入商品：<span>{this.state.countDataObj.productCount || 0}</span></i>
                <i>待导入SKU：<span>{this.state.countDataObj.skuCount || 0}</span></i>
                <i onClick={this.gotoWaitLead} className={styles.linkColor} style={{ 'cursor': 'pointer' }}>处理</i>
              </div>
            </div>
            <div className={styles.H16} />
            <Table
              columns={columns}
              rowKey={j => j.id}
              loading={loading}
              rowSelection={rowSelection}
              components={components}
              dataSource={this.state.data}
              pagination={{
                size: 'small',
                current: Number(this.state.currentPage),
                showQuickJumper: true,
                showSizeChanger: true,
                pageSize: parseInt(this.state.pageSize),
                total: parseInt(this.state.totalCount),
                showTotal: () => { return `共${this.state.totalCount}条记录` },
              }}
              scroll={{ x: 1500 }}
              onChange={(p, f, s) => { this.requestPageList(p.current, p.pageSize, s); }}
            />
          </div>
        </PageHeaderWrapper>

      </Fragment>
    )
  }
}

export default GoodsList;