import React, { Component, Fragment } from 'react';
import { Form, Input, Row, Col, Table, Tag, List, Select, Button, message } from 'antd';
import { DMOverLay } from '@/components/DMComponents';
import Ellipsis from '@/components/Ellipsis';
import { connect } from 'dva';
import styles from './index.less'


/*
引用 zhushi
 <DMSelectCrowd 
 iscanvas={true} 
 nodeContent={nodeContent} 
 marketingNodeUpdate={me.handleMarketingNodeUpdate}
  ref={(ref) => this.crowdOverlay = ref} />


 nodeContent格式
 nodeContent={
   NodeName:"画布节点名称，非画布的不传",
   SelectId:["1111","22222"],
 }


*/




const FormItem = Form.Item;

@connect(({ loading, DMCrowdInfo }) => {
  return {
    loading: loading.models.DMCrowdInfo,
    DMCrowdInfo,
  };
})
@Form.create()
class SelectCrowd extends Component {
  state = {
    classList: [],
    classId: '',
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    crowdList: [],
    customerCount: 0,
    inputValue: this.props.nodeContent.NodeName ? this.props.nodeContent.NodeName : '',
    selectedRowKeys: (this.props.nodeContent && this.props.nodeContent.SelectId) ? this.props.nodeContent.SelectId : [],
    selectedCrowdList: [],
  }

  columns = [
    {
      dataIndex: 'crowdName',
      title: '人群名称',
      render: (text) => {
        return (<Ellipsis length={12} tooltip>{text}</Ellipsis>)
      }
    },
    { dataIndex: 'className', title: '所属分类', width: '21%'},
    { dataIndex: 'crowdDefinition', title: '人群定义', width: '21%',
      render:(text)=>{
        return <div style={{wordBreak:'break-all'}}>{text}</div>
      }
    },
    { dataIndex: 'customerCount', title: '总人数', width: '21%' },
  ]


  componentDidMount() {
    this.GetCrowdClass();
    this.GetPageCrowdList(1, this.state.pageSize);
    this.GetCrowdListById();
  }

  // 获取分类信息
  GetCrowdClass = () => {
    const me = this;
    const { dispatch } = this.props;
    const queryData = {
      classType: 0,
    };
    dispatch({
      type: 'DMCrowdInfo/GetCrowdClass',
      payload: { ...queryData },
      callback: (response) => {
        response.splice(0, 0, { id: "", className: "所有" });
        me.setState({
          classList: response
        });
        console.log(response);
      }
    });
  }

  // 获取人群列表
  GetPageCrowdList = (CurrentPage, PageSize) => {
    const me = this;
    const { dispatch } = this.props;
    const queryData = {
      crowdName: me.props.form.getFieldValue("crowdName"),
      classId: me.state.classId,
      CurrentPage: CurrentPage,
      PageSize: PageSize,
      OrderName: 'createtime'

    };
    dispatch({
      type: 'DMCrowdInfo/GetPageCrowdList',
      payload: { ...queryData },
      callback: response => {
        if (response) {
          me.setState({
            currentPage: response.currentPage,
            pageSize: response.pageSize,
            totalCount: response.totalCount,
            crowdList: response.data,
          });
          console.log(response);
        }
      },
    });
  }


  // 获取已选择的人群列表
  GetCrowdListById = () => {
    const me = this;
    const { dispatch } = this.props;
    if (me.state.selectedRowKeys.length == 0) {
      me.setState({
        selectedCrowdList: [],
        customerCount: 0
      });
      return;
    }

    const queryData = {
      CrowdIds: me.state.selectedRowKeys.join(),
      crowdName: '',
      classId: '',
      CurrentPage: 1,
      PageSize: 100
    };
    dispatch({
      type: 'DMCrowdInfo/GetPageCrowdList',
      payload: { ...queryData },
      callback: response => {
        if (response && response.data) {
          // 选中的人群的会员数量
          let num = 0;
          response.data.forEach(tempCrowd => {
            if (tempCrowd) {
              num += Number(tempCrowd.customerCount);
            }

          });

          me.setState({
            selectedCrowdList: response.data,
            customerCount: num
          });
          console.log(response);
        }
      },
    });
  }





  // 输入框数字计数
  changeVals = e => {
    this.setState({
      inputValue: e.target.value,
    });
    this.props.form.setFieldsValue({ name: this.state.inputValue })
  };

  // 点击分类
  onChooseClass = (id) => {
    const me = this;

    this.setState({
      classId: id
    }, () => me.GetPageCrowdList(1, me.state.pageSize))
  }

  // 删除人群
  handleCrowdClose = (crowdId) => {
    const { selectedRowKeys } = this.state;
    const index = selectedRowKeys.findIndex(v => v == crowdId);
    selectedRowKeys.splice(index, 1);
    this.onSelectChange(selectedRowKeys);
  }

  onSelectChange = selectedRowKeys => {
    const me = this;
    me.props.form.setFieldsValue({ 'selectedRowKeys': selectedRowKeys });
    this.setState({
      selectedRowKeys,
    }, () => me.GetCrowdListById());
  };

