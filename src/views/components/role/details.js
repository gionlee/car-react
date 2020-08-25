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
class role_details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            persmission_list:[],
            role_name:'',
            checkedKeys:[],
            loading:true
        }

    }
    componentDidMount () {
        this.getMyPermissionList()
        this.getRolePermissionList()
    }
    getMyPermissionList =() => {
        axios.get(api.roleDetails+ '?role_id='+sessionStorage.getItem('role_id')).then((res) => {
            if(res.data.code == 0) {
                let reslutList = res.data.data.permission_list;
                let treeList = []
                reslutList.map((item,index)=> {
                    if(item.pid == 0) {
                        treeList.push({
                            role_name:item.permission_name,
                            role_id:item.permission_id,
                            children:[]
                        })
                        reslutList.splice(index,1)
                    }
                    
                })
                let persmission_list = this.formatTreeData(reslutList,treeList)
                this.setState({
                    persmission_list:persmission_list,
                    loading:false
                })
            }
            
        })
    }
    getRolePermissionList =() => {
        console.log(this.props.match)
        axios.get(api.roleDetails+ '?role_id='+this.props.match.params.id).then((res) => {
            if(res.data.code == 0) {
                let reslutList = res.data.data.permission_id.split(',');
                this.setState({
                    role_name:res.data.data.role_name,
                    checkedKeys:reslutList
                })
            }
            
        })
    }
    formatTreeData (reslutList,treeList) {
        reslutList.map( (item,index) => {
            treeList.map( (treeItem,treeIndex)=> {
                if(item.pid == treeItem.role_id) {
                    treeItem.children.push({
                            role_name:item.permission_name,
                            role_id:item.permission_id,
                            children:[]
                    })
                    reslutList.splice(index,1)
                }
            })
        })
        if(reslutList.length == 0) {
            return treeList
        } else {
            this.formatTreeData(reslutList,treeList)
        }
        this.formatTreeData(reslutList,treeList)
        return treeList
    }
    goBack = () => {
        this.props.history.push('/role/list')
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
                        <Form.Item label="角色名称">
                            <Input className="g-input g-text-left" value={this.state.role_name}  readOnly/>
                        </Form.Item>
                        <br />
                        <Form.Item label="权限">
                        <Tree
                        checkable
                        multiple
                        checkedKeys={this.state.checkedKeys}
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
export default role_details;
