import React from "react";
import ReactDOM from "react-dom";
import "./Components/style/index.css";
import App from "./Components/App";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import verify from "./Components/verifyUser";
import home from "./Components/home";
import login from "./Components/login";
import logout from "./Components/logout";
import questions from "./Components/questions";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/adduser" component={App} />
      <Route path="/verify" component={verify} />
      <Route path="/home" component={home} />
      <Route path="/login" component={login} />
      <Route path="/logout" component={logout} />
      <Route path="/questions/add" component={questions} />
      <Route path="/questions/:id" component={questions} />
      <Redirect from="/" exact to="/adduser" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
