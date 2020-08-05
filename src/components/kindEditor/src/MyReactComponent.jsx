/******************************
 * Created by lv on 2017/11/15.
 *
 * 自定义react组件
 ******************************/
import React from 'react';
import PropTypes from 'prop-types';
import { Guid } from './utils';
import './kindeditor/kindeditor-all.js';
import { Upload, Button, message } from 'antd';

class KindEditorReactComponent extends React.Component {
  constructor(props) {
    super(props);
    const value = this.props.value || '';

    this.state = {
      id: Guid(),
      content: value,
    };
  }
  componentDidMount() {
    this.initEditor();
    //this.setState({content: this.props.value})
  }
  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    this.setState({ content: '', id: '' });
  }
  componentWillReceiveProps(nextProps) {
    //console.log(nextProps)
    let { content } = nextProps;
    let oldContent = this.editor.html();
    if (oldContent !== content) {
      this.setState({ content: content });
      this.editor.html(content);
    }
  }
  getItems() {
    let defaultItems = [
      'source',
      '|',
      'undo',
      'redo',
      '|',
      'preview',
      //'print',
      'template',
      'code',
      'cut',
      'copy',
      'paste',
      'plainpaste',
      'wordpaste',
      '|',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'justifyfull',
      'insertorderedlist',
      'insertunorderedlist',
      'indent',
      'outdent',
      'subscript',
      'superscript',
      'clearhtml',
      'quickformat',
      'selectall',
      '|',
      'fullscreen',
      '/',
      'formatblock',
      'fontname',
      'fontsize',
      '|',
      'forecolor',
      'hilitecolor',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'lineheight',
      'removeformat',
      '|',
      'image',
      /*'multiimage',
             'flash', 'media', 'insertfile',*/ 'table',
      'hr',
      // 'emoticons',
      // 'baidumap',
      // 'pagebreak',
      // 'anchor',
      'link',
      'unlink',
      //'|',
      // 'about',
    ];
    return this.props.items || defaultItems;
  }
  getHtmlTags() {
    let defaultTags = {
      font: ['color', 'size', 'face', '.background-color'],
      span: ['style'],
      div: ['class', 'align', 'style'],
      table: ['class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'style'],
      'td,th': [
        'class',
        'align',
        'valign',
        'width',
        'height',
        'colspan',
        'rowspan',
        'bgcolor',
        'style',
      ],
      a: ['class', 'href', 'target', 'name', 'style'],
      embed: [
        'src',
        'width',
        'height',
        'type',
        'loop',
        'autostart',
        'quality',
        'style',
        'align',
        'allowscriptaccess',
        '/',
      ],
      img: ['src', 'width', 'height', 'border', 'alt', 'title', 'align', 'style', '/'],
      hr: ['class', '/'],
      br: ['/'],
      'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': ['align', 'style'],
      'tbody,tr,strong,b,sub,sup,em,i,u,strike': [],
    };
    return { ...defaultTags, ...this.props.htmlTags };
  }

  initEditor = () => {
    const props = this.props;
    const that = this;

    // var uploadbutton = window.KindEditor.uploadbutton({
    //   button: K('#ke-upload-button')[0],
    //   fieldName: 'imgFile',
    //   url: '../php/upload_json.php',
    //   afterUpload: function(data) {
    //     if (data.error === 0) {
    //       alert(data.url);
    //     } else {
    //       alert(data.message);
    //     }
    //   },
    // });

    window.KindEditor.lang({
      image: '上传图片',
    });
    window.KindEditor.plugin('image', function(K) {
      var editor = this,
        name = 'image';

      // 点击图标时执行
      editor.clickToolbar(name, function() {
        const ddd = window.document.getElementsByTagName('input');
        let fss = undefined;
        for (var i = 0; i < ddd.length; i++) {
          const ttt = ddd[i];
          if (ttt.type === 'file') {
            fss = ttt;
          }
        }
        if (fss) fss.click();
      });
    });

    this.editor = window.KindEditor.create(`#${this.state.id}`, {
      width: '100%',
      height: 600,
      minWidth: props.minWidth || 650,
      minHeight: props.minHeight || 100,
      items: this.getItems(),
      noDisableItems: props.noDisableItems || ['source', 'fullscreen'],
      filterMode: props.filterMode || true,
      htmlTags: this.getHtmlTags(),
      wellFormatMode: props.wellFormatMode || true,
      resizeType: props.resizeType || 2,
      themeType: props.themeType || 'default',
      langType: props.langType || 'zh-CN',
      designMode: props.designMode || true,
      fullscreenMode: props.fullscreenMode || false,
      basePath: props.basePath || '',
      themesPath: props.cssPath,
      pluginsPath: props.pluginsPath || './kindeditor/plugins/',
      langPath: props.langPath || '',
      minChangeSize: props.minChangeSize || 5,
      loadStyleMode: props.loadStyleMode || true,
      urlType: props.urlType || 'domain',
      newlineTag: props.newlineTag || 'p',
      pasteType: props.pasteType || 2,
      dialogAlignType: props.dialogAlignType || 'page',
      shadowMode: props.shadowMode || true,
      zIndex: props.zIndex || 811213,
      useContextmenu: props.useContextmenu || true,
      syncType: props.syncType || 'form',
      indentChar: props.indentChar || '\t',
      cssPath: props.cssPath,
      cssData: props.cssData,
      bodyClass: props.bodyClass || 'ke-content',
      colorTable: props.colorTable,
      afterCreate: props.afterCreate,
      afterChange: function() {
        //  this.afterChange
        that.props.onChange(this.html());
      },
      afterTab: props.afterTab,
      afterFocus: props.afterFocus,
      afterBlur: props.afterBlur,
      afterUpload: props.afterUpload,
      uploadJson: props.uploadJson,
      fileManagerJson: props.fileManagerJson,
      allowPreviewEmoticons: props.allowPreviewEmoticons || true,
      allowImageUpload: props.allowImageUpload || true,
      allowFlashUpload: props.allowFlashUpload || false,
      allowMediaUpload: props.allowMediaUpload || false,
      allowFileUpload: props.allowFileUpload || false,
      allowFileManager: props.allowFileManager || false,
      fontSizeTable: props.fontSizeTable || [
        '9px',
        '10px',
        '12px',
        '14px',
        '16px',
        '18px',
        '24px',
        '32px',
      ],
      imageTabIndex: props.imageTabIndex || 0,
      formatUploadUrl: props.formatUploadUrl || true,
      fullscreenShortcut: props.fullscreenShortcut || false,
      extraFileUploadParams: props.extraFileUploadParams || [],
      filePostName: props.filePostName || 'file',
      fillDescAfterUploadImage: props.fillDescAfterUploadImage || false,
      afterSelectFile: props.afterSelectFile,
      pagebreakHtml:
        props.pagebreakHtml || '<hr style=”page-break-after: always;” class=”ke-pagebreak” />',
      allowImageRemote: props.allowImageRemote || false,
      autoHeightMode: props.autoHeightMode || false,
      fixToolBar: props.fixToolBar || true,
      tabIndex: props.tabIndex,
    });

    window.KindEditor.options.filterMode = false;
  };

  // 判断上传图片的格式/图片大小
  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const { imgUrls } = this.state;
    const list = imgUrls ? imgUrls.split(',') : [];
    const mostLength = list.length >= 50;
    if (mostLength) {
      message.error('最多上传50张图片!');
    }
    if (!isJpgOrPng) {
      message.error('请上传png或jpg格式的图片!');
    }
    const isLt2M = file.size < 2 * 1024 * 1024;
    if (!isLt2M) {
      message.error('图片大小应小于2M!');
    }
    return isJpgOrPng && isLt2M && !mostLength;
  };

  handleChange = info => {
    if (info.file && info.file.status === 'done') {
      const response = info.file.response;
      if (info.file.size < 2 * 1024 * 1024 && info.file.type.indexOf('image') >= 0) {
        const result = response.result;
        this.editor.insertHtml(`<img title="" border="none" src="${result}"></img>`);
      }
    }
  };

  render() {
    const that = this;
    const uploadUrl = 'http://file.duomaiyun.com'.concat('/FileUpload/UploadPublicFile');
    return (
      <div className="kindeditor">
        <textarea
          id={this.state.id}
          name="content"
          ref="textarea"
          value={this.state.content}
        ></textarea>
        <Upload
          headers={{ authorization: 'authorization-text' }}
          showUploadList={false}
          name="file"
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          accept="image/*"
          action={uploadUrl}
          data={{
            sessionkey: localStorage.getItem('full.crm.sessionkey'),
          }}
          style={{
            display: 'none',
          }}
        ></Upload>
      </div>
    );
  }
}

KindEditorReactComponent.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default KindEditorReactComponent;
