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
      <Route path="/adduser" component={App} />
      <Route path="/verify" component={verify} />
      <Route path="/home" component={home} />
      <Route path="/login" component={login} />
      <Route path="/logout" component={logout} />
      <Route path="/search" component={Search} />
      <Route path="/questions/add" component={questions} />
      <Route path="/fquestions/:id" component={viewQuestion} />
      <Route path="/fuser/:id" component={userInfo} />
      <Route path="/addmedia" component={addMedia} />
      <Route path="/fmedia/:id" component={viewMedia} />
      <Redirect from="/" exact to="/adduser" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
