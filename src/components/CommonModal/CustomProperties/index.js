import React, { Component } from 'react';
import { Form, message, Select, Input, InputNumber, Checkbox, DatePicker, Radio, Spin } from 'antd';
import { connect } from 'dva';
import { DMOverLay } from '@/components/DMComponents';
import { DMSelect } from '@/components/DMComponents';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';
import request from '@/utils/request';
import moment from 'moment';
const { Search } = Input;
const { Option } = Select;
class IntegralFormItem extends React.Component {
    state = {
        attribute: null
    }
    componentDidMount() {
        this.init();
    }

    getDerivedStateFromProps(nextProps, prevState) {

        this.init();
    }
    init = () => {
        if (!this.props.attributeid) { return; }
        let ququ = {
            Id: this.props.attributeid
        }
        this.setState({ loading: true })
        request('g1/crm.customproperties.item.get', {
            method: 'POST',
            body: ququ,
        })
            .then(response => {
                console.log(response, 'zidy', ququ)
                this.setState({ attribute: response, loading: false });
                //this.GetNode(response);
            })
            .catch(() => {

            });
    }
    GetNode = (item) => {
        if (!item) { return <span></span>; }
        switch (item.propType) {
            case "0":
                return (<Input style={{ width: '255px' }} />)
            case "1":
                return (
                    <DatePicker showTime placeholder="选择时间" style={{ width: '255px' }} />
                )
            case "2":
                return (
                    <Select defaultValue="lucy" style={{ width: '255px' }}   >

                        {item.propValue.split(',').map((e) => {
                            return <Option value={e}>{e}</Option>
                        })}
                    </Select>
                )
            case "3":
                return (
                    <Radio.Group style={{ width: '255px' }}   >
                        {item.propValue.split(',').map((e) => {
                            return <Radio value={e}>{e}</Radio>
                        })}
                    </Radio.Group>
                )
            case "4":
                return (
                    <Checkbox.Group style={{ width: '255px' }}  >
                        {item.propValue.split(',').map((e) => {
                            return <Checkbox value={e}>{e}</Checkbox>
                        })}

                    </Checkbox.Group>
                )
            case "5":
                return (<InputNumber min={-999999999} max={999999999} style={{ width: '255px' }} />)
        }
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
        let proptype = this.state.attribute ? this.state.attribute.propType : -1;
        return (
            <Spin spinning={this.state.loading}>
                <Form>
                    <Form.Item {...formItemLayout} label={this.state.attribute ? (<Ellipsis length={6} tooltip>{this.state.attribute.propName}</Ellipsis>) : '无数据'} colon={false}>
                        {getFieldDecorator('editlevel', {
                            rules: [
                                {
                                    required: true,
                                    message: proptype === "0" || proptype === "5" ? "请输入" : "请选择",
                                }
                            ], initialValue: proptype === "1" ? moment(this.props.attributevalue, 'YYYY-MM-DD hh-mm-ss') : this.props.attributevalue
                        })(
                            this.GetNode(this.state.attribute)
                        )}
                        {getFieldDecorator('proptype', {
                            rules: [

                            ], initialValue: proptype
                        })(
                            <input hidden></input>
                        )}
                    </Form.Item>
                </Form>
            </Spin>
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
class CustomProperties extends Component {
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

    show = (attributeid, attributevalue, CustomerId) => {
        this.setState({ attributeid, attributevalue, CustomerId });
        this.editlevelModal.show();
    };
    hide = () => {
        this.editlevelModal.hide();
    };

    update = (editData) => {
        // console.log(this.planForm.props.form.getFieldValue('editlevel'), 'shuxing')
        this.planForm.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values, 'values');
            if (err) {
                this.props.editInit();
            } else {
                let v = null;
                if (values.proptype === "4") {
                    v = typeof (values.editlevel) === "string" ? encodeURI(values.editlevel.replace(/，/g, ',')) : encodeURI(values.editlevel.join(','));
                } else if (values.proptype === "1") {
                    v = values.editlevel.format();// moment().format(values.editlevel.format("YYYY-MM-DD HH-mm-ss"));
                } else {
                    v = values.editlevel
                }

                let ququ = {
                    CustomerId: this.state.CustomerId,
                    SetInfo: [{
                        PropertiesId: this.state.attributeid,
                        PropertiesType: values.proptype,
                        Value: v
                    }]

                }

                request('g1/crm.customproperties.memberbatch.add', {
                    method: 'POST',
                    body: ququ,
                })
                    .then(response => {

                        this.setState({ attribute: response });
                        this.props.editInit()
                        //this.GetNode(response);
                    })
                    .catch(() => {

                    });
                this.hide();

            }
        })

    }
    render() {
        const that = this;
        const { editData, type } = this.state;
        const { id } = this.state;
        return (
            <>
                <DMOverLay
                    confirmLoading={this.props.loading}
                    ref={ref => {
                        this.editlevelModal = ref;
                    }}
                    title="修改属性"
                    width={522}
                    handleOk={e => {
                        e.preventDefault();
                        this.update();

                    }}
                >

                    <IntegralForm
                        wrappedComponentRef={ref => (this.planForm = ref)}
                        modelData={editData}
                        attributeid={this.state.attributeid}
                        attributevalue={this.state.attributevalue}
                    />
                </DMOverLay>
            </>
        )
    }
}

export default CustomProperties;

