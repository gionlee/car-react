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
            delete_visible: false,
            car_number:'',

            loading:true,
            pagination: {
                current:1,
                pageSize:10,
            },
            role_list:[],
            word:'',  
        }
    }
    componentWillMount () {
        this.getList()
    }
    getList = ()=> {
        axios({
            url:api.roleList,
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
                this.setState ({
                    role_list:list,
                    loading: false,
                    pagination:pager
                })
            }
            
        }).catch( (err) => {
            console.log(err)
        })
    }
    toDetails = (e,record) => {
            this.props.history.push('details/'+record.role_id);
    }
    createRole = (record) => {
        this.props.history.push('create');
    }
    editRole = (e,record) => {
        console.log(record)
        e.stopPropagation()

        this.props.history.push('edit/'+record.role_id);
    }
    deleteRole = (e,record) => {
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
    render() {
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'role_name',
                key: 'role_name',
                align: 'center',
            },
            {
                title: '权限名',
                dataIndex: 'permission_name',
                key: 'permission_name',
                align: 'left',
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
                    <span>
                        <Button type="link"  onClick={(e) => this.editRole(e,record)} className="g-btn-edit" >编辑</Button>
                        <Button type="link" onClick={(e)=> this.deleteRole(e,record)} className="g-btn-del" >删除</Button>
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
                        <Button
                            type="primary"
                            icon="plus"
                            loading={this.state.iconLoading}
                            onClick={this.createRole}
                        >
                            &nbsp;&nbsp;新增
                        </Button>
                        <div className="g-text-right g-m-20"></div>    
                    </div>
                    <div className="g-h-40"></div>
                    <Table loading={this.state.loading} 
                        onRow={(record) => {
                            return {
                                onClick: event => { this.toDetails(event,record) },
                            }
                        }}
                        pagination={this.state.pagination}
                        onChange={this.setPageIndex.bind(this)}
                        columns={columns} dataSource={this.state.role_list} rowKey="role_id" />
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
            </div>
        );
    }
}
export default user_list;