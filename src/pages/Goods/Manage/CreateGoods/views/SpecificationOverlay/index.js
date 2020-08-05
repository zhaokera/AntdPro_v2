import React, { Component } from 'react';
import { Form, message } from 'antd';
import Specification from './Specification';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';

@connect(
  ({ loading, AttributeModels }) => {
    return {
      loading: loading.models.AttributeModels,
      AttributeModels,
    };
  },
  null,
  null,
  { withRef: true }
)
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.show = this.show.bind(this);
  }

  componentDidMount() {

  }

  show = () => {
    this.attributeModal.show();
  };

  hide = () => {
    this.attributeModal.hide();
  }

  getData = (spec) => {
    this.props.onChange(spec);
  }

  saveData(formData) {
    if (!(formData.PropName.replace(/^\s\s*/, '').replace(/\s\s*$/, ''))) {
      message.error("请输入规格名称");
      return;
    }

    if (formData.keys.length === 0) {
      message.error("请至少输入一个规格值。");
      return;
    }

 
 
    let json = {};
    json.name = formData.PropName;
    let arr = [];
    
    let a='';
    formData.keys.forEach(i => {
      if(arr.findIndex(j=>j==formData.names[i])>-1)
      {
        a="规格值不允许重复" 
      }
      if(!formData.names[i])
      {
        a="请认真填写规格值，不要置空"
      }
      if(formData.names[i]&& formData.names[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "" ){
        arr.push(formData.names[i]);
      }
    });
    if(a)
    {
      message.error(a);
      return;
    }
    

    json.values =a?[]:arr;

    let specList=this.props.speData;
    if(specList.length>=10)
    {
        message.error("最多只能添加10个规格")
        return;
    }
    const flag = specList.findIndex(i => i.name === json.name) < 0;
    if(!flag) {
      message.error("已经增加了相同的规格");
      return;
    }


    this.props.onChange(json);

    
    this.hide();
  };

  render() {
    const that = this;
    const { loading } = this.props;
    return (
      <>
        <DMOverLay
          ref={ref => {
            this.attributeModal = ref;
          }}
          confirmLoading={loading}
          title="新增规格"
          width={430}
          handleOk={e => {
            e.preventDefault();
            that.saveData(that.fanForm.props.form.getFieldsValue());
            
          }}
        >
          <Specification dataEdit={that.props.dataEdit}  speData={that.props.specList}  wrappedComponentRef={ref => this.fanForm = ref} />
        </DMOverLay>
      </>
    );
  }
}

export default index;