import React, { Component } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import store from '../../Store'
import car_list from '../../views/components/car/list';
import car_details from '../../views/components/car/details';
import car_create from '../../views/components/car/create';
import car_edit from '../../views/components/car/edit';
import user_list from '../../views/components/user/list';
import user_details from '../../views/components/user/details'
import user_edit from '../../views/components/user/edit'
import role_list from '../../views/components/role/list'
import role_create from '../../views/components/role/create';
import role_details from '../../views/components/role/details';
import role_edit from '../../views/components/role/edit';
import staff_list from '../../views/components/staff/list';
import staff_create from '../../views/components/staff/create'
import staff_edit from '../../views/components/staff/edit';
import staff_details from '../../views/components/staff/details'
const { Content } = Layout
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            asideList: store.getState().asideList,
            router_link: '/car/list',
            router_name: '车辆管理',
            c_router_name: ''
        }
    }
    linkto = (url) => {
        this.props.history.push(url)
    }
    async setRouter(pathname) {
        console.log('set router ...')
        let router_name = ''
            let c_router_name = ''
            let menu = pathname.split('/')[2]
            switch (menu) {
                case 'create':
                    c_router_name = '新增'
                    break
                case 'edit':
                    c_router_name = '编辑'
                    break
                case 'details':
                    c_router_name = '详情'
                    break
                default:
                    c_router_name = ''

            }
            this.state.asideList.map(item => {
                if (pathname.indexOf(item.type) !== -1) {
                    router_name = item.name
                }
            })
            await this.setState({
                router_name,
                c_router_name,
                router_link: pathname
            })
    }
    componentWillMount () {
        this.setRouter(this.props.history.location.pathname)
    }
    async shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.pathname !== nextState.router_link) {
            this.setRouter(nextProps.location.pathname)
            return true
        } else {
            return false
        }
    }
    render() {
        // 包含子标签
        const breadcrumb_tags = (
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
        const breadcrumb_tag = (
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
                    <Route path={`/staff/edit`} component={staff_edit} />
                    <Route path={`/staff/details/:id`} component={staff_details} />
                    <Route path="*">
                        <Redirect to={`/login`} />
                    </Route>
                </Switch>

            </Content>
        );
    }
}

export default withRouter(Main);