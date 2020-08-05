import React, { Component } from 'react';
import { Form, message, Select } from 'antd';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';
import styles from './index.less';

const { Option } = Select;
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

export default class EditLabel extends React.Component {
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

    okhandle() {
        const me = this;

        let grade = this.planForm.props.form.getFieldValue("editlevel");
        let member = me.state.editData.member;
        if (member && member.length > 0 && grade) {
            // console.log(123);
           // message.success("参数正常")
            const queryData = {
                memberid: member,
                grade: grade,
            };
            this.props.dispatch({
                type: 'memberlist/UpdateMembersGrade',
                payload: {
                    ...queryData
                },
                callback: response => {
                    // console.log(response);
                    if(response){
                        message.success("修改成功")
                        this.editlevelModal.hide();
                        //location.reload();//刷新当前页面
                        me.props.editInit();
                    }else{
                        message.error("修改失败")
                    }
                    
                }
            })
            
        } else if (!member) {
            message.error("请选择客户")
            this.editlevelModal.hide();
        } else if (member.length === 0) {
            message.error("请选择客户")
            this.editlevelModal.hide();
        } else if (!grade) {
            message.error("请选择等级")
        }
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


    render() {
        const that = this;
        const { editData, type } = this.state;
        return (
            <>
                <DMOverLay
                confirmLoading={this.props.loading}
                    ref={ref => {
                        this.editlevelModal = ref;
                    }}
                    title="修改等级"
                    width={522}
                    handleOk={e => {
                        e.preventDefault();

                        this.okhandle();
                    }}
                    handleCancel={()=>{
                        if (handleCancel) handleCancel();
                    }}
                >

                    <EditLevelForm
                        wrappedComponentRef={(ref) => this.planForm = ref}
                        modelData={editData}
                    />
                </DMOverLay>
            </>
        )
    }
}




@connect(({ Grade, loading }) => ({
    Grade,
    loading: loading.models.Grade,
}))
class EditLevelFormItem extends React.Component {

    state ={
        gradeitem:null
    }
    componentDidMount(){
        this.init();
    }
    init = () => {
        const me =this;
        const queryData ={
            IsUsed:true
        }
        me.props.dispatch({
            type: 'Grade/GetMembersGrade',
            payload: {
                ...queryData
            }, callback: response => {

                 this.setState({gradeitem:response} );

            }
        })
    }
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
                <Form.Item {...formItemLayout} label="修改等级至" colon={false}>
                    {getFieldDecorator('editlevel', {
                        rules: [
                            {
                                required: true,
                                message: '请选择需要修改的等级',
                            },
                        ],
                    })(
                        <Select placeholder="请选择" style={{ width: '255px', marginRight: '8px' }} className="Mr-basewidth">

                            <Option key="-1" value="">请选择</Option>
                            {this.state.gradeitem?this.state.gradeitem.map((e) => {

                                return <Option key={e.grade} value={e.grade}>{e.gradeName}</Option>
                            }):null}

                        </Select>
                    )}
                    {/* <span className={styles.itemtext}>成长值自动调整为改等级的最低值</span> */}
                </Form.Item>
            </Form>
        )
    }
}
const EditLevelForm = Form.create({ name: 'validate_editlevel' })(EditLevelFormItem)

