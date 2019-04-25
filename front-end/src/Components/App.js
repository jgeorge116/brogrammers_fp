import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
        const res = await ("/adduser", {
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
            pathname: '/fverify'
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
    this.props.history.push("/flogin");
  };

  render() {
	console.log('APP 2!!!!');
    return (
      <div className="App">
        <header className="App-header">
          {/* <link rel="stylesheet" href="style/styles.css" /> */}
        </header>
        <Button id="login" onClick={this.handleLogin}>
          Login
        </Button>
        <div className="registerContainer">
          <h1> Register For StackOverFlow!!</h1>
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
              type="email"
              name="email"
              label="Email"
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
      </div>
    );
  }
}

export default App;
