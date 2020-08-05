import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Badge,
  message,
  DatePicker,
  Table,
  Card,
  Tooltip,
} from 'antd';
import moment from 'moment';
import CouponOverlay from './views/CouponOverlay';

import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['success', 'default'];
const status = ['发放中', '已结束'];
const moneyArray = [
  { val: 0, title: '全部' },
  { val: 3, title: '3' },
  { val: 5, title: '5' },
  { val: 10, title: '10' },
  { val: 20, title: '20' },
  { val: 100, title: '100' },
];

@connect(({ loading, coupon }) => {
  return {
    loading: loading.models.coupon,
    coupon,
  };
})
@Form.create()
class CouponList extends PureComponent {
  state = {
    startTime: '',
    endTime: '',
    queryParams: {
      awardName: '', // 搜索字段。搜索商品的title。1
      sort: 0,
      sortType: 'desc',
      currentPage: 1,
      pageSize: 20,
      awardType: 'Coupon',
    },
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
                    that.couponOverLay.getWrappedInstance().show();
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
    const { dispatch } = this.props;
    const { queryParams } = this.state;
    queryParams.currentPage = currentPage;
    queryParams.pageSize = pageSize;
    dispatch({
      type: 'coupon/fetch',
      payload: queryParams,
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      startTime: '',
      endTime: '',
      queryParams: {
        awardName: '', // 搜索字段。搜索商品的title。
        sort: 0,
        sortType: 'desc',
        currentPage: 1,
        pageSize: 20,
        awardType: 'Coupon',
      },
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { queryParams } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.timeType !== undefined) {
        if (fieldsValue.timeType === 0) {
          queryParams.findTimeType = 'awardUsingStartTime';
          if (this.state.startTime === undefined || this.state.startTime === '') {
            message.error('请选择有效期时间');
            return;
          }
        } else if (fieldsValue.timeType === 1) {
          queryParams.findTimeType = 'awardUsingEndTime';
          if (this.state.startTime === undefined || this.state.startTime === '') {
            message.error('请选择有效期时间');
            return;
          }
        }
        queryParams.awardUsingStartTime = this.state.startTime;
        queryParams.awardUsingEndTime = this.state.endTime;
      }
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
            <FormItem label="面额">
              {getFieldDecorator('awardDenomination')(
                <Select placeholder="全部" style={{ width: '100%' }}>
                  {moneyArray.forEach((item, index) => (
                    <Option key={index} value={item.val}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              )}
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
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem label="有效期" style={{ marginLeft: 15 }}>
              {getFieldDecorator('timeType')(
                <Select placeholder="请选择" style={{ width: '12%', minWidth: 130 }}>
                  <Option value={0}>开始时间</Option>
                  <Option value={1}>结束时间</Option>
                </Select>
              )}

              {getFieldDecorator('timeTypes')(
                <RangePicker
                  style={{ width: '25%', minWidth: 300, marginLeft: 16 }}
                  size="default"
                  onChange={date => {
                    if (date !== undefined)
                      this.setState({
                        startTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
                        endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
                      });
                  }}
                  placeholder={['开始时间', '结束时间']}
                />
              )}
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 16 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {coupon: { data },loading} = this.props;
    // console.log(this.props)
    const { list, pagination } = data;
    const paginationProps = {
      showQuickJumper: true,
      ...pagination,
    };
    const { editData } = this.state;
    const that = this;
    return (
      <>
        <CouponOverlay
          ref={ref => {
            that.couponOverLay = ref;
          }}
          editData={editData}
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
                        that.couponOverLay.getWrappedInstance().show();
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
