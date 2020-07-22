import { Icon, Input, Card,Button, Form,Select, Spin,DatePicker, InputNumber,message } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api';
import carCityType from '../../../utils/carCityType'
import {carType} from '../../../utils/carType'
const { Option } = Select;
const formItemLabelCol = {
    labelCol: {

        style: {
            width: '120px'
        }

    },
}

const dateFormat = 'YYYY/MM/DD';
class car_edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            car_edit: {
                create_time: '',
                car_number: '',
                phone: '',
                real_name: '',
                last_time: '',
                car_type: 'C',
                money: '',
                remarks: '',
                count: '',
                city:'冀B'
            },

        }

    }
    componentWillMount () {
        let id = this.props.match.params.id
        axios.get(api.carDetails+ '?id='+id).then( (res) => {
            if(res.data.code == 0) {
                res.data.info.id = id
                this.setState({
                    car_edit: res.data.info,
                    loading:false
                })
            }
        })
    }
    setRegister = (date, dateString) => {
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { create_time: dateString })})
    }
    setCarNumber = (e) => {
        let value = e.target.value
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { car_number: value})})
    }
    setTel = (e) => {
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { phone: e.target.value })})
    }
    setVipType = (e) => {
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { vip_type: e.target.value })})
    }
    setCarcCity = (value) => {
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { city: value })})
    }
    setCarType = (value) => {
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { car_type: value })})
    }
    setSurplus = (value) => {
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { count: value })})
    }
    setMoney = (value) => {
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { money: value })})
    }
    setRemarks = (e) => {       
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { remarks: e.target.value })})
    }

    setRealName = (e) => {       
        this.setState({car_edit:Object.assign({}, this.state.car_edit, { real_name: e.target.value })})
    }
    
    editCar = () => {
        this.setState({
            loading:true
        })
        axios.post(api.editCar,this.state.car_edit).then( (res) => {
            if(res.data.code == 0) {
                
                message.success('提交成功！',1.5).then( ()=> {
                    this.props.history.push('/car/list')
                })
            } else {
                alert(res.data.msg);
            }
            
        }).catch( (err) => {
            console.log(err)
        })
        
    }
    goBack = () => {
        this.props.history.push('/car/list')
    }
    render() {
        return (
            <Spin size="large"  tip="Loading..." spinning={this.state.loading} >
            <div className="g-body">
                <Card hoverable className="g-card">
                    <div className="g-card-head">
                        <Icon type="file-text" />
                    </div>
                    <div className="g-h-40"></div>
                    <Form {...formItemLabelCol} layout="inline">
                        <Form.Item label="注册时间">
                            <Input className="g-input g-text-left" value={new Date(this.state.car_edit.create_time).format('yyyy-MM-dd hh:mm:ss')} readOnly/>
                        </Form.Item>
                        <Form.Item label="车牌号">
                            <Select className="g-city" showSearch value={this.state.car_edit.city}  onChange={this.setCarcCity.bind(this)} > 
        {carCityType.map((item,index) => <Option key={index} value={item.name}>{item.name}</Option>)}
                            </Select>
                            <Input className="g-input g-text-left g-city-input" value={this.state.car_edit.car_number} onInput={this.setCarNumber.bind(this)} />
                        </Form.Item>
                        <Form.Item label="联系方式">
                            <Input className="g-input g-text-left" value={this.state.car_edit.phone} onInput={this.setTel.bind(this)} />
                        </Form.Item>
                        <Form.Item label="车主姓名">
                            <Input className="g-input g-text-left" value={this.state.car_edit.real_name} onInput={this.setRealName.bind(this)} />
                        </Form.Item>
                        <br />
                        <Form.Item label="车辆类型">
                            <Select  className="g-select" value={this.state.car_edit.car_type} onChange={this.setCarType.bind(this)}>
                                {carType.map( (item) => <Option key={item.value} value={item.value}>{item.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item label="可用次数">
                            <InputNumber className="g-input g-text-left" value={this.state.car_edit.count} onChange={this.setSurplus.bind(this)} />
                        </Form.Item>
                        <Form.Item label="可用金额">
                            <InputNumber
                                 value={this.state.car_edit.money}
                                className="g-input g-text-left"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={this.setMoney.bind(this)}
                            />
                        </Form.Item>
                        <Form.Item label="备注">
                            <Input className="g-input g-text-left" value={this.state.car_edit.remarks} onInput={this.setRemarks.bind(this)} />
                        </Form.Item>
                    </Form>
                    <div className="g-ctrl">
                    <Button  onClick={this.goBack}>返回</Button>
                    <Button className="g-submit" type="primary" onClick={this.editCar}>保存</Button>
                    </div>
                </Card>
            </div>
            </Spin>
        )
    }
}
export default car_edit;
