import { Layout, Menu, Form, Input, Dropdown, Modal, message } from 'antd';
import { withRouter } from 'react-router-dom';
import cookie from 'react-cookies'
import React, { Component } from 'react';
import api from '../../utils/api';
import { POST } from '../../utils/http';
const { Header } = Layout;
class _Header extends Component {
    state = {
        real_name: sessionStorage.getItem('real_name'),
        edit_password_info: {
            user_name: sessionStorage.getItem('user_name'),
            password: '',
            new_password: ''
        },
        visible: false
    }
    setEditPassword = (e) => {
        this.setState({ edit_password_info: Object.assign({}, this.state.edit_password_info, { password: e.target.value }) })
    }
    setEditNewPassword = (e) => {
        this.setState({ edit_password_info: Object.assign({}, this.state.edit_password_info, { new_password: e.target.value }) })
    }
    editPassword = () => {
        this.setState({
            visible: true
        })
    }
    cancelEditPassword = () => {
        this.setState({
            visible: false
        })
    }
    saveEditPassword = async () => {
        let data = this.state.edit_password_info
        data.id = sessionStorage.getItem('user_id')
        let res = await POST(api.editPassword, data)
        if (res.result) {
            message.success(res.message, 1.5, () => {
                this.setState({
                    visible: false
                })
            });

        } else {
            message.error(res.message);
        }
    }
    logout = () => {
        cookie.remove('token')
        this.props.history.push('/login')
    }
    render() {
        const user = (
            <Menu>
                <Menu.Item>
                    <div onClick={this.editPassword.bind(this)}>
                        修改密码
              </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={this.logout.bind(this)}>
                        退出登录
              </div>
                </Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Header style={{ background: '#fff', padding: 0 }} >
                    <Dropdown overlay={user}>
                        <div className="g-userinfo">
                            <div className="g-userlog">
                                <img src={require('../../assets/images/user.jpg')} />
                            </div>
                            <div className="g-username">
                                {this.state.real_name}
                            </div>
                        </div>
                    </Dropdown>
                </Header>
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
                            label="用户名"
                            name="username"
                        >
                            <Input value={this.state.edit_password_info.user_name} readOnly />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input.Password onInput={this.setEditPassword.bind(this)} value={this.state.edit_password_info.password} />
                        </Form.Item>
                        <Form.Item
                            label="新密码"
                            name="password"
                            rules={[{ required: true, message: '请输入新密码!' }]}
                        >
                            <Input.Password onInput={this.setEditNewPassword.bind(this)} value={this.state.edit_password_info.new_password} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>


        );
    }
}

export default withRouter(_Header);