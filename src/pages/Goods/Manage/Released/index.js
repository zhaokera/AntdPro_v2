import React, { Component, PureComponent } from 'react';
import { Button, Card, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import router from "umi/router";
import styles from './index.less';


class Released extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title='商品发布'>
        <div className={styles.Released}>
          <div className={styles.bg}>
            <div className={styles.page_title_s}><b>录入商品</b></div>
            <div className={styles.title_hint}>手动录入单个商品，若您已接入线上渠道，录入后系统商品可自动与线上渠道商品进行关联</div>
            <Row type="flex" gutter={24}>
              <Col xxl={6} xl={9} lg={12}>
                <Card className={styles.card_item}>
                  <div><img src='http://wevip.image.alimmdn.com/qqd/Classify_pro.png' alt='' /></div>
                  <Button type="primary" className={styles.btn} onClick={()=>router.push("/goods/manage/create")}>点击录入商品</Button>
                </Card>
              </Col>
            </Row>
          </div>
          <div className={styles.bg}>
            <div className={styles.page_title_s}><b>Excel批量导入</b></div>
            <div className={styles.title_hint}>下载模板后按照模板要求填写商品信息，一次性将商品导入至系统，导入后系统将实时更新商品信息，完善系统商品</div>
            <Row type="flex" align='bottom' gutter={24}>
              <Col xxl={6} xl={9} lg={12}>
                <Card className={styles.card_item}>
                  <div><img src='http://wevip.image.alimmdn.com/qqd/Classify_excel.png' alt='' /></div>
                  <Button type="primary" className={styles.btn} onClick={()=>router.push("/goods/manage/excelleadin")}>EXCEL导入</Button>
                </Card>
              </Col>
              <Col><a href='https://duomaipublic.oss-cn-zhangjiakou.aliyuncs.com/public/excel%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.zip'>下载模板</a></Col>
            </Row>
          </div>
          <div className={styles.bg}>
            <div className={styles.page_title_s}><b>线上渠道商品导入</b></div>
            <div className={styles.title_hint}>根据操作步骤选择需要同步的商品渠道和商品，一键即可导入各大线上渠道的商品信息，导入后系统将实时更新商品信息，完善系统商品</div>
            <Row type="flex" gutter={24}>
              <Col xxl={6} xl={9} lg={12}>
                <Card className={styles.card_item}>
                  <div><img src='http://wevip.image.alimmdn.com/qqd/Classify_cloud.png' alt='' /></div>
                  <Button type="primary" className={styles.btn} onClick={()=>router.push("/goods/manage/goodsleadin")}>线上渠道商品导入</Button>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </PageHeaderWrapper>
    )
  }
}
export default Released;