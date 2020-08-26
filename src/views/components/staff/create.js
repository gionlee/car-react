import { Icon, Input, Card,Button,Select, Form, Tree ,message } from 'antd';
import React, {Component} from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api'
const { Option } = Select;
class staff_create extends Component {
    constructor (props) {
        super(props)
        this.state = {
            login_name :'',
            real_name:'',
            role_list:[],
            role_id:'',
            canSubmit:true
        }
    }
    componentWillMount () {
        this.getRoleList()
    }
    getList() {
    }
    setLoginName =(e) => {
        this.setState({
            login_name:e.target.value
        })
    }
    createStaff =() => {

    }
    setRealName = () => {

    }
    setRoleName =(value) => {
        this.setState({
            role_id:value
        })
    }
    getRoleList = async ()=>  {
        axios.get(api.roleList,{}).then((res) => {
            let list = []
            res.data.data.map( (item,index) => {
                list.push({
                    role_id:item.role_id,
                    role_name:item.role_name
                })
            })
            this.setState({
                role_id:list[0].role_id,
                role_list:list
            })
        }).catch((err) => {
            
        });
    }
    checkLoginName =() => {
        axios.get(api.staffCheck+'?login_name='+this.state.login_name).then((res) => {
            if(res.data.code != 0) {
                this.setState({
                    canSubmit:false
                })
            } else {
                this.setState({
                    canSubmit:true
                })
            }
        }).catch((err) => {
            
        });
    }
    render () {

        return (            
        <div className="g-body">
            <Card hoverable className="g-card">
                <div className="g-card-head">
                    <Icon type="file-text" />
                </div>
                <div className="g-h-40"></div>
                <Form layout="inline">
                    <Form.Item label="账号">
                        <Input className="g-input g-text-left" onBlur={this.checkLoginName} value={this.state.login_name} onInput={this.setLoginName.bind(this)} />
                    </Form.Item>
                    <Form.Item label="真实姓名">
                        <Input className="g-input g-text-left" value={this.state.real_name} onInput={this.setRealName.bind(this)} />
                    </Form.Item>
                    <Form.Item label="职位">
                        <Select className="g-role " showSearch value={this.state.role_id}  onChange={this.setRoleName.bind(this)} > 
                            {this.state.role_list.map((item,index) => <Option key={index} value={item.role_id}>{item.role_name}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
                <div className="g-ctrl">
                <Button  onClick={this.goBack}>返回</Button>
                {this.state.canSubmit ? <Button className="g-submit" type="primary" onClick={this.createStaff}>保存</Button> : <Button className="g-submit" disabled >保存</Button>}
                
                </div>
            </Card>
        </div>)
    }
}
export default staff_create