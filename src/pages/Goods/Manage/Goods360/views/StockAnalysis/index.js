
import React, { Component } from 'react';
import { Row, Col, Progress, Tag, Pagination } from 'antd';
import styles from './index.less';
import { Item } from 'gg-editor';
import requests from '@/utils/request';

class StockAnalysis extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSourse:[],
      friDataSourse:[],
      secDataSourse:[],
      thrDataSourse:[],

      friDataSourse1:[],
      secDataSourse1:[],
      thrDataSourse1:[],
      offlineNum:0,//线下
      onlineNum:0,
      }
  }

  ShowTag = (type) => {
    return (
      <>
        {type === '淘宝' ? <Tag color="#FF7D00">{type}</Tag> : ''}
        {type === '天猫' ? <Tag color="#FF0036">{type}</Tag> : ''}
        {type === '微盟' ? <Tag color="#00ABDC">{type}</Tag> : ''}
        {type === '有赞' ? <Tag color="#EC0000">{type}</Tag> : ''}
        {type === '京东' ? <Tag color="#FF3333">{type}</Tag> : ''}
      </>
    )
  }

  componentDidMount(){
   
    this.init();
  }

  //获取全渠道库存分布

  init =()=>{
    var queryData ={
      Id:this.props.GoodId,
      ChannelId:"",
      ShopId:"",
      Day:"",
    } 
    requests('g1/crm.analysis.product.getstockanalysis',{
      method:'POST',
      body:queryData,
    }).then(response=>{
        if(response){
          this.setState({
            onlineNum:response.totalCount,
            offlineNum:response.amtOfStoreStock
          });
            if(response.sourceList){
              let fri =[];
              let sec =[];
              let thr = [];
              response.sourceList.forEach((element,index) => {
                if(index%3==0){
                fri.push(element);
                }
                if(index%3==1){
                  sec.push(element);
                }
                if(index%3==2){
                  thr.push(element);
                }
              });
              this.setState({
                friDataSourse:fri,
                secDataSourse:sec,
                thrDataSourse:thr,
              });
            }
            if(response.storeList){
              let fri =[];
              let sec =[];
              let thr = [];
              response.storeList.forEach((element,index) => {
                if(index%3==0){
                fri.push(element);
                }
                if(index%3==1){
                  sec.push(element);
                }
                if(index%3==2){
                  thr.push(element);
                }
              });
              this.setState({
                friDataSourse1:fri,
                secDataSourse1:sec,
                thrDataSourse1:thr,
              });
            } 
       }
    })

   
  }


  //线下门店库存分布

  render() {
    const me = this;
    return (
      <div className={styles.StockAnalysis}>
        <div className={styles.bgWhite}>
          <div className='Mb-basewidth'><b>全渠道库存分布</b></div>
            <Row className={styles.wrapper} gutter={8} type='flex' align='middle'>
            <Col>当前库存总数</Col>
            <Col className={styles.font20}>{me.state.onlineNum}</Col>
            </Row>

            <Row type='flex' justify='space-between' className='Pl-basewidth2 Pr-basewidth2' style={{ color: '#686B78' }}>
            <Col span={6}>
          {
            this.state.friDataSourse.map((item,i)=>{
              return(
                <div className='Mb-basewidth2'>
                <Row type='flex' gutter={8} align='middle' justify='space-between'>
                  <Col>
                    <Row type='flex' align='middle'>
                      <Col>{this.ShowTag(item.sourceName)}</Col>
                      <Col>{item.shopName}</Col>
                    </Row>
                  </Col>
                  <Col>{item.stock}</Col>
                </Row>
                <Progress status="active" percent={this.state.onlineNum == 0?0: (item.stock/this.state.onlineNum*100).toFixed(2)}  />
                </div>
              )
            })
          }
          </Col>
          <Col span={6}>
          {
            this.state.secDataSourse.map((item,i)=>{
              return(
                <div className='Mb-basewidth2'>
                <Row type='flex' gutter={8} align='middle' justify='space-between'>
                  <Col>
                    <Row type='flex' align='middle'>
                      <Col>{this.ShowTag(item.sourceName)}</Col>
                      <Col>{item.shopName}</Col>
                    </Row>
                  </Col>
                  <Col>{item.stock}</Col>
                </Row>
                <Progress status="active" percent={this.state.onlineNum == 0?0: (item.stock/this.state.onlineNum*100).toFixed(2)} />
                </div>
              )
             })
          }
          </Col>
          <Col span={6}>
          {
            this.state.thrDataSourse.map((item,i)=>{
              return(
                <div className='Mb-basewidth2'>
                <Row type='flex' gutter={8} align='middle' justify='space-between'>
                  <Col>
                    <Row type='flex' align='middle'>
                      <Col>{this.ShowTag(item.sourceName)}</Col>
                      <Col>{item.shopName}</Col>
                    </Row>
                  </Col>
                  <Col>{item.stock}</Col>
                </Row>
                <Progress status="active" percent={this.state.onlineNum == 0?0: (item.stock/this.state.onlineNum*100).toFixed(2)} />
                </div>
              )
            })
          }
          </Col>
         </Row> 
        </div>
        <div className={styles.bgWhite}>
          <div className='Mb-basewidth'><b>线下门店库存分布</b></div>
          <Row className={styles.wrapper} gutter={8} type='flex' align='middle'>
            <Col>线下库存总数</Col>
            <Col className={styles.font20}>{me.state.offlineNum}</Col>
          </Row>
          <Row type='flex' justify='space-between' className='Pl-basewidth2 Pr-basewidth2' style={{ color: '#686B78' }}>
            <Col span={6}>
          {
            this.state.friDataSourse1.map((item,i)=>{
              return(
                <div className='Mb-basewidth2'>
                <Row type='flex' gutter={8} align='middle' justify='space-between'>
                  <Col>
                    <Row type='flex' align='middle'>
                      <Col>{this.ShowTag(item.sourceName)}</Col>
                      <Col>{item.shopName}</Col>
                    </Row>
                  </Col>
                  <Col>{item.stock}</Col>
                </Row>
                <Progress status="active" percent={this.state.offlineNum == 0?0: (item.stock/this.state.offlineNum*100).toFixed(2)} />
                </div>
              )
            })
          }
          </Col>
          <Col span={6}>
          {
            this.state.secDataSourse1.map((item,i)=>{
              return(
                <div className='Mb-basewidth2'>
                <Row type='flex' gutter={8} align='middle' justify='space-between'>
                  <Col>
                    <Row type='flex' align='middle'>
                      <Col>{this.ShowTag(item.sourceName)}</Col>
                      <Col>{item.shopName}</Col>
                    </Row>
                  </Col>
                  <Col>{item.stock}</Col>
                </Row>
                <Progress status="active" percent={this.state.offlineNum == 0?0: (item.stock/this.state.offlineNum*100).toFixed(2)} />
                </div>
              )
             })
          }
          </Col>
          <Col span={6}>
          {
            this.state.thrDataSourse1.map((item,i)=>{
              return(
                <div className='Mb-basewidth2'>
                <Row type='flex' gutter={8} align='middle' justify='space-between'>
                  <Col>
                    <Row type='flex' align='middle'>
                      <Col>{this.ShowTag(item.sourceName)}</Col>
                      <Col>{item.shopName}</Col>
                    </Row>
                  </Col>
                  <Col>{item.stock}</Col>
                </Row>
                <Progress status="active" percent={this.state.offlineNum == 0?0: (item.stock/this.state.offlineNum*100).toFixed(2)} />
                </div>
              )
            })
          }
          </Col>
         </Row> 

        </div>
      </div>
    )
  }
}

export default StockAnalysis;