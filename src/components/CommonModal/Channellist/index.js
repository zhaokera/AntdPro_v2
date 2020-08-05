import React, { Component } from 'react';
import { Row, Col, Select, Form } from 'antd';
import request from '@/utils/request';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

const bigformItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 5 },
        xl: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 19 },
        xl: { span: 20 }
    },
};




class ChannelList extends Component {

    static defaultProps = {
    }
    static propTypes = {
        formname: PropTypes.string.isRequired,
        getFieldDecorator: PropTypes.func.isRequired
    }
    state={
        channel:null,
    }
    componentDidMount (){
        this.init();
    }
    init = () => {
        request('g1/crm.channelname.list.get', {
            method: 'POST',
            body: {},
        })
        .then(response => { 
            this.setState({channel:response});
    
        })
        .catch((resoponseerror) => {
                console.log(resoponseerror);
            });
    }
    render() {

        return (
            <FormItem label="渠道"   >
                {this.props.getFieldDecorator(`${this.props.formname}`)(
                    <Select placeholder="请选择"  className="Mr-basewidth">
                        {/* <Option value="">所有渠道</Option> */}
                        {this.state.channel?this.state.channel.map((e)=>{
                            return(
                                <Option key={e.platform} value={e.platform}>{e.platformname}</Option>
                            )
                        }):null }
                        {/* <Option value="">所有渠道</Option>
                        <Option value="tb">淘宝</Option>
                        <Option value="jd">京东</Option>
                        <Option value="sn">苏宁</Option>
                        <Option value="xhs">小红书</Option>
                        <Option value="yz">有赞</Option>
                        <Option value="wm">微盟</Option>
                        <Option value="yd">云店</Option>
                        <Option value="store">自建商城</Option>
                        <Option value="unline">线下</Option> */}
                    </Select>

                )}
            </FormItem>
        )
    }
}



export default ChannelList;