import { Icon, Input, Card,Button,Select, Form, DatePicker, InputNumber,message } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import {GET,POST,PUT,DELETE} from '../../../utils/http';
import api from '../../../utils/api';
import carCityType from '../../../utils/carCityType'
import {carType} from '../../../utils/carType'
import axios from '../../../utils/httpsConf';
const { Option } = Select;
const formItemLabelCol = {
    labelCol: {

        style: {
            width: '120px'
        }

    },
}
const dateFormat = 'YYYY/MM/DD';
class car_create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            car_create: {
                register: new Date(),
                car_number: '',
                tel: '',
                vip_type: '',
                last_time: '',
                car_type: 'C',
                real_name:'',
                money: '',
                remarks: '',
                city:'冀B',
                count: 0,
                user_id:45
            },
            permission_list:sessionStorage.getItem('permission').split(',') || [],
        }

    }
    setRegister = (e, value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { register: value })})
    }
    setCarNumber = (e) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { car_number: e.target.value })})
    }
    setTel = (e) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { tel: e.target.value })})
    }
    setVipType = (e) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { vip_type: e.target.value })})
    }
    setCarType = (value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { car_type: value })})
    }
    setSurplus = (value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { surplus: value })})
    }
    setCount = (value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { count: value })})
    }
    setMoney = (value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { money: value })})
    }
    setRemarks = (e) => {       
        this.setState({car_create:Object.assign({}, this.state.car_create, { remarks: e.target.value })})
    }
    setCarCity = (value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { city: value })})
    }
    setRealName =(e) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { real_name: e.target.value })})
    }
    createCar = async () => {
        let data = this.state.car_create
        data.register = new Date(data.register).toUTCString()
        axios.post(api.carCreate,this.state.car_create).then((res) => {
            if(res.data.code == 0) {
                message.success('提交成功！',1.5).then( ()=> {
                    this.props.history.push('/car/list')
                })
            } else {
                message.error(res.data.message,1.5)
            }
            
        })
    }
    goBack = () => {
        this.props.history.push('/car/list')
    }
    render() {
        return (
            <div className="g-body">
                <Card hoverable className="g-card">
                    <div className="g-card-head">
                        <Icon type="file-text" />
                    </div>
                    <div className="g-h-40"></div>
                    <Form {...formItemLabelCol} layout="inline">
                        <Form.Item label="注册时间">
                            <DatePicker className="g-input g-text-left" defaultValue={moment(new Date(), dateFormat)} onChange={this.setRegister} />
                        </Form.Item>
                        <Form.Item label="车牌号">
                        <Select className="g-city" showSearch value={this.state.car_create.city}  onChange={this.setCarCity.bind(this)} > 
        {carCityType.map((item,index) => <Option key={index} value={item.name}>{item.name}</Option>)}
                            </Select>
                            <Input className="g-input g-text-left g-city-input" value={this.state.car_create.car_number} onInput={this.setCarNumber.bind(this)} />
                        </Form.Item>
                        <Form.Item label="联系方式">
                            <Input className="g-input g-text-left" onInput={this.setTel.bind(this)} />
                        </Form.Item>
                        <Form.Item label="姓名">
                            <Input className="g-input g-text-left" onInput={this.setRealName.bind(this)} />
                        </Form.Item>
                        <br />
                        <Form.Item label="车辆类型">
                        <Select  className="g-select" value={this.state.car_create.car_type} onChange={this.setCarType.bind(this)}>
                                {carType.map( (item) => <Option key={item.value} value={item.value}>{item.name}</Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item label="可用次数">
                            <InputNumber className="g-input g-text-left" onChange={this.setCount.bind(this)} />
                        </Form.Item>
                        <Form.Item label="收款金额">
                            <InputNumber
                                className="g-input g-text-left"
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={this.setMoney.bind(this)}
                            />
                        </Form.Item>
                        <Form.Item label="备注">
                            <Input className="g-input g-text-left" onInput={this.setRemarks.bind(this)} />
                        </Form.Item>
                    </Form>
                    <div className="g-ctrl">
                    <Button  onClick={this.goBack}>返回</Button>
                    {this.state.permission_list.includes('1002') ? <Button className="g-submit" type="primary" onClick={this.createCar}>保存</Button> : '' }
                    </div>
                </Card>
            </div>
        )
    }
}
export default car_create;
