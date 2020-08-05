import React, { Component } from 'react';
import { Tabs, Table, message, Button } from 'antd';
import { DMOverLay } from '@/components/DMComponents';
import styles from './index.less';
import Ellipsis from '@/components/Ellipsis';
import request from '@/utils/request';

const { TabPane } = Tabs;


class DetailOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      type: '2',
      recordid: '',
      totalCount: 0,
      data: [],
      errordata: [

      ],
      succdata: [

      ],
    };
    this.show = this.show.bind(this);


    this.error_columns = [
      {
        dataIndex: 'mianImg', title: '主图', width: "117px",
        render: (txt) => {
          return txt ? <img className={styles.pic} src={txt} alt='' /> : ''
        }
      },
      {
        dataIndex: 'itemName',
        title: '商品名称', width: '22%',
        render: (txt, record, index) => {
          return (
            <Ellipsis lines={1} tooltip>{txt}</Ellipsis>
          )
        }
      },
      {
        dataIndex: 'barcode', title: '商品编码', width: '14%',
        render: (txt, record, index) => {
          return (
            <Ellipsis lines={1} tooltip>{txt}</Ellipsis>
          )
        }
      },
      { dataIndex: 'unit', title: '计量单位', width: '10%' },
      { dataIndex: 'weight', title: '重量(kg)', width: '10%' },
      { dataIndex: 'volume', title: '体积(m³)', width: '10%' },
      { dataIndex: 'errmsg', title: '失败原因', render: (txt) => { return <span style={{ color: "#FF4049" }}>{txt}</span> } },
    ]
    this.succ_columns = [
      {
        dataIndex: 'mianImg', title: '主图', width: "117px",
        render: (txt) => {
          return txt ? <img className={styles.pic} src={txt} alt='' /> : ''
        }
      },
      {
        dataIndex: 'itemName', title: '商品名称',
        render: (txt, record, index) => {
          return (
            <Ellipsis lines={1} tooltip>{txt}</Ellipsis>
          )
        }
      },
      {
        dataIndex: 'barcode', title: '商品编码', width: '14%',
        render: (txt, record, index) => {
          return (
            <Ellipsis lines={1} tooltip>{txt}</Ellipsis>
          )
        }
      },
      { dataIndex: 'unit', title: '计量单位', width: '12%' },
      { dataIndex: 'weight', title: '重量(kg)', width: '12%' },
      { dataIndex: 'volume', title: '体积(m³)', width: '12%' },
    ]
  }

  componentDidMount() {
    console.log(1);
    this.productDetailListGet();

  }


  refresh() {
    console.log(2);
    this.setState({ type: '2' }, () => {
      this.productDetailListGet();
    });
  }
  // 导出Excel
  exportToExcel = () => {

    var queryData = {
      pageIndex: 0,
      pageSize: 999999,
      recordId: this.state.recordid,
      type: 2
    };
    request('g1/crm.product.batchexporttoexcel.list', {
      method: 'POST',
      body: queryData,
    })
      .then(response => {
        if (response) {
          window.open(response);
        } 
      })
  }
  // 商品详情列表获取
  productDetailListGet = () => {
    const { pageIndex, pageSize, type, recordid } = this.state;

    this.setState({ loading: true, data: [] }, () => {
      if (recordid) {
        // 直接调用request
        request('g1/crm.product.importproductrecorddetaillist.list', {
          method: 'POST',
          body: { pageIndex, pageSize, recordid, type },
        })
          .then(response => {
            this.setState({
              pageIndex: response.currentPage,
              pageSize: response.pageSize,
              totalCount: response.totalCount,
              data: response.data,
              loading: false
            })
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  // 为了防止父组件修改editData但是子组件不修改
  static getDerivedStateFromProps(nextProps, prevState) {
    const { recordid } = nextProps;
    if (recordid !== prevState.recordid) {
      if (!recordid) return '';
      return { recordid: recordid }
    }
    return '';
  }

  show = () => {
    this.addModal.show();
  };

  hide = () => {
    this.addModal.hide();
  }

  render() {
    const { footer } = this.props
    const { loading, errordata, succdata, pageSize, totalCount } = this.state
    return (
      <>

        <DMOverLay
          ref={ref => {
            this.addModal = ref;
          }}
          confirmLoading={loading}
          title="导入明细"
          width={1300}
          handleOk={e => {
            e.preventDefault();
            this.hide();
          }}
          footer={footer}
        >
          <Tabs defaultActiveKey="2" onChange={(type) => { this.setState({ type: type }, () => this.productDetailListGet()) }}>
            <TabPane tab="导入失败" key="2">
              <Button type='primary' style={{ marginBottom: 8 }} onClick={this.exportToExcel}>导出Excel</Button>
              <Table
                rowKey={j => j.id}
                loading={this.state.loading}
                columns={this.error_columns}
                dataSource={this.state.data}
                pagination={{
                  size: 'small',
                  total: Number(totalCount),
                  pageSize: Number(pageSize),
                  current: Number(this.state.pageIndex),
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: () => { return `共${totalCount}条记录` },
                  // eslint-disable-next-line no-shadow
                  onChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.productDetailListGet()) },
                  onShowSizeChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.productDetailListGet()) }
                }}
                scroll={{ y: 400 }}
              />
            </TabPane>
            <TabPane tab="导入成功" key="1">
              <Table
                rowKey={j => j.id}
                loading={this.state.loading}
                columns={this.succ_columns}
                dataSource={this.state.data}
                pagination={{
                  size: 'small',
                  total: Number(totalCount),
                  pageSize: Number(pageSize),
                  current: Number(this.state.pageIndex),
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: () => { return `共${totalCount}条记录` },
                  onChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.productDetailListGet()) },
                  onShowSizeChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.productDetailListGet()) }
                }}
                scroll={{ y: 400 }}
              />
            </TabPane>
          </Tabs>

        </DMOverLay>

      </>
    );
  }
}

// export default Form.create()(AddOverlay);
export default DetailOverlay;
