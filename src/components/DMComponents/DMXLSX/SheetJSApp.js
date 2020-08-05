import React, { PureComponent } from 'react';
import XLSX from 'xlsx';
import { Button, Alert } from 'antd';
import DragDropFile from '@/components/DMComponents/DMXLSX/DragDropFile';
import OutTable from '@/components/DMComponents/DMXLSX/OutTable';
import DataInput from '@/components/DMComponents/DMXLSX/DataInput';
import styles from './index.less';

/* generate an array of column objects */
const makeCols = refstr => {
  const o = [];
  const C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};

class SheetJSApp extends PureComponent {
  static defaultProps = {
    showExport: false,
    downloadMB: undefined,
    alertInfo: '支持扩展名：txt, csv,xls,xlsx，文件大小不超过5M。',
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
      cols: [] /* Array of column objects e.g. { name: "C", K: 2 } */,
    };
    this.handleFile = this.handleFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }

  downloadMB = () => {
    const { downloadMB } = this.props;
    if (downloadMB) downloadMB();
  };

  removeFile() {
    this.setState({
      data: [],
      cols: [],
    });
  }

  /**
   * File
   *  */
  handleFile(file) {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      /* Update state */
      this.setState({ data, cols: makeCols(ws['!ref']) });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }

  exportFile() {
    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(this.state.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, 'sheetjs.xlsx');
  }

  render() {
    const { showExport, alertInfo } = this.props;
    return (
      <DragDropFile handleFile={this.handleFile}>
        <div className={styles.upload_control}>
          <DataInput
            downloadMB={this.downloadMB}
            removeFile={() => {
              this.removeFile();
            }}
            handleFile={this.handleFile}
          />
          <Alert className={styles.alert} message={alertInfo} type="warning" showIcon />

          {showExport ? (
            <div>
              <Button
                disabled={!this.state.data.length}
                className="btn btn-success"
                onClick={this.exportFile}
              >
                Export
              </Button>
              <OutTable data={this.state.data} cols={this.state.cols} />
            </div>
          ) : null}
        </div>
      </DragDropFile>
    );
  }
}

export default SheetJSApp;

/* -------------------------------------------------------------------------- */
