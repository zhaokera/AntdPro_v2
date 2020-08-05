import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Select, Button, Input, Table } from 'antd';
import styles from './index.less';
// import { DMOverLay } from '@/components/DMComponents';
/**
 * 选择优惠券Select参数(params)
 * 样式:style
 * 标题:title
 * title, //弹框标题
  *    width, //宽度
  *   handleOk,//确认按钮  handleOk(this.state.selectedRowKeys, this.state.selectedRows)
  *  handleCancel,//取消按钮
  *maskClosable, //点击蒙层是否允许关闭

  实例
  一 引用组件
      import { DMSelectPerson } from '@/components/DMComponents';
二 复制下面代码
    <DMSelectPerson  //选择人群
          ref={ref => {
            this.editLevel = ref;
          }}
          title="选择人群"
          width={1000}
          handleOk={this.handleok}
          selectedRowKeys={["1158391115104260096"]}
        />

  <button onClick={() => { //按钮触发
   this.setState(
    {},
      () => {
      this.editLevel.getWrappedInstance().show();
     }
     );
    }}>选择人群</button>
 * 
 * 
 * 
 * 
 */


const { Option } = Select;

const data = [];
// for (let i = 0; i < 4; i++) {
//   data.push({
//     key: i,
//     name: `全部会员${i}`,
//     type: "系统预置",
//     dingyi: `全部的会员人群`,
//     count: `${i}`,
//     time: `2019.08.01~2019.09.10`,
//   });
// }


@connect(
  ({ loading }) => {
    return {
      loading: loading.models.DMCrowdInfo,
    };
  },
  null,
  null,
  { withRef: true }
)
class DMSelectcoupon extends Component {
  static defaultProps = {
    dataList: [],
    disable: false,
    confirmLoading: true,

  };




  componentDidMount() {
    this.init(1, this.state.PageSize,"createtime",0);
    this.props.dispatch({
      type: 'DMCrowdInfo/GetCrowdClass',
      payload: {
      },
      callback: response => {
        // console.log(response)
        this.setState({ selectitem: response })
      }
    })
  }

  init = (CurrentPage, PageSize,OrderName,OrderType) => {
    const queryData = {
      CurrentPage,
      PageSize,
      ClassId: this.state.ClassId,
      CrowdName: this.state.CrowdName,
      OrderName,
      OrderType
    }
    this.props.dispatch({
      type: 'DMCrowdInfo/GetPageCrowdList',
      payload: {
        ...queryData
      },
      callback: response => {
        // console.log(response)
        this.setState({ data: response.data, totalCount: response.totalCount, PageSize: PageSize, CurrentPage: CurrentPage })
      }
    })
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      CurrentPage: 1,
      PageSize: 10,
      ClassId: "", // 人群分类ID
      CrowdName: "",// 人群名称
    };

    this.columns = [
      {
        dataIndex: 'crowdName',
        title: '人群名称',
      }, {
        dataIndex: 'className',
        title: '所属分类',
      }, {
        dataIndex: 'crowdDefinition',
        title: '人群定义',
      }, {
        dataIndex: 'createTime',
        title: '创建时间',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.time - b.time,
      }, {
        dataIndex: 'customerCount',
        title: '总人数',
      }
    ]

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show = () => {
    this.setState({
      visible: true,
    });
  };

  hide = () => {
    this.setState({
      // confirmLoading: false,
      visible: false,
    });
  };
  monchange = (pagination, filters, sorter) => {
    const me = this;
    //console.log(pagination, filters, sorter);
    let ck =null;
    let order =null;
    if(sorter){
      ck =sorter.columnKey;
      order =sorter.order==="ascend"?1:0;
    }
    this.init(pagination.current, pagination.pageSize,ck, order)

  }
  //单选选择
  onSelectChange = (selectedRowKeys, selectedRows) => {

    this.setState({ selectedRowKeys, selectedRows }); //给选中行赋值
  };

  render() {
    const rowRadioSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      type: 'radio',
      onChange: this.onSelectChange,
    }
    const {
      title,
      width,
      handleOk,
      handleCancel,
      // children,
      maskClosable,
      // confirmLoading,
    } = this.props;
    const { visible, PageSize, CurrentPage } = this.state;


    return (
      <Modal
        title={title}
        width={width}
        visible={visible}
        maskClosable={maskClosable}
        // confirmLoading={confirmLoading}
        okButtonProps={{
          htmlType: 'submit',
          style: {
            borderRadius: 2,
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: 2,
          },
        }}
        onOk={e => {
          if (handleOk){handleOk(this.state.selectedRowKeys, this.state.selectedRows);} 
          this.hide();

        }}
        onCancel={e => {
          this.hide();
          if (handleCancel){ handleCancel(e);}
        }}
        okText="确认"
        cancelText="取消"
      >
        <div className={styles.headInfo}>
          <div className={styles.search}>
            <SelectName
              selectitem={this.state.selectitem}
              value={this.state.ClassId}
              onChange={(e) => { this.setState({ ClassId: e }); }}
            ></SelectName>

            <Input placeholder="请输入人群名称" style={{ width: 150 }} value={this.state.CrowdName} onChange={(v) => { this.setState({ CrowdName: v.target.value }); }} />
            <Button type="primary" onClick={() => { this.init(1, PageSize) }}>查询</Button>
            <Button onClick={() => {
              this.setState({ CrowdName: "", ClassId: "" });

            }} >重置</Button>
          </div>
        </div>
        <Table
          loading={this.props.loading}
          rowKey={record => record.crowdId}
          rowSelection={rowRadioSelection}
          columns={this.columns}
          dataSource={this.state.data}
          style={{ marginTop: "8px" }}
          onChange={this.monchange.bind(this)}
          pagination={{
            size: 'small',
            total: this.state.totalCount,
            pageSize: this.state.PageSize,
            current: this.state.CurrentPage,
            defaultCurrent: 1,
            showQuickJumper: true,
            showSizeChanger: true,
            // hideOnSinglePage:true,
            showTotal: total => `共 ${this.state.totalCount}条记录`
            , pageSizeOptions: ['10', '20', '50', '100'],


          }}

        />

      </Modal>)
  }
}

export default DMSelectcoupon;


class SelectName extends Component {

  render() {
    const selectitem = this.props.selectitem;
    let option = null;
    if (selectitem) {
      option = selectitem.map((e) => {
        return <Option key={e.id} value={e.id}>{e.className}</Option>
      })
    }

    return (
      <Select onChange={this.props.onChange} value={this.props.value} placeholder="请选择" style={{ width: 120 }}>
        <Option key="" value="">请选择</Option>
        {option}
      </Select>
    )
  }

}