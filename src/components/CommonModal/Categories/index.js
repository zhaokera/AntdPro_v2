// 选择商品分类

import React, { Component } from 'react';
import { Form, message, Select, Input, Transfer, Tree } from 'antd';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';

const { Option } = Select;
const { TreeNode } = Tree;

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode {...props} disabled={checkedKeys.includes(props.key)}>
      {generateTree(children, checkedKeys)}
    </TreeNode>
  ));
};

const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={item => item.title}
      showSelectAll={false}

    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
              onSelect={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
            >
              {generateTree(dataSource, targetKeys)}
            </Tree>
          );
        }
      }}
    </Transfer>
  );
};

const treeData = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [{ key: '0-1-0', title: '0-1-0' }, { key: '0-1-1', title: '0-1-1' }],
  },
  { key: '0-2', title: '0-3' },
];

class CategoriesForm extends React.Component {
  state = {
    targetKeys: [],
  };

  onChange = targetKeys => {
    console.log('Target Keys:', targetKeys);
    this.setState({ targetKeys });
  };


  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
        xl: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 6 },
      },
    };
    const { targetKeys } = this.state;

    return (
      <div>
        <Form>
          <Form.Item {...formItemLayout} label="选择分类" colon={false}>
            <Select>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </Form.Item>
        </Form>
        <TreeTransfer
          showSearch
          dataSource={treeData}
          targetKeys={targetKeys}
          onChange={this.onChange}
          onSearch={this.handleSearch}
        />
      </div>

    )
  }
}
const IntegralForm = Form.create({ name: 'validate_editlevel' })(CategoriesForm)

class Categories extends Component {
  static defaultProps = {
    type: 'add',
  };

  constructor(props) {
    super(props);
    this.state = {
      checkState: false,
      visible: false,
      editData: this.props.editData === undefined ? undefined : this.props.editData,
      type: this.props.editData === undefined ? 'add' : 'edit', // 新增弹窗add 修改edit
    };

    this.show = this.show.bind(this);
  }

  // 为了防止父组件修改editData但是子组件不修改
  static getDerivedStateFromProps(nextProps, prevState) {
    const { editData } = nextProps;
    if (JSON.stringify(editData) !== JSON.stringify(prevState.editData)) {
      if (!editData) return null;
      return {
        editData: editData,
      };
    }
    return null;
  }

  show = () => {

    this.editlevelModal.show();
  };

  render() {
    const that = this;
    const { editData, type } = this.state;

    return (
      <>
        <DMOverLay
          ref={ref => {
            this.editlevelModal = ref;
          }}
          title="选择商品分类"
          width="60%"
          handleOk={e => {
            e.preventDefault();
            console.log(e)
            that.editlevelModal.hide();
          }}
        >

          <IntegralForm
            wrappedComponentRef={ref => (this.planForm = ref)}
            modelData={editData}
          />
        </DMOverLay>
      </>
    )
  }
}

export default Categories


