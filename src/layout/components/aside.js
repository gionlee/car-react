import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

import store from '../../Store';
const { Content, Header, Footer, Sider } = Layout;
const openLogo = require('../../assets/images/logo.jpg')
const claseLogo = require('../../assets/images/mini-logo.jpg')
class Aside extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            asideList: store.getState().asideList,
            openLogo,
            claseLogo,
            collapsed: false,
            defaultView: '0'
        }
    }
    // 左侧菜单 收缩展开
    onCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    // 路由跳转
    linkto = (url, index) => {
        this.setState({
            defaultView: index + ''
        })
        this.props.history.push(url)
    }
    // 
    componentWillMount () {
        this.state.asideList.map((item, index) => {
            if(this.props.history.location.pathname.indexOf(item.type) !== -1) {
                this.setState({
                    defaultView: index + ''
                })
            }
        })
    }
    render() { 
        return ( 
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className={!this.state.collapsed ? "g-logo" : "g-mini-logo"} >
                        <img className="g-logo-img " src={!this.state.collapsed ? this.state.openLogo : this.state.claseLogo} /> 
                    </div>
                    <Menu theme="dark" selectedKeys={[this.state.defaultView]} mode="inline">
                        {this.state.asideList.map( (item,index) => 
                            <Menu.Item key={index} onClick={this.linkto.bind(this, item.path, index)}>
                            <Icon type="car" />
                            <span>{item.name}</span>
                        </Menu.Item>
                        )}
                    </Menu>
                </Sider>
         );
    }
}
 
export default withRouter(Aside);