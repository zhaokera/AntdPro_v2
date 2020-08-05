import React, { Component } from 'react';
import { Form, message, Select, Input, InputNumber } from 'antd';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';
import { DMSelect } from '@/components/DMComponents';
import styles from './index.less';
const { Search } = Input;
const { Option } = Select;

class IntegralFormItem extends React.Component {
    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
        } = this.props;
        const formItemLayout = {
            labelCol: {
                sm: { span: 5 },
                xl: { span: 5 },
            },
            wrapperCol: {
                sm: { span: 19 },
            },
        };
        return (
            <Form>
                <Form.Item {...formItemLayout} label="批量修改积分" colon={false}>
                    {getFieldDecorator('editlevel', {
                        rules: [
                            {
                                required: true,
                                message: '请输入修改的积分',
                            },
                        ],
                    })(
                        <InputNumber min={-10000} max={10000} precision={0}  style={{ width: '255px' }} />
                    )}
                    <span className={styles.itemtext}>输入100，表示获取100，输入-100，表示消耗100，只能输入整数</span>
                </Form.Item>
            </Form>
        )
    }
}
const IntegralForm = Form.create({ name: 'validate_editlevel' })(IntegralFormItem)

// 修改积分
@connect(
    ({ loading, memberlist }) => {
        return {
            loading: loading.models.memberlist,
        };
    },
    null,
    null,
    { withRef: true }
)
class ChangeIntegral extends Component {
    static defaultProps = {
        type: 'add',
    };

    constructor(props) {
        super(props);
        this.state = {
            checkState: false,
            visible: false,
            editData: this.props.editData.id === undefined ? undefined : this.props.editData,
            type: this.props.editData.id === undefined ? 'add' : 'edit', // 新增弹窗add 修改edit
        };
        this.show = this.show.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { editData, type } = nextProps;
        if (JSON.stringify(editData) !== JSON.stringify(prevState.editData)) {
            if (!editData) return null;

            return {
                editData: editData,
                type: type,
            };
        }
        if (type !== prevState.type) {
            return {
                type: type,
            };
        }
        return null;
    }

    show = () => {
        
        if (this.state.editData.member && this.state.editData.member.length > 0) {
            this.editlevelModal.show();
        } else {
            message.error("请选择客户");
        }
    };
    hide = () => {
        this.editlevelModal.hide();
    };

    update =(editData)=>{
        let ed= this.planForm.props.form.getFieldValue("editlevel")
        if( ed===0 || !ed){message.error('输入异常'); return;}
        let operationType = "reduce";
        if(ed>0){operationType="add"};
        
        let queryData ={
            pointRemark:"中台修改积分",
            pointNum:Math.abs(ed),
            customerId:editData.member.join(","),
            operationType:operationType,

        }
        this.props.dispatch(
            {
                type:'memberlist/SendPointBatch',
                payload: {
                    ...queryData
                }, callback: response => {
                   
                    if(response){
                        message.success(`修改成功`); //${response.succCount}个,修改失败${response.failCount}个
                       
                        this.hide();
                        //location.reload();//刷新当前页面
                        
                        this.props.editInit();
                    }else{
                        //message.success(`修改失败`);
                    }                  
                   //console.log(response);
                  }
            }
        )
        console.log(ed);
        
    }
    render() {
        const that = this;
        const { editData, type } = this.state;     
        const {handleCancel,handleOk}=this.props;   

        return (
            <>
                <DMOverLay
                    confirmLoading={this.props.loading}
                    ref={ref => {
                        this.editlevelModal = ref;
                    }}
                    title="修改积分"
                    width={522}
                    handleOk={e => {
                        e.preventDefault();
                        //console.log(e)
                        this.update(editData);
                        if(handleOk)handleOk()
                    }}
                    handleCancel={()=>{
                        if (handleCancel) handleCancel();
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

export default ChangeIntegral;