import React, { PureComponent, Fragment } from 'react';
import { Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { DMOverLay, DMSelectGoods } from '@/components/DMComponents';
class SelectGoods extends PureComponent {

  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
  }

  show = () => {
    this.selectGoodsModal.show();
  };

  render() {
    return (
      <Fragment>
        <DMOverLay
          ref={ref => {
            this.selectGoodsModal = ref;
          }}
          title="选择宝贝"
          width={1000}
        >
          <DMSelectGoods />

        </DMOverLay>
        <PageHeaderWrapper title='选择商品'>
          <Button
            style={{ width: 225 }}
            type="dashed"
            onClick={() => this.selectGoodsModal.show()}
          >
             选择商品
          </Button>
        </PageHeaderWrapper>
      </Fragment>
    )
  }
}

export default SelectGoods;