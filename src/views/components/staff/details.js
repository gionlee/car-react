import { Icon, Input, Card,Button,Select, Form, Tree ,message } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api';
import { setTwoToneColor } from 'antd/lib/icon/twoTonePrimaryColor';
const {TreeNode} = Tree;
const formItemLabelCol = {
    labelCol: {

        style: {
            width: '120px'
        }

    },
}
const dateFormat = 'YYYY/MM/DD';
class staff_details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login_name :sessionStorage.getItem('staff_login_name'),
            real_name:sessionStorage.getItem('staff_real_name'),
            role_list:[],
            role_id:sessionStorage.getItem('staff_role_id'),
            staff_id:sessionStorage.getItem('staff_id'),
            persmission_list:[],
            role_name:'',
            checked_keys:[],
            loading:true
        }

    }
    componentDidMount () {
        this.getRolePermissionList()
    }
    getRolePermissionList =() => {
        axios.get(api.staffDtails+ '?staff_id='+this.props.match.params.id).then((res) => {
            if(res.data.code == 0) {
                let reslut_list = res.data.data.permission_list;
                let tree_list = []
                reslut_list.map((item,index)=> {
                    if(item.pid == 0) {
                        tree_list.push({
                            role_name:item.permission_name,
                            role_id:item.permission_id,
                            children:[]
                        })
                        reslut_list.splice(index,1)
                    }
                    
                })
                let persmission_list = this.formatTreeData(reslut_list,tree_list)
                let role_list = res.data.data.permission_id.split(',');
                let real_list = []
                let remove_id = ['1000','2000','3000','4000']
                role_list.map((item)=> {
                    if(!remove_id.includes(item)){
                        real_list.push(item)
                    } 
                })
                this.setState({
                    role_name:res.data.data.role_name,
                    checked_keys:real_list,
                    persmission_list:persmission_list,
                    loading:false
                })
            }
            
        })
    }
    formatTreeData (reslut_list,tree_list) {
        reslut_list.map( (item,index) => {
            tree_list.map( (tree_item,tree_index)=> {
                if(item.pid == tree_item.role_id) {
                    tree_item.children.push({
                            role_name:item.permission_name,
                            role_id:item.permission_id,
                            children:[]
                    })
                    reslut_list.splice(index,1)
                }
            })
        })
        if(reslut_list.length == 0) {
            return tree_list
        } else {
            this.formatTreeData(reslut_list,tree_list)
        }
        this.formatTreeData(reslut_list,tree_list)
        return tree_list
    }
    goBack = () => {
        this.props.history.push('/staff/list')
    }
    render() {
        let roleTree =(list) => {
            return (
                list.map( (item) => 
                    <TreeNode title={item.role_name} key={item.role_id}>
                        {item.children.length > 0  ? roleTree(item.children) : ''}
                    </TreeNode>
                )
            )
        }
        return (
            <div className="g-body">
                <Card hoverable className="g-card" loading={this.state.loading}>
                    <div className="g-card-head">
                        <Icon type="file-text" />
                    </div>
                    <div className="g-h-40"></div>
                    <Form {...formItemLabelCol} layout="inline">
                        <Form.Item label="登录账号">
                            <Input className="g-input g-text-left" value={this.state.login_name}  readOnly/>
                        </Form.Item>
                        <Form.Item label="姓名">
                            <Input className="g-input g-text-left" value={this.state.real_name}  readOnly/>
                        </Form.Item>
                        <Form.Item label="职位">
                            <Input className="g-input g-text-left" value={this.state.role_name}  readOnly/>
                        </Form.Item>
                        <br />
                        <Form.Item label="权限">
                        <Tree
                        checkable
                        multiple
                        checkedKeys={this.state.checked_keys}
                        disabled
                    >
                        {roleTree(this.state.persmission_list)}
                    </Tree>
                        </Form.Item>
                    </Form>

                    <div className="g-ctrl">
                    <Button  onClick={this.goBack}>返回</Button>
                    </div>
                </Card>
            </div>
        )
    }
}
export default staff_details;
