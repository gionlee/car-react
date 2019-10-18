import { Icon, Input, Card, Form, Table } from 'antd';
import React, { Component } from 'react';
import axios from '../../../utils/https';
import api from '../../../utils/api';
const columns = [
    {
        title: '时间',
        dataIndex: 'user_time',
        key: 'user_time',
        align: 'center',
        width: 400
    }, {
        title: '操作',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        width: 400
    }, {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        align: 'center',
    }]
const data = [{
    user_time: '20119-05-22',
    type: '办卡',
    remarks: '无'
}]
const formItemLabelCol = {
    labelCol: {

        style: {
            width: '120px'
        }

    },
}
class car_details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            car_details: {
                id: 1,
                register: '2019-3-22',
                car_number: '冀B 872R5',
                tel: '18833303737',
                vip_type: '标准',
                last_time: '2019-5-22',
                car_type: '傻屌开的车',
                surplus: 2
            }
        }

    }
    componentWillMount () {
        let id = this.props.match.params.id
        axios.get(api.carDetails+ '?id='+id).then( (res) => {
            if(res.data.code == 0) {
                this.setState({
                    car_details: res.data.data
                })
            }
        })
        axios.get(api.washList+ '?id='+id).then( (res) => {
            if(res.data.code == 0) {
                console.log(res)
            }
        })
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
                            <Input className="g-input g-text-left" value={this.state.car_details.register} readOnly />
                        </Form.Item>
                        <Form.Item label="车牌号">
                            <Input className="g-input g-text-left" value={this.state.car_details.car_number} readOnly />
                        </Form.Item>
                        <Form.Item label="联系方式">
                            <Input className="g-input g-text-left" value={this.state.car_details.tel} readOnly />
                        </Form.Item>
                        <Form.Item label="会员类型">
                            <Input className="g-input g-text-left" value={this.state.car_details.vip_type} readOnly />
                        </Form.Item>
                        <br />
                        <Form.Item label="上次洗车时间">
                            <Input className="g-input g-text-left" value={this.state.car_details.last_time} readOnly />
                        </Form.Item>
                        <Form.Item label="车辆类型">
                            <Input className="g-input g-text-left" value={this.state.car_details.car_type} readOnly />
                        </Form.Item>
                        <Form.Item label="剩余次数">
                            <Input className="g-input g-text-left" value={this.state.car_details.surplus} readOnly />
                        </Form.Item>
                    </Form>

                </Card>
                <div className="g-h-40"></div>
                <Card hoverable className="g-card">
                    <div className="g-title g-text-left">操作记录</div>
                    <Table columns={columns} dataSource={data} />
                </Card>
            </div>
        )
    }
}
export default car_details;
