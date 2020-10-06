import { Icon, Input, Card,Button,Select, Form, Tree ,message } from 'antd';
import React, {Component} from 'react';
import axios from '../../../utils/httpsConf';
import api from '../../../utils/api'
const { Option } = Select;
class staff_create extends Component {
    constructor (props) {
        super(props)
        this.state = {
            login_name :sessionStorage.getItem('staff_login_name'),
            real_name:sessionStorage.getItem('staff_real_name'),
            role_list:[],
            role_id:Number(sessionStorage.getItem('staff_role_id')),
            staff_id:sessionStorage.getItem('staff_id'),
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
    editStaff =() => {
        axios.post(api.staffEdit,{
            role_id:this.state.role_id,
            staff_id:this.state.staff_id,
            real_name:this.state.real_name
        }).then((res) => {
            if(res.data.code == 0) {
                message.success(res.data.message,1.5,()=> {
                    this.props.history.push('list');
                })
            }
        }).catch((err) => {
            
        });
    }
    setRealName = (e) => {
        console.log(e)
        this.setState({
            real_name:e.target.value
        })
    }
    setRoleName =(value) => {
        console.log(value)
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
                // role_id:list[0].role_id,
                role_list:list
            })
        }).catch((err) => {
            
        });
    }
    goBack = () => {
        this.props.history.push('/staff/list')
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
                        <Input className="g-input g-text-left" readOnly value={this.state.login_name}/>
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
                {this.state.canSubmit ? <Button className="g-submit" type="primary" onClick={this.editStaff}>保存</Button> : <Button className="g-submit" disabled >保存</Button>}
                
                </div>
            </Card>
        </div>)
    }
}
export default staff_create