import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: "",
        title: "",
        body: "",
        tags: []
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRequest = e => {
    e.preventDefault();
    if (this.state.title === "" || this.state.body === "" || this.state.tags === "") 
      alert("ONE OR MORE OF THE FIELDS ARE EMPTY!");
    else {
      (async () => {
        const res = await fetch("/questions/add", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
            title: this.state.title,
            body: this.state.body,
            tags: this.state.tags.split(",")
          })
        });
        let content = await res.json();
        this.setState({id:content.id})
        if (content.status === "error") alert("Error: " + content.error);
        else {
          this.props.history.push({
            pathname: `/questions/${this.state.id}`
          });
        }
      })();
    }
  };

  render() {
    return (
      <div className="questionContainer">
        <h1>Submit your Question</h1>
        <form onSubmit={this.handleRequest}>
          <TextField
            className="textFields"
            type="text"
            name="title"
            label="Title"
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <br />
          <TextField
            className="textFields"
            type="text"
            name="body"
            label="Body"
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
            multiline
          />
          <br />
          <TextField
            className="textFields"
            type="text"
            name="tags"
            label="Tags"
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <Button id="sub" type="submit">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}
export default questions;
