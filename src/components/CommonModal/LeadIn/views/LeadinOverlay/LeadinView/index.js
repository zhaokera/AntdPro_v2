import React, { Component, PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';
import styles from './index.less'

@Form.create()
export default class CreateLeadinOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { modelData } = this.state;
    return (
      <div>
        sdfsdf
      </div>
    )
  }
}