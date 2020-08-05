import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, Pagination, Select, Spin } from 'antd';
import { DMOverLay } from '@/components/DMComponents';
import Ellipsis from '../../Ellipsis';
import selectImg from '../../../assets/activity/icon_selected_blue.png';
import styles from './index.less';
import request from '@/utils/request';
import { select } from 'd3-selection';

const { Option } = Select;
const InputGroup = Input.Group;

class ConditionElement extends Component {
  componentDidMount() {
    this.props.form.setFieldsValue({
      selectType: this.props.selectType === undefined ? 0 : this.props.selectType,
    });
  }

  restFormVals = () => {
    // this.props.form.resetFields();
    const { form } = this.props;
    form.setFieldsValue({ selectValue: '', selectType: 0 })
    this.setState({current:1,pageSize:10})
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label="宝贝名称/编码"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              colon={false}
            >
              <Form.Item className={styles.Mb0}>
                {getFieldDecorator('selectType', {
                  initialValue: this.props.selectType,
                })(
                  <Select style={{ display: 'none' }}>
                    <Option value={0}>请输入宝贝名称或编码</Option>

                  </Select>
                )}
              </Form.Item>
              {getFieldDecorator('selectValue', { initialValue: this.props.selectList })(
                <Input allowClear placeholder='请输入宝贝名称或编码' />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Row type="flex" gutter={8}>
                <Col>
                  <Button type="primary" onClick={() => this.props.requestCouponAdd(1, 10)}>
                    查询
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => this.restFormVals()}>重置</Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
const SelectForm = Form.create()(ConditionElement);

class SelectEntity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        list: [],
      },
      checkList: [], // 选中的图片
      selctvlaue: '',
      checked: {},
      opentype:"",
      loading: false,
      current:1,
      pageSize:10,
      cancheck:[]
    };
    this.show = this.show.bind(this);
  }

  // 设置props的默认值
  static defaultProps = {
    'singleMode': false,
    type: 'multiple', // 默认多选 ，单选：radio
  }

  componentDidMount() {
    var ty = this.props.opentype;
   
    this.requestCouponAdd(1, 10,ty);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { checked } = nextProps;
   // console.log("对比checked:", checked)
    if (checked !== prevState.checked) {
      //    debugger
      return {
        checked: checked
      };
    }
    return null;
  }

  // 弹窗显示
  show = () => {
    this.entityModal.show();
    const { type } = this.props;
    if(this.props.opentype=="all"){
        this.setState({opentype:"all"})
    }
    

    //     所有商品          编辑状态
    const { data: { list }, checked } = this.state;

    // 勾选的列表
    let { checkList } = this.state;

    // 所有改为不选择
    list.forEach((value) => {
      value.checked = false
    })

    if (checked && type === 'radio') {// 单选
      // 过滤数据，更改checked状态
      list.forEach((value, key) => {
        value.checked = false;
        if (value.id === checked.id) {
          value.checked = true;
          checkList = { ...value };
        }
      })
    } else if (checked && type === 'multiple') { // 多选
      // 过滤数据，更改checked状态
      list.forEach((value) => {
        checked.forEach((item) => {
          // value.checked = false;
          // console.log(item,value.id == item.id)
          if (value.id == item.id) {
            value.checked = true;
            checkList.push(value);
          }
        })
      })
    }
    this.setState({
      data: {
        list: list
      },
      checkList: checkList,
      cancheck:checked
    }, () => { console.log(this.state.checkList) })
    // }
  };

  // 获取实物商品列表
  requestCouponAdd = (currentPage, pageSize,type) => {
    const that = this;

    let SelectNameValue = null;
    let SelectCodeValue = null;
    let EntityPrice = null;

    if (that.selectForm) {
      that.selectForm.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.setState({ selectType: values.selectType, selctvlaue: values.selectValue });
        if (values.selectType === 0) {
          SelectNameValue = values.selectValue;
        }
        if (values.selectType === 1) {
          SelectCodeValue = values.selectValue;
        }
      });
    }

    this.setState({ loading: true });
    const queryData = {
      IsAward: true,
      CurrentPage: currentPage,
      Name: SelectNameValue,
      SpuCode: SelectCodeValue,
      PageSize: pageSize,
     // StockD: 1,
      //EntityPrice:entityPrice,

    };
    if(this.props.opentype=="all"){
       //type=all为获取所有商品
       queryData.IsAward=null;
    }
    if(type=="all"){
       //type=all为获取所有商品
      queryData.IsAward=null;
    }

    request('g1/crm.product.master.list', {
      method: 'POST',
      body: queryData,
    }).then(response => {
      if (response) {

        var cancheck  = this.state.cancheck;
        var ch = this.state.checkList;
        // let list2=response.data.filter(k=>{k.totalStock>0})
        let list2 = [];
        response.data.forEach(value => {
          cancheck.forEach(e => {
            if(e.id ==value.id){
              value.checked = true;
            }
          });
          //type=all为获取所有商品
          // if (value.totalStock != 0 || type=="all") {
            list2.push(value)
          // }
        })
        console.log(response.data, 'k', list2);
        //debugger

       

        this.setState({
          data: {
            list: list2
          },
          current:response.currentPage,
          pageSize:response.pageSize,
          total: response.totalCount,
          loading: false
        });
      }
    });
  };

  handleSelect = key => {
    const {
      data,
      data: { list },
    } = this.state;
    let checkList = this.props.type === 'radio' ? [] : [...this.state.checkList]
    if (this.props.singleMode && checkList.length !== 0) {
      list.forEach((value, index) => {
        list[index].checked = false;
      })
      checkList = [];

    }
    let isadd = true;

    const selectIndex = list.findIndex(item => item.id === key.id);
    if (this.props.type === 'radio') {
      list.forEach(item => item.checked = false);
      list[selectIndex].checked = true;
    } else {
      list[selectIndex].checked = !list[selectIndex].checked;
    }

    this.setState({
      data: {
        ...data,
        list: list,
      },
    });
    var checked = this.state.cancheck; 
    checked.forEach(value => {
      if (value.id === key.id) {
        isadd = false;
      }
    });
   
    if (isadd === true) {
      var query = {
        actprize: key.price,
        discount: 10,
        id: key.id,
        name: key.name,
        pic: key.mainImage,
        price: key.price,
        minPrice:key.minPrice,
        maxPrice:key.maxPrice,
        pricerange: key.skuList!=null? (key.skuList.length!=0? (key.minPrice==undefined?key.pricerange:key.minPrice + " ~ " + key.maxPrice):null):null,
        reduce: 0,
        skuId: key.skuId,
        skuList: key.skuList
      }
      var check = [...checked, query];
      this.setState({ checkList: [...checkList, key],cancheck:check });
    } else {
      this.setState({ checkList: checkList.filter(k => k.id !== key.id) ,cancheck: checked.filter(k => k.id !== key.id)});
    }
  };

  render() {
    const { width, handleOk } = this.props;
    const me = this;
    const {
      data: { list },
      total,
      checkList,
      selctvlaue,
      selectType,
    } = me.state;
    return (
      <DMOverLay
        ref={ref => (this.entityModal = ref)}
        title="选择商品"
        width={width}
        handleOk={() => {

          console.log("已选择的list:", this.state.cancheck)
          if (handleOk) handleOk(this.state.cancheck);
          this.setState({
            checkList: [],
            cancheck:[]
          })
          me.entityModal.hide();
        }}
      >
        <SelectForm
          wrappedComponentRef={ref => {
            me.selectForm = ref;
          }}
          requestCouponAdd={this.requestCouponAdd}
          selectList={selctvlaue}
          selectType={selectType}
        />
        <Spin spinning={this.state.loading}>
          <Row type="flex" gutter={24} className={`${styles.EntiyBox}`}>
            {list.map((item, index) => (
              <Col
                span={4}
                key={index}
                onClick={() => {
                  this.handleSelect(item);
                }}
              >
                <div
                  className={
                    item.checked ? `${styles.cell} ${styles.active}` : `Mb-basewidth2 ${styles.cell}`
                  }
                >
                  <div className={styles.picImg}><img className={styles.pic} src={item.mainImage} alt="" /></div>
                  <Row type="flex" justify="center" className={`Mt-basewidth ${styles.title}`}>
                    <Ellipsis length={17} tooltip lines={2}>
                      {item.name}
                    </Ellipsis>
                  </Row>
                  <Row type="flex" justify="space-between" align="middle" className={styles.font12}>
                    <div>
                      &yen;<span className={styles.txtWarning}>{item.price}</span>
                    </div>
                    <div className={styles.txtDefault}>库存 {item.totalStock}</div>
                  </Row>
                  <div className={styles.imgDiv}>
                    {item.checked ? (
                      <img alt="" style={{ width: 20, height: 20 }} src={selectImg} />
                    ) : null}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Spin>
        <Row type="flex" justify="end" align="middle">
          <Col>
            <Pagination
              showQuickJumper
              showSizeChanger
              current={parseInt(this.state.current)} 
              pageSize={parseInt(this.state.pageSize)} 
              total={total ? parseInt(total) : 0}
              showTotal={total => `共 ${total} 条记录`} 
              onChange={this.requestCouponAdd}
              onShowSizeChange={this.requestCouponAdd}
              size="small"
            />
          </Col>
        </Row>
      </DMOverLay>
    );
  }
}

export default SelectEntity;
