import React from "react";
import ReactDOM from "react-dom";
import "./Components/style/index.css";
import App from "./Components/App";
import { BrowserRouter, Route, Switch} from "react-router-dom";
import verify from "./Components/verifyUser";
import home from "./Components/home";
import login from "./Components/login";
import Search from "./Components/search";
import questions from "./Components/addQuestion";
import viewQuestion from "./Components/viewQuestion";
import userInfo from "./Components/userInfo";
import addMedia from "./Components/addMedia";
import viewMedia from "./Components/viewMedia";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={home} />
      <Route path="/fadduser" component={App} />
      <Route path="/fverify" component={verify} />
      <Route path="/flogin" component={login} />
      <Route path="/fsearch" component={Search} />
      <Route path="/fquestions/add" component={questions} />
      <Route path="/fquestions/:id" component={viewQuestion} />
      <Route path="/fuser/:id" component={userInfo} />
      <Route path="/faddmedia" component={addMedia} />
      <Route path="/fmedia/:id" component={viewMedia} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
