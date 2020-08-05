
import React, { Component } from 'react';
import { Tabs, Row, Col, Tag } from 'antd';
// import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GoodsInfo from './views/GoodsInfo';
import SalesAnalysis from './views/SalesAnalysis';
import ChannelAnalysis from './views/ChannelAnalysis';
import PriceAnalysis from './views/PriceAnalysis';
import CustomersAnalysis from './views/CustomersAnalysis';
import PurchaseAnalysis from './views/PurchaseAnalysis';
import ServiceAnalysis from './views/ServiceAnalysis';
import CommodityAnalysis from './views/CommodityAnalysis';
import StockAnalysis from './views/StockAnalysis';
import Knowledge from './views/Knowledge';
import styles from './index.less';
import request from '@/utils/request';
import ChannelDetail from '@/components/CommonModal/ChannelDetail';
import { DMOverLay } from '@/components/DMComponents';
import router from 'umi/router';
const { TabPane } = Tabs;

class Goods360 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateSorce:[], 
      GoodId:"",//商品id
      name:"",//名称
      img:"",//主图
      code:"",//编码
      catg:"",//分类
      minPrice:"",
      maxPrice:"",
      price:'',
      totalcount:"",//总库存
      zhiliang:"",//质量
      tiji:"",//体积
      current: '1',
      volumeInterval:"",
      weightInterVal:"",
      isMore:false,
      taglist: ['天猫', '京东', '淘宝'],
    }
  }

  handleChangeTabs = (activeKey) => {
    this.setState({
      current: activeKey
    })
  }
  componentWillMount()
  {
   let GoodId = this.getQueryString('GoodId');
    this.getGoodDetial(GoodId);
  }
  //获取
  getGoodDetial= (GoodId) => {
    const queryParams = {
      id: GoodId
    };
    // 直接调用request
    request('g1/crm.product.masterdetail.list', {
      method: 'POST',
      body: queryParams,
    })
      .then(response => {
        if (response) {
          let imglist='';
          if(response.productDetail.mainImage==""||response.productDetail.mainImage==null||response.productDetail.mainImage==undefined)
          {
            imglist="http://wevip.image.alimmdn.com/qqd/104-104.jpg";
          }
          else
          {
            imglist=response.productDetail.mainImage;
          }
          this.setState({
            dateSorce:response,
            img:imglist,
            name:response.productDetail.name,
            code:response.productDetail.spuCode,
            catg:response.productDetail.productBehindCategoryName,
            minPrice:response.productDetail.minPrice==null?0:response.productDetail.minPrice,
            maxPrice:response.productDetail.maxPrice==null?0:response.productDetail.maxPrice,
            price:response.productDetail.price==null?0:response.productDetail.price,
            totalcount:response.productDetail.stock==null?0:response.productDetail.stock,
            zhiliang:response.productDetail.weight==null?0:response.productDetail.weight,
            tiji:response.productDetail.volume==null?0:response.productDetail.volume,
            taglist:response.channelList,
            volumeInterval:response.productDetail.volumeInterval,
            weightInterVal:response.productDetail.weightInterVal,
            isMore:response.productDetail.isMore
          })
        }
      })
      .catch((response) => {
        console.log(response);
      });
  }

   //获取url参数
   getQueryString = name => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    return r != null ? unescape(r[2]) : '';
  };

  render() {
    const GoodId=this.getQueryString('GoodId');
    const { taglist } = this.state;
    return (
      <PageHeaderWrapper title={<span><a onClick={() => { router.push({ pathname: '/goods/manage/goodslist' }) }}>商品管理</a>-商品详情</span>}>
        <div className={styles.GoodsDetails} style={{ paddingBottom: 0 }}>
          <Row type='flex' gutter={16} className={styles.header}>
            <Col>
              <div className={styles.proImg}>
                <img src={this.state.img} alt='' />
              </div>
            </Col>
            <Col className={styles.proInfo}>
              <div className={styles.title}>{this.state.name}</div>
              <Row type='flex' gutter={16}>
                <Col>编码：{this.state.code}</Col>
                <Col>分类：{this.state.catg}</Col>
                {this.state.isMore==true?<Col>售价区间：¥{this.state.minPrice}-¥{this.state.maxPrice}</Col>:<Col>售价：¥{this.state.price}</Col>}  
                {/* <Col>总库存：{this.state.totalcount}</Col> */}
                <Col>重量：{this.state.isMore==true?this.state.weightInterVal:this.state.zhiliang}kg</Col>
                <Col>体积：{this.state.isMore==true?this.state.volumeInterval:this.state.tiji}m³</Col>
              </Row>
              <Row type='flex' gutter={8}>
                {
                  taglist.map((item, key) => {
                    return (
                      <Col key={key}>
                        {item === "淘宝" ? <Tag color="#FF7D00">淘宝</Tag> : ''}
                        {item === "天猫" ? <Tag color="#FF3333">天猫</Tag> : ''}
                        {item === "京东" ? <Tag color="#FF3333">京东</Tag> : ''}
                        {item === "苏宁易购" ? <Tag color="#FF7D00">苏宁易购</Tag> : ''}
                        {item === "有赞" ? <Tag color="#EC0000">有赞</Tag> : ''}
                        {item === "微盟" ? <Tag color="#00ABDC">微盟</Tag> : ''}
                      </Col>
                    )
                  })
                }
                <Col><a onClick={() =>this.selectGoodsModal.show()}>详情</a></Col>
              </Row>
            </Col>
          </Row>
          <DMOverLay
          ref={ref => {
            this.selectGoodsModal = ref;
          }}
          title="渠道详情"
          width={1000}
        >
          <ChannelDetail id={GoodId} code={this.state.code}/>
        </DMOverLay>
          <Tabs defaultActiveKey={this.state.current} onChange={(activeKey) => { this.handleChangeTabs(activeKey) }} activeKey={this.state.current}>
            <TabPane tab="商品档案" key="1" />
            <TabPane tab="销售分析" key="2" />
            <TabPane tab="渠道分析" key="3" />
            <TabPane tab="价格分析" key="4" />
            <TabPane tab="客群分析" key="5" />
            <TabPane tab="复购分析" key="6" />
            <TabPane tab="服务分析" key="7" />
            <TabPane tab="商品连带分析" key="8" />
            <TabPane tab="库存分析" key="9" />
            {/* <TabPane tab="知识库" key="10" /> 产品说 知识库没有数据来源*/}
          </Tabs>
        </div>

        {this.state.current === '1' ? <GoodsInfo GoodId={GoodId}  /> : ''}
        {this.state.current === '2' ? <SalesAnalysis GoodId={this.state.code} /> : ''}
        {this.state.current === '3' ? <ChannelAnalysis GoodId={this.state.code} /> : ''}
        {this.state.current === '4' ? <PriceAnalysis GoodId={this.state.code} /> : ''}
        {this.state.current === '5' ? <CustomersAnalysis GoodId={this.state.code} /> : ''}
        {this.state.current === '6' ? <PurchaseAnalysis GoodId={this.state.code} /> : ''}
        {this.state.current === '7' ? <ServiceAnalysis GoodId={this.state.code} /> : ''}
        {this.state.current === '8' ? <CommodityAnalysis GoodId={this.state.code} /> : ''}
        {this.state.current === '9' ? <StockAnalysis GoodId={GoodId} /> : ''}
        {/* {this.state.current === '10' ? <Knowledge GoodId={GoodId} /> : ''} */}
      </PageHeaderWrapper>
    )
  }
}

export default Goods360;