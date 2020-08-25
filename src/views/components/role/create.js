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
class role_create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role_create: {
                role_name:'',
                permission_list:[]
            },
            persmission_list:[],
            role_name:'',
            checkedKeys:[],
            halfCheckedKeys:[]
        }

    }
    componentDidMount () {
        this.getPermissionList()
    }
    setPermission = (e) => {
        this.setState({role_create:Object.assign({}, this.state.role_create, { permission_name: e.target.value })})
    }
    setRoleName = (e) => {
        
        this.setState({role_name:e.target.value })
        // this.setState({role_create:Object.assign({}, this.state.role_create, { role_name: e.target.value })})
    }
    getPermissionList =() => {
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
                    persmission_list:persmission_list
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
    createRole = () => {
        let that = this;
        axios.post(api.roleCreate,{permission_list:that.state.checkedKeys.concat(that.state.halfCheckedKeys).toString(),role_name:that.state.role_name,role_id:sessionStorage.getItem('role_id')}).then( (res)=> {
            if(res.data.code == 0) {
                message.success('提交成功！',1.5).then( ()=> {
                    this.props.history.push('/role/list')
                })
            } else {
                message.error(res.data.message,1.5)
            }
        }).catch( (err) => {
            message.error(err,1.5)
        })
    }
    setRoleList = (checkedKeys, info) => {
        this.setState({
            checkedKeys:checkedKeys,
            halfCheckedKeys:info.halfCheckedKeys
        })
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
                <Card hoverable className="g-card">
                    <div className="g-card-head">
                        <Icon type="file-text" />
                    </div>
                    <div className="g-h-40"></div>
                    <Form {...formItemLabelCol} layout="inline">
                        <Form.Item label="角色名称">
                            <Input className="g-input g-text-left" onInput={this.setRoleName.bind(this)} />
                        </Form.Item>
                        <br />
                        <Form.Item label="权限">
                        <Tree
                        checkable
                        multiple
                        checkedKeys={this.state.checkedKeys}
                        onCheck={this.setRoleList}
                        onSelect={this.setRoleList}
                    >
                        {roleTree(this.state.persmission_list)}
                    </Tree>
                        </Form.Item>
                    </Form>

                    <div className="g-ctrl">
                    <Button  onClick={this.goBack}>返回</Button>
                    <Button className="g-submit" type="primary" onClick={this.createRole}>保存</Button>
                    </div>
                </Card>
            </div>
        )
    }
}
export default role_create;
