import React, { PureComponent } from 'react';
import { Modal, Icon, Table, Tabs, Alert, Row, Col, Button, Form, Input, Progress, message, Cascader, InputNumber } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Categories } from '@/components/CommonModal';
import styles from './index.less';
import request from '@/utils/request';
import router from 'umi/router';
import { match } from 'minimatch';

const { TabPane } = Tabs;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  numberSave = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.target.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values }, e.target.id);
    });
  }

  save = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values }, e.currentTarget.id);
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    if (record.children && record.children.length > 0 && (dataIndex == 'weight' || dataIndex == 'volume')) {
      return <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>{children}</div>
    }
    else if (!record.children && (dataIndex == 'categoryName' || dataIndex == 'unit')) {
      return <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>{children}</div>
    }
    else if (editing) {
      return <Form.Item className={styles.Mb0}>
        {
          dataIndex === 'weight' ? (
            <>
              {form.getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `${title} 必填.`,
                  },
                ],
                initialValue: record[dataIndex],
              })(<InputNumber ref={node => (this.input = node)} min={0} max={99999999} onPressEnter={this.numberSave} onBlur={this.numberSave} />)}
            </>
          ) : (
              <>
                {form.getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `${title} 必填.`,
                    },
                  ],
                  initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
              </>
            )
        }
      </Form.Item>
    }
    else {
      return <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={this.toggleEdit}>{children}</div>
    }
  };


  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
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


