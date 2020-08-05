import React, { PureComponent } from 'react';
import { Upload, Button, Icon } from 'antd';
import styles from './index.less';
/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/

/* list of supported file types */
const SheetJSFT = [
  'txt',
  'xls',
  'xlsx',
  'csv',
  // 'xlsb',
  // 'xlsm',
  // 'xml',
  // 'ods',
  // 'fods',
  // 'uos',
  // 'sylk',
  // 'dif',
  // 'dbf',
  // 'prn',
  // 'qpw',
  // '123',
  // 'wb*',
  // 'wq*',
  // 'html',
  // 'htm',
]
  .map(x => {
    return '.'.concat(x);
  })
  .join(',');

export default class DataInput extends PureComponent {
  state = {
    disabled: false,
  };

  handleChange = ({ file }) => {
    const { handleFile } = this.props;
    if (file && file.status === 'done') {
      if (handleFile) handleFile(file.originFileObj);
      this.setState({
        disabled: true,
      });
    }
  };

  removeFile = file => {
    const { removeFile } = this.props;
    if (removeFile) removeFile(file.originFileObj);
    this.setState({
      disabled: false,
    });
  };

  render() {
    const props = {
      onChange: this.handleChange,
      accept: SheetJSFT,
      onRemove: this.removeFile,
    };
    return (
      <Upload {...props}>
        <div className={styles.upload}>
          <Button disabled={this.state.disabled}>
            <Icon type="upload" /> 上传文件
          </Button>

          <div>
            下载
            <a
              onClick={e => {
                if (e.stopPropagation) {
                  e.stopPropagation(); // 阻止事件 冒泡传播
                } else {
                  e.cancelBubble = true; // ie兼容
                }
                const { downloadMB } = this.props;
                if (downloadMB) downloadMB();
              }}
            >
              文件模版
            </a>
          </div>
        </div>
      </Upload>
    );
  }
}
