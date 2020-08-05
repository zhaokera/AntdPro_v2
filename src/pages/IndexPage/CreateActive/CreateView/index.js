import React, { PureComponent } from 'react';
import { Form, Checkbox,Spin } from 'antd';
import styles from './index.less';
import request from '@/utils/request';
const FormItem = Form.Item;
import { connect } from 'dva';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
@connect(({ user }) => {
  return {
    currentUser: user.currentUser,
  };
})
@Form.create()
class RoleEditView extends PureComponent {
  state = {
    loadingmenu: true,
  };

  componentDidMount() {
    this.getijson();
    this.getoverview();
  }
  getoverview = () => {
    let sdata = {
      roleid:this.props.currentUser.userName
    }
    this.setState({ loadingmenu: true });
    request('g2/wx.authority.menu.get', {
      method: 'POST',
      body: sdata,
    }).then(rt => {
      if (rt) {
        debugger;
        rt.routes.map(e=>{
          if(e.name=="首页"||(e.authority.length==0))
          {
          }
          else
          {
            if(e.routes.length==0||e.routes==undefined)
            {
              if(e.topMenuPath==undefined)
              {
                e.sign=true;
              }
            }
            else
            {
              e.routes.map(ee=>{
                if(ee.routes!=undefined)
                {
                  if(ee.routes.length==0)
                  {
                    if(ee.topMenuPath==undefined)
                    {
                      ee.sign=true;
                    }
                  }
                  else
                  {
                    ee.routes.map(eee=>{
                      if(eee.routes!=undefined)
                      {
                          if(eee.routes.length==0)
                          {
                            if(eee.topMenuPath==undefined)
                            {
                              eee.sign=true;
                            }
                          }
                      }
                      else
                      {
                        if(eee.topMenuPath==undefined)
                        {
                          eee.sign=true;
                        }
                      
                      }
  
                    })
  
                  }
                }

              })
            }

          }
        })
        this.setState({ menu: rt, loadingmenu: false })
        // console.log(rt, '菜单');
      }
    });
  }

  getijson = () => {
    let sdata = {
      subuserid:this.props.currentUser.userName
    }
    this.setState({ loadingGetmenu: true });
    request('g1/crm.member.menu.get', {
      method: 'POST',
      body: sdata, 
    }).then(rt => {
      if (rt) {
        let ijson = JSON.parse(rt.homeMenu);
        // console.log(rt.homeMenu);
        this.setState({ ijson: ijson ,loadingGetmenu: false});
      }
      else if(rt==undefined)
      {
        this.setState({loadingGetmenu: false});
      }
    });
  }
  getCheckNode=(e)=>
  {
      var nodearr=[];
      e.routes.map((ee, i) => {
        if(ee.sign==true)
        {
          /* return (
            <Checkbox key={`key${ee.menuCode}`} value={`${ee.menuCode}`}>{ee.name}</Checkbox>
          ) */
          nodearr.push(<Checkbox key={`key${ee.menuCode}`} value={`${ee.menuCode}`}>{ee.name}</Checkbox>);
        }
        else
        {
              ee.routes.map(eee=>{
                if(eee.sign==true)
                {
                 /* return(
                  <Checkbox key={`key${eee.menuCode}`} value={`${eee.menuCode}`}>{eee.name}</Checkbox>
                 ) */
                 nodearr.push(<Checkbox key={`key${eee.menuCode}`} value={`${eee.menuCode}`}>{eee.name}</Checkbox>);
                }
              })
        }
      })
      return nodearr;
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Spin spinning={this.state.loadingmenu==false && this.state.loadingGetmenu ==this.state.loadingmenu ?false:true}>
        <div className={styles.CustomSetPage}>
          <Form className={styles.formView} colon={false}>
            {
              this.state.menu ?
                this.state.menu.routes.map((e, i) => {
                  if(e.name==="首页"||(e.authority.length==0)){

                  }else{
                    return (<FormItem {...formItemLayout} label={`${e.name}`}>
                    {getFieldDecorator(`${e.menuCode}`, {
                      initialValue: this.state.ijson ? this.state.ijson[e.menuCode] : []
                    })(

                      <Checkbox.Group key={`123${e.name}`} style={{ width: '100%' }}>
                        {
                          this.getCheckNode(e)
                         /*  e.routes.map((ee, i) => {
                            if(ee.sign==true)
                            {
                              return (
                                <Checkbox key={`key${ee.menuCode}`} value={`${ee.menuCode}`}>{ee.name}</Checkbox>
                              )
                            }
                            else
                            {
                                  ee.routes.map(eee=>{
                                    if(eee.sign==true)
                                    {
                                     return(
                                      <Checkbox key={`key${eee.menuCode}`} value={`${eee.menuCode}`}>{eee.name}</Checkbox>
                                     )
                                      
                                    }
                                  })
                            }
                          }) */
                        }
                      </Checkbox.Group>
                    )}
                  </FormItem>)
                  }
                  
                }) : null

            }
          </Form>
        </div>
      </Spin>

    );
  }
}

export default RoleEditView;
