import React, { Component } from 'react';
import { Select, Button, Input, Table } from 'antd';
import DMOverLay from '../DMOverLay';
import { filterListModel, getUrlByCode } from '@/utils/utils';
import request from '@/utils/request';
import styles from './index.less';
import { connect } from 'dva';

/**
 * 优惠券公共弹窗
 */

const { Option } = Select;
class DMSelectCoupon extends Component {
  static defaultProps = {
    type: 'default', // multi:多选 default:默认
  };

  constructor(props) {
    super(props);
    this.state = {
      data: {
        list: [],
      },
      selected: this.props.checked === undefined ? {} : this.props.checked,
      checkedList: this.props.checkedList === undefined ? [] : this.props.checkedList,
      queryParams: {},
      loading: false,
      typeSelected: '-1',
      couponName: '',
      masterCode:'100005',
      channelType:this.props.channelType === undefined ? '':this.props.channelType,
      porpMasterCode: this.props.masterCode === undefined ? '' : this.props.masterCode
    };

    this.show = this.show.bind(this);
    console.log(this.state.porpMasterCode);
    console.log(this.state.masterCode);

     this.columns = [
      {
        dataIndex: 'couponName',
        title: '优惠券名称',
        width:'12%'
      },
      {
        dataIndex: 'couponTypeName',
        title: '优惠券类型',
        width:'12%'
      },
      {
        dataIndex: 'couponMoney',
        title: '优惠券面额',
        width:'12%'
      },
      {
        dataIndex: 'couponLevel',
        width:'14%',
        title: this.state.porpMasterCode===this.state.masterCode?'适用业态':'适用范围',
        render: (text, record, index) => {
          let str = '';
          // 嘉辉
          if(this.state.porpMasterCode ===  this.state.masterCode){
            str = this.getFormat(record.applicableFormat);
          }
          // 全渠道
          else if(record.storeType === 0){
            str += '全部门店，';
          }
          else{
            str += '部分门店，';
          }

          // 嘉辉
          if(this.state.porpMasterCode ===  this.state.masterCode){
            str += '';
          }
          // 全渠道
          else if (record.productType === 0 ) {
            str += '全部商品';
          }
          else {
            str += '部分商品';
          }
          return str;
        },
      },
      {
        dataIndex: 'couponRange',
        title: '使用门槛',
        width: '12%',
      },
      {
        dataIndex: 'surplusQuantitiy',
        title: '可用库存',
        width:'10%',
      },
      {
        dataIndex: 'couponUseTime',
        title: '有效期',
      },
    ];
  }

  getFormat = (str) =>{
    let formatObj = {
      "all":"全部",
      "city":"酒店",
      "club":"会所",
      "spot":"景区",
      "play":"游乐场"
    };
    let format = '';
    if(str){
      let arr = str.split(",");
      arr.forEach((item)=>{
        format+=formatObj[item];
      })
    }
    return format;
  }

  componentDidMount() {
    this.requestPageList();
  }

