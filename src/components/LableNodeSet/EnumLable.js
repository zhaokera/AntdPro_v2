import React, { Fragment } from 'react';
import { Checkbox,Row, Col  } from 'antd';
const CheckboxGroup = Checkbox.Group;

export default class EnumLable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		
		};
  }
  onChange(selectedItems)
  {
    this.props.data.selectvalue=selectedItems;
    this.props.onChange(this.props.data);

  }
  onNodeCheckChange(val)
  {
    this.props.data.setnodecheckd=val.target.checked;
    this.props.onChange(this.props.data);
  }
  render() {
    
    return (

    <Row>
      <Col span={8}><Checkbox onChange={this.onNodeCheckChange.bind(this)} checked={this.props.data.setnodecheckd}>{this.props.data.tag_name}</Checkbox></Col>
      <Col span={16}><CheckboxGroup onChange={this.onChange.bind(this)} value={this.props.data.selectvalue} options={this.props.data.enum_map} /></Col>
    </Row>

      
     // <CheckboxGroup options={this.props.data.enum_map} />
    )
  }
}
