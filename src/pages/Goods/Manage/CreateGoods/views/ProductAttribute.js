import React, { PureComponent } from 'react';
import { Button, Select, message, Tooltip,Modal } from 'antd';
import AttributeOverlay from './AttributeOverlay';
import styles from './ProductAttribute.less';

const { Option } = Select;

class index extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			current: 1,
			dataEdit: {
				test: 111
			},
			sel1:[],
			sel:this.props.sel,
			attData: [],
			attData1:this.props.attData,
			Attribute:[],//this.props.selectData
            IsAdd:false
		};
	}

      // 为了防止父组件修改editData但是子组件不修改
  static getDerivedStateFromProps(nextProps, prevState) {
	  
    const { data,sel } = nextProps;
    if (JSON.stringify(data) !== JSON.stringify(prevState.attData1)) {
      if (!data) return null;
      return {
		attData1: data,
		sel: sel
      };
	}
    return null;
  }



	getFormData(params) {
		let { attData } = this.state;
		if (attData.findIndex(i => i.PropName === params.PropName) < 0) {
			attData.push(params);
		} else {
			message.error("已添加了相同的项");
			return;
		}

		this.setState({ attData: [...attData] }, () => {
			let attrArr = [];
			this.state.attData.forEach(i => {
				if (i.hasOwnProperty("PropValue")) {
					let attr = { AttributeKey: i.PropName, AttributeVal: i.PropValue.split(',') };
					attrArr.push(attr);
				}

			});
			this.props.getAttr(attrArr);
		});

		this.attributeOverLay.getWrappedInstance().hide();
	}

	addAttr = () => {
		this.setState({ dataEdit: {} }, () => {
			this.attributeOverLay.getWrappedInstance().show();
		})
	}

	delAttr = (PropName) => {
   let me=this;

		Modal.confirm({
			title: "是否确定删除?",
			cancelText: '取消',
			okText: '确定',
			onOk: () => {
				
				let { attData } = me.state;
				let a = attData.filter(i => i.PropName !== PropName);
				me.setState({ attData: a }, () => {
					 me.props.getAttr(me.state.attData); 
				});
			}
		  });



	

	}

	selectChange = (value, name) => {
		let { Attribute,sel1 } = this.state;
		const flag = Attribute.findIndex(i => i.Name === name) < 0;
		if (flag === true) {
			Attribute.push({ Name: name, Value: value });
		} else {
			Attribute = Attribute.filter(i => i.Name !== name);
			Attribute.push({ Name: name, Value: value });
		}
	   
		const flag1=sel1.findIndex(i=>i.Name=name)<0
		
		if(flag1===true)
		{
           sel1.push({ Name: name, Value: value });
		}
		else
		{
			sel1 = sel1.filter(i => i.Name !== name);
			sel1.push({ Name: name, Value: value });
		}

		this.setState({ Attribute: [...Attribute] ,sel1:[...sel1]}, () => {
			this.props.onChange(this.state.Attribute);
		})

	}

	render() {
		const that = this;
		const { attData,sel,attData1,IsAdd,sel1 } = that.state;
		let attrs='';
		if(!IsAdd && attData1.length>0 && attData.length==0)
		{
           this.setState({attData:attData1,IsAdd:true,sel1:sel})
          
		}
		
		if(attData.length>0){
		 attrs = attData.map(i => {
		   let sasa=sel1.length==0?"":sel1.filter(j=>i.PropName==j.Name).length==0?"":sel1.filter(j=>i.PropName==j.Name)[0].Value;
		
			return(
				<div className={styles.boxItem}>
					<span className={styles.attTit}><Tooltip title={i.PropName}>{i.PropName}</Tooltip></span>
					<Select value={sasa?sasa:i.PropValue.split(',')[0]}  key={i.PropName} style={{ width:'150px', margin: "0 5px" }} onChange={(value) => {
						that.selectChange(value, i.PropName);
					}}>
						{i.PropValue.split(',').map(j => {
							return <Option  key={j} placeholder="请选择" value={j}>{j}</Option>
						})}
					</Select>
					<a onClick={() => { this.delAttr(i.PropName) }}>删除</a>
				</div>
			)
		});
	}

		return (
			<div className={styles.box}>
				{attrs}
				<Button type="primary" onClick={this.addAttr}>+新增属性参数</Button>

				<AttributeOverlay
					ref={ref => {
						that.attributeOverLay = ref;
					}}
					dataEdit={that.state.dataEdit}
					formData={(params) => { this.getFormData(params) }}
				/>
			</div>
		)
	}
}

export default index;