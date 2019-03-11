import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './App';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import home from './home'

ReactDOM.render(
<BrowserRouter>
    <Switch>
        <Route path="/adduser" component={App}/> 
        <Route path="/home" component={home}/>
        <Redirect from="/" exact to="/adduser"/> 
    </Switch>
</BrowserRouter>, document.getElementById('root'));