import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { DMOverLay } from '@/components/DMComponents';
import request from '@/utils/request';


class ClassifyView extends Component {
  state = {
    inputValue: this.props.name?this.props.name:''
  }

  // 输入框数字计数
  changeVals = e => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  render() {
    const { form: { getFieldDecorator }, label, name } = this.props;
    return (
      <Form>
        <Form.Item label={label} colon={false} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          {
            getFieldDecorator('name', {
              rules: [{ required: true, message: "请输入分类名称！" }],
              initialValue: name
            })(
              <Input
                allowClear
                placeholder="请输入分类名称"
                maxLength={15}
                onChange={this.changeVals}
                addonAfter={<span> {this.state.inputValue.length}/15 </span>}
              />
            )
          }
        </Form.Item>
      </Form>
    )
  }
}
const ClassifyForm = Form.create()(ClassifyView)

class ClassifyOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pid: '',
      //  pid: this.props.pid === undefined ? undefined : this.props.pid,
    };
    this.show = this.show.bind(this);

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { pid } = nextProps;
    const { pname } = nextProps;
    const { id } = nextProps;

    return {
      pid: pid,
      pname:pname,
      id: id
    };
  }

  show = () => {
    this.attributeModal.show();
  };

  requestAddCategoryList(values) {
    values.sort = 30;
    const that = this;
    const { callBack } = this.props;

    // table loading
    this.setState({ loading: true });
    if (!this.state.id)//新增
    {
      values.parentId = this.props.pid;
      values.lev = this.props.pid == 0 ? 1 : 2;
      // 直接调用request
      request('g1/crm.product.behindcategory.add', {
        method: 'POST',
        body: values,
      })
        .then(response => {
          // data根据自己api的规则处理
          //that.setState({ data: response, loading: false });
       
          if (response.id != "") {
            that.attributeModal.hide();
            if (callBack) callBack('新增成功');
          }


        })
        .catch(() => {
          this.setState({ loading: false });
        });
    }
    else//编辑
    {
      // 直接调用request
      values.id = this.props.id
      request('g1/crm.product.behindcategory.update', {
        method: 'POST',
        body: values,
      })
        .then(response => {
          // data根据自己api的规则处理
          //that.setState({ data: response, loading: false });
         
          if (response) {
            that.attributeModal.hide();
            if (callBack) callBack('编辑成功');
          }


        })
        .catch(() => {
          this.setState({ loading: false });
        });
    }
  }

  render() {
    const { loading } = this.props;
    const that = this;
    return (
      <>
        <DMOverLay
          ref={ref => {
            this.attributeModal = ref;
          }}
          confirmLoading={loading}
          title={!that.state.id && this.props.pid === 0 ? '新建分类':!that.state.id && this.props.pid !== 0 ?'新建子分类' :
          that.state.id && (this.props.pid === 0 ||this.props.pid=='')? '编辑分类':'编辑子分类'}
          width={430}
          handleCancel={e=>this.props.callBack('取消编辑')}
          handleOk={e => {
            e.preventDefault();
            this.classifyForm.props.form.validateFields((err, values) => {
              that.requestAddCategoryList(values);

            })
          }}
          
        >
          <ClassifyForm label={this.props.pid === 0 ||this.props.pid==''? '分类名称' : '子分类名称'} wrappedComponentRef={ref => (this.classifyForm = ref)} name={this.props.pname} />
        </DMOverLay>
      </>
    );
  }
}

export default ClassifyOverlay;