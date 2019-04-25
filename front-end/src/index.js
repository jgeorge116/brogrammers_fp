import React from "react";
import ReactDOM from "react-dom";
import "./Components/style/index.css";
import App from "./Components/App";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import verify from "./Components/verifyUser";
import home from "./Components/home";
import login from "./Components/login";
import logout from "./Components/logout";
import Search from "./Components/search";
import questions from "./Components/addQuestion";
import viewQuestion from "./Components/viewQuestion";
import userInfo from "./Components/userInfo";
import addMedia from "./Components/addMedia";
import viewMedia from "./Components/viewMedia";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/fadduser" component={App} />
      <Route path="/fverify" component={verify} />
      <Route path="/fhome" component={home} />
      <Route path="/flogin" component={login} />
      <Route path="/flogout" component={logout} />
      <Route path="/fsearch" component={Search} />
      <Route path="/fquestions/add" component={questions} />
      <Route path="/fquestions/:id" component={viewQuestion} />
      <Route path="/fuser/:id" component={userInfo} />
      <Route path="/faddmedia" component={addMedia} />
      <Route path="/fmedia/:id" component={viewMedia} />
      <Redirect from="/" exact to="/fadduser" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
