import React, { Component } from 'react';
import { Row, Col, Steps, Table } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';
const { Step } = Steps;

class OrdreDetail extends Component {
  state = {
    data: [
      {
        goods: {
          url: 'https://img.alicdn.com/imgextra/i4/751308485/TB2.2G6tVuWBuNjSszbXXcS7FXa_!!751308485.jpg',
          title: '七匹狼短袖T恤新款中青年男士纯色【丝光棉】翻领短袖POLO衫男装'
        },
        num: 2,
        price: '25.00',
        discount: '2.00',
        state: '交易成功',
        realCollection: ['23.00', '9.00']
      },
      {
        goods: {
          url: 'https://img.alicdn.com/imgextra/i4/751308485/TB2.2G6tVuWBuNjSszbXXcS7FXa_!!751308485.jpg',
          title: '七匹狼短袖T恤新款中青年男士纯色【丝光棉】翻领短袖POLO衫男装'
        },
        num: 2,
        price: '25.00',
        discount: '2.00',
        state: '交易失败',
      }
    ]
  }

  columns = [
    {
      dataIndex: 'goods',
      title: '商品',
      render: (txt) => {
        return (
          <div className={styles.FistCell}>
            <div className={styles.Left}>
              <img src={txt.url} alt="" />
            </div>
            <div className={styles.Right}>
              <a href="" className={styles.PicName}>{txt.title} </a>
            </div>
          </div>
        )
      }
    }, {
      dataIndex: 'num',
      title: '数量',
      width: '10%'
    }, {
      dataIndex: 'price',
      title: '价格',
      width: '10%',
      render: (txt) => {
        return <span>&yen;{txt}</span>
      }
    }, {
      dataIndex: 'discount',
      title: '优惠',
      width: '10%',
      render: (txt) => {
        return <span>&yen;{txt}</span>
      }
    }, {
      dataIndex: 'state',
      title: '状态',
      width: '10%'
    }, {
      dataIndex: 'realCollection',
      title: '实收款',
      width: '18%',
      render: (value) => {
        const obj = {
          children: (
            value ? <span>￥{value[0]}（含快递￥{value[1]}）</span> : ''
          ),
          props: { rowSpan: 2 },
        };
        if (!value) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    }
  ]

  render() {
    const { data } = this.state;
    return (
      <PageHeaderWrapper title='订单详情'>
        <div className={styles.OrdreDetail}>
          <Steps current={1}>
            <Step title="买家下单" description="2019/8/15 09:36:47" />
            <Step title="买家付款" description="" />
            <Step title="商家发货" description="" />
            <Step title="交易完成" description="" />
            <Step title="评价" description="" />
          </Steps>
        </div>
        <div className={styles.OrdreDetail}>
          <div className={styles.page_title_s}><b>当前订单状态：</b>交易关闭</div>
          <Row className={styles.cardBox}>
            <Col span={8}>
              <div><b>买家信息</b></div>
              <div>Tempest</div>
              <div>王大锤</div>
              <div>15161131440</div>
              <div>江苏省常州市新北区创意产业园A座1803</div>
            </Col>
            <Col span={8}>
              <div><b>买家信息</b></div>
              <Row type='flex'><Col>配送方式：</Col><Col>快递</Col></Row>
              <Row type='flex'><Col>快递公司：</Col><Col>圆通</Col></Row>
              <Row type='flex'><Col>物流单号：</Col><Col>1234567890123</Col></Row>
            </Col>
            <Col span={8}>
              <div><b>买家信息</b></div>
              <Row type='flex'>
                <Col>订单来源：</Col>
                <Col>
                  <i className={`${styles.taobaoIcon} ${styles.iconCommon}`}>淘宝</i> 阿迪达斯常州南大街专卖店
                </Col>
              </Row>
              <Row type='flex'><Col>订单号：</Col><Col>1234567890123</Col></Row>
              <Row type='flex'><Col>支付方式：</Col><Col>微信</Col></Row>
            </Col>
          </Row>
        </div>
        <div className={styles.OrdreDetail}>
          <Table
            columns={this.columns}
            dataSource={data}
            pagination={{
              size: 'small',
              showQuickJumper: true,
              showSizeChanger: true,
              total: 50
            }}
          />
        </div>
      </PageHeaderWrapper>
    )
  }
}
export default OrdreDetail;