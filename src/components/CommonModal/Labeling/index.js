import React, { Component } from 'react';
import { Form, message, Select, Input } from 'antd';
import { connect } from 'dva';
import { DMOverLay , DMSelect } from '@/components/DMComponents';

import styles from './index.less';
const { Search } = Input;
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
class LabingFormItem extends React.Component {

    state ={
        dataList:[]
    }

     // 组件加载完成
  componentDidMount() {
    this.init();
  }

  init =(labelName)=>{

    const queryData={
        labelName:labelName
    }

    this.props.dispatch({
        type: 'memberlist/listlabelget',
        payload: {
            ...queryData
        },
        callback: response => {
            console.log(response);
            this.setState({dataList:response})

        }
    })
  }

    render() {
        const {
            form: { getFieldDecorator, getFieldValue,state },
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
              {getFieldDecorator('editlevel', {
                        rules: [

                        ],
                    })(
                      <Search
                        placeholder="请输入标签"
                        onSearch={value => {this.init(value)}}
                        style={{ width: 220 }}
                        allowClear
                      />
                    )}

            </Form.Item>
            <Form.Item>
              <div className={`${styles.allLevelBox}`}>
                {getFieldDecorator('chose', {
                            rules: [

                            ],
                        })(
                          <DMSelect
                            style={{
                                    width: 300,
                                }}
                            dataList={this.state.dataList}
                            type="multi"
                            onChange={({ item,selectList }) => {
                                    // message.success(`当前选中${JSON.stringify(selectList)}`);
                                     this.props.onChangeLabel(selectList)
                                }}
                          />
                        )}

              </div>
            </Form.Item>
          </Form>
        )
    }
}
const LabingForm = Form.create({ name: 'validate_editlevel' })(LabingFormItem)

// 打标签
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
class Labeling extends Component {
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

        const {selectList }=this.state
        const tagId= [];
        if(selectList && selectList.length>0){
            console.log(selectList);
            selectList.map((e)=>{
                tagId.push(e.value);

            });
        }else{
            message.error("请选择标签")
            return;
        }
        this.setState({selectList:[]})
        const queryData ={
            tagId: tagId,
            memberId: this.state.editData.member
        }
        this.props.dispatch({
            type: 'memberlist/AddLabelMember',
            payload: {
                ...queryData
            },
            callback: response => {
                if(response){
                    this.editlevelModal.hide();
                    message.success("添加成功");
                    this.props.editInit();
                }else{
                    message.error("添加失败")
                }
            }
        })

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
              title="打标签"
              width={555}
              handleOk={e => {
                        e.preventDefault();
                        this.okhandle();
                    }}
            >

              <LabingForm
                wrappedComponentRef={ref => (this.planForm = ref)}
                modelData={editData}
                onChangeLabel={(selectList)=>{
                            this.setState({selectList:selectList})
                        }}
              />
            </DMOverLay>
          </>
        )
    }
}

export default Labeling;