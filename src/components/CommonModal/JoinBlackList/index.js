import React, { Component } from 'react';
import { Form, message, Select, Input, InputNumber } from 'antd';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';
import { DMSelect } from '@/components/DMComponents';
import styles from './index.less';
const { Search } = Input;
const { Option } = Select;

class JoinBlackListItem extends React.Component {
    static defaultProps = {
        pagetype: '1',//默认是客户列表
    };
    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
            pagetype
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
                <Form.Item {...formItemLayout} label="" colon={false}>
                    <div className={styles.chosedpeople}><i style={{ display: pagetype == '1' ? 'inline-block' : 'none' }} className={styles.IstyleBox}>已选择<span>{this.props.modelData.member.length}</span>个客户，</i>确认加入黑名单吗？</div>
                </Form.Item>
            </Form>
        )
    }
}
const JoinBlackListForm = Form.create({ name: 'validate_editlevel' })(JoinBlackListItem)

//加入黑名单
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
class JoinBlackList extends Component {
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
    okhandle = () => {
        const me = this;
        if (this.state.editData.member && this.state.editData.member.length > 0) {
            let memberarr = [];
            if(this.props.isSingle === true){
                if(this.state.editData.membermobile)
            {memberarr.push( this.state.editData.membermobile);}
                if(this.state.editData.membermobile==null){
                    message.error("该客户无手机号，添加失败")
                    return;
                }
            }else{
                me.state.editData.memberRows.map((item) => {
                    if(item.mobile)
                    { memberarr.push(item.mobile)
                    }
                });
            }
            if(memberarr.length==0){
                message.error("该客户无手机号，添加失败")
                return;
            }
            // if(!(/^1[3456789]\d{9}$/.test(memberarr))){                  
            //     message.error("该客户的手机号有误，添加失败")
            //     return false; 
            // } 
            const queryData = {
                phone: memberarr,
                sourceType: 0,
            };
            this.props.dispatch({
                type: 'memberlist/ADDMembersBlack',
                payload: {
                    ...queryData
                },
                callback: response => {
                    console.log(response);
                    if (response) {
                        message.success("添加成功")
                        this.editlevelModal.hide();
                        //me.props.editInit();
                       
                    } else {
                        message.error("添加失败")
                    }

                }
            })
        } else {
            message.error("请选择客户");
        }
    }

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
                    title="加入黑名单"
                    width={522}
                    handleOk={e => {
                        e.preventDefault();
                        this.okhandle();
                        console.log(e)
                    }}
                >

                    <JoinBlackListForm
                        wrappedComponentRef={ref => (this.planForm = ref)}
                        modelData={editData}
                    />
                </DMOverLay>
            </>
        )
    }
}

export default JoinBlackList;