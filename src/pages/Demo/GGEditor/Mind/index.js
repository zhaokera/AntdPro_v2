import React from 'react';
import { Row, Col } from 'antd';
import GGEditor, { Mind } from 'gg-editor';
import EditorMinimap from '../components/EditorMinimap';
import { MindContextMenu } from '../components/EditorContextMenu';
import { MindToolbar } from '../components/EditorToolbar';
import { MindDetailPanel } from '../components/EditorDetailPanel';
import data from '../mock/worldCup2018.json';
import styles from '../Flow/index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

GGEditor.setTrackable(false);

const MindPage = () => {
  return (
    <PageHeaderWrapper
      title="脑图编辑器"
      content="脑图是表达发散性思维的有效图形思维工具 ，它简单却又很有效，是一种实用性的思维工具。"
    >
      <GGEditor className={styles.editor}>
        <Row type="flex" className={styles.editorHd}>
          <Col span={24}>
            <MindToolbar />
          </Col>
        </Row>
        <Row type="flex" className={styles.editorBd}>
          <Col span={20} className={styles.editorContent}>
            <Mind data={data} className={styles.mind} />
          </Col>
          <Col span={4} className={styles.editorSidebar}>
            <MindDetailPanel />
            <EditorMinimap />
          </Col>
        </Row>
        <MindContextMenu />
      </GGEditor>
    </PageHeaderWrapper>
  );
};

export default MindPage;
