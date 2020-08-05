import React, { Fragment } from 'react';
import {  Checkbox,Slider, InputNumber, Button, Select, Row, Col, DatePicker,Form } from 'antd';
import moment from 'moment';
const Option = Select.Option;

const RangePicker = DatePicker.RangePicker;
import styles from './index.less'

export default class RegionInt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    checkNum(str)
    {
        if(this.props.data.tag_type == "region_int"||this.props.data.tag_type=="region_time")
        {
            var r = /^\d+$/;
            var flag=r.test(str);
            return flag;
        }
        else if(this.props.data.tag_type == "region_double")
        {
            //var r= /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
            var r=/^[0-9]+([.]{1}[0-9]{1,2})?$/
            var flag=r.test(str);
            return flag;
        }
        else
        {
            return true;
        }
    }
    handleChange(selectedItems) {
        if (this.props.data.tag_type == "region_time"||this.props.data.tag_type == "region_time_date") {
            let newvalue = { "type": "select", "selecttype": selectedItems, "selectvalue": [] };
            this.propchange(newvalue);
            return;
        }
        let datavalue = [];
        if (selectedItems == "1") {
            if (this.props.data.selectvalue.length == 1) {
                datavalue = [1];
                datavalue = datavalue.concat(this.props.data.selectvalue);
            }
        }
        else {
            if (this.props.data.selectvalue.length > 1) {
                if (selectedItems == "2") {
                    datavalue = datavalue.concat(this.props.data.selectvalue[0]);
                }
                else {
                    datavalue = datavalue.concat(this.props.data.selectvalue[1]);
                }
            }
        }
        if (datavalue.length == 0) {
            datavalue = this.props.data.selectvalue;
        }
        let newvalue = { "type": "select", "selecttype": selectedItems, "selectvalue": datavalue };
        this.propchange(newvalue);
    }
    handleintChange(value) {
        if(this.checkNum(value))
        {
            let datavalue = [];
            datavalue = datavalue.concat(value);
            let newvalue = { "type": "select", "selecttype": this.props.data.selecttype, "selectvalue": datavalue };
            this.propchange(newvalue);
        }
    }

    handleRegMinChange(value) {
        if(this.checkNum(value))
        {
            let newvalue = { "type": "select", "selecttype": this.props.data.selecttype, "selectvalue": this.concatValue(value, "min") };
            this.propchange(newvalue);
        }
    }
    handleRegMaxChange(value) {
        if(this.checkNum(value)){
        let newvalue = { "type": "select", "selecttype": this.props.data.selecttype, "selectvalue": this.concatValue(value, "max") };
       // this.props.change(this.props.data, newvalue);
       this.propchange(newvalue);
     }
    }
    handleTimeChange(value, dateString) {
        let datavalue = [];
        datavalue = datavalue.concat(dateString);
        let newvalue = { "type": "select", "selecttype": this.props.data.selecttype, "selectvalue": datavalue };
        this.propchange(newvalue);
    }
    onReChange(e) {
        this.props.data.selectdayvalue=e;
        this.props.onChange(this.props.data);
    }
    onReMinChange(e) {
        if(this.checkNum(e))
        {
            let min=e;
            let max;
            if(this.props.data.selectdayvalue.length==2)
            {
                max=this.props.data.selectdayvalue[1];
            }
            else{
                max=this.props.data.selectdayvalue;
            }
            if(max>=min)
            {
                this.props.data.selectdayvalue=[min,max];
            }
            else
            {
                this.props.data.selectdayvalue=[min,min];
            }
            this.props.onChange(this.props.data);
        }
        
    }
    onReMaxChange(e) {
        if(this.checkNum(e))
        {
        let min=0;
        let max=e
        if(this.props.data.selectdayvalue.length==2)
        {
            min=this.props.data.selectdayvalue[0];
        }
        else{
            min=1;
        }
        if(max>=min)
        {
            this.props.data.selectdayvalue=[min,max];
        }
        else
        {
            this.props.data.selectdayvalue=[max,max];
        }
        this.props.onChange(this.props.data);
    }
    }
    propchange(newvalue)
    {
        if(newvalue.selectvalue.length>0&&newvalue.selectvalue[0]==""&&newvalue.selectvalue[0]!=0)
        {
            newvalue.selectvalue=[];
        }
        this.props.data.selecttype = newvalue.selecttype;
        this.props.data.selectvalue = newvalue.selectvalue;
        this.props.onChange(this.props.data);
    }
    concatValue(value, type) {
        let regvalue = [];
        if (this.props.data.selecttype == "1") {

            if (type == "min") {
                regvalue = regvalue.concat(value);
                if (this.props.data.selectvalue.length > 0) {
                    regvalue = regvalue.concat(this.props.data.selectvalue[1]);
                }

            }
            else {
                if (this.props.data.selectvalue.length > 0) {
                    regvalue = regvalue.concat(this.props.data.selectvalue[0]);
                }
                else {
                    regvalue = regvalue.concat(value);
                }
                regvalue = regvalue.concat(value);
            }
        }
        else {
            regvalue = regvalue.concat(value);
        }
        if (regvalue.length == 0) {
            regvalue = this.props.data.selectvalue;
        }
        return regvalue;
    }

    onNodeCheckChange(val)
    {
      this.props.data.setnodecheckd=val.target.checked;
      this.props.onChange(this.props.data);
    }

    render() {
        let inner = [];
        let starttime = "";
        let endtime = "";
        let showdateformat='YYYY-MM-DD';
        let showformat='MM-DD';
        let dateFormat = 'YYYY-MM-DD HH:mm:ss';
        if(this.props.data.tag_type == "region_time_date")
        {
            dateFormat="MM-DD";
        }
        if (this.props.data.tag_type == "region_time"||this.props.data.tag_type == "region_time_date") {
            if (this.props.data.selectvalue.length == 2) {
                starttime =this.props.data.selectvalue[0]!=""? moment(this.props.data.selectvalue[0], dateFormat):"";
                endtime = this.props.data.selectvalue[1]!=""?moment(this.props.data.selectvalue[1], dateFormat):"";
            }
            else if (this.props.data.selectvalue.length == 1) {
                starttime = this.props.data.selectvalue[0]!=""?moment(this.props.data.selectvalue[0], dateFormat):"";
            }
        }
        if (this.props.data.selecttype == "1") {//区间
            if (this.props.data.tag_type == "region_time"||this.props.data.tag_type == "region_time_date") {
                inner.push(
                    <span>
                        <RangePicker
                             format={this.props.data.tag_type == "region_time_date"?showformat:showdateformat}
                            onChange={this.handleTimeChange.bind(this)}
                            value={[starttime,endtime]}
                        /></span>);
            }
            else {
                inner.push(<span><InputNumber step={this.props.data.step} onChange={this.handleRegMinChange.bind(this)} min={this.props.data.min_value} value={this.props.data.selectvalue[0]} max={this.props.data.max_value} />&nbsp;&nbsp;-&nbsp;&nbsp;<InputNumber step={this.props.data.step} onChange={this.handleRegMaxChange.bind(this)} value={this.props.data.selectvalue[1]} min={this.props.data.min_value} max={this.props.data.max_value} />&nbsp;&nbsp;{this.props.data.unit}</span>);
            }

        }
        else if (this.props.data.selecttype == "2") {//大于
            if (this.props.data.tag_type == "region_time"||this.props.data.tag_type == "region_time_date") {
                inner.push(
                    <span>
                        <DatePicker
                            format={this.props.data.tag_type == "region_time_date"?showformat:showdateformat}
                            placeholder="请选择时间"
                            value={starttime}
                            onChange={this.handleTimeChange.bind(this)}
                        /></span>);
            }
            else {
                inner.push(<span><InputNumber step={this.props.data.step} onChange={this.handleintChange.bind(this)} value={this.props.data.selectvalue[0]} min={this.props.data.min_value} max={this.props.data.max_value} />&nbsp;&nbsp;{this.props.data.unit}</span>);
            }

        }
        else if (this.props.data.selecttype == "3") {//小于
            if (this.props.data.tag_type == "region_time"||this.props.data.tag_type == "region_time_date") {
                inner.push(
                    <span>
                        <DatePicker
                            format={this.props.data.tag_type == "region_time_date"?showformat:showdateformat}
                            placeholder="请选择时间"
                            onChange={this.handleTimeChange.bind(this)}
                            value={starttime}
                        /></span>);
            }
            else {
                inner.push(<span><InputNumber step={this.props.data.tag_type == "region_int" ? 1 : 1.00} onChange={this.handleintChange.bind(this)} value={this.props.data.selectvalue[0]} min={this.props.data.min_value} max={this.props.data.max_value} />&nbsp;&nbsp;{this.props.data.unit}</span>);
            }

        }
        else if (this.props.data.selecttype == "4") {//相对时间
            inner.push(<span>
                 <Row gutter={16}>
                    <Col span={8} className={styles.colBoxstyle}>
                        <span style={{marginRight:10}}>近</span>
                        <Slider
                        range
                            min={this.props.data.min_value}
                            max={this.props.data.max_value}
                            onChange={this.onReChange.bind(this)}
                            value={this.props.data.selectdayvalue.length==undefined?[0,this.props.data.selectdayvalue]:this.props.data.selectdayvalue}
                            step={this.props.data.step}
                            style={{width:'100%'}}
                        />
                    </Col>
                    <Col span={16}>
                    <InputNumber
                        style={{width:85}}
                            min={this.props.data.min_value}
                            max={this.props.data.max_value}
                            precision={0}
                            value={this.props.data.selectdayvalue.length==undefined?0:this.props.data.selectdayvalue[0]}
                            step={this.props.data.step}
                            onChange={this.onReMinChange.bind(this)}
                        />
                        -
                        <InputNumber
                        style={{width:85}}
                            min={this.props.data.min_value}
                            max={this.props.data.max_value}
                            precision={0}
                            value={this.props.data.selectdayvalue.length==undefined?this.props.data.selectdayvalue:this.props.data.selectdayvalue[1]}
                            step={this.props.data.step}
                            onChange={this.onReMaxChange.bind(this)}
                        />&nbsp;&nbsp;{this.props.data.unit}
                    </Col>
                </Row>
            </span>);
        }
        else if (this.props.data.selecttype == "5") {//废弃保留
            inner.push(<span>
                 <Row gutter={16}>
                    <Col span={8}>
                        <Slider
                            min={this.props.data.min_value}
                            max={this.props.data.max_value}
                            onChange={this.onReChange.bind(this)}
                            value={this.props.data.selectdayvalue}
                            step={this.props.data.step}
                        />
                    </Col>
                    <Col span={16}>
                        <InputNumber
                        style={{width:85}}
                            min={this.props.data.min_value}
                            max={this.props.data.max_value}
                            precision={0}
                            value={this.props.data.selectdayvalue}
                            step={this.props.data.step}
                            onChange={this.onReChange.bind(this)}
                        />&nbsp;&nbsp;{this.props.data.unit}
                    </Col>
                </Row>
            </span>);
        }
        return (
            <Row>
      <Col span={8}><Checkbox onChange={this.onNodeCheckChange.bind(this)} checked={this.props.data.setnodecheckd}>{this.props.data.tag_name}</Checkbox></Col>
      <Col span={16}>
      <div >
            <Row gutter={24}>
                <Col span={6}>
                    <Select value={this.props.data.selecttype} onChange={this.handleChange.bind(this)}>
                        <Select.Option key="1" value='1'>区间</Select.Option>
                        <Select.Option key="2" value='2'>{this.props.data.tag_type == "region_time_date"?'晚于':'大于'}</Select.Option>
                        <Select.Option key="3" value='3'>{this.props.data.tag_type == "region_time_date"?'早于':'小于'}</Select.Option>
                        {(this.props.data.tag_type == "region_time")?<Select.Option key="4" value='4'>相对时间</Select.Option>:""}
                    </Select>
                </Col>
                <Col span={18}>
                    {inner}
                </Col>
            </Row>
            </div>
          
          </Col>
        </Row>
            
        )
    }
}
