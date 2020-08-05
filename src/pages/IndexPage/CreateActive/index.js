import React, { Component } from 'react';
import { Form,message } from 'antd';
import CreateView from './CreateView';
import { DMOverLay } from '@/components/DMComponents';
import request from '@/utils/request';
const UserEditForm = Form.create()(CreateView);



class CreateVOverLay extends Component {
  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.show = this.show.bind(this);
  }

  show = () => {
    this.model.show();
  };
  hide = () => {
    this.model.hide();
  };
  okhandle =()=>{
    this.formView.props.form.validateFields((err,values)=>{
          let HomeMenu = JSON.stringify(values)
          if(HomeMenu==='{}'){
            message.error('请选择模块!');
            return;
          }
          let count =0;
          for(let key  in values){
            console.log(values[key] + '---'+   (values[key] ?values[key].length:0 ))
            count +=  (values[key] ?values[key].length:0 );
           }
           if(count>9){
            message.error('常用功能菜单超出最大限制!');
            return;
           }
            let sdata = {
              HomeMenu
            } 
            this.setState({menuloading:true});
            request('g1/crm.member.menu.saveable', {
              method: 'POST',
              body: sdata,
            }).then(rt => {
              if (rt) {
                message.success('设置成功!');
                this.hide()
              }else{
                message.error('设置失败!');
              }
              this.props.Showmenu();
              this.setState({menuloading:false});
            });
          
    })
  }
  render() {
    return (
      <>
        <DMOverLay
        confirmLoading={this.state.menuloading}
          ref={ref => {
            this.model = ref;
          }}
          title='自定义设置'
          width={740}
          handleOk={e => {
            e.preventDefault();
          this.okhandle();
          
          }}
        >
          <UserEditForm
            wrappedComponentRef={ref => (this.formView = ref)}
          />
        </DMOverLay>
      </>
    );
  }
}

export default CreateVOverLay;

// Array.isArray(response) ? response : [],