  render() {
    const me = this;
    const { form: { getFieldDecorator } } = this.props;
    const formItemlayout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 22
      },
      colon: false
    }

    const rowSelection = {
      columnWidth: '40px',
      selectedRowKeys: me.state.selectedRowKeys,
      onChange: me.onSelectChange
    }


    return (
      <div className={styles.CrowdView}>
        <Form {...formItemlayout}>
          {me.props.iscanvas &&
            <FormItem label='节点名称'>
              <Row>
                <Col span={10}>
                  {
                    getFieldDecorator('name', {
                      initialValue: me.props.nodeContent ? me.props.nodeContent.NodeName : '',
                      rules: [{ required: true, message: '请输入节点名称!', whitespace: true, }]
                    })(
                      <Input
                        allowClear
                        placeholder="请输入节点名称"
                        maxLength={20}
                        onChange={this.changeVals}
                        addonAfter={<span> {this.state.inputValue.length}/20 </span>}
                      />
                    )
                  }
                </Col>
              </Row>
            </FormItem>
          }
          {/* <Row type='flex'> */}
          {/* <Col span={8}>
              <Form.Item label='所属分类' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {
                  getFieldDecorator('classId')(
                    <Select>
                      {me.state.classList.map(v=>{
                        return <Select.Option value={v.id}>{v.className}</Select.Option>
                      })}
                    </Select>
                  )
                }
              </Form.Item>
            </Col> */}
          {/*   <Col span={8}>
              <Form.Item label='人群名称' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {
                  getFieldDecorator('crowdName')(
                    <Input allowClear />
                  )
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label=' ' style={{ marginTop: '-1px' }}>
                <Row type='flex' gutter={16}>
                  <Col><Button onClick={() => me.GetPageCrowdList(1, me.state.pageSize)} type='primary'>查询</Button></Col>
                  <Col><Button onClick={() => { me.props.form.resetFields(); me.GetPageCrowdList(1, me.state.pageSize) }}>重置</Button></Col>
                </Row>
              </Form.Item>
            </Col>
          </Row> */}
          <Row type='flex' className={styles.borderwrappr}>
            <Col span={5} className={styles.borderight}>
              <List
                size="small"
                bordered
                dataSource={me.state.classList}
                // loading={loading}
                renderItem={
                  (item, index) => (
                    <List.Item onClick={() => this.onChooseClass(item.id)} className={me.state.classId == item.id ? styles.active : ''}>
                      <Ellipsis length={5} tooltip>{item.className}</Ellipsis>
                    </List.Item>
                  )}
              />
            </Col>
            <Col span={19} className={styles.rightBox}>
              {/* <p>温馨提示：多个人群分组选择时，实际人群会进行合并处理，排除重复的人群</p> */}
              <Row type='flex' justify='end'>
                <Col span={12}>
                  <Form.Item label='人群名称' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    {
                      getFieldDecorator('crowdName')(
                        <Input.Search allowClear onSearch={() => me.GetPageCrowdList(1, me.state.pageSize)} />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Table
                rowKey={record => record.crowdId}
                columns={this.columns}
                dataSource={this.state.crowdList}
                rowSelection={rowSelection}
                scroll={{ y: 300 }}
                pagination={{
                  size: 'small',
                  current: me.state.currentPage,
                  pageSize: me.state.pageSize,
                  total: me.state.totalCount,
                  showTotal: total => `共 ${me.state.totalCount} 条记录`,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: me.GetPageCrowdList,
                  onShowSizeChange: me.GetPageCrowdList
                }}
              />
            </Col>
          </Row>
          {getFieldDecorator('selectedRowKeys', {
            initialValue: me.state.selectedRowKeys,
          })}
          <Row className='Mt-basewidth' type='flex' gutter={8}>
            {
              me.state.selectedRowKeys.map((item, index) => {
                const crowd = me.state.selectedCrowdList.find(v => v.crowdId == item);
                if (crowd) {
                  return (
                    <Col key={item}>
                      <Tag closable onClose={() => me.handleCrowdClose(item)}>
                        <Ellipsis length={5} tooltip>{crowd.crowdName}</Ellipsis>
                      </Tag>
                    </Col>
                  )
                }

              })
            }
          </Row>
          {
            !me.props.iscanvas && <Row className='Mt-basewidth Pl-basewidth' type='flex' gutter={16}>
              筛选统计：共筛选出<span className={styles.colortxt}>{me.state.customerCount}</span>位会员
          </Row>
          }
        </Form>
      </div>
    )
  }
}

class DMSelectCrowd extends Component {
  static defaultProps = {
    loading: false
  }

  constructor(props) {
    super(props);
    this.state = {
    }
    this.show = this.show.bind(this);
  }

  show = () => {
    this.crowdModal.show();
  };

  hide = () => {
    this.crowdModal.hide();
  };


  // 确定
  handleOnOk = e => {
    const me = this;
    const nodeContent = {
      NodeName: "",
      SelectId: [],
    };
    e.preventDefault();
    me.crowdForm.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      nodeContent.NodeName = values.name;
      nodeContent.SelectId = values.selectedRowKeys;
      console.log(values);
      if (!nodeContent.SelectId || nodeContent.SelectId.length <= 0) {
        message.error("请选择人群");
        return;
      }

      if (me.props.marketingNodeUpdate) {
        me.props.marketingNodeUpdate(nodeContent);
      }
      this.hide();
    })


  }

  render() {
    const me = this;
    const { loading } = this.props
    console.log("1", me.props);
    return (
      <Fragment>
        <DMOverLay
          ref={ref => {
            this.crowdModal = ref;
          }}
          confirmLoading={loading}
          footer={this.props.activityState ? (this.props.activityState!=0) ? null : undefined : undefined}
          title="选择人群"
          width={1100}
          handleOk={me.handleOnOk}
        >
          <SelectCrowd
            nodeContent={me.props.nodeContent}
            iscanvas={me.props.iscanvas}
            wrappedComponentRef={ref => (me.crowdForm = ref)}
          />
        </DMOverLay>
      </Fragment>
    )
  }
}
export default DMSelectCrowd;

