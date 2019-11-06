import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import React, { Component } from 'react';
import car_list from './components/car/list';
import car_details from './components/car/details';
import car_create from './components/car/create';
import car_edit from './components/car/edit';
const { Content, Footer, Sider } = Layout;
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
        this.setRouterName(this.props.match.url)
    }
    setRouterName = (url) => {
        let c_router_name = ''
        switch (url) {
            case '/car/details':
                c_router_name = '详情';
                break;
            case '/car/create':
                c_router_name = '新增';
                break;
            default:
                c_router_name = '';
                break;
        }
        this.setState({
            c_router_name: c_router_name
        })
    }
    componentWillUpdate(netxProps) {
        if (this.props.location.pathname != netxProps.location.pathname) {
            this.setRouterName(netxProps.location.pathname)
        }
    }
    render() {
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
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" onClick={this.setRouterName.bind(this, '/car/list')}>
                            <Icon type="pie-chart" />
                            <span>车辆列表</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ margin: '0 16px' }}>
                        {this.state.c_router_name ? breadcrumb_tags : breadcrumb_tag}

                        <Switch>
                            <Route path={`/car/list`} component={car_list} />
                            <Route path={`/car/details/:id`} component={car_details} />
                            <Route path={`/car/create`} component={car_create} />
                            <Route path={`/car/edit/:id`} component={car_edit} />
                            
                        </Switch>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default _Layout;