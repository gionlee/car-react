import { Icon, Input, Button, Card, Table, Modal, InputNumber,Form ,message} from 'antd';
import React, { Component } from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api';
// import axios from 'axios';
class staff_list extends Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            delete_visible: false,
            loading:true,
            pagination: {
                current:1,
                pageSize:10,
            },
            staff_list:[],
            word:'',  
            visible:false,
            staff_info:{},
            new_password:'',
            my_level:sessionStorage.getItem('role_level') || 999
        }
    }
    componentWillMount () {
        this.getList()
    }
    getList = ()=> {
        axios({
            url:api.staffList,
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
                console.log(list)
                const pager = { ...this.state.pagination };
                pager.total = res.data.total
                this.setState ({
                    staff_list:list,
                    loading: false,
                    pagination:pager
                })
            }
            
        }).catch( (err) => {
            console.log(err)
        })
    }
    toDetails = (e,record) => {

        sessionStorage.setItem('staff_login_name',record.login_name)
        sessionStorage.setItem('staff_real_name',record.real_name)
        sessionStorage.setItem('staff_role_id',record.role_id)
        sessionStorage.setItem('staff_id',record.id)
        this.props.history.push('details/'+record.id);
    }
    createStaff = (record) => {
        this.props.history.push('create');
    }
    editStaff = (e,record) => {
        sessionStorage.setItem('staff_login_name',record.login_name)
        sessionStorage.setItem('staff_real_name',record.real_name)
        sessionStorage.setItem('staff_role_id',record.role_id)
        sessionStorage.setItem('staff_id',record.id)
        this.props.history.push('edit');
        e.stopPropagation()
    }
    editPawword = (e,record) => {
        console.log(record)
        this.setState({
            visible: true,
            staff_info:record
        })
        e.stopPropagation()
    }
    deleteStaff = (e,record) => {
        console.log(record)
        this.setState({
            role_id:record.role_id,
            delete_visible: true
        })
        e.stopPropagation()
        
    }
    deleteHandleOk =(id)=> {
        this.setState({
            loading:true
        })
        axios.post(api.deleteRole,{id:this.state.role_id}).then( (res) => {
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
    cancelEditPassword = () => {
        this.setState({
            visible:false
        })
    }
    saveEditPassword =() => {
        axios.post(api.staffPassword,{id:this.state.staff_info.id,new_password:this.state.new_password}).then((res) => {
            if(res.data.code == 0) {
                message.success(res.data.message,1.5,()=> {
                    this.getList()
                })
            }
        }).catch((err) => {
            
        });
    }
    setEditNewPassword =(e) => {
        this.setState({
            new_password:e.target.value
        })
    }
    render() {
        const columns = [{
                title:'账号',
                dataIndex:'login_name',
                key:'login_name',
                align:'left'
            },
            {
                title: '姓名',
                dataIndex: 'real_name',
                key: 'real_name',
                align: 'center',
            },
            {
                title: '职位',
                dataIndex: 'role_name',
                key: 'role_name',
                align: 'center',
                render:(text,record) => (
                <div>{text.toString()}</div>
                )
            },
            {
                title: '操作',
                key: 'ctrl',
                dataIndex: 'ctrl',
                align: 'center',
                render: (text, record) => (
                    record.role_level > this.state.my_level ? (<span>                        
                        <Button type="link"  onClick={(e) => this.editStaff(e,record)} className="g-btn-edit" >编辑</Button>
                        <Button type="link"  onClick={(e) => this.editPawword(e,record)} className="g-btn-edit" >修改密码</Button>
                        <Button type="link" onClick={(e)=> this.deleteRole(e,record)} className="g-btn-del" >删除</Button>
                    </span>) : ''
                    
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
                        <Button
                            type="primary"
                            icon="plus"
                            loading={this.state.iconLoading}
                            onClick={this.createStaff}
                        >
                            &nbsp;&nbsp;新增
                        </Button>
                        <div className="g-text-right g-m-20"></div>    
                    </div>
                    <div className="g-h-40"></div>
                    <Table loading={this.state.loading} 
                        onRow={(record) => {
                            return {
                                onClick: event => { record.role_level > this.state.my_level ? this.toDetails(event,record): console.log('无权限！') },
                            }
                        }}
                        pagination={this.state.pagination}
                        onChange={this.setPageIndex.bind(this)}
                        columns={columns} dataSource={this.state.staff_list} rowKey="id" />
                </Card>
                <Modal
                    title="提示"
                    visible={this.state.delete_visible}
                    onOk={this.deleteHandleOk}
                    onCancel={this.deleteHandleCancel}
                    maskClosable={false}
                    keyboard={false}
                    okText="确定"
                    cancelText="取消"
                    >
                    <p>确认删除？</p>
                </Modal>
                <Modal
                    title="修改密码"
                    visible={this.state.visible}
                    cancelText="取消"
                    okText="提交"
                    onCancel={this.cancelEditPassword.bind(this)}
                    maskClosable={false}
                    onOk={this.saveEditPassword.bind(this)}
                    >
                        <Form
                            name="basic"
                        >
                            <Form.Item
                                label="账号"
                                name="logion_name"
                            >
                                <Input  value={this.state.staff_info.login_name} readOnly />
                            </Form.Item>
                            <Form.Item
                                label="新密码"
                                name="password"
                                rules={[{ required: true, message: '请输入新密码!' }]}
                            >
                                <Input.Password onInput={this.setEditNewPassword.bind(this)} value={this.state.new_password} />
                            </Form.Item>
                        </Form>
                    </Modal>
            </div>
        );
    }
}
export default staff_list;