import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Row, Col, Form, Input, Select, Button, Badge, Table, Card, Tooltip, message } from 'antd';
import moment from 'moment';
import CouponOverlay from './views/CouponOverlay';
import request from '@/utils/request';
import { filterListModel } from '@/utils/utils';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['success', 'default'];
const status = ['发放中', '已结束'];

@Form.create()
class CouponList extends PureComponent {
  state = {
    data: {
      list: [],
    },
    queryParams: {},
    loading: false,
    editData: {},
  };

  columns = [
    {
      title: '活动名称',
      dataIndex: 'awardName',
      width: 150,
      render: awardName => {
        if (awardName && awardName.length > 15) {
          return (
            <Tooltip title={awardName}>
              <span>{awardName}</span>
            </Tooltip>
          );
        }
        return <span>{awardName}</span>;
      },
      textWrap: 'ellipsis',
    },
    {
      title: '面额（元）',
      width: 120,
      align: 'center',
      dataIndex: 'awardDenomination',
      render: awardDenomination => {
        return (
          <div style={{ width: 65 }}>
            <span style={{ float: 'right' }}>{awardDenomination.toFixed(2)}</span>
          </div>
        );
      },
    },
    {
      title: '使用门槛',
      dataIndex: 'awardConditions',
    },
    {
      title: '有效期',
      key: 'effectTime',
      width: 160,
      render: item => {
        return (
          <div className={styles.timeDiv}>
            <span>{`起：${moment(item.awardUsingStartTime).format('YYYY-MM-DD')}`}</span>
            <span>{`止：${moment(item.awardUsingEndTime).format('YYYY-MM-DD')}`}</span>
          </div>
        );
      },
    },
    {
      title: '发行量（份）',
      align: 'center',
      dataIndex: 'awardTotalNum',
    },
    {
      title: '已发放（份）',
      align: 'center',
      key: 'awardSendNum',
      render: item => {
        // 已发放 awardSendNum
        // 发放失败 awardTotalNum-awardSendNum-awardSurplusNum
        const sendFail = item.awardTotalNum - item.awardSendNum - item.awardSurplusNum;
        return (
          <div className={styles.timeDiv}>
            <span>{`成功：${item.awardSendNum}`}</span>
            <span>{`失败：${sendFail}`}</span>
          </div>
        );
      },
    },
    {
      title: '奖品状态',
      dataIndex: 'awardStatus',
      width: 100,
      render: awardStatus => {
        const index = awardStatus === 'using' ? 0 : 1;
        return <Badge status={statusMap[index]} text={status[index]} />;
      },
    },
    {
      title: '关联活动数',
      dataIndex: 'relationActNum',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'awardCreated',
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: item => {
        const that = this;
        return (
          <span>
            <a
              onClick={() => {
                that.setState(
                  {
                    editData: item,
                  },
                  () => {
                    that.couponOverLay.show();
                  }
                );
              }}
            >
              修改
            </a>
          </span>
        );
      },
    },
  ];

  componentDidMount() {
    this.requestPageList();
  }

  // 奖品列表list
  requestPageList(currentPage = 1, pageSize = 20) {
    const { queryParams } = this.state;
    // 分页的参数
    queryParams.currentPage = currentPage;
    queryParams.pageSize = pageSize;
    // 加上些Api默认的参数
    queryParams.awardType = 'Coupon';
    queryParams.sortType = 'desc';
    queryParams.sort = 0;
    const that = this;
    // table loading
    this.setState({ loading: true });

    // 直接调用request
    request('g2/wx.rights.awards.type.get', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        // data根据自己api的规则处理
        that.setState({ data: filterListModel(response), loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  // 重置搜索框
  handleFormReset = isRequest => {
    const { form } = this.props;
    form.resetFields();
    const that = this;
    this.setState(
      {
        queryParams: {},
      },
      () => {
        if (isRequest) that.requestPageList();
      }
    );
    // 目前产品那边的需求是只重置搜索框，自己在点击查询按钮。所以这边重置完并没有在调用查询方法
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { queryParams } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.state.queryParams = Object.assign(queryParams, fieldsValue);
      this.requestPageList();
    });
  };

  // 搜索Div
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="奖品名称">
              {getFieldDecorator('awardName')(<Input placeholder="请输入奖品名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="奖品状态">
              {getFieldDecorator('awardStatus')(
                <Select placeholder="全部" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="using">发放中</Option>
                  <Option value="unused">已结束</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 16 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </Row>
      </Form>
    );
  }

  render() {
    const { editData, data, loading } = this.state;
    const { list, pagination } = data;
    const paginationProps = {
      showQuickJumper: true,
      ...pagination,
    };
    const that = this;
    return (
      <>
        <CouponOverlay
          ref={ref => {
            that.couponOverLay = ref;
          }}
          editData={editData}
          callBack={res => {
            message.success(res);
            that.handleFormReset(true);
          }}
        />

        <PageHeaderWrapper
          title="店铺优惠券"
          content="粉丝收藏店铺后才可获取到该优惠劵，在店铺下单时直接抵扣，等同于现金。"
        >
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => {
                    that.setState(
                      {
                        editData: {},
                      },
                      () => {
                        that.couponOverLay.show();
                      }
                    );
                  }}
                >
                  新建
                </Button>
              </div>
              <Table
                className={styles.table}
                columns={this.columns}
                scroll={{ x: 1450 }}
                dataSource={list}
                loading={loading}
                pagination={paginationProps}
                rowKey={record => record.id}
                onChange={paginations =>
                  this.requestPageList(paginations.current, paginations.pageSize)
                }
              />
            </div>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default CouponList;
