import { Icon, Input, Card, Form, Table } from 'antd';
import React, { Component } from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api';
import {getCarType} from '../../../utils/carType'
const columns = [
    {
        title: '车牌号',
        dataIndex: 'car_number',
        key: 'car_number',
        render: (text,record)=> (
        <div>{record.city + record.car_number}</div>
        )
    },{
        title: '车辆类型',
        dataIndex: 'car_type',
        key: 'car_type',
        align: 'center',
        render: (text) => (
        <div>{getCarType(text)}</div>
        )
    }]
const formItemLabelCol = {
    labelCol: {

        style: {
            width: '120px'
        }

    },
}
class user_details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            car_details: {
                id: 1,
                create_time:'',
                car_number: '',
                tel: '',
                last_time: '',
                car_type: '',
                count: 0
            },
            wast_list:[]

        }

    }
    componentWillMount () {
        console.log(api.userDetails)
        let id = this.props.match.params.id
        axios.get(api.userDetails+ '?id='+id).then( (res) => {
            if(res.data.code == 0) {
                let list = res.data.list;
                this.setState({
                    car_details: res.data.info,
                    wast_list:list
                })
                
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
                            <Input className="g-input g-text-left" value={new Date(this.state.car_details.create_time).format('yyyy-MM-dd hh:mm:ss')} readOnly />
                        </Form.Item>
                        <Form.Item label="姓名">
                            <Input className="g-input g-text-left" value={this.state.car_details.real_name} readOnly />
                        </Form.Item>
                        <Form.Item label="登录用户名">
                            <Input className="g-input g-text-left" value={this.state.car_details.user_name} readOnly />
                        </Form.Item>
                        <br />
                        <Form.Item label="联系方式">
                            <Input className="g-input g-text-left" value={this.state.car_details.phone} readOnly />
                        </Form.Item>
                    </Form>

                </Card>
                <div className="g-h-40"></div>
                <Card hoverable className="g-card">
                    <div className="g-title g-text-left">车辆记录</div>
                    <Table rowKey="id" columns={columns} dataSource={this.state.wast_list} />
                </Card>
            </div>
        )
    }
}
export default user_details;
