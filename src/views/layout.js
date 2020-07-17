import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon,Dropdown } from 'antd';
import cookie from 'react-cookies'
import React, { Component } from 'react';
import car_list from './components/car/list';
import car_details from './components/car/details';
import car_create from './components/car/create';
import car_edit from './components/car/edit';
import user_list from './components/user/list';
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
            c_router_name: ''

        }

    }
    linkto = (url) => {
        this.props.history.push(url)
    }
    componentDidMount () {
        this.setRouterName(this.props.match.url,this.router_name)
    }
    setRouterName = (url,router_name) => {
        let c_router_name = ''
        switch (url.split('/')[2]) {
            case 'details':
                c_router_name = '详情';
                break;
            case 'create':
                c_router_name = '新增';
                break;
            default:
                c_router_name = '';
                break;
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
              <a target="_blank" rel="noopener noreferrer" href="/">
                修改密码
              </a>
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
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" onClick={this.setRouterName.bind(this, '/car/list','车辆列表')}>
                            <Icon type="pie-chart" />
                            <span>车辆列表</span>
                        </Menu.Item>
                    
                        <Menu.Item key="2" onClick={this.setRouterName.bind(this, '/user/list','用户列表')}>
                            <Icon type="team" />
                            <span>用户列表</span>
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
                                admin
                            </div>
                        </div>
                    </Dropdown>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        {this.state.c_router_name ? breadcrumb_tags : breadcrumb_tag}

                        <Switch>
                            <Route path={`/car/list`} component={car_list} />
                            <Route path={`/car/details/:id`} component={car_details} />
                            <Route path={`/car/create`} component={car_create} />
                            <Route path={`/car/edit/:id`} component={car_edit} />
                            <Route path={`/user/list`} component={user_list} />
                        </Switch>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default _Layout;