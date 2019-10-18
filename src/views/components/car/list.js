import { Icon, Input, Button, Card, Table, Modal, InputNumber,Form ,message} from 'antd';
import React, { Component } from 'react';
import axios from '../../../utils/https';
import api from '../../../utils/api';
// import axios from 'axios';
class car_list extends Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            visible: false,
            bubb: true,
            count: 0,
            surplus: '',
            remarks: '',
            carId: 0,
            newSurplus: '',
            deleteVisible: false,
            loading:true           
        }
    }
    componentWillMount () {
        this.getList()
    }
    getList = ()=> {
        axios.get(api.carList).then( (res) => {
            if(res.data.code == '0') {
                console.log(res)
                this.setState ({
                    carlist:res.data.data,
                    loading: false
                })
            }
            
        }).catch( (err) => {
            console.log(err)
        })
    }
    toDetails = (e,record) => {

            this.props.history.push('details/'+record.id);
    }
    createCar = (record) => {
        this.props.history.push('create');
    }
    editCar = (e,record) => {
        e.stopPropagation()
        this.props.history.push('edit/'+record.id);
    }
    deleteCar = (e,record) => {
        this.setState({
            carId:record.id,
            deleteVisible: true
        })
        e.stopPropagation()
        
    }
    washCar = (e,record) => {
        e.stopPropagation()
        this.setState({
            visible: true,
            count:Number(record.surplus),
            surplus:Number(record.surplus),
            carId:record.id
        })  
    }
    showTips = () => {
        this.setState({
            visible: true
        })
    }
    setSurplus = (value) => {
        this.setState({newSurplus:value,surplus:this.state.count - value})
    }
    handleOk = () => {
        axios.post(api.washCar,{id:this.state.carId,surplus:this.state.newSurplus,remarks:this.state.remarks}).then( (res) => {
            this.setState ({
                carlist:JSON.parse(res.data.data).carlist
            })
        }).catch( (err) => {
            console.log(err)
        })
        this.setState({visible:false})
        
    }
    deleteHandleOk =(id)=> {
        axios.post(api.deleteCar,{id:this.state.carId}).then( (res) => {
            if(res.data.code == '0') {
                this.setState({deleteVisible:false})
                message.success('删除成功！',1.5).then( ()=> {      
                    this.getList()
                })      
            }
        }).catch( (err) => {
            console.log(err)
        })
    }
    deleteHandleCancel = () => {
        this.setState({
            deleteVisible:false,
        })
    }
    
    handleCancel = () => {
        this.setState({
            visible:false,
            newSurplus: '',
            remarks: ''
        })
    }
    setremarks = (e) => {
        this.setState({remarks:e.target.value})
    }
    render() {
        const columns = [
            {
                title: '注册时间',
                dataIndex: 'register',
                key: 'register',
                align: 'center',
            },
            {
                title: '车牌号码',
                dataIndex: 'car_number',
                key: 'car_number',
                align: 'center',
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                key: 'tel',
                align: 'center',
            },
            {
                title: '会员类型',
                key: 'vip_type',
                dataIndex: 'vip_type',
                align: 'center',
            },
            {
                title: '上次洗车时间',
                key: 'last_time',
                dataIndex: 'last_time',
                align: 'center',
            },
            {
                title: '操作',
                key: 'ctrl',
                dataIndex: 'ctrl',
                align: 'center',
                render: (text, record) => (
                    <span>
                        <Button type="link"  onClick={(e) => this.washCar(e,record)} className="g-btn-edit" >洗车</Button>
                        <Button type="link"  onClick={(e) => this.editCar(e,record)} className="g-btn-edit" >编辑</Button>
                        <Button type="link" onClick={(e)=> this.deleteCar(e,record)} className="g-btn-del" >删除</Button>
                    </span>
                ),
            }
        ];
        return (
            <div className="g-body">
                <div className="g-h-40"></div>
                <Card hoverable className="g-card">
                    <div className="g-card-head">
                        <Icon type="profile" />
                    </div>
                    <div className="g-text-right">
                        <Button
                            type="primary"
                            icon="plus"
                            loading={this.state.iconLoading}
                            onClick={this.createCar}
                        >
                            &nbsp;&nbsp;新增
                        </Button></div>
                    <div className="g-text-right g-m-20"><Input className="g-input" placeholder="Basic usage" /><Button className="g-search" shape="circle" icon="search" /></div>
                    <div className="g-h-40"></div>
                    <Table loading={this.state.loading} onRow={(record) => {
                        return {
                            onClick: event => { this.toDetails(event,record) },
                        }
                    }}
                        columns={columns} dataSource={this.state.carlist} rowKey="id" />
                </Card>
                <Modal
                    title="提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    keyboard={false}
                    >
                    <Form>
                        <Form.Item label="耗费洗车次数">
                        <InputNumber value={this.state.newSurplus} min={0} max={this.state.count}  onChange={this.setSurplus.bind(this)} className="g-input"  />
                        </Form.Item>
                        <Form.Item label="剩余洗车次数">
                        {this.state.count - this.state.newSurplus}
                        </Form.Item>
                        <Form.Item label="备注">
                        <Input  onInput={this.setremarks.bind(this)} className="g-input"  />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="提示"
                    visible={this.state.deleteVisible}
                    onOk={this.deleteHandleOk}
                    onCancel={this.deleteHandleCancel}
                    maskClosable={false}
                    keyboard={false}
                    >
                    <p>是否确认删除？</p>
                </Modal>
            </div>
        );
    }
}
export default car_list;