class ExcelDetail extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      state: 'suceess',
      recordid: '',
      pageIndex: 1,  // 页码
      pageSize: 10,   // 页大小
      totalCount: 0,   // 总个数
      type: '2',
      errordata: [],
      selectedRowKeys: [],
      categoryData: [],
      isEdit: true,
      editRecode: '',
      loading: false,
      tablekey: Math.random(),
      tablekey2: Math.random(),
    }
    this.error_columns = [
      {
        key: 'mianImg', dataIndex: 'mianImg', title: '主图', width: "118px",
        render: (txt) => {
          return txt ? <img className={styles.pic} src={txt} alt='' /> : ''
        }
      },
      {
        key: 'itemName', dataIndex: 'itemName', title: '商品名称', editable: true,
        render: (txt, record) => {
          return (
            <div className={styles.edithover} title={txt} style={{ width: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {
                record.errFileds && record.errFileds.indexOf('itemName') >= 0 ? <span className={styles.txt_error}>{txt}</span> : txt
              }
              <a href="javascript:;" className={styles.edit}><Icon type="edit" /></a>
            </div>
          )
        }
      },
      {
        key: 'barcode', dataIndex: 'barcode', title: '商品编码', width: '11%', editable: true,
        render: (txt, record) => {
          return (
            <div className={styles.edithover} style={{ width: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {
                record.errFileds && record.errFileds.indexOf('barcode') >= 0 ? <span className={styles.txt_error}>{txt}</span> : txt
              }
              <a href="javascript:;" className={styles.edit}><Icon type="edit" /></a>
            </div>
          )
        }
      },
      {
        key: 'categoryName', dataIndex: 'categoryName', title: '商品分类', width: '11%',
        render: (txt, record) => {
          return (
            <div className={styles.edithover}>
              {txt ? <span>{txt}</span> : ''}
              {/* <a href="javascript:;" className={styles.edit} onClick={() => this.CategoriesOverlay.show()}><Icon type="edit" /></a> */}
              {
                // eslint-disable-next-line no-nested-ternary
                record.detailId ? '' : this.state.isEdit && this.state.editRecode === record.id ? (<Cascader onChange={(value) => this.cascaderChange(value, record)} options={this.state.categoryData} placeholder="请选择" />) : <a href="javascript:;" className={styles.edit} onClick={() => this.editCategories(record.id)}><Icon type="edit" /></a>
              }
            </div>
          )
        }
      },
      {
        key: 'unit', dataIndex: 'unit', title: '计量单位', width: '10%', editable: true,
        render: (txt, record) => {
          return (
            <div className={styles.edithover}>
              {
                record.errFileds && record.errFileds.indexOf('unit') >= 0 ? <span className={styles.txt_error}>{txt}</span> : txt
              }
              {(record.children) && <a href="javascript:;" className={styles.edit}><Icon type="edit" /></a>}
            </div>
          )
        }
      },
      {
        key: 'weight', dataIndex: 'weight', title: '重量(kg)', width: '10%', editable: true,
        render: (txt, record) => {
          return (
            <div className={styles.edithover}>
              {
                record.errFileds && record.errFileds.indexOf('weight') >= 0 ? <span className={styles.txt_error}>{txt}</span> : txt
              }
              {!(record.children && record.children.length > 0) && <a href="javascript:;" className={styles.edit}><Icon type="edit" /></a>}
            </div>
          )
        }
      },
      {
        key: 'volume', dataIndex: 'volume', title: '体积(m³)', width: '10%', editable: true,
        render: (txt, record) => {
          return (
            <div className={styles.edithover}>
              {
                record.errFileds && record.errFileds.indexOf('volume') >= 0 ? <span className={styles.txt_error}>{txt}</span> : txt
              }
              {!(record.children && record.children.length > 0) && <a href="javascript:;" className={styles.edit}><Icon type="edit" /></a>}
            </div>
          )
        }
      },
      {
        key: 'errmsg', dataIndex: 'errmsg', title: '失败原因', width: '15%',
        render: (txt) => {
          txt = txt ? (txt.charAt(txt.length - 1) === "," ? txt.substr(0, txt.length - 1) : txt) : ''
          return (
            <div style={{ width: '100%' }}>
              <div className={styles.txt_error} style={{ width: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={txt}>{txt}</div>
            </div>
          )
        }
      },
      {
        key: 'action', dataIndex: 'action', title: '操作', width: '150px',
        fixed: 'right',
        render: (txt, record) => {
          let item = "";
          if (!record.detailId && record.hasErr) {
            item = <a href='javascript:;' onClick={() => this.reimport(record)}>重新导入</a>
          }
          return item
        }
      },
    ];

    this.succ_columns = [
      {
        dataIndex: 'mianImg', title: '主图', width: "118px",
        render: (txt) => {
          return txt ? <img className={styles.pic} src={txt} alt='' /> : ''
        }
      },
      { dataIndex: 'itemName', title: '商品名称', render: (text) => { return (<div style={{ wordBreak: 'break-all' }}>{text}</div>) } },
      { dataIndex: 'barcode', title: '商品编码', width: '15%', render: (text) => { return (<div style={{ wordBreak: 'break-all' }}>{text}</div>) } },
      { dataIndex: 'categoryName', title: '商品分类', width: '15%', render: (text) => { return (<div style={{ wordBreak: 'break-all' }}>{text}</div>) } },
      { dataIndex: 'unit', title: '计量单位', width: '13%', render: (text) => { return (<div style={{ wordBreak: 'break-all' }}>{text}</div>) } },
      { dataIndex: 'weight', title: '重量(kg)', width: '13%', render: (text) => { return (<div style={{ wordBreak: 'break-all' }}>{text}</div>) } },
      { dataIndex: 'volume', title: '体积(m³)', width: '13%', render: (text) => { return (<div style={{ wordBreak: 'break-all' }}>{text}</div>) } },
    ]
  }

  // 一键导入
  handleImport = () => {
    Modal.confirm({
      title: "是否确定重新导入?",
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        request('g1/crm.product.batchreimport.update', {
          method: 'POST',
          body: { id: this.state.recordid },
        })
          .then(response => {
            if (response) {
              message.success(response);
            }
            this.setState({ selectedRowKeys: [] });
            this.ImportProductRecordDetailListGet();
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  }


  // 导出Excel
  exportToExcel = () => {

    var queryData={
        pageIndex:0,
        pageSize:999999,
        recordId:this.state.recordid,
        type:2
    };
    request('g1/crm.product.batchexporttoexcel.list', {
      method: 'POST',
      body: queryData,
    })
      .then(response => {
        if (response) {
          window.open(response);
        }
          else 
          {
            message.error("导出失败，请重新登录。")
          
        }
      
      })
  }

  editCategories = (id) => {
    console.log(id)
    this.setState({
      isEdit: true,
      editRecode: id
    })
  }

  // 级联选择
  cascaderChange = (value, record) => {
    const json = { "id": record.id };
    json.categoryId = value[value.length - 1];
    if (record.detailId) {
      json.issku = true;
    } else {
      json.issku = false;
    }
    this.ExcelRecordProductUpdate(json);
    this.setState({ isEdit: false });
  }

  handleSave = (row, dataIndex) => {
    const json = { "id": row.id };
    json[dataIndex] = row[dataIndex];
    if (row.detailId) {
      json.issku = true;
    } else {
      json.issku = false;
    }
    this.ExcelRecordProductUpdate(json);
  };

  // 修改信息
  ExcelRecordProductUpdate = (parame) => {
    request('g1/crm.product.excelrecordproduct.update', {
      method: 'POST',
      body: parame,
    })
      .then(response => {
        this.ImportProductRecordDetailListGet();
      })
      .catch(() => {
        this.setState({ loading: false });
      });

  }

  // 获取详情
  ImportProductRecordDetailListGet = () => {
    const { pageIndex, pageSize, recordid, type } = this.state;

    this.setState({ loading: true }, () => {
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
            errordata: response.data,
            loading: false
          }, () => this.setState({ tablekey: Math.random(), tablekey2: Math.random() }))
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    })


  }

  // 重新导入
  reimport = (record) => {
    if (record.errmsg && record.errmsg.length > 0) {
      message.error("当前数据有错误，无法导入。");
      return;
    }
    let flag = false;
    record.children.map(i => {
      if (i.errmsg && i.errmsg.length > 0) {
        flag = true;
      }
    });

    if (flag) {
      message.error("当前规格数据有错误，无法导入。");
      return;
    }

    var arr = [];
    let that = this;
    arr[0] = record.id;
    Modal.confirm({
      title: "是否确定重新导入?",
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        that.reimportRequest(arr);
      }
    });
  }

  reimportRequest = (arr) => {
    request('g1/crm.product.reimport.update', {
      method: 'POST',
      body: { ids: arr },
    })
      .then(response => {
        if (response) {
          message.success(response);
        }
        this.setState({ selectedRowKeys: [] });
        this.ImportProductRecordDetailListGet();
      })
      .catch(() => {
        this.setState({ loading: false });
      });

  }

  // 批量重新导入
  batchReimport = () => {
    let arr = this.state.selectedRowKeys;

    // eslint-disable-next-line eqeqeq
    if (arr.length == 0) {
      message.error("请选择要导入的商品");
      return;
    }
    let that = this;
    let msg = "";
    that.state.selectedRowKeys.map(j => {
      var rcd = that.state.errordata.find(k => k.id == j);
      if (rcd && rcd.errmsg) {
        msg = rcd.errmsg;
      }
    });
    if (msg) {
      message.error("当前数据有错误，无法导入.");
      return;
    }
    Modal.confirm({
      title: "是否确定重新导入?",
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        that.reimportRequest(arr);
      }
    });

  }

  // 获取分类
  behindcategoryGet = () => {
    request('g1/crm.product.behindcategorytree.list', {
      method: 'POST',
      body: {},
    })
      .then(response => {
        this.setState({ categoryData: response });
      })
      .catch(() => {
        this.setState({ loading: false });
      });

  }

  getcategoryName = (id) => {
    const data = this.state.categoryData;
    const c = data.find(i => i.value === id);

    if (c) {
      return c.label;
    }

    let str = data.map(i => {
      str = i.label;
      const c2 = i.children.find(j => j.value === id);
      if (c2) {
        str += `->${c2.label}`;
        return str;
      }
    });
    return str;
  }

  // 初始化
  componentDidMount() {
    this.behindcategoryGet();

    this.setState({ recordid: this.props.location.query.id }, () => {
      // 获取成功数据
      this.ImportProductRecordDetailListGet();
    });
  }



  render() {
    const { errordata } = this.state;
    const rowSelection = {
      getCheckboxProps: record => ({
        disabled: (record.errmsg && record.errmsg.length > 0) || (record.detailId && record.detailId.length > 0),
        name: record.name,
      }),
      onChange: selectedRowKeys => {
        this.setState({ selectedRowKeys });
      }
    }

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.error_columns.map(col => {
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

    return (
      <PageHeaderWrapper title={<span><a onClick={() => { router.push({ pathname: '/goods/manage/released' }) }}>商品发布</a>-<a onClick={() => { router.push({ pathname: '/goods/manage/excelleadin' }) }}>Excel导入</a>-导入明细</span>}>
        <div className={styles.ExcelDetail}>
          <Tabs onChange={(type) => { this.setState({ type: type }, () => this.ImportProductRecordDetailListGet()) }}>
            <TabPane tab="导入失败" key="2">
              <Alert
                message='商品导入规则'
                description={
                  <div className={styles.LH22}>
                    <p>1.商品编码为必填项，若填写规格信息，规格编码必填</p>
                    <p>2.商品名称不得超过60中文字符</p>
                    <p>3.商品编码规格编码支持填写数字、英文字母，不超过30字符</p>
                    <p>4.计量单位只能包括：个、件、瓶、盒、双、箱、组、套、打，不匹配则无法导入</p>
                    <p>5.重量、体积、只允许输入数字，数值不大于99999999，保留小数点后2位</p>
                    <p>6.商品分类若填写错误，将自动过滤商品分类，分类支持在商品管理中调整</p>
                  </div>
                }
                showIcon
              />
              <Row className="Mt-basewidth2 Mb-basewidth2" type='flex' align='bottom' gutter={16}>
                <Col><Button type='primary' onClick={this.batchReimport}>批量重新导入</Button></Col>
                <Col><Button type='primary' onClick={this.handleImport}>一键重新导入</Button></Col>
                <Col><Button type='primary' onClick={this.exportToExcel}>导出Excel</Button></Col>
                <Col>已选商品数：<span className={styles.txt_error}>{this.state.selectedRowKeys.length}</span></Col>
              </Row>

              <Table
                key={this.state.tablekey2}
                rowKey="id"
                loading={this.state.loading}
                columns={columns}
                dataSource={errordata}
                pagination={{
                  size: 'small',
                  showQuickJumper: true,
                  showSizeChanger: true,
                  showTotal: () => { return `共${this.state.totalCount}条记录` },
                  pageSize: Number(this.state.pageSize),
                  onChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.ImportProductRecordDetailListGet()) },
                  onShowSizeChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.ImportProductRecordDetailListGet()) },
                  total: Number(this.state.totalCount),
                  current: Number(this.state.pageIndex),
                }}
                scroll={{ x: 1500 }}
                rowSelection={rowSelection}
                defaultExpandAllRows
                components={components}
              />
            </TabPane>
            <TabPane tab="导入成功" key="1">
              <Table
                key={this.state.tablekey}
                rowKey="id"
                loading={this.state.loading}
                columns={this.succ_columns}
                dataSource={errordata}
                pagination={{
                  size: 'small',
                  showQuickJumper: true,
                  showSizeChanger: true,
                  showTotal: () => { return `共${this.state.totalCount}条记录` },
                  pageSize: Number(this.state.pageSize),
                  total: Number(this.state.totalCount),
                  onChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.ImportProductRecordDetailListGet()) },
                  onShowSizeChange: (pageIndex, pageSize) => { this.setState({ pageIndex, pageSize }, () => this.ImportProductRecordDetailListGet()) },
                  current: Number(this.state.pageIndex),
                }}
                defaultExpandAllRows
              />
            </TabPane>
          </Tabs>

        </div>
        <Categories editData={this.state.categoryData} ref={(ref) => this.CategoriesOverlay = ref} />
      </PageHeaderWrapper>
    )
  }
}
export default ExcelDetail;