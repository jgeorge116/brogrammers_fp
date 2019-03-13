import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './App';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import verify from './verifyUser'
import home from './home'
import login from './login'
import logout from './logout'

ReactDOM.render(
<BrowserRouter>
    <Switch>
        <Route path="/adduser" component={App}/> 
        <Route path="/verify" component={verify}/>
        <Route path="/home" component={home}/>
        <Route path="/login" component={login}/>
        <Route path="/logout" component={logout}/>
        <Redirect from="/" exact to="/adduser"/> 
    </Switch>
</BrowserRouter>, document.getElementById('root'));