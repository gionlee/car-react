import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Layout, Menu,Form, Input, Button, Breadcrumb, Icon,Dropdown, Modal,message} from 'antd';
import cookie from 'react-cookies'
import React, { Component } from 'react';
import car_list from './components/car/list';
import car_details from './components/car/details';
import car_create from './components/car/create';
import car_edit from './components/car/edit';
import user_list from './components/user/list';
import user_details from './components/user/details'
import user_edit from './components/user/edit'
import api from '../utils/api';
import {GET,POST,PUT,DELETE} from '../utils/http';
import { compose } from 'redux';
const { Content, Header, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
let breadcrumb_tag = '';
let breadcrumb_tags = '';
class _Layout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            router_link: '/car/list',
            router_name: '车辆列表',
            c_router_name: '',
            visible:false,
            real_name:sessionStorage.getItem('real_name'),
            edit_password_info:{
                user_name:sessionStorage.getItem('user_name'),
                password:'',
                new_password:''
            }

        }

    }
    linkto = (url) => {
        this.props.history.push(url)
    }
    componentDidMount () {
        this.setRouterName(this.props.match.url,this.router_name)
    }
    setRouterName = (url,router_name,from_menu) => {
        let c_router_name = ''
        
        switch (url.split('/')[2]) {
            case 'details':
                c_router_name = '详情';
                break;
            case 'create':
                c_router_name = '新增';
                break;
            case 'edit':
                c_router_name = '编辑';
                break;
            default:
                c_router_name = '';
                break;
        }
        if(from_menu) {
            this.setState({
                router_link:url
            })
        }
        this.setState({
            c_router_name: c_router_name,
        })
        if(router_name) {
            this.setState({
                router_name: router_name,
            })
        }
        this.linkto(url);
    }
    onCollapse = ()=> {
        this.setState({
            collapsed : !this.state.collapsed
        })
    }
    componentWillUpdate(netxProps) {
        if (this.props.location.pathname != netxProps.location.pathname) {
            this.setRouterName(netxProps.location.pathname,this.router_name)
        }
    }
    setEditPassword = (e) => {
        this.setState({edit_password_info:Object.assign({}, this.state.edit_password_info, { password: e.target.value })})
    }
    setEditNewPassword = (e) => {
        this.setState({edit_password_info:Object.assign({}, this.state.edit_password_info, { new_password: e.target.value })})
    }
    editPassword = () => {
        this.setState({
            visible:true
        })
    }
    cancelEditPassword = () => {
        this.setState({
            visible:false
        })
    }
     saveEditPassword = async() => {
        let data = this.state.edit_password_info
        data.id = sessionStorage.getItem('user_id')
        let res  = await POST(api.editPassword,data)
        if(res.result) {
            message.success(res.message,1.5,() => {
                    this.setState({
                        visible: false
                    })
                });
            
        } else {
            message.error(res.message);
        }
    }
    logout = ()=> {
        cookie.remove('token')
        this.props.history.push('/login')
    }
    render() {
        // 包含子标签
        breadcrumb_tags = (
            <Breadcrumb className="g-breadcrumb">
                <Breadcrumb.Item >
                    首页
                            </Breadcrumb.Item>
                <Breadcrumb.Item className="g-pointer" onClick={this.linkto.bind(this, this.state.router_link)}>
                    <span>{this.state.router_name}</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item><span>{this.state.c_router_name}</span></Breadcrumb.Item>
            </Breadcrumb>
        )
        // 不包含子标签
        breadcrumb_tag = (
            <Breadcrumb className="g-breadcrumb">
                <Breadcrumb.Item >
                    首页
                            </Breadcrumb.Item>
                <Breadcrumb.Item className="g-pointer" onClick={this.linkto.bind(this, this.state.router_link)}>
                    <span>{this.state.router_name}</span>
                </Breadcrumb.Item>
            </Breadcrumb>
        )
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
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className={!this.state.collapsed ? "g-logo" : "g-mini-logo"} >
                        <img className="g-logo-img " src={!this.state.collapsed ? require('../assets/images/logo.jpg') : require('../assets/images/mini-logo.jpg')} />
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" onClick={this.setRouterName.bind(this, '/car/list','车辆管理')}>
                            <Icon type="pie-chart" />
                            <span>车辆管理</span>
                        </Menu.Item>
                    
                        <Menu.Item key="2" onClick={this.setRouterName.bind(this, '/user/list','用户管理')}>
                            <Icon type="team" />
                            <span>用户管理</span>
                        </Menu.Item>
                        </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }} >
                    <Dropdown overlay={user}>
                        <div className="g-userinfo">
                            <div className="g-userlog">
                            <img src={require('../assets/images/user.jpg') } />
                            </div>
                            <div className="g-username">
                                {this.state.real_name}
                            </div>
                        </div>
                    </Dropdown>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        {this.state.c_router_name ? breadcrumb_tags : breadcrumb_tag}

                        <Switch>
                            <Route path={`/car/list`} component={car_list} exact />
                            <Route path={`/car/details/:id`} component={car_details} />
                            <Route path={`/car/create`} component={car_create} />
                            <Route path={`/car/edit/:id`} component={car_edit} />
                            <Route path={`/user/list`} component={user_list} />
                            <Route path={`/user/details/:id`} component={user_details} />
                            <Route path={`/user/edit/:id`} component={user_edit} />
                            <Route path="*">
                                <Redirect to={`/login`} />
                            </Route>
                            
                        </Switch>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
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
                                <Input  value={this.state.edit_password_info.user_name} readOnly />
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
                </Layout>

            </Layout>
        )
    }
}
export default _Layout;