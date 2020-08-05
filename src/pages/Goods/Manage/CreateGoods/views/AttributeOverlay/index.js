import React, { Component } from 'react';
import { Form, message } from 'antd';
import AttributeModalView from './Attribute';
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
class AttributeOverLay extends Component {
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

  saveData(formData) {
    let that = this;
    //console.log(formData);

    if (!formData.PropName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) {
      message.error("请输入属性名称");
      return;
    }
  
    if((formData.names||[]).length==0)
    {
      message.error("请输入属性值");
      return;
    }
    this.props.formData(formData);
    if (formData.keys.length > 0) {
      let arr = [];
      formData.keys.forEach(i => {
        arr.push(formData.names[i]);
      });
      formData.PropValue = arr.join(',');
    } else {
      formData.PropValue = (formData.PropValue || []).join(',');
    }

    //  let qurl = that.props.dataEdit.id ? 'AttributeModels/PropertiesItemUpdateModel' : 'AttributeModels/PropertiesItemAddModel';
    //  that.props.dispatch({
    //    type: qurl,
    //    payload: {
    //      ...formData,
    //      Id:that.props.dataEdit.id||'',
    //      IsUsed: that.props.dataEdit.isUsed || false,
    //      IsDelete: false
    //    },
    //    callBack: response => {
    //      if (response) {
    //        message.success('保存成功');
    //        that.attributeModal.hide();
    //        that.props.onChange(true);
    //      }
    //    },
    //  });
  };

  render() {
    const that = this;
    const { dispatch, loading } = this.props;
    return (
      <>
        <DMOverLay
          ref={ref => {
            this.attributeModal = ref;
          }}
          confirmLoading={loading}
          title={"新增属性"}
          width={430}
          handleOk={e => {
            e.preventDefault();
            //console.log(that.fanForm.props.form.getFieldsValue())
            that.saveData(that.fanForm.props.form.getFieldsValue());
          }}
        >
          <AttributeModalView dataEdit={that.props.dataEdit} wrappedComponentRef={ref => this.fanForm = ref} />
        </DMOverLay>
      </>
    );
  }
}

export default AttributeOverLay;