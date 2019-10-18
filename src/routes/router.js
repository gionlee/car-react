import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './../views/login';
import Layout from './../views/layout';
const createHistory  = require("history").createHashHistory;
const history = createHistory()

const BasicRoute = () => (
    <Router history={history}>   
        <Switch>     
        <Route exact path="/" component={Login}></Route>
        <Route path="/*" component={Layout}></Route>
        </Switch>
    </Router>

);


export default BasicRoute;