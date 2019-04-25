import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      pwd: "",
      isValidated: false
    };
  }

  handleRequest = e => {
    e.preventDefault();
    if (this.state.username === "" || this.state.pwd === "")
      alert("ONE OR MORE OF THE FIELDS ARE EMPTY!");
    else {
      (async () => {
        const res = await fetch("http://localhost:4000/login", {
          method: "POST",
          credentials: 'include',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.pwd
          })
        });
        let content = await res.json();
        if (content.error === "Not verified") {
          this.props.history.push({
            pathname: "/fverify"
          });
        } else if (content.status === "error") alert("Error: " + content.error);
        else {
            localStorage.setItem('username', this.state.username)
            this.props.history.push({
            pathname: "/fhome"
            });
        }
      })();
    }
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="loginContainer">
        <header>
          {/* <link rel="stylesheet" href="style/styles.css" /> */}
        </header>
        <h1>Login boi!!</h1>
        <form onSubmit={this.handleRequest}>
          <TextField
            className="textFields"
            type="text"
            name="username"
            label="Username"
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <br />
          <TextField
            className="textFields"
            type="password"
            name="pwd"
            label="Password"
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <br />
          <Button id="sub" type="submit">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default login;
