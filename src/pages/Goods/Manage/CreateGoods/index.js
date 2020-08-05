import React, { PureComponent } from 'react';
import { Cascader, Steps, Form, Input,Checkbox, Popconfirm, Icon, Select, Upload, message, Radio, Modal, InputNumber, Button, Table, Tooltip, Affix, Anchor, Tag } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Categories } from '@/components/CommonModal';
import router from 'umi/router';
import { connect } from 'dva';
import Link from 'umi/link';
import ProductAttribute from './views/ProductAttribute';
import SpecificationOverlay from './views/SpecificationOverlay';
import styles from './index.less';
import request from '@/utils/request';
const CheckboxGroup = Checkbox.Group
const { Step } = Steps;
const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

// 扫码
let code = '';
let lastTime=null,
    nextTime=null,
    lastCode=null,
    nextCode=null;

function scanEvent(e, cb) {
    nextCode = e.which;
    nextTime = new Date().getTime();

    if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
        code += String.fromCharCode(lastCode);
    } else if (lastCode != null && lastTime != null && nextTime - lastTime > 100) {
        code = '';
    }

    lastCode = nextCode;
    lastTime = nextTime;
    if (e.which === 13) {
        cb(code);
        console.log('code', code);
        code = '';
    }
}

@connect(({ loading, createGoodsModel }) => {
  return {
    loading: loading.models.createGoodsModel,
    createGoodsModel,
  };
})
@Form.create()
class index extends PureComponent {
  constructor(props) {
    super(props);


    this.state = {
      id: '',
      dataEdit: {},
      tabIndex: 0,
      navTop: false,
      current: 1,
      loading: false,
      guigeValue: 1,
      previewVisible: false,
      optionsData: [],
      previewImage: '',
      fileList: [

      ],
      fileNameList: [],
      specList: [],  // 规格集合  { name: '颜色', values: ["红色", "黄色", "绿色", "紫色"] } }  

      specData: [],  // 规格数据集合
      AttributeList: [],
      AddProduct: {},
      visible: false,
      specvisible: false,
      batchValue: 0,
      isweight: true,
      imgs: [],
      repeatCode: [],
      pcDetail: '',
      newSpec: '',//新增规格值
      fatherSpec: '',
      editorState: BraftEditor.createEditorState(null),
      shuxingList: [],//属性列表
      selectShuXing: [],
    //   checks:'1',
    //   check:'1',
     }

    // 规格图片列
    this.imgColumns = [
      {
        title: '规格图片',
        dataIndex: 'Images',
        width: 175,
        fixed: 'left',
        render: (text, record) => {
          return (
            record.Images ?
              <UploadImg imgs={[{ uid: 0, name: record.Images, url: record.Images }]} onChange={filedList => this.specUploadImgs(filedList, 'Images', record)} imgCount={1} />
              : <UploadImg onChange={filedList => this.specUploadImgs(filedList, 'Images', record)} imgCount={1} />
          )
        },
      }
    ];
    // 规格公共列
    this.publicColumns = [
      {
        title: '重量(kg)',
        dataIndex: 'Weight',
        width:100,
        render: (text, record) => (
          <InputNumber allowClear min={0} max={999999} value={text} onChange={(e) => this.SpecChange(e, 'Weight', record)} style={{ width: 100 }} />
        )
      },
      {
        title: '体积(m³)',
        dataIndex: 'Volume',
        render: (text, record) => (
          <InputNumber allowClear min={0} max={999999} value={text} onChange={(e) => this.SpecChange(e, 'Volume', record)} style={{ width: 100 }} />
        )
      },
      {
        title: '规格编码',
        dataIndex: 'SkuCode',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <Input maxLength={30} allowClear value={text} onChange={(e) => this.SpecChange(e.target.value, 'SkuCode', record)} style={{ width: 150 }} />
        )
      }, {
        title: '条形码',
        dataIndex: 'ProBroarcode',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <Input maxLength={30} allowClear value={text} onBlur={(e) => {
            if (e.target.value !== '') {
              // this.onBlurChange(record.SkuCode, e.target.value);
            }
          }} onChange={(e) =>

            this.SpecChange(e.target.value, 'ProBroarcode', record)
          } style={{ width: 150 }} />
        )
      },{
        title: '建议售价',
        dataIndex: 'Price',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <InputNumber allowClear min={0} max={999999} precision={2} value={text} onChange={(e) => this.SpecChange(e, 'Price', record)} style={{ width: 100 }} />
       )
      },
      {
        title: '操作',
        dataIndex: 'delete',
        width: 150,
        fixed: 'right',
        render: (text, record) =>
          this.state.specData.length >= 1 ? (
            <Popconfirm title="是否删除?" onConfirm={() => this.DeleteSpen(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ]
  }

  componentDidMount(){
    // 添加监听事件
    window.addEventListener('keypress', this.scanWrapper, false);
  }

  componentWillUnmount() {
    //移除监听
    window.removeEventListener('keypress', this.scanWrapper, false);
  }

  componentWillMount() {
    this.getCategoryList();
    window.addEventListener('scroll', this.handleScroll);
  }

  scanWrapper(e) {
    scanEvent(e, (code) => {
    // 这里获取扫码的结果，加自己的业务处理
    
    });
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
  }

  async componentDidMount() {
    if (this.props.location.query.id) {
      this.setState({ id: this.props.location.query.id }, () => {
        this.getGoodsDetail();
        document.title = '编辑商品'
      });
    }
    // 假设此处从服务端获取html格式的编辑器内容
    // const htmlContent = "123123123asdasdd"
    // // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // this.setState({
    //   editorState: BraftEditor.createEditorState(htmlContent)
    // })
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    // const result = await saveEditorContent(htmlContent);
  }

  // 获取商品详情
  getGoodsDetail = () => {
    request('g1/crm.product.masterdetail.list', {
      method: 'POST',
      body: { id: this.state.id },
    })
      .then(response => {

        // 处理 商品分类
        let { optionsData } = this.state;
        let arr = [];
        optionsData.forEach(i => {
          if (i.value === response.productDetail.categoryId) {
            arr.push(i.value);
          }

          if (i.children.length > 0) {
            i.children.forEach(j => {
              if (j.value === response.productDetail.categoryId) {
                arr.push(i.value);
                arr.push(j.value);
              }
            });
          }
          
        });
        // this.setState({
        //   check:response.productDetail.online,
        //   checks:response.productDetail.offline,
        // })
        response.productDetail.categoryId = arr;
        // 处理图片
        let imgs = [];
        if (response.productDetail.mainImage) {
          imgs.push({ uid: 0, name: response.productDetail.mainImage, url: response.productDetail.mainImage });
        }
        if (response.productDetail.subImages) {
          const subImages = response.productDetail.subImages.split('|');
          subImages.forEach((i, index) => {
            imgs.push({ uid: index + 1, name: i, url: i });
          });
        }
        response.productDetail.imgs = imgs;
        this.setState({ imgs });
        // 处理是否多规格
        if (response.productDetail.isMore === true) {
          response.productDetail.isMore = 2;
          this.setState({ guigeValue: 2 });
        } else {
          response.productDetail.isMore = 1;
          this.setState({ guigeValue: 1 });
        }

        ///属性
        var attrss = [];//属性列表
        var attrsss = [];//已选属性

        if (response.productAttrList && response.productAttrList.length > 0) {
          response.productAttrList.map(item => {
            let a = {};
            a.PropName = item.attributeKey;
            let b = [];
            if (item.attributeVals.length > 0) {
              item.attributeVals.map(j => {
                if (j.isSelect) {
                  let c = {};
                  c.Name = item.attributeKey;
                  c.Value = j.attributeValue;
                  attrsss.push(c);
                }
                b.push(j.attributeValue);
              });
            }
            a.PropValue = b.join(',');
            attrss.push(a);
          });
        }

        this.setState({
          shuxingList: attrss,
          loading:false,
          selectShuXing: attrsss,
          spuCode: response.productDetail.spuCode,
        });

        this.props.form.setFieldsValue({
          name: response.productDetail.name,
          spuCode: response.productDetail.spuCode,
          categoryId: response.productDetail.categoryId,
          module: response.productDetail.module,
          imgs: response.productDetail.imgs,
          isMore: response.productDetail.isMore,
          weight: response.productDetail.weight,
          barCode: response.productDetail.barCode,
          volume: response.productDetail.volume,
          pcDetail: BraftEditor.createEditorState(response.productDetail.pcDetail),
          price: response.productDetail.price,
        });

        // 处理规格
        let { specList, specData } = this.state;
        response.productSpecList.forEach(i => {
          let arr = [];
          i.values.forEach(j => {
            arr.push(j.specValue)
          })
          specList.push({ name: i.specName, values: arr });
        });
        this.setState({ specList });

        // 处理规格数据
        response.productSkuList.forEach(i => {
          const spec = { id: i.id, key: i.id, Images: i.images, Weight: i.weight, Volume: i.volume, SkuCode: i.skuCode, Specs: JSON.parse(i.attrSale), ProBroarcode: i.productCode, Price: i.price }
          spec.Specs.forEach(j => {
            spec[j.Name] = j.Value;
          });
          specData.push(spec);
        })
        this.setState({ specData });

        const pcDetail = response.productDetail.pcDetail;
        console.log(pcDetail)

        // 商品详情
        // 这个地方特别慢,还有规格的加载也很慢,这个地方加载会阻塞整个页面,优化了原来的代码,速度提升50%,但是远远不够,  有问题找老徐,我也看不懂这些代码在干嘛
        // setTimeout(() => {
        //   const pcDetail = response.productDetail.pcDetail;
        //   console.log(pcDetail)
        //   let fuck = BraftEditor.createEditorState(pcDetail);
        //   this.props.form.setFieldsValue({ pcDetail: fuck });
        //   this.setState({ editorState: fuck });
        // }, 500);
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  // 删除规格
  DeleteSpen = key => {
    const specData = this.state.specData;
    this.setState({ specData: specData.filter(item => item.key !== key) });
  }
  onBlurChange = (spucode, productcode) => {
    let { repeatCode } = this.state;
    request('g1/crm.product.productmast.select', {
      method: 'POST',
      body: { ProductCode: productcode, SpuCode: spucode },
    })
      .then(response => {
        if (response) {
          message.error("条形码" + productcode + "已存在");
          repeatCode.push(productcode+","+spucode);
          this.setState({ repeatCode: repeatCode });
        }
      })
  }
  SpecChange = (text, fildName, row) => {
    let { specData } = this.state;

    if (row.key === undefined) {
      return;
    }
    var reg = /^[0-9]\d*$/;
    if (fildName == 'ProBroarcode' && !reg.test(text) && text != "") {
      message.error("条形码必须是整数字符");
      return;
    }
    let spec = specData.find(i => i.key === row.key);
    spec[fildName] = text;

    this.setState({ specData: [...specData] });
  }


  handleScroll = () => {
    var tab1H; var tab2H; var tab3H;
    let box = document.getElementById("tab1H");
    var box1 = document.getElementById("tab2H");
    if (box) {
      tab1H = box.offsetHeight;
    }
    if (box1) {
      tab2H = box1.offsetHeight;
    }

    const scrollTop = document.documentElement.scrollTop;  // 滚动条滚动高度

    if (scrollTop < (tab1H + 70)) {
      this.setState({ tabIndex: 0 })
    } else if (scrollTop < (tab1H + tab2H) && scrollTop >= (tab1H + 70)) {
      this.setState({ tabIndex: 1 })
    } else {
      this.setState({ tabIndex: 2 })
    }
  }

  onChange = (e) => {
    const that = this;
    Modal.confirm({
      title: '提示',
      content: '切换规格会有数据丢失，是否切换规格?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let { specList, specData } = that.state;
        if (e.target.value === 1) {
          specList = [];
          specData = [];
          that.setState({
            guigeValue: e.target.value, specList, specData
          })
        } else {
          that.setState({
            guigeValue: e.target.value
          })
        }
      },
      onCancel() {
        if (e.target.value === 1) {
          that.props.form.setFieldsValue({ isMore: 2 });
        } else {
          that.props.form.setFieldsValue({ isMore: 1 });
        }
      }
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });


  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    let json = {};

    this.props.form.validateFields((err, values) => {
      if (!err) {
        var isfalse = false;
        const { specList, specData, AttributeList, repeatCode } = this.state;
        var badcode = "";
        specData.forEach((i, index) => {
          specData.forEach((j, jn) => {
            if (i.ProBroarcode == j.ProBroarcode && i.ProBroarcode != null && j.ProBroarcode != null && index != jn) {
              badcode = i.ProBroarcode;
              isfalse = true;
            }
          })
          // var rep = repeatCode.find(j => j == i.ProBroarcode+","+i.SkuCode);
          // if (rep != "" && rep != undefined) {
          //   badcode = i.ProBroarcode;
          //   isfalse = true;
          // }
        })
        // if (values.barCode != undefined && values.barCode != "") {
        //   var rep = repeatCode.find(j => j == values.barCode+","+values.spuCode);
        //   if (rep != "" && rep != undefined) {
        //     badcode = values.barCode;
        //     isfalse = true;
        //   }
        // }
        if (isfalse) {
          message.error("条形码：" + badcode + "已存在");
        }
        let imgs = values.imgs;
        values.MainImage = imgs[0].url;
        if (imgs.length > 1) {
          let arr = [];
          imgs.forEach((i, index) => {
            if (index > 0) {
              arr.push(i.url);
            }
          })
          values.SubImages = arr.join('|');
        }

        values.categoryId = values.categoryId[values.categoryId.length - 1];

        values.pcDetail = this.state.editorState.toHTML();
        if (values.isMore === 1) {
          values.isMore = false;
        } else {
          values.isMore = true;
        }

        var reg = /^[0-9]\d*$/;
        if(values.barCode!=null&&values.barCode!=undefined&&values.barCode!=""){
          if (!reg.test(values.barCode)){
            message.error("条形码必须是纯数字")
            isfalse = true;
          }
        }
        


        let skuCode = [];
        specData.map(item => {
          skuCode.push(item.SkuCode)

        });
        let ns = skuCode.sort();
        for (var i = 0; i < ns.length; i++) {
          if (ns[i] == "") {

            message.error("sku编码不能为空")
            isfalse = true;
           // return;
          }
          if (ns[i] == ns[i + 1]) {
            message.error("有sku的编码重复")
            isfalse = true;
           // return;
          }
        }
        if (values.pcDetail == "<p></p>") {

          message.error("请输入详情")
          isfalse = true;
         // return;
        }

        if (values.isMore && specData.length == 0) {
          message.error("多规格商品请添加sku");
          isfalse = true;
         // return;
        }
        // values.channel=values.channel.toString()==""?'0':values.channel.toString();
        // values.channels=values.channels.toString()==""?'0':values.channels.toString();
        
        specData.forEach(j => {
          j.skuid = j.id
        })


        json = {
          ProductDetail: values,
          SkuList: specData,
          SpecList: specList,
          AttributeList: AttributeList
        };

        

        //console.log(json);
        // return;
        if (!isfalse) {
          if (!this.state.id) {
            // 直接调用request
            request('g1/crm.product.master.add', {
              method: 'POST',
              body: json,
            }).then(response => {
              if (response) {
                message.success("录入成功");
                router.push("/goods/manage/goodslist");
              }else{
                this.setState({ loading: false });
              }
            }).catch(() => {
              this.setState({ loading: false });
            });
          } else {
            // 直接调用request
            json.ProductDetail.id = this.state.id;

            request('g1/crm.product.master.update', {
              method: 'POST',
              body: json,
            }).then(response => {
              if (response) {
                message.success("编辑成功");
                router.push("/goods/manage/goodslist");
              }else{
                this.setState({ loading: false });
              }
            }).catch(() => {
              this.setState({ loading: false });
            });
          }

        }else{
          this.setState({ loading: false });
        }
        
      }else{
        this.setState({ loading: false });
      }
    });
  };

  // 获取类目树形结构
  getCategoryList = () => {
    const queryData = {};
    this.props.dispatch({
      type: 'createGoodsModel/ProductCategoryTreeListModel',
      payload: queryData,
      callback: (response) => {
        if (response) {
          this.setState({
            optionsData: response,
          });
        }
      }
    });
  };

  uploadImgs = (fileList) => {
    if (this.state.imgs.length > 0) {
      this.setState({ imgs: fileList });
    }
    return fileList;
  }

  specUploadImgs = (fileList, fildName, row) => {
    let { specData } = this.state;

    if (row.key === undefined) {
      return;
    }
    let spec = specData.find(i => i.key === row.key);

    spec[fildName] = fileList.length > 0 ? fileList[0].url : '';

    this.setState({ specData: [...specData] });
  }

  getAttr = (AttributeList) => {
    this.setState({ AttributeList: [...AttributeList] })
  }

  getAttribute = (Attribute) => {
    // this.setState({ AttributeList: [...AttributeList] })
    // console.log(Attribute);
    return Attribute;
  }

  // componentWillMount = () => {
  // 获取规格组合
  // const specList = [
  //   { name: '颜色', values: ["红色", "黄色", "绿色", "紫色"] },
  //   { name: '尺码', values: ["S", "M", "X", "XL"] },
  //   { name: '产地', values: ["常州", "苏州"] }
  // ]
  // let specData = [];
  // let specGroup = this.getSpecGroup(specList);

  // if (specGroup.length === 1 && specGroup[0] instanceof Array) {
  //   specGroup[0].forEach((i) => {
  //     let spec = { imgUrl: '', weight: 0, volume: 0, barCode: '' };
  //     i.forEach((j, index) => { spec[specList[index].name] = j; })
  //     specData.push(spec);
  //   })
  // } else {
  //   specGroup.forEach(i => {
  //     let spec = { imgUrl: '', weight: 0, volume: 0, barCode: '' }
  //     spec[specList[0].name] = i;
  //     specData.push(spec);
  //   })
  // }
  // console.log(specData)
  // this.setState({specList,specData})
  // }

  getSpec1 = (spec) => {
    let { specList } = this.state;

    const flag = specList.findIndex(i => i.name === spec.name) < 0;
    if (flag) {
      specList.push(spec);
      this.setState({ specList: specList }, () => { this.getSpec() })
      message.success('新增成功');
    } else {
      message.error("已经增加了相同的规格");
      return;
    }

  }


  getSpec = () => {
    let { specList, specData } = this.state;
    let specData1 = [];
    const specGroup = this.getSpecGroup(specList);
    if (specGroup.length === 1 && specGroup[0] instanceof Array) {
      specGroup[0].forEach((i, index) => {

        let spec = { key: Math.random(), Images: '', Weight: 0, Volume: 0, SkuCode: '', Specs: [], Combin: '' };
        let specsList = [];

        i.forEach((j, index) => {
          spec[specList[index].name] = j;
          specsList.push({ Name: specList[index].name, Value: j });

        });
        spec.Specs = specsList;

        let cc = Array.from(specsList, j => j.Value).join(',');
        spec.Combin = cc;
        let fir = specData.find(item => item.Combin == cc);
        if (fir) {
          spec.Images = fir.Images;
          spec.Weight = fir.Weight;
          spec.Volume = fir.Volume;
          spec.SkuCode = fir.SkuCode;
          spec.ProBroarcode=fir.ProBroarcode
        }
        specData1.push(spec);
      })
    } else {
      // specGroup.forEach((i, index) => {
      //   let fir = specData.find(item => 1 === 1);
       
      // })
      // if(specData.length==0){
        specGroup.forEach((i, index) => {
          let fir = specData.find(item => 1 === 1);
          let spec = { key: Math.random(), Images: fir ? fir.Images : '', Weight: fir ? fir.Weight : 0, Volume: fir ? fir.Volume : 0, SkuCode:  '', Specs: [{ Name: specList[0].name, Value: i }] }
          spec[specList[0].name] = i;
          specData1.push(spec);
        })
      // }
      // specData.forEach(fir => {
      //   var bo = false;
      //   specGroup.forEach((i, index) => {
      //     if(fir[specList[0].name] == i){
      //       bo = true;
      //     }
      //   })
      //   if(bo){
      //    // let spec = { key: Math.random(), Images: fir ? fir.Images : '', Weight: fir ? fir.Weight : 0, Volume: fir ? fir.Volume : 0, SkuCode: fir ? fir.SkuCode : '',ProBroarcode:fir?fir.ProBroarcode:'', Specs: [{ Name: specList[0].name, Value: i }] };
      //     specData1.push(fir);
      //   }
      // });

    }

    // imgUrl,weight，volume，barCode
    this.setState({ specList: [...specList], specData: [...specData1] });
  }

  // 获取规格组合
  getSpecGroup = (arr) => {
    if (arr.length == 0) {
      return [];
    }
    if (arr[0].hasOwnProperty("values")) {
      arr = arr.map((item) => {
        return item = item.values
      })
    }
    if (arr.length === 1) {
      return arr[0];
    }
    let arrySon = [];
    arr[0].forEach((item, index) => {
      arr[1].forEach((item1, index1) => {
        arrySon.push([].concat(arr[0][index], arr[1][index1]));
      })
    })
    arr[0] = arrySon;
    // 删除第二项
    arr.splice(1, 1);

    if (arr.length === 1) {
      return arr;
    }
    // 递归
    return this.getSpecGroup(arr);

  }

  getHtml = (html) => {
    return html;
  }

  uploadFn = param => {
    //console.log(param)
    if (
      !(
        param.file.type == 'image/png' ||
        param.file.type == 'image/jpg' ||
        param.file.type == 'image/jpeg' ||
        param.file.type == 'image/bmp' ||
        param.file.type == 'image/gif'
      )
    ) {
      confirm({
        title: '信息',
        content: '请传图片，正确格式png，jpg，jpeg，gif，bmp',
        okText: '确认',
        cancelText: '取消',
        zIndex: 9999999,
        onOk() { },
        onCancel() { },
      });

      //message.error('图片格式不正确');
      return;
    }
    if (param.file.size > 10 * 1024 * 1024) {
      confirm({
        title: '信息',
        content: '请传小于10M的图片',
        okText: '确认',
        cancelText: '取消',
        zIndex: 9999999,
        onOk() { },
        onCancel() { },
      });
      return;
    }


    const formData = new FormData();

    formData.append('file', param.file);


    request('/FileUpload/UploadPublicFile', {
      method: 'POST',
      body: formData,
    })
      .then(response => {


        if (response.result) {
          param.success({
            url: response.result,
            meta: {
              id: '', // upLoadObject && upLoadObject.id,
              title: '', // upLoadObject && upLoadObject.fileName,
              alt: '', // upLoadObject && upLoadObject.fileName,
              loop: false, // 指定音视频是否循环播放
              autoPlay: false, // 指定音视频是否自动播放
              controls: false, // 指定音视频是否显示控制栏
              poster: '', // 指定视频播放器的封面
            },
          });
        }
        else {
          message.error("上传图片失败，请重新登录。")
        }
      })

  };


  batchShow = (type) => {
    let isweight = true;
    if (type !== 1) {
      isweight = false;
    }

    this.setState({ isweight, visible: true })
  }


  batchChange = (value) => {
    this.setState({ batchValue: value });
  }

  batchCancel = () => {
    this.setState({ visible: false, batchValue: 0 });
  }

  batchOk = () => {
    let { specData, isweight, batchValue } = this.state;
    specData.forEach(i => {
      if (isweight) {
        i.Weight = batchValue;
      } else {
        i.Volume = batchValue;
      }
    });
    this.setState({ specData: [...specData], visible: false, batchValue: 0 });
  }


  addShuxingVal = () => {

    let fatherSpec = this.state.fatherSpec;

    let spec = JSON.parse(JSON.stringify(this.state.specList));
    let newSpec = this.state.newSpec;
    let a = '';
    if (fatherSpec && newSpec) {
      spec.map((item, i) => {
        if (item.name == fatherSpec) {
          if (item.values.findIndex(i => i == newSpec) > -1) {
            a = "请不要添加相同规格值";
          }
          item.values.push(newSpec);
        }

      });
      if (a) {
        message.error(a);
        return;
      }
      this.setState({ specList: spec, fatherSpec: '', newSpec: '', specvisible: false }, () => { this.getSpec() });
    }
    if (!newSpec) {
      message.error("请输入添加的规格值")
    }
  }

  delShuxingVal = (a, b, c) => {

    let spec = JSON.parse(JSON.stringify(this.state.specList));
    if (c == 0)//单个删除
    {
      spec.map(item => {
        if (item.name == a) {
          let bu = item.values.filter(item2 => item2 != b);
          item.values = bu;
        }
      });
      let aaaa = spec.filter(item => item.values.length > 0)
      this.setState({
        specList: aaaa
      }, () => { this.getSpec() });
    }
    if (c == 1)//整个删除
    {


      this.setState({ specList: spec.filter(item => item.name != a) }, () => { this.getSpec() });
    }
  }
  barcodeChange =(text)=>{
    var reg = /^[0-9]\d*$/;
    if (  text != "" &&!reg.test(text)) {
      message.error("条形码必须是整数字符");
      return;
    }
  }
  
  render() {
    const that = this;
    const { guigeValue, editorState, tabIndex, specList, specData, spuCode,loading } = this.state;
    const options = this.state.optionsData;

    const { form: { getFieldDecorator } } = this.props;
    const formbtnLayout = {
      labelCol: {
        xl: { span: 6 }
      },
      wrapperCol: {
        xl: { span: 18 }
      },
    }

    // 规格列
    let specCloumns = [];

    specList.forEach(i => {
      specCloumns.push({
        title: i.name,
        dataIndex: i.name,
        width: 100,
        // render: (text) => (
        //   <Input value={text} style={{ width: 100 }} />
        // )
      });
    });

    return (
      <PageHeaderWrapper
      title={<span><a onClick={() => { router.push({ pathname: '/goods/manage/goodslist' }) }}>商品管理</a>-{this.state.id ? '编辑商品' : '创建商品'}</span>}>
        <Categories
          ref={ref => {
            that.categoriesOverLay = ref;
          }}
          dataEdit={that.state.dataEdit}
        />
        <SpecificationOverlay
          ref={ref => {
            that.specificationOverLay = ref;
          }}
          dataEdit={that.state.dataEdit}
          speData={that.state.specList}
          onChange={this.getSpec1}
        />
        <div className={styles.createBox}>
          <Affix offsetTop={0}>
            <div className={styles.createSteps}>
              <Steps progressDot current={tabIndex}>
                <Step title="商品信息" />
                <Step title="规格信息" />
                <Step title="商品描述" />
              </Steps>
            </div>
          </Affix>
          <div className={styles.formItem} id="tab1H">
            <div className={styles.formItemTit}>商品信息</div>
            <Form {...formbtnLayout}>
              <Form.Item label="商品名称" colon={false}>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入商品名称' }],
                })(
                  <Input maxLength={60} allowClear placeholder="请输入" style={{ width: 400 }} />
                )}
              </Form.Item>
              <Form.Item label="商品编码" colon={false}>
                {getFieldDecorator('spuCode', {
                  rules: [{ required: true, message: '请输入商品编码' }],
                })(
                  <Input maxLength={30} allowClear placeholder="请输入" style={{ width: 400 }} />
                )}
                &nbsp;&nbsp; <Tooltip title="商品编码将用于系统商品与外部商品的关联"><Icon type="question-circle" style={{ fontSize: "18px" }} /></Tooltip>
              </Form.Item>
              <Form.Item label="商品分类" colon={false}>
                {getFieldDecorator('categoryId', {
                  rules: [{ required: true, message: '请输入商品分类' }],
                })(
                  <Cascader options={options}
                    placeholder="请选择"
                    style={{ width: 400 }}
                  />
                )}
                &nbsp;&nbsp;<a onClick={this.getCategoryList}>刷新</a>&nbsp;&nbsp;
                <Link target="_blank" to="/goods/manage/classify">新建</Link>
                {/* <a   onClick={() => router.push({ pathname: `/goods/manage/classify`})}>新建</a> */}
              </Form.Item>
              <Form.Item label="计量单位" colon={false}>
                {getFieldDecorator('module', {
                  rules: [{ required: true, message: '请选择计量单位' }],
                })(
                  <Select placeholder="请选择" style={{ width: 400 }}>
                    <Option value="个">个</Option>
                    <Option value="件">件</Option>
                    <Option value="瓶">瓶</Option>
                    <Option value="盒">盒</Option>
                    <Option value="双">双</Option>
                    <Option value="箱">箱</Option>
                    <Option value="组">组</Option>
                    <Option value="套">套</Option>
                    <Option value="打">打</Option>
                    {/* <Option value="5">无需审核</Option> */}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="商品属性" colon={false}>
                {getFieldDecorator('attribute', {
                  rules: [{ required: false, message: '请输入商品属性' }],
                })(
                  <ProductAttribute getAttr={this.getAttr} onChange={this.getAttribute} data={this.state.shuxingList} sel={this.state.selectShuXing} />
                )}
              </Form.Item>
              <Form.Item label="商品主图" colon={false}>
                {getFieldDecorator('imgs', {
                  rules: [{ required: true, message: '请输入商品主图' }],
                })(
                  <UploadImg imgs={this.state.imgs} onChange={this.uploadImgs} imgCount={10} />
                )}
                <div>建议尺寸：800*800px，单张大小不超过2M，最多可上传10张</div>
              </Form.Item>
              {/* <Form.Item label="销售渠道" colon={false}>
                {getFieldDecorator('channel', {
                  initialValue:this.state.check
                })(
                  <CheckboxGroup style={{ marginTop: 4 }}>
                  <Checkbox value={1}>线上渠道</Checkbox>
              </CheckboxGroup>
                )}
                 {getFieldDecorator('channels', {
                  initialValue:this.state.checks
                })(
                  <CheckboxGroup style={{ marginTop: 4 }}>
                  <Checkbox value={1}>线下渠道</Checkbox>
              </CheckboxGroup>
                )}
              </Form.Item> */}
            </Form>
          </div>
          <div className={styles.formItem} id="tab2H">
            <div className={styles.formItemTit}>规格信息</div>
            <Form {...formbtnLayout}>
              <Form.Item label="规格" colon={false}>
                {getFieldDecorator('isMore', {
                  rules: [{ required: true, message: '请选择规格' }],
                  initialValue: this.state.guigeValue
                })(
                  <Radio.Group onChange={this.onChange}>
                    <Radio value={1}>统一规格</Radio>
                    <Radio value={2}>多规格</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              {/* 统一规格 */}
              {guigeValue === 1 ? (

                <Form.Item label="重量" colon={false}>
                  <div>
                    {getFieldDecorator('weight', {
                      rules: [{ required: false, message: '请输入重量' }],
                      initialValue: 0
                    })(
                      <InputNumber max={9999999} min={0} allowClear style={{ width: 200 }} />
                    )}
                    &nbsp;&nbsp;&nbsp; kg</div>
                </Form.Item>) : ''}
              {guigeValue === 1 ? (

                <Form.Item label="体积" colon={false}>
                  <div>
                    {getFieldDecorator('volume', {
                      rules: [{ required: false, message: '请输入体积' }],
                      initialValue: 0
                    })(
                      <InputNumber max={999999} min={0} allowClear style={{ width: 200 }} />
                    )}
                    &nbsp;&nbsp;&nbsp; m³</div>
                </Form.Item>) : ''}
              {guigeValue === 1 ? (

                <Form.Item label="条形码" colon={false}>
                  <div>
                    {getFieldDecorator('barCode', {
                      rules: [{ required: false, message: '请输入条形码' }],
                      initialValue: null
                    })(

                      <Input  maxLength={30}  allowClear onBlur={(e) => {
                        if (e.target.value !== '') {
                          // this.onBlurChange(spuCode, e.target.value);
                        }
                        
                      }} 
                      onChange={(e) =>

                        this.barcodeChange(e.target.value)
                      }
                      style={{ width: 400 }} />
                    )}
                    &nbsp;&nbsp;&nbsp; </div>
                </Form.Item>) : ''}
                {guigeValue === 1 ? (
                <Form.Item label="建议售价" colon={false}>
                  <div>
                    {getFieldDecorator('price', {
                      rules: [{ required: false, message: '请输入建议售价' }],
                      initialValue: 0
                    })(
                      <InputNumber max={9999999} min={0} precision={2} allowClear style={{ width: 200 }} />
                    )}
                    &nbsp;&nbsp;&nbsp; 元</div>
                </Form.Item>) : ''}
              {/* 多规格 */}
              {
                guigeValue === 2 ? specList.map(item => {
                  return (
                    <Form.Item label={item.name} colon={false}>
                      {getFieldDecorator('guige1', {
                        rules: [{ required: false, message: '请选择规格' }],
                      })(
                        <div>
                          {
                            item.values.map(items => {
                              return (<Tag key={items} closable onClose={() => { this.delShuxingVal(item.name, items, 0) }}>{items}</Tag>)
                            })
                          }
                          {item.values.length > 0 ? <Icon type="delete" onClick={() => this.delShuxingVal(item.name, '', 1)} /> : ""}
                        </div>

                      )}
                      <Button type="primary" size={"small"} onClick={() => { this.setState({ specvisible: true, fatherSpec: item.name }) }}>新增规格值</Button>
                    </Form.Item>
                  )
                }) : ''
              }


              {guigeValue === 2 ? (<div className={styles.duoguige}>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      that.setState({ dataEdit: {} }, () => {
                        that.specificationOverLay.getWrappedInstance().show();
                      })
                    }}
                  >新增规格</Button>
                </div>
                <div style={{ margin: "10px 0" }}>
                  批量修改: <a onClick={() => { this.batchShow(1) }}>重量</a>&nbsp;&nbsp;<a onClick={() => { this.batchShow(2) }}>体积</a>


                </div>
                <Table
                  columns={[...this.imgColumns, ...specCloumns, ...this.publicColumns]} scroll={{ x: 2200 }} dataSource={specData} pagination={false}
                />
              </div>) : ''}
            </Form>
          </div>
          <div className={styles.formItem} style={{ borderBottom: "1px solid #e6e6ed", marginBottom: "16px" }}>
            <div className={styles.formItemTit}>商品描述</div>
            <Form {...formbtnLayout}>
              <Form.Item colon={false}>
                {getFieldDecorator('pcDetail', {
                  rules: [{ required: true, message: '请输入详情' }]
                })(
                  <BraftEditor
                    controls={[
                      'undo',
                      'redo',
                      'separator',
                      'font-size',
                      'line-height',
                      'letter-spacing',
                      'separator',
                      'text-color',
                      'bold',
                      'italic',
                      'underline',
                      'strike-through',
                      'separator',
                      'superscript',
                      'subscript',
                      'remove-styles',
                      'emoji',
                      'separator',
                      'text-indent',
                      'text-align',
                      'separator',
                      'headings',
                      'list-ul',
                      'list-ol',
                      'blockquote',
                      'code',
                      'separator',
                      'separator',
                      'hr',
                      'separator',
                      'media',
                      'separator',
                      'clear',
                    ]}
                    //value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                    media={{ uploadFn: this.uploadFn }}
                  />
                )}
              </Form.Item>
            </Form>

          </div>
          <Modal
            title="批量修改"
            visible={this.state.visible}
            onOk={this.batchOk}
            onCancel={this.batchCancel}
          >
            <div>
              <InputNumber style={{ width: 400 }} min={0} max={999999} onChange={this.batchChange} value={this.state.batchValue} />&nbsp;&nbsp;&nbsp;{this.state.isweight ? "kg" : "m³"}
            </div>
          </Modal>
          <Modal
            title="新增规格值"
            visible={this.state.specvisible}
            onOk={this.addShuxingVal}
            onCancel={() => { this.setState({ specvisible: false, newSpec: '', fatherSpec: '' }) }}
          >
            <Input style={{ width: 400 }} maxLength={10} onChange={e => this.setState({ newSpec: e.target.value })} value={this.state.newSpec} />
          </Modal>
          <div className={styles.footer}>
            <Button
              type="primary"
              loading={this.state.loading}
              onClick={this.handleSubmit}
            >保存</Button>
          </div>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default index;


// 上传文件
class UploadImg extends PureComponent {
  state = {
    fileList: [],
    imgCount: 1
  }

  componentWillMount() {
    this.setState({ imgCount: this.props.imgCount });
  }

  static getDerivedStateFromProps(nextProps) {
    const { imgs, imgCount } = nextProps;
    if (imgs && imgs.length > 0) {
      return {
        fileList: imgs,
        imgCount: imgCount
      };
    }
    return {
      imgCount: imgCount
    };
  }

  handleChange = (file) => {

    if (file.file.size < 2 * 1024 * 1024 && file.file.type.indexOf('image') >= 0) {
      const formData = new FormData();
      const { fileList } = this.state;
      // 上传文件

      formData.append('file', file.file.originFileObj);

      request('/FileUpload/UploadPublicFile', {
        method: 'POST',
        body: formData,
      })
        .then(response => {

          if (response && response.result) {
            const f = { uid: response.id, name: response.result, url: response.result };
            fileList.push(f);
            this.setState({ fileList: [...fileList] });
            this.props.onChange([...fileList]);
          } else {
            message.error("上传图片失败，请重新登录。")
          }
        })
    }
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  remove = (file) => {

    const index = this.state.fileList.indexOf(file);
    const newFileList = this.state.fileList.slice();
    newFileList.splice(index, 1);
    this.setState({
      fileList: [...newFileList]

    });
    this.props.onChange([...newFileList]);
  }

  // 判断图片大小
  beforeUpload = (file) => {
    const isJpgOrPng = file.type.indexOf('image') >= 0;
    if (!isJpgOrPng) {
      message.error('只能上传图片!');
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('单张照片大小不能超过2MB!');
      return false;
    }
    return true;
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传主图</div>
      </div>
    );

    const { fileList } = this.state;

    return (
      <span className={styles.newUpLoadBox}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          //onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          onRemove={this.remove}
          accept='image/*'
        >
          {fileList.length >= this.state.imgCount ? null : uploadButton}
        </Upload>
      </span>
    )
  }
}