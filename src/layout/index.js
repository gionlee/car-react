import React, { Component } from 'react';
import { Layout } from 'antd';
import Aside from './components/aside'
import Main from './components/main'
import Header from './components/header';
class _Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Aside></Aside>
                <Layout>
                    <Header></Header>
                    <Main></Main>
                </Layout>
            </Layout>);
    }
}
export default _Layout;