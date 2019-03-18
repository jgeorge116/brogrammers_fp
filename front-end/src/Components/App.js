import React, { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      pwd: ""
    };
  }

  handleRequest = e => {
    e.preventDefault();
    if (
      this.state.username === "" ||
      this.state.email === "" ||
      this.state.pwd === ""
    )
      alert("ONE OR MORE OF THE FIELDS ARE EMPTY!");
    else if (this.state.username === this.state.email)
      alert("USERNAME AND EMAIL MUST BE UNIQUE");
    else {
      (async () => {
        const res = await fetch("http://localhost:4000/adduser", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.pwd,
            email: this.state.email
          })
        });
        let content = await res.json();
        if (content.status === "error") alert("Error: " + content.error);
        else{
          this.props.history.push({
            pathname: '/verify',
            // state: {
            //   username: this.state.username,
            //   pwd: this.state.pwd,
            //   email: this.state.email,
            //   key: content.data
            // }
          })
        }
      })();
    }
  };

  handleChange = e => {
    const { name, value } = e.target; //deconstruct to get state
    this.setState({ [name]: value });
  };

  handleLogin = () => {
    this.props.history.push("/login");
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <link rel="stylesheet" href="style/styles.css" />
        </header>
        <button id="login" onClick={this.handleLogin}>
          Login
        </button>
        <div className="registerContainer">
          <h1> Register For StackOverFlow!!</h1>
          <form onSubmit={this.handleRequest}>
            <input
              type="text"
              name="username"
              placeholder="username"
              onChange={this.handleChange}
            />
            <br />
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={this.handleChange}
            />
            <br />
            <input
              type="password"
              name="pwd"
              placeholder="password"
              onChange={this.handleChange}
            />
            <br />
            <button id="sub" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
