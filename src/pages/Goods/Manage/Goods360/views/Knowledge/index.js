import React, { Component } from 'react';
import { Row, Col, Table, Radio } from 'antd';
import styles from './index.less';

class Knowledge extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div className={styles.Knowledge}>
        <Row type='flex' align='middle' gutter={8} className='Mb-basewidth2'>
          <Col>知识类型</Col>
          <Col>
            <Radio.Group defaultValue="a" className='RadioGroupNew'>
              <Radio.Button value="a">不限</Radio.Button>
              <Radio.Button value="b">尺码推荐</Radio.Button>
              <Radio.Button value="c">商品推荐</Radio.Button>
              <Radio.Button value="d">适用范围</Radio.Button>
              <Radio.Button value="e">商品使用</Radio.Button>
              <Radio.Button value="f">商品属性</Radio.Button>
              <Radio.Button value="g">其他</Radio.Button>
              <Radio.Button value="h">自定义类型</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Table
          dataSource={[
            { key: 1, title: '衣服洗涤方式', type: '商品使用', creator: '古天乐', time: '2019-06-12' },
            { key: 2, title: '衣服洗涤方式', type: '商品使用', creator: '古天乐', time: '2019-06-12' },
            { key: 3, title: '衣服洗涤方式', type: '商品使用', creator: '古天乐', time: '2019-06-12' },
            { key: 4, title: '衣服洗涤方式', type: '商品使用', creator: '古天乐', time: '2019-06-12' },
            { key: 5, title: '衣服洗涤方式', type: '商品使用', creator: '古天乐', time: '2019-06-12' },
          ]}
          pagination={{
            size: 'small',
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => { return `共${total}条记录` }
          }}
        >
          <Table.Column dataIndex='title' title='标题'  />
          <Table.Column dataIndex='type' title='知识类型' width='20%' />
          <Table.Column dataIndex='creator' title='创建人' width='20%' />
          <Table.Column dataIndex='time' title='创建时间' width='20%' />
          <Table.Column dataIndex='action' title='操作' width='16%' render={() => <a>查看</a>} />
        </Table>
      </div>
    )
  }
}

export default Knowledge;