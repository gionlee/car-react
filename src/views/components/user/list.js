import { Icon, Input, Button, Card, Table, Modal, InputNumber,Form ,message} from 'antd';
import React, { Component } from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api';
// import axios from 'axios';
class user_list extends Component {
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
            car_number:'',

            loading:true,
            pagination: {
                current:1,
                pageSize:10,
            },
            word:'',
            permission_list:sessionStorage.getItem('permission').split(',') || []  
        }
    }
    componentWillMount () {
        this.getList()
    }
    getList = ()=> {
        axios({
            url:api.userList,
            method:'get',
            params:{
                word:this.state.word,
                page_size: this.state.pagination.pageSize,
                page_index: this.state.pagination.current -1
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
    editUser = (e,record) => {
        e.stopPropagation()
        this.props.history.push('edit/'+record.id);
    }
    deleteUser = (e,record) => {
        this.setState({
            carId:record.id,
            deleteVisible: true
        })
        e.stopPropagation()
        
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
        let data = {id:this.state.carId,count:this.state.newSurplus,remarks:this.state.remarks}
        axios({
            url:'/car/wash',
            method:'post',
            data :data,
            withCredeRtials: true
        }).then( (res) => {
            if(res.data.result) {
                message.success(res.data.message,1.5).then( ()=> {
                    this.setState ({
                        carlist: res.data.data,
                        visible: false
                    })
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
        axios.post(api.deleteUser,{id:this.state.carId}).then( (res) => {
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
            newSurplus: 1,
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
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time',
                align: 'left',
            },
            {
                title: '姓名',
                dataIndex: 'real_name',
                key: 'real_name',
                align: 'center',
            },
            {
                title: '联系方式',
                dataIndex: 'phone',
                key: 'phone',
                align: 'center',
            },
            {
                title: '操作',
                key: 'ctrl',
                dataIndex: 'ctrl',
                align: 'center',
                render: (text, record) => (
                    <span>
                        {this.state.permission_list.includes('2003') ? <Button type="link"  onClick={(e) => this.editUser(e,record)} className="g-btn-edit" >编辑</Button> : ''}
                        
                        {this.state.permission_list.includes('2004') ? <Button type="link" onClick={(e)=> this.deleteUser(e,record)} className="g-btn-del" >删除</Button>: '' }
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
                    <div className="g-text-right g-m-20"><Input className="g-input" placeholder="Basic usage" onInput={this.setWords.bind(this)} /><Button className="g-search" shape="circle" icon="search" onClick={this.getList.bind(this)} /></div>
                    <div className="g-h-40"></div>
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
export default user_list;