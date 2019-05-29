import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
class verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: ""
    };
  }

  handleChange = e => {
    const { name, value } = e.target; //deconstruct to get state
    this.setState({ [name]: value });
  };

  handleRequest = e => {
    e.preventDefault();
    if (this.key === "") alert("KEY IS EMPTY!");
    else {
      (async () => {
        const res = await fetch("/verify", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            email: this.state.email,
            key: this.state.key
          })
        });
        let content = await res.json();
        if (content.status === "error") alert("Error: " + content.error);
        else {
          this.props.history.push({
            pathname: "/flogin"
          });
        }
      })();
    }
  };

  render() {
    return (
      <div className="verifyContainer">
        <h1>Verify your Account</h1>
        <form onSubmit={this.handleRequest}>
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
            type="text"
            name="key"
            label="Key"
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
export default verify;
