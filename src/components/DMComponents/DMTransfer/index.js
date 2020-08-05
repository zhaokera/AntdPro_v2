import React, { Component } from 'react';
import { Input, Modal,message } from 'antd';
import styles from './index.less';
const { Search } = Input;

class DMTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mockData: [],
            targetKeys: [],
            visible: this.props.visible,
            title: "",
            titles: "",
            search: "",
            searchy: "",
            valu: []
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    initSelect = () => {
        this.props.onCancle();
        this.setState({
            mockData: this.props.option,
        })
        this.getMock(this.props.option);
    }
    // 弹窗
    showModel = () => {
        this.setState({
            visible: true,
            valu: [],
            search: "",
            searchy: "",
            targetKeys: [],
            title: "",
            titles: "",
        });
        this.initSelect();
    };
    //确定
    handleOk = e => {
        var { valu } = this.state;
       
        console.log(e);
        
        if (this.state.search != "") {
            valu.push(this.state.search);
        }
        if (this.state.searchy != "") {
            valu.push(this.state.searchy);
        }
        if (valu.length < 1) {
            message.error("请先选择商品分类");
            return;
          }else{
            this.setState({
                visible: false,
            });
          }
        this.props.news.onChangeTreeSelect(valu);
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    // 穿梭框
    getMock = (mockDatay) => {
        var { mockData } = this.state;
        mockData.length = 0;
        for (let index = 0; index < mockDatay.length; index++) {
            const element = mockDatay[index];
            const data = {
                key: element.value,
                title: element.label,
                description: element.children,
                closen: this.state.checked
            };
            mockData.push(data);
        }
        this.setState({ mockData });
    }

    clickSome = (val, v2,span) => {
        
        this.setState({
            search: val,
            title: span,
            titles: ""
        })
        console.log(val);
        const { targetKeys, title } = this.state;
        targetKeys.length = 0;
        const mockDatay = this.props.option;
        for (let indexx = 0; indexx < mockDatay.length; indexx++) {
            const element = mockDatay[indexx];
            if (element.value == val) {
                this.setState({
                    title: element.label
                });
                for (let indexy = 0; indexy < element.children.length; indexy++) {
                    const elementy = element.children[indexy];
                    if (v2 != "" && elementy.label.indexOf(v2) != -1) {
                        const datay = {
                            key: elementy.value,
                            title: elementy.label,
                            description: elementy.label,
                        };
                        targetKeys.push(datay);
                    }
                    if (v2 == "") {
                        const data = {
                            key: elementy.value,
                            title: elementy.label,
                            description: elementy.label,
                        };
                        targetKeys.push(data);
                    }
                }
            }
            this.setState({ targetKeys});
        }
    };
    cancel = (val) => {
        this.setState({
            searchy: val.key,
            titles: val.title
        })
    }
    onSearch = (v1, v2) => {
        // 左边搜索
        if (v1 === 'left') {
            this.state.targetKeys.length = 0;
            var mock = [];
            const search = this.props.option;
            for (let i = 0; i < search.length; i++) {
                const element = search[i];
                if (element.label.indexOf(v2) != -1) {
                    const data = {
                        value: element.value,
                        label: element.label,
                        children: element.children,
                        closen: this.state.checked
                    };
                    mock.push(data);
                }
            }
            this.getMock(mock);
        }
        // 右边
        else {
            this.clickSome(this.state.search, v2,"");
        }
    }

    render() {
        const { mockData, targetKeys } = this.state;
        return (
            <Modal
                title="选择商品分类"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={700}
            >
                <p className={styles.modalTranTitle}>当前选择分类：&nbsp;&nbsp;<span>{this.state.title}</span><span>{this.state.titles.length > 0 ? ">" + this.state.titles : ""}</span></p>
                <div className={styles.tranWrap}>
                    {/* 左 */}
                    <div className={styles.tranLeft}>
                        <Search
                            placeholder="请输入"
                            onSearch={this.onSearch.bind(this, 'left')}
                        />
                        <div className={styles.line}></div>
                        <div className={styles.list}>
                            {
                                mockData.map(item => {
                                    return (
                                        <div className={styles.listone} style={ (item.key==this.state.search) ? { backgroundColor:'#9fb7fa'} : {} } onClick={this.clickSome.bind(this, item.key, "",item.title)}>{item.title}</div>
                                    )
                                })
                            }
                            <div></div>
                        </div>
                    </div>
                    {/* 右 */}
                    <div className={styles.tranRight}>
                        <Search
                            placeholder="请输入"
                            onSearch={this.onSearch.bind(this, 'right')}
                        />
                        <div className={styles.line}></div>
                        <div className={styles.list}>
                            {
                                targetKeys.map(item => {
                                    return (
                                        <div className={styles.listone} style={ (item.key==this.state.searchy) ? { backgroundColor:'#9fb7fa'} : {} } onClick={this.cancel.bind(this, item)} >{item.title}</div>
                                    )
                                })
                            }
                            <div></div>
                        </div>
                    </div>
                </div>

            </Modal>

        )
    }
}
export default DMTransfer;