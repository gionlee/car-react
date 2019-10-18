import { Icon, Input, Card,Button, Form, DatePicker, InputNumber,message } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import axios from '../../../utils/https';
import api from '../../../utils/api';
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
                car_type: '',
                money: '',
                remarks: '',
                surplus: 0
            }
        }

    }
    setRegister = (date, dateString) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { register: dateString })})
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
    setCarType = (e) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { car_type: e.target.value })})
    }
    setSurplus = (value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { surplus: value })})
    }
    setMoney = (value) => {
        this.setState({car_create:Object.assign({}, this.state.car_create, { money: value })})
    }
    setRemarks = (e) => {       
        this.setState({car_create:Object.assign({}, this.state.car_create, { remarks: e.target.value })})
    }
    createCar = () => {
        let data = this.state.car_create
        data.register = new Date(data.register)
        axios.post(api.createCar,this.state.car_create).then( (res) => {
            console.log(res)
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
                            <Input className="g-input g-text-left" onInput={this.setCarNumber.bind(this)} />
                        </Form.Item>
                        <Form.Item label="联系方式">
                            <Input className="g-input g-text-left" onInput={this.setTel.bind(this)} />
                        </Form.Item>
                        <Form.Item label="会员类型">
                            <Input className="g-input g-text-left" onInput={this.setVipType.bind(this)} />
                        </Form.Item>
                        <br />
                        <Form.Item label="车辆类型">
                            <Input className="g-input g-text-left" onInput={this.setCarType.bind(this)} />
                        </Form.Item>
                        <Form.Item label="可用次数">
                            <InputNumber className="g-input g-text-left" onChange={this.setSurplus.bind(this)} />
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
                    <Button className="g-submit" type="primary" onClick={this.createCar}>保存</Button>
                    </div>
                </Card>
            </div>
        )
    }
}
export default car_create;
