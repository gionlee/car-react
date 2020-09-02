import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import cookie from 'react-cookies';
import '../style/login.css';
import api from '../utils/api';
import {GET,POST,PUT,DELETE} from '../utils/http';
import jwt from 'jsonwebtoken';
class Login extends React.Component {
    
    constructor (props) {
        super(props);
        this.state= {
            userInfo: {
                username : '',
                password : ''
            },
            rememberPw : false,
            canAgain : true
        }
    }
    componentWillMount  () {
        if(cookie.load('rememberPw')) {
            this.setState({
                rememberPw: true
            })
            let user_token = jwt.verify(cookie.load('user_token'),'54wp9oyghjeakp')
            let data = Object.assign({}, this.state.userInfo, {username: user_token.username,password:user_token.password})
            this.setState({
                userInfo: data
            })
        }
    }
     UserLogin = async e => {
        e.preventDefault();
        let data = this.state.userInfo
        if (!this.state.canAgain) {
            return false
        }
        this.setState({
            canAgain: false
        })
        let res = await POST(api.staffLogin,data)
        this.setState({
            canAgain: true
        })
        if(res.result) {
            if(this.state.rememberPw) {
                let user_token = jwt.sign(data,'54wp9oyghjeakp',{expiresIn:'1d'})
                cookie.save('user_token',user_token)
            }
            sessionStorage.setItem('user_id',res.data.id)
            sessionStorage.setItem('user_name',this.state.userInfo.username)
            sessionStorage.setItem('real_name',res.data.real_name)
            sessionStorage.setItem('role_id',res.data.role_id)
            sessionStorage.setItem('role_level',res.data.role_level)
            message.success(res.message, 1.5).then( () => {
                this.props.history.push('/car/list')
            })
        } else {
            setTimeout( ()=> {
                this.setState({
                    canAgain: true
                })
            },1500)
        }
    }
    setUsername = (e) => {
        let data = Object.assign({}, this.state.userInfo, {username: e.target.value})
        this.setState({
            userInfo: data
        })
    }
    setPassword = (e) => {
        let data = Object.assign({}, this.state.userInfo, {password: e.target.value})
        this.setState({
            userInfo: data
        })
    }
    setRememberPw = () => {
        let bol = !this.state.rememberPw
        this.setState({
            rememberPw: bol
        })
        if(bol) {
            cookie.save('rememberPw',true)
        } else {
            cookie.remove('rememberPw')
            cookie.remove('user_token')
        }
    }
    render() {
        return (
            <div className="g-login">
                <div className="login-form">
                    <div className="g-title" >
                        登录
                    </div>
                    <Form className="" layout="inline" onSubmit={this.UserLogin}>

                        <Form-Item>
                            <Input className="login-form-item" value={this.state.userInfo.username} onChange={this.setUsername.bind(this)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        </Form-Item>
                        <Form-Item>
                            <Input type="password" className="login-form-item" value={this.state.userInfo.password} onChange={this.setPassword.bind(this)}  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />
                        </Form-Item>
                        <Form-Item>
                            <Checkbox checked={this.state.rememberPw} onChange={this.setRememberPw.bind(this)} className="login-form-item">记住密码</Checkbox>
                        </Form-Item>
                        <Form-Item>
                            <Button  className="login-form-item"  type="primary" htmlType="submit" className="login-form-button">
                                登 录
                            </Button>
                            
                        </Form-Item>
                    </Form>
                </div>
            </div>
        )
    }
}
export default Login;