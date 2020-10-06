import { Icon, Input, Button, Card, Table, Modal, InputNumber,Form ,message} from 'antd';
import React, { Component } from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api';
import {getCarType} from '../../../utils/carType'
class car_list extends Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            visible: false,
            bubb: true,
            count: 0,
            surplus: '',
            remarks: '洗车',
            car_id: 0,
            new_surplus: '',
            delete_visible: false,
            loading:true,
            pagination: {
                current:1,
                pageSize:10,
            },
            permission_list:sessionStorage.getItem('permission').split(',') || [],
            word:'',  
        }
    }
    componentWillMount () {
        this.getList()
    }
    getList = ()=> {
        axios({
            url:api.carList,
            method:'get',
            params:{
                word:this.state.word,
                page_size: this.state.pagination.pageSize,
                page_index: this.state.pagination.current -1,
                user_id :sessionStorage.getItem('user_id')
            },
            withCredeRtials: true
        }).then( (res) => {
            if(res.data.result) {
                let list = res.data.data
                const pager = { ...this.state.pagination };
                pager.total = res.data.total
                list.map( val => {
                    val.create_time = new Date(val.create_time).format('yyyy-MM-dd hh:mm:ss')
                    val.last_time = new Date(val.last_time).format('yyyy-MM-dd hh:mm:ss')
                })
                this.setState ({
                    carlist:list,
                    loading: false,
                    pagination:pager
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
            car_id:record.id,
            delete_visible: true
        })
        e.stopPropagation()
        
    }
    washCar = (e,record) => {
        e.stopPropagation()
        this.setState({
            visible: true,
            count:Number(record.count),
            surplus:Number(record.surplus),
            car_id:record.id
        })  
    }
    showTips = () => {
        this.setState({
            visible: true
        })
    }
    setSurplus = (value) => {
        this.setState({new_surplus:value,surplus:this.state.count - value})
    }
    handleOk = () => {
        let data = {id:this.state.car_id,count:this.state.new_surplus,surplus:this.state.surplus,remarks:this.state.remarks}
        axios({
            url:'/car/wash',
            method:'post',
            data :data,
            withCredeRtials: true
        }).then( (res) => {
            if(res.data.result) {
                message.success(res.data.message,1.5).then( ()=> {
                    this.setState({
                        visible: false
                    })
                    this.getList()
                })
            } else {
                message.error(res.data.message,1.5).then( ()=> {
                })
            }
            
        }).catch( (err) => {
            alert(err)
        })
        
        
    }
    deleteHandleOk =(id)=> {
        axios.post(api.carDelete,{id:this.state.car_id}).then( (res) => {
            if(res.data.code == '0') {
                this.setState({delete_visible:false})
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
            delete_visible:false,
        })
    }
    
    handleCancel = () => {
        this.setState({
            visible:false,
            new_surplus: 1,
            remarks: '洗车'
        })
    }
    setremarks = (e) => {
        this.setState({remarks:e.target.value})
    }
    setWords = (e) => {
        this.setState({word:e.target.value})
    }
    setPageIndex = async (pagination)=> {
        const pager = { ...this.state.pagination };             
        pager.current = pagination.current;
        await this.setState({
            pagination: pager,
        });
        this.getList()
    }
    render() {
        const columns = [
            {
                title: '注册日期',
                dataIndex: 'create_time',
                key: 'create_time',
                align: 'center',
                render:(text) => (
                <div>{text.split(' ')[0]}</div>
                )
            },
            {
                title: '车牌号码',
                dataIndex: 'car_number',
                key: 'car_number',
                align: 'center',
                render: (text,record)=> (
                    <div>{record.city + record.car_number}</div>
                    )
            },
            {
                title: '车辆类型',
                key: 'car_type',
                dataIndex: 'car_type',
                align: 'center',
                render:(text,record) => (
                <div>{getCarType(text)}</div>
                    )
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
                        { this.state.permission_list.includes('1003') ? <Button type="link"  onClick={(e) => this.editCar(e,record)} className="g-btn-edit" >编辑</Button> : '' }
                        { this.state.permission_list.includes('1004') ? <Button type="link" onClick={(e)=> this.deleteCar(e,record)} className="g-btn-del" >删除</Button> : '' }
                        
                        
                    </span>
                ),
            }
        ];
        return (
            <div className="g-body">
                <Card hoverable className="g-card">
                    <div className="g-card-head">
                        <Icon type="profile" />
                    </div>
                    <div className="g-text-right">
                        <div className="g-inline-block g-pdr-100">
                        <Input className="g-input" placeholder="Basic usage" onInput={this.setWords.bind(this)} /><Button className="g-search" shape="circle" icon="search" onClick={this.getList.bind(this)} />
                        </div>
                        { this.state.permission_list.includes('1002') ? <Button
                            type="primary"
                            icon="plus"
                            loading={this.state.iconLoading}
                            onClick={this.createCar}
                        >
                            &nbsp;&nbsp;新增
                        </Button> : ''}
                        <div className="g-text-right g-m-20"></div>    
                    </div>
                    
                    <Table loading={this.state.loading} 
                        onRow={(record) => {
                            return {
                                onClick: event => { this.toDetails(event,record) },
                            }
                        }}
                        pagination={this.state.pagination}
                        onChange={this.setPageIndex.bind(this)}
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
                        <InputNumber value={this.state.new_surplus} min={0} max={this.state.count}  onChange={this.setSurplus.bind(this)} className="g-input"  />
                        </Form.Item>
                        <Form.Item label="剩余洗车次数">
                        {this.state.count - this.state.new_surplus}
                        </Form.Item>
                        <Form.Item label="备注">
                        <Input value={this.state.remarks}  onInput={this.setremarks.bind(this)} className="g-input"  />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="提示"
                    visible={this.state.delete_visible}
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