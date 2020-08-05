import React, { PureComponent, Fragment } from 'react';
import { Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DMOverLay } from '@/components/DMComponents';
import UpDateGoods from './UpDateGoodsOverlay';
class SelectGoods extends PureComponent {

  // constructor(props) {
  //   super(props);
  //   this.show = this.show.bind(this);
  // }

  // show = () => {
  //   this.updateGoodsModal.show();
  // };

  render() {
    return (
      <Fragment>
        <DMOverLay
          ref={ref => {
            this.updateGoodsModal = ref;
          }}
          title="更新商品信息"
          width={500}
        >
          <UpDateGoods />
        </DMOverLay>
        <PageHeaderWrapper title='更新商品信息'>
          <Button
            style={{ width: 225 }}
            type="dashed"
            onClick={() => this.updateGoodsModal.show()}
          >
            更新商品信息
          </Button>
        </PageHeaderWrapper>
      </Fragment>
    )
  }
}

export default SelectGoods;