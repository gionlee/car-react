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
import role_list from './components/role/list'
import role_create from './components/role/create';
import role_details from './components/role/details';
import role_edit from './components/role/edit';
import staff_list from './components/staff/list';
import staff_create from './components/staff/create'
import not_found from './components/not_found/404'
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
            },
            defaultView:'1'

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
        let defaultView = '1'
        switch (url.split('/')[1]) {
            case 'car':
                router_name = '车辆列表';
                break;
            case 'user':
                router_name = '用户列表';
                defaultView = '2'
                break;
            case 'role':
                router_name = '角色列表';
                defaultView = '3'
                break;
            case 'staff':
                router_name = '员工管理';
                defaultView = '4'
                break;
            default:
                router_name = '车辆列表';
                break;
        }
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
            defaultView:defaultView
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
                    <Menu theme="dark" selectedKeys={[this.state.defaultView]} mode="inline">
                        <Menu.Item key="1" onClick={this.setRouterName.bind(this, '/car/list','车辆管理')}>
                            <Icon type="pie-chart" />
                            <span>车辆管理</span>
                        </Menu.Item>
                    
                        <Menu.Item key="2" onClick={this.setRouterName.bind(this, '/user/list','用户管理')}>
                            <Icon type="user" />
                            <span>用户管理</span>
                        </Menu.Item>
                        <Menu.Item key="3" onClick={this.setRouterName.bind(this, '/role/list','角色管理')}>
                            <Icon type="team" />
                            <span>角色管理</span>
                        </Menu.Item>
                        <Menu.Item key="4" onClick={this.setRouterName.bind(this, '/staff/list','员工管理')}>
                            <Icon type="team" />
                            <span>员工管理</span>
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
                            <Route path={`/role/list`} component={role_list} />
                            <Route path={`/role/create`} component={role_create} />
                            <Route path={`/role/details/:id`} component={role_details} />
                            <Route path={`/role/edit/:id`} component={role_edit} />
                            <Route path={`/staff/list`} component={staff_list} />
                            <Route path={`/staff/create`} component={staff_create} />
                            <Route path="*">
                                <Redirect to={`/login`}/>
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