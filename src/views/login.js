import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import cookie from 'react-cookies';
import '../style/login.css';
import axios from '../utils/https';
import api from '../utils/api';
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            canSubmit: true,
            userInfo : {
                username: '',
                password: ''
            }
        }
    }
    componentDidMount() {
        if (cookie.load('userInfo.username')) {
            this.setState({
                'userInfo.username.value': cookie.load('userInfo.username'),
                'userInfo.password.value': cookie.load('userInfo.password'),
                checked: true
            })
        }
    }

    login = () => {
        if (!this.state.canSubmit) {

            return false;
        }
        this.state.canSubmit = false;
        axios.post(api.userLogin,{username:this.state.userInfo.username.value,password:this.state.userInfo.password.value}).then( (res) => {
            console.log(res)
            if(res.data.code == 0) {
                if (this.state.checked) {
                    cookie.save('userInfo.username', this.state.userInfo.username.value);
                    cookie.save('userInfo.password', this.state.userInfo.password.value);
                    this.props.history.push('/car/list')
                } else {
                    cookie.remove('userInfo.username');
                    cookie.remove('userInfo.password');
                }
                message.success('提交成功！',1.5).then( ()=> {
                    this.props.history.push('/car/list')
                })
            } else {
                alert(res.data.msg);
            }
            
        }).catch( (err) => {
            console.log(err)
        })
        
    }
    handleFormChange = changedFields => {
        this.setState(({ userInfo }) => ({
            userInfo: { ...userInfo, ...changedFields },
          }));
          console.log(this.state)
    };
    render() {
        const { userInfo } = this.state;
        return (
            <div className="g-login">
             <CustomizedForm {...userInfo} onSubmit={this.login} onChange={this.handleFormChange} /></div>
        );
    }
}
const CustomizedForm = Form.create({
    name: 'global_state',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
      },
    mapPropsToFields(props) {
        return {
            'username': Form.createFormField({
                value:props.username.value
            }),
            'password': Form.createFormField({
                value:props.password.value
            }),
        };
    },
    onValuesChange(_, values) {
    },
})(props => {
    const { getFieldDecorator } = props.form;
    return (
        
            <Form className="login-form" onSubmit={props.onSubmit}>
                <div className="g-title">登录</div>
                <Form.Item className="login-form-item">
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '用户名不得为空!' }],
                    })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请输入用户名" />)}
                </Form.Item>
                <Form.Item className="login-form-item">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码不得为空!' }],
                    })(<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="请输入密码" />)}
                </Form.Item>
                <Form.Item className="login-form-item">
                    <Checkbox  >记住密码</Checkbox>
                    <a className="login-form-forgot" href="">重置密码</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                    <a href="">注册</a>
                </Form.Item>
            </Form>
        
    )
});
export default Login;