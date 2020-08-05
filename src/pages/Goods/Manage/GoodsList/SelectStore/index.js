import React, { Component } from 'react';
import { Table,Tabs, Form, Row, Col, Cascader, Button, Select, Input, Badge, Tooltip,Modal, message, Tag as ATag } from 'antd';
import { DMOverLay } from '@/components/DMComponents';
import { filterListModel } from '@/utils/utils';
import request from '@/utils/request';
import styles from "./index.less"
const FormItem = Form.Item;
const { Option } = Select;

class ConditionElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      loading: false,
      optionArr:[],
      getStoreDetail: this.props.getStoreDetail === undefined ? [] : this.props.getStoreDetail,
    };

    this.requestList = this.props.requestList.bind(this);
  }

  componentDidMount() {
    let queryParams = {};
    request('g2/wx.authority.group.shop.list', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (response) {

          this.setState({ optionArr: response.list });
        } else {
          this.setState({ optionArr: [] });
        }

      })
  }



  // 重置
  restFormVals = () => {
    const { form } = this.props;
    form.resetFields();
  }

  handleSubmit = e => {
    const that = this;
    e.preventDefault();
    that.props.form.validateFields((err, values) => {
      // if (values.shopName !== undefined && values.shopName !== "") {
      this.requestList(1, 10, values);
      // }

    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemlayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      colon: false,
    };
    const { dataList } = this.state;

    return (
      <Form {...formItemlayout} onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={16}>
        <Col span={8}>
            <FormItem label="门店分组" colon={false}>
              {getFieldDecorator('shopGroupId', {
                rules: [
                  {
                    message: '请输入门店名称',
                  },
                ],
              })(
                <Select placeholder={"请选择门店分组"} >
                  {
                    this.state.optionArr.map((item) => (
                      <Option value={item.id + ""}>{item.groupName}</Option>
                    ))
                  }
                </Select>)}
            </FormItem>
          </Col>
          <Col span={8}>
            <Form.Item label="门店名称">{getFieldDecorator('shopName')(<Input placeholder='请输入门店名称' allowClear />)}</Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Row type="flex" gutter={16} style={{ marginTop: '-1px' }}>
                <Col>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => this.restFormVals()}>重置</Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
const StoreForm = Form.create()(ConditionElement);

class DMSelectStore extends Component {
  static defaultProps = {
    type: 'default', // multi:多选 default:默认
  };

  constructor(props) {
    super(props);
    this.isLoadA = false
    this.isLoadB = false
    this.state = {
      data: [
        // { id: 0, storeName: '七匹狼直营店-大润发一店', manager: '刘德华', phone: '1855134454', city: '常州', state: 0, group: '系统管理员', creator: '系统管理员', },
        // { id: 1, storeName: '七匹狼直营店-大润发一店', manager: '刘德华', phone: '1855134454', city: '常州', state: 1, group: '系统管理员', creator: '系统管理员', },
        // { id: 2, storeName: '七匹狼直营店-大润发一店', manager: '刘德华', phone: '1855134454', city: '常州', state: 0, group: '系统管理员', creator: '系统管理员', },
        // { id: 3, storeName: '七匹狼直营店-大润发一店', manager: '刘德华', phone: '1855134454', city: '常州', state: 1, group: '系统管理员', creator: '系统管理员', },
        // { id: 4, storeName: '七匹狼直营店-大润发一店', manager: '刘德华', phone: '1855134454', city: '常州', state: 0, group: '系统管理员', creator: '系统管理员', },
        // { id: 5, storeName: '七匹狼直营店-大润发一店', manager: '刘德华', phone: '1855134454', city: '常州', state: 1, group: '系统管理员', creator: '系统管理员', },
      ],
      currentGroup: null,
      selected: this.props.checked === undefined ? {} : this.props.checked,
      checkedList: this.props.checkedList || [],
      loading: false,
      selectedList: this.props.checkedshopList || [],
      selectedAll: [],

      checkedListold:null,
      selectedListold:null,
    };
    this.columns = [      {
      title: '门店名称',
      dataIndex: 'shopName',
      width: 200,

    },
    // {
    //   title: '店长',
    //   dataIndex: 'shopOwner',
    //   width: 200,
    // },
    // {
    //   title: '联系电话',
    //   dataIndex: 'phone',
    //   //sorter: (a, b) => a.currentprice.length - b.currentprice.length,
    //   width: 200,
    // },
    {
      title: '城市',
      dataIndex: 'city',
      width: 200,
    },
    {
      title: '门店状态',
      width: 200,
      dataIndex: 'shopState',
      render: txt => {
        return txt === 0 ? (
          <span>
            <Badge status="success" />
            正常营业
          </span>
        ) : (
            <span>
              <Badge status="error" />
              歇业
          </span>
          );
      },
    },
    {
      title: '门店分组',
      width: 200,
      dataIndex: 'groupName',
    }
  
    ];

    this.show = this.show.bind(this);
  }

  componentDidMount() {
    this.requestPageList();
  }

  reload() {
    const { checkedList, selectedList } = this.state;
    if (that.props.checkedshopList && that.props.checkedshopList.length > 0 && !selectedList.length) {
      this.setState({
        selectedList: JSON.parse(JSON.stringify(this.props.checkedshopList))
      })
    }

    if (that.props.checkedList != undefined && that.props.checkedList.length > 0 && !checkedList.length) {
      this.setState({
        checkedList: JSON.parse(JSON.stringify(this.props.checkedList))
      })
    }
  }


  // // 为了防止父组件修改editData但是子组件不修改
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { checkedList, checkedshopList } = nextProps;
  //   const obj = undefined
  //   debugger
  //   if (checkedList && JSON.stringify(checkedList) !== JSON.stringify(prevState.checkedList)) {
  //     if (!checkedList) return null;
  //     obj.checkedList = checkedList
  //   }
  //   if (checkedList && JSON.stringify(checkedshopList) !== JSON.stringify(prevState.selectedList)) {
  //     if (!checkedList) return null;
  //     obj.selectedList = checkedshopList
  //   }
  //   if (obj) return {
  //     ...prevState,
  //     ...obj
  //   }
  //   return null;
  // }

  // 查询门店
  requestPageList(currentPage = 1, pageSize = 10, params) {
    const that = this;
    this.setState({ loading: true });
    const queryParams = {
      currentPage: currentPage,
      pageSize: pageSize,
      shopState: 0,
      shopGroupId:params?params.shopGroupId:null,
      shopName:params?params.shopName:null
    };
    // if(this.state.currentGroup){
    //   queryParams.shopGroupId = this.state.currentGroup
    // }else {
    // if (this.state.currentGroup) {
    //   queryParams.shopGroupId = this.state.currentGroup
    // }
    // }

    // 空数据查询时 左边菜单显示全部门店
    if (params !== undefined && params.shopGroupId === undefined && (params.shopName === undefined || params.shopName === "")) {
      this.setState({
        currentGroup: null ,  // 全部门店高亮
        shopName: null
      })
    }

    if (params !== undefined && params.shopGroupId !== undefined) {
      queryParams.shopGroupId = params.shopGroupId;
      this.setState({
        currentGroup: params.shopGroupId
      })
    }else{
      this.setState({
        currentGroup: null
      })
    }

    if (params && params.shopName) {
      queryParams.shopName = params.shopName;
      this.setState({
        shopName: params.shopName
      })
    }else{
      this.setState({
        shopName: null
      })
    }
    this.setState({ loading: true });
    // 直接调用request
    request('g2/wx.authority.shop.list', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // console.log(filterListModel(response))
        // data根据自己api的规则处理
        // if (response.list.filter(item => item.shopGroupId === that.state.currentGroup).length > 0){ // 说明查询的跟当前的一致

        // }else{
        //   that.setState({ data: response, loading: false})
        // }
        that.setState({ data: filterListModel(response), loading: false });

      })
      .catch(() => {
        that.setState({ loading: false });
      });


  }


  show = (stores,completestores) => {
    //父页面传入勾选门店Id(store),id对应的门店名称(completestore)
    this.isLoadA = true
    this.isLoadB = true
    let store =[];
    let completestore =[]
    if(stores&&stores.length>0){
    let   storeA =stores.split(',');
    storeA.forEach(e => {
      store.push(Number(e));
      completestore.push(Number(e));
    });
    }
    this.setState({
      checkedList:store,
      selectedList:completestore
    })
    //记录上一次保存的勾选防止勾选后取消无法还原勾选
    this.setState({
      reloadTTTT: true,
      checkedListold:JSON.stringify(store),
      selectedListold:JSON.stringify(completestore),
    })
    this.requestPageList();
    this.storeModal.show();
  };

  clickItem = (item) => {
    console.log(item)
    const obj = {};
    if (item) {
      this.setState({
        currentGroup: item.id
      })
      obj.shopGroupId = item.id
    } else {
      obj.shopGroupId = null
    }

    this.requestPageList(1, 10, obj)
  }

  handleCrowdClose = (item) => {
    console.log("item", item)
    const { checkedList, selectedList } = this.state;
    const index = checkedList.findIndex(v => v == item.submeterNum);
    const index2 = selectedList.findIndex(v => v.shopName == item.shopName);
    checkedList.splice(index, 1);
    selectedList.splice(index2, 1);
    this.setState({
      checkedList,
      selectedList
    });
  }
  getallstore() {
    let queryParams = {
      shopState: 0,
      shopGroupId:this.state.currentGroup,
      shopName:this.state.shopName
    };
    request('g2/wx.authority.shop.list', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (response) {
          let selectedRowKeysA = [];
          let selectedCodeA = [];
          for (var i = 0; i < response.list.length; i++) {
            selectedRowKeysA.push(response.list[i].submeterNum);
            selectedCodeA.push(response.list[i])
          }
          this.setState({
            checkedList: selectedRowKeysA,
            selectedList:selectedCodeA
          })

        }

      })
  }

  render() {
    const that = this;
    const { width, handleOk,handleCancel, type,storelist } = this.props;
    const { selected, data: { pagination, list }, loading, currentGroup,shopName } = this.state;
    let { checkedList, selectedList,checkedListold, selectedListold } = this.state;

    const paginationProps = {
      showQuickJumper: true,
      size: 'small',
      ...pagination,
    };
    let rowSelection = {};
    const nowSelected = [];


    // if (that.props.checkedshopList && that.props.checkedshopList.length > 0 && !selectedList.length && this.isLoadA) {
    //   selectedList = JSON.parse(JSON.stringify(this.props.checkedshopList));
    //   this.isLoadA = false
    // }

    // if (that.props.checkedList != undefined && that.props.checkedList.length > 0 && !checkedList.length && this.isLoadB) {
    //   checkedList = JSON.parse(JSON.stringify(this.props.checkedList));
    //   this.isLoadB = false
    // }
  
   
    if (type === 'default') {
      rowSelection = {
        type: 'radio',
        columnTitle: ' ',
        selectedRowKeys: checkedList,
        onSelect: selectedRowKeys => {
          that.setState({ selected: selectedRowKeys });
        },
        getCheckboxProps: record => ({
          disabled: record.surplusQuantitiy == 0, // Column configuration not to be checked
        }),
      };
    } else {
      // let { checkedList } = this.props;
      // console.log(selected)
      // if (selected.length) {
      //   checkedList = selected.map(v => v.id);
      // }
      // if (checkedList.length && list != undefined) {
      //   checkedList.forEach(v => {
      //     const index = list.findIndex(i => i.id === v);
      //     if (index !== -1) {
      //       nowSelected.push(list[index]);
      //     }
      //   });
      // }
      rowSelection = {
        selectedRowKeys: checkedList,
        onChange: (selectedRowKeys, selectedRows) => {

          if (checkedList.length) {
            list.forEach(item => {
              const index = checkedList.findIndex(i => i === item.submeterNum);
              if (index !== -1) {
                checkedList.splice(index, 1);
                selectedList.splice(index, 1);
              }
            });
            selectedRows.forEach(v => {
              const index = checkedList.findIndex(i => i === v.submeterNum);
              if (index === -1) {
                checkedList.push(v.submeterNum);
                selectedList.push(v);
              }
            });
          } else {
            checkedList = selectedRowKeys;
            selectedList = selectedRows;
          }
         
          this.setState({ checkedList: checkedList, selectedList: selectedList });

        },
      };
    }

    return (
      <DMOverLay
        title="选择门店"
        width={width}
        ref={ref => {
          this.storeModal = ref;
        }}
        confirmLoading={loading}
        handleOk={() => {
          Modal.confirm({
            title: '分配门店',
            content: '商品分配门店会造成门店商品信息变动,请确认？',
            confirmLoading: true,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
          // if (checkedList.length == undefined) {
          //   message.error("请选择门店");
          //   return;
          // }
          if(checkedList!=""){

          if (handleOk) {
           
            handleOk(checkedList, selectedList);
         
          }

          this.isLoadA = false
          this.isLoadB = false
          that.setState({
            checkedList: [],
            loading: false,
            selectedList: [],
          })
          this.storeModal.hide();
         
        }else{
          message.error("请选择门店");
        }
        }
        })
        }}
        handleCancel={() => {
          this.isLoadA = false
          this.isLoadB = false
          if(handleCancel){
            handleCancel(JSON.parse(checkedListold), JSON.parse(selectedListold));
          }
          that.setState({
            checkedList: JSON.parse(checkedListold),
            loading: false,
            selectedList: JSON.parse(selectedListold),
          })
        }}
      >
        <StoreForm
          // wrappedComponentRef={(ref => this.selectFrom = ref)}
          requestList={(currentPage, pageSize, params) =>
            that.requestPageList(currentPage, pageSize, params)
          }
        // clickItem2={(item) =>
        //   this.clickItem(item)
        // }
        />
        <div className={styles.groupName}>
           <Table
            style={{ flex: 1 }}
            width={width}
            columns={this.columns}
            dataSource={list}
            rowKey={record => record.submeterNum}
            pagination={paginationProps}
            rowSelection={rowSelection}
            scroll={{ y: 400 }}
            onChange={paginations => this.requestPageList(paginations.current, paginations.pageSize, { shopGroupId: currentGroup,shopName:shopName })}
          />
        </div>
        <div className={styles.selectList}>
         {/* 已选择门店：
          <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
            {
              selectedList.map(item => {
                return (
                  <ATag closable className={styles.itemSelect} onClose={(e) => { e.preventDefault(); this.handleCrowdClose(item) }}>
                    {item.shopName}
                  </ATag>
                )
              })
            }
          </div> */}
              <table className={styles.UnderLine}>
            <tbody>
              <tr>
                <td style={{width:'60%'}}><span style={{ paddingLeft: 27 }}>已选择门店：<a >{this.state.selectedList.length}个</a></span></td>
                <td style={{width:'40%', float:'right'}} ><Button   onClick={() => this.getallstore()}>一键分配所有门店</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </DMOverLay>
    );
  }
}

export default DMSelectStore;
