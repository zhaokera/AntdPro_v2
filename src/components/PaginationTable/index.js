import React, { PureComponent } from 'react';
import { Table } from 'antd';


export default class PaginationTable extends PureComponent {

    selectedRowKeysOnChange = selectedRowKeys => {
        const me = this;
        me.props.selectedRowKeysOnChange(selectedRowKeys);
    }

    render() {
        const me = this;
        const { columns,
            dataSource,
            totalCount,
            currentPage,
            pageSize,
            loading,
            handleListPageGet,
            selectedRowKeys,
            expandedRowRender,
            footer,
            bordered,
        } = this.props;

        const rowSelection = (me.props.selectedRowKeysOnChange == undefined) ? null : {
            selectedRowKeys: selectedRowKeys == undefined ? [] : selectedRowKeys,
            onChange: me.selectedRowKeysOnChange,
        };
        return (
    
                <Table size='small'
                    {...me.props}
                    rowKey={r => r.id}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    footer={footer}
                    bordered={bordered}
                    pagination={{
                        size: "small",
                        total: totalCount,
                        showTotal: total => `共 ${total} 条记录`,
                        pageSize: pageSize,
                        defaultCurrent: 1,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        current: currentPage,
                        onChange: (page, pageSize) => handleListPageGet(page, pageSize),
                        pageSizeOptions: ['10', '20', '50', '100'],
                        onShowSizeChange: (page, pageSize) => handleListPageGet(page, pageSize),
                        style: { marginTop: '10px', float: 'right' }
                    }}
                />
        
        );
    }
}