  requestPageList(currentPage = 1, pageSize = 10) {
    const { queryParams, typeSelected, couponName,porpMasterCode ,masterCode,channelType} = this.state;
    // 分页的参数
    queryParams.currentPage = currentPage;
    queryParams.pageSize = pageSize;
    queryParams.platform = 'store';
    queryParams.listQueryStatus = 0;
   queryParams.couponStatus = 0;
     queryParams.quantityStatus = 0;
     var str='g2/wx.rights.couponList.get';
    if (
      this.props.channelType &&
      ['a', 'b', 'c', 'd', 'e', 'f', 'g','h','i','j','k','l','m','n'].indexOf(this.props.channelType) !== -1
    ) {
      queryParams.channelType = this.props.channelType;
    }
    if (this.props.IsVali && this.props.IsVali === true) {
      queryParams.listQueryStatus = 0;
      // queryParams.couponStatus = 1;
      queryParams.surplusQuantitiy = 0;
    }
    // if (this.props.Sign && this.props.Sign === true&&masterCode !=='10005') {
    //   queryParams.channelType = 'f';
    // }
    // 嘉辉
    if(porpMasterCode === masterCode){
      str='g2/wx.rights.couponList.jh.get';
      // queryParams.channelType = 'n';
    }

    // //场景营销
    // if (this.props.jhSign === false) {
    //   str='g2/wx.rights.couponList.jh.get';
    //   queryParams.channelType = 'k';
    // }
    // //高级营销
    // if (this.props.jhSign === false && this.props.jhGj === true) {
    //   str='g2/wx.rights.couponList.jh.get';
    //   queryParams.channelType = 'l';
    // }

    if (typeSelected !== '-1') {
      queryParams.couponType = typeSelected;
    } else {
      delete queryParams.couponType;
    }
    if (couponName && couponName !== '') {
      queryParams.couponName = couponName;
    } else {
      delete queryParams.couponName;
    }
    const that = this;
    // table loading
    this.setState({ loading: true });
    // 直接调用request
    request(str, {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // if (this.props.jhSign === false)
        // {
        //    var mayArray=[];
        //    if(response.list.length>0)
        //    {
        //     response.list.map(e=>{
        //       if(e.channelType.indexOf("k")>-1)
        //       {
        //          mayArray.push(e);
        //       }
        //     })
        //    }
        //    response.list=mayArray;
        //    response.total=mayArray.length;
        // }

        that.setState({ data: filterListModel(response, 10), loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  // 重置
  restFormVals(refresh) {
    this.setState(
      {
        selected: {},
        typeSelected: '-1',
        couponName: '',
      },
      () => {
        if (refresh) {
          this.requestPageList();
        }
      }
    );
  }

  show = () => {
    this.couponModal.show();
  };

  render() {
    const { width, handleOk, type } = this.props;
    const { data, typeSelected, couponName, loading } = this.state;
    const { selected } = this.state;
    let { checkedList } = this.state;
    const { list, pagination } = data;
    const paginationProps = {
      showQuickJumper: true,
      size: 'small',
      ...pagination,
    };
    const that = this;
    let rowSelection = {};
    const nowSelected = [];
    if (type === 'default') {
      rowSelection = {
        type: 'radio',
        columnTitle: ' ',
        selectedRowKeys: typeof selected === 'string' ? selected : [selected.id],
        onSelect: selectedRowKeys => {
          that.setState({ selected: selectedRowKeys });
        },
        getCheckboxProps: record => ({
          disabled: record.surplusQuantitiy == 0, // Column configuration not to be checked
        }),
      };
    } else {
      if (selected.length) {
        checkedList = selected.map(v => v.id);
      }
      if (checkedList.length) {
        checkedList.forEach(v => {
          const index = list.findIndex(i => i.id === v.id);
          if (index !== -1) {
            nowSelected.push(list[index]);
          }
        });
      }
      rowSelection = {
        selectedRowKeys: nowSelected.length ? nowSelected.map(v => v.id) : [],
        onChange: (selectedRowKeys, selectedRows) => {
          if (checkedList.length) {
            list.forEach(item => {
              const index = checkedList.findIndex(i => i.id === item.id);
              if (index !== -1) {
                checkedList.splice(index, 1);
              }
            });
            selectedRows.forEach(v => {
              const index = checkedList.findIndex(i => i.id === v.id);
              if (index === -1) {
                checkedList.push(v);
              }
            });
          } else {
            checkedList = selectedRows;
          }
          that.setState({ checkedList: checkedList },()=>{console.log('xuanz:',this.state.checkedList)});
        },
        getCheckboxProps: record => ({
          disabled: record.surplusQuantitiy == 0, // Column configuration not to be checked
        }),
      };
    }

    return (
      <DMOverLay
        title="选择优惠券"
        width={width}
        ref={ref => {
          this.couponModal = ref;
        }}
        confirmLoading={loading}
        handleOk={() => {
          // type: 'default', // multi:多选 default:默认
          if (handleOk) handleOk(type === 'default' ? selected : checkedList);
          this.couponModal.hide();
        }}
      >
        <div className={styles.headInfo}>
          <div>
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                window.open(`${getUrlByCode('10000101')}/marketing/coupon/digitcoupon`, '_blank');
              }}
            >
              创建优惠券
            </Button>{' '}
            <a className="Ml-basewidth2" onClick={() => this.restFormVals(true)}>
              刷新
            </a>
          </div>
          <div className={styles.search}>
            <Select
              defaultValue={typeSelected}
              value={typeSelected}
              style={{ width: 120 }}
              onChange={value => {
                that.setState({ typeSelected: value });
              }}
            >
              <Option value="-1">全部类型</Option>
              <Option value="0">代金券</Option>
              <Option value="1">折扣券</Option>
              <Option value="2">兑换券</Option>
            </Select>
            <Input
              placeholder="请输入优惠券名称"
              style={{ width: 150 }}
              value={couponName}
              onChange={e => {
                that.setState({ couponName: e.target.value });
              }}
            />
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                that.requestPageList();
              }}
            >
              查询
            </Button>
            <Button onClick={() => this.restFormVals()}>重置</Button>
          </div>
        </div>
        <Table
          className="Mt-basewidth2"
          scroll={{ y: 400 }}
          rowSelection={rowSelection}
          columns={this.columns}
          dataSource={list}
          loading={loading}
          pagination={paginationProps}
          rowKey={record => record.id}
          onChange={paginations => this.requestPageList(paginations.current, paginations.pageSize)}
        />
      </DMOverLay>
    );
  }
}

export default DMSelectCoupon;
