
import React, { Component } from 'react';
import { Row, Col, Icon, Divider, Tabs } from 'antd';
//  import { connect } from 'dva';
//  import router from 'umi/router';
import styles from './index.less';
import request from '@/utils/request';

const { TabPane } = Tabs;

class GoodsInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datedetial: this.props.datedetial,
      current: 0,
      name: "",//  商品名称
      minPrice: "",
      maxPrice: "",
      price: "",
      totalcount: "",//  总库存 
      module: "",//  单位
      imglist: [],//  商品图片
      propslist: [],//  自定义属性
      goodfirst: [],//  商品详情第一组
      goodsecod: [],//  商品详情第二组
      propthird: [],//  商品详情第三组
      propfour: [],//  商品详情第四组
      pcDetail: '',//  富文本html
      isMore: false
    }
  }

  //  页面加载
  loadPage = (datedetial) => {
    let dataSorce = datedetial
    //  处理商品图片
    let imglist = [];
    if(dataSorce.productDetail.mainImage==""||dataSorce.productDetail.mainImage==null||dataSorce.productDetail.mainImage==undefined)
    {
      imglist.push("http://wevip.image.alimmdn.com/qqd/344-344.jpg");
    }
    else
    {
      imglist.push(dataSorce.productDetail.mainImage);
    }
   
    let subImages = dataSorce.productDetail.subImages === null ? [] : dataSorce.productDetail.subImages.split('|');
    for (let i = 0; i < subImages.length; i++) {
      imglist.push(subImages[i]);
    }
    //  自定义属性处理
    let propslist = [];
    if (dataSorce.productSpecList != null) {
      for (let j = 0; j < dataSorce.productSpecList.length; j++) {
        let sourcejj = [];
        for (let jj = 0; jj < dataSorce.productSpecList[j].values.length; jj++) {
          sourcejj.push(<Col><div className={`textOverflow ${styles.sizeBox}`}>{dataSorce.productSpecList[j].values[jj].specValue}</div></Col>);
        }
        propslist.push(<Row type='flex' gutter={24} className='Pl-basewidth Pr-basewidth Mb-basewidth3'>
          <Col className={styles.LH32}>{dataSorce.productSpecList[j].specName}</Col>
          <Col className={styles.leftSize}>
            <Row type='flex' gutter={8}>
              {sourcejj}
            </Row>
          </Col>
        </Row>);
      }
    }

    //  商品详情处理
    let index = 4;// 每4个一个循环
    let goodfirst = [];// 商品详情第一组
    let goodsecod = [];// 商品详情第二组
    let propthird = [];// 商品详情第三组
    let propfour = [];// 商品详情第四组
    if (dataSorce.productAttrList != null) {
      for (let ii = 1; ii < dataSorce.productAttrList.length + 1; ii++) {

        if (ii === 1 || ii % index === 1) {
          goodfirst.push(<div>{dataSorce.productAttrList[ii - 1].attributeKey}: {dataSorce.productAttrList[ii - 1].attributeVals[0].attributeValue}</div>);
        }
        else if (ii === 2 || ii % index === 2) {
          goodsecod.push(<div>{dataSorce.productAttrList[ii - 1].attributeKey}: {dataSorce.productAttrList[ii - 1].attributeVals[0].attributeValue}</div>);
        }
        else if (ii === 3 || ii % index === 3) {
          propthird.push(<div>{dataSorce.productAttrList[ii - 1].attributeKey}: {dataSorce.productAttrList[ii - 1].attributeVals[0].attributeValue}</div>);
        }
        else if (ii === 4 || ii % index === 0) {
          propfour.push(<div>{dataSorce.productAttrList[ii - 1].attributeKey}: {dataSorce.productAttrList[ii - 1].attributeVals[0].attributeValue}</div>);
        }
      }
    }


    this.setState({
      name: dataSorce.productDetail.name,
      minPrice: dataSorce.productDetail.minPrice === null ? 0 : dataSorce.productDetail.minPrice,
      maxPrice: dataSorce.productDetail.maxPrice === null ? 0 : dataSorce.productDetail.maxPrice,
      totalcount: dataSorce.productDetail.stock === null ? 0 : dataSorce.productDetail.stock,
      module: dataSorce.productDetail.module,
      imglist: imglist,
      propslist: propslist,
      goodfirst: goodfirst,
      goodsecod: goodsecod,
      propthird: propthird,
      propfour: propfour,
      price: dataSorce.productDetail.price == null ? 0 : dataSorce.productDetail.price,
      pcDetail: dataSorce.productDetail.pcDetail,
      isMore: dataSorce.productDetail.isMore
    })

  }

  componentWillMount() {
    let GoodId = this.props.GoodId;
    this.getGoodDetial(GoodId);
  }

  // 获取
  getGoodDetial = (GoodId) => {
    const queryParams = {
      id: GoodId
    };
    //  直接调用request
    request('g1/crm.product.masterdetail.list', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (response) {
          this.loadPage(response);
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }

  render() {
    return (
      <div className={styles.GoodsInfo}>
        <Row type='flex' gutter={32}>
          <Col>
            <img className={styles.mainImg} src={this.state.imglist[this.state.current]} alt='' />
            <Tabs style={{ width: 344 }} onChange={(activeKey) => { this.setState({ current: activeKey }) }}>
              {
                this.state.imglist.map((item, key) => (
                  <TabPane
                    key={key}
                    tab={
                      <div className={styles.P4}><img src={item} alt='' /></div>
                    }
                  />
                ))
              }
            </Tabs>
          </Col>
          <Col className={styles.LeftContanier}>
            <div className={styles.LH44}>{this.state.name}</div>
            <Row>
              <Col xxl={18} xl={20} sm={24}>
                <Row type='flex' align='middle' justify='space-between' className={styles.priceWrapper} style={{width:'100%'}}>
                  <Col>
                    <Row type='flex' align='middle' gutter={24}>
                      <Col>销售价　</Col>
                      {this.state.isMore == true ? <Col className={styles.priceColor}>&yen;<span>{this.state.minPrice}</span>~&yen;<span>{this.state.maxPrice}</span></Col> : <Col className={styles.priceColor}>&yen;<span>{this.state.price}</span></Col>}
                    </Row>
                  </Col>
                  <Col className={styles.unitColor}>
                    <Row type='flex' gutter={8} align='middle'>
                      <Col>单位  {this.state.module}</Col>
                      <Divider type="vertical" />
                      {/* <Col>库存  {this.state.totalcount}</Col> */}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            {this.state.propslist}

          </Col>
        </Row>
        <div>
          <div className={styles.parameterHeader}>商品详情</div>
          <Row className={styles.parameterCon} type='flex'>
            <Col>
              {this.state.goodfirst}
            </Col>
            <Col>
              {this.state.goodsecod}
            </Col>
            <Col>
              {this.state.propthird}
            </Col>
            <Col>
              {this.state.propfour}
            </Col>
          </Row>
        </div>
        <Divider />
        <div className={styles.w750}>
          <p dangerouslySetInnerHTML={{ __html: this.state.pcDetail }} />
        </div>
      </div>
    )
  }
}

export default GoodsInfo;


const ArrowStyles = {
  display: "block", color: "#E6E6ED", fontSize: 16,
  top: "20%"
}
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, ...ArrowStyles, left: "-15px" }}
      onClick={onClick}
    >
      <Icon type="left" />
    </div>
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, ...ArrowStyles, right: '-19px' }}
      onClick={onClick}
    >
      <Icon type="right" />
    </div>
  );
}