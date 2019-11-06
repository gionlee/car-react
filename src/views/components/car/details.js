import { Icon, Input, Card, Form, Table } from 'antd';
import React, { Component } from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api';
const columns = [
    {
        title: '时间',
        dataIndex: 'wash_time',
        key: 'wash_time',
        align: 'center',
        width: 400
    },{
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        align: 'center',
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
        let id = this.props.match.params.id
        axios.get(api.carDetails+ '?id='+id).then( (res) => {
            if(res.data.code == 0) {
                let list = res.data.list;
                list.map( (val,index) => {
                    val.wash_time = new Date(val.wash_time).format('yyyy-MM-dd hh:mm:ss')
                })
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
                        <Form.Item label="车牌号">
                            <Input className="g-input g-text-left" value={this.state.car_details.car_number} readOnly />
                        </Form.Item>
                        <Form.Item label="联系方式">
                            <Input className="g-input g-text-left" value={this.state.car_details.phone} readOnly />
                        </Form.Item>
                        <br />
                        <Form.Item label="上次洗车时间">
                            <Input className="g-input g-text-left" value={new Date(this.state.car_details.last_time).format('yyyy-MM-dd hh:mm:ss')} readOnly />
                        </Form.Item>
                        <Form.Item label="车辆类型">
                            <Input className="g-input g-text-left" value={this.state.car_details.car_type} readOnly />
                        </Form.Item>
                        <Form.Item label="剩余次数">
                            <Input className="g-input g-text-left" value={this.state.car_details.count} readOnly />
                        </Form.Item>
                    </Form>

                </Card>
                <div className="g-h-40"></div>
                <Card hoverable className="g-card">
                    <div className="g-title g-text-left">操作记录</div>
                    <Table rowKey="id" columns={columns} dataSource={this.state.wast_list} />
                </Card>
            </div>
        )
    }
}
export default car_details;
