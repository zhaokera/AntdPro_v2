import React, { Component } from 'react';
import { Table, Alert, Button, Row, Col, Popconfirm, Pagination, message } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ClassifyOverlay from "./views/ClassifyOverlay"
import styles from './index.less';
import request from '@/utils/request';
import { filterListModel } from '@/utils/utils';


let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // diama 
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

class Classify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [

      ],
      //type: 'level0',
      queryParams: {},
      expand: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      pid: '',
      isExpand: true,
      pname: '',
      id: '',
      tableKey: Math.random()
    };

    this.columns = [
      { dataIndex: 'name', title: '分类名称', width: "80%" },
      {
        dataIndex: 'key',
        title: '操作',
        render: (txt, row, index) => {
          return (
            
            <Row type='flex' gutter={16} justify='end' style={{ width: '156px' }}>
              {row.children ? <Col><a href="javascript:;" onClick={() => { this.setState({ pid: txt, id: '', pname: '' }, () => this.classifyOverlay.show()) }}>新增子分类</a></Col> : ''}
              <Col><a onClick={() => { this.setState({ pid: row.children ?'':row.pid, id: txt, pname: row.name }, () => this.classifyOverlay.show()) }}>编辑</a></Col>
              <Col>
                <Popconfirm
                  title="确定删除此分类?"
                  onConfirm={() => this.confirm(index, row.key)}
                >
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              </Col>
            </Row>
          )
        }
      }
    ]
  }

  componentDidMount() {
    this.requestPageList(this.state.currentPage, this.state.pageSize);
  }

  // 分类列表list
  requestPageList = (currentPage, pageSize) => {
    const that = this;
    const { queryParams } = this.state;
    // 分页的参数
    queryParams.currentPage = currentPage;
    queryParams.pageSize = pageSize;
    // table loading
    this.setState({ loading: true }, () => {
      // 直接调用request
      request('g1/crm.product.pagecategory.list', {
        method: 'POST',
        body: queryParams,
      })
        .then(response => {
          // data根据自己api的规则处理
          let data = [];

          if (response) {
            
            const Newresponse = response.data
            Newresponse.map(item => {
              let childrenList = [];
              item.children.map(o => {
                let childrenItem = {
                  key: o.value,
                  name: o.label,
                  pid: o.pid
                }
                childrenList.push(childrenItem);
              });

              let CategoryList = {
                key: item.value,
                name: item.label,
                children: childrenList
              };
              data.push(CategoryList);

            });
           
          }
          that.setState({isExpand: true, data: data, currentPage: parseInt(response.currentPage), pageSize: parseInt(response.pageSize), totalCount: parseInt(response.totalCount), loading: false }, () => this.setState({ tableKey: Math.random() }));

        })
        .catch(() => {
          this.setState({ loading: false });
        });
    });

  }


  // 删除分类
  requestDeleteCategory = (index, key) => {
    const that = this;
    const { queryParams } = this.state;
    // 分页的参数
    queryParams.id = key;
    // table loading
    this.setState({ loading: true });
    // 直接调用request
    request('g1/crm.product.behindcategory.delete', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {

        let cp =  that.state.data.length<=1 ? that.state.currentPage - 1 : that.state.currentPage;
        let currentPage= cp || 1;
        this.requestPageList(currentPage, that.state.pageSize);
        // data根据自己api的规则处理
        //that.setState({ data:response, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }



  confirm = (index, key) => {

    this.requestDeleteCategory(index, key);
    //message.success('删除成功', 1);
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex, row) => {
    const { data } = this.state;

    let dragId = data[dragIndex].key;
    let hoverId = data[hoverIndex].key;

    if (!row.children) {
      const pid = row.pid;
      const c = data.find(i => i.key === pid).children;
      dragId = c[dragIndex].key;
      hoverId = c[hoverIndex].key;
    }

    const dragRow = data[dragIndex];

    // this.setState(
    //   update(data, {
    //     data: {
    //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    //     },
    //   }),
    // );

    // 与后台交互 切换排序
    request('g1/crm.product.exchangecategoryshort.update', {
      method: 'POST',
      body: { DragId: dragId, HoverId: hoverId },
    })
      .then(response => {
        this.requestPageList(this.state.currentPage, this.state.pageSize);
      })
      .catch(() => {
        this.setState({ loading: false });
      });

  };

  // 展开所有行
  ExpandAllRows = () => {
    const { data, expand, isExpand } = this.state;
    if (!isExpand) {
      data.forEach((item) => {
        expand.push(item.key)
      })
      this.setState({
        expand: expand,
        isExpand: true
      })
    }
    else {
      this.setState({
        expand: [],
        isExpand: false
      })
    }
  }

  render() {
    const that = this;
    return (
      <PageHeaderWrapper title='商品分类'>
        <div className={styles.Classify}>
          <Alert message="商品分类可以在前端销售系统中展示，最多可新增2个层级；分类可自由拖拽调整顺序" type="info" showIcon />
          <Row className='Mt-basewidth3 Mb-basewidth2' type='flex' gutter={16}>
            <Col>
              <Button
                type='primary'
                onClick={() => {
                  this.setState({ pid: 0, id: '', pname: '' }, () => this.classifyOverlay.show())
                }}
              >
                新建一级分类
              </Button>
            </Col>
            <Col>
              <Button type='primary' onClick={this.ExpandAllRows}>{!this.state.isExpand ? '展开全部' : "收起全部"} </Button>
            </Col>
          </Row>
          <DndProvider backend={HTML5Backend}>
            <Table
              loading={this.state.loading}
              key={this.state.tableKey}
              columns={this.columns}
              dataSource={this.state.data}
              components={this.components}
              expandedRowKeys={this.state.expand}
              defaultExpandAllRows
              pagination={{
                size: 'small',
                current: this.state.currentPage,
                pageSize: that.state.pageSize,
                total: that.state.totalCount,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: that.requestPageList,
                onShowSizeChange: that.requestPageList,
                showTotal: (total) => `共${total}条记录`
              }}
              onRow={(record, index) => ({
                index,
                moveRow: (id1, id2) => { this.moveRow(id1, id2, record) },
              })}
              onExpand={
                (expanded, record) => {
                  const { expand } = this.state;
                  if (expand.includes(record.key)) {
                    // 移除 key
                    this.setState({
                      expand: expand.filter(k => k !== record.key),
                    });
                  } else {
                    // 添加 key
                    this.setState({ expand: [...expand, record.key] });
                  }

                }
              }
            />
          </DndProvider>
        </div>
        <ClassifyOverlay
          ref={(ref) => {
            this.classifyOverlay = ref
          }}
          callBack={res => {
            message.success(res);
            that.requestPageList(1, 10);
          }}
          pname={this.state.pname}
          pid={this.state.pid}
          id={this.state.id}
        />
      </PageHeaderWrapper>
    )
  }
}
export default Classify;
