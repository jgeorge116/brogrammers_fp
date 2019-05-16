import React, { Component, Fragment } from "react";
import Cookies from "js-cookie";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Navbar from "./navbar";

class questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      body: "",
      tags: [],
      media: []
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRequest = e => {
    e.preventDefault();
    if (
      this.state.title === "" ||
      this.state.body === "" ||
      this.state.tags === ""
    ) {
      alert("ONE OR MORE OF THE FIELDS ARE EMPTY!");
    } else {
      (async () => {
        const tagsArr = this.state.tags.split(",").map((item) => item.trim());
        var mediaArr = [];
        if(this.state.media.length!==0)
	        mediaArr = this.state.media.split(",").map((item) => item.trim());
        const res = await fetch("/questions/add", {
          method: "POST",
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + Cookies.get("access_token")
          },
          body: JSON.stringify({
            title: this.state.title,
            body: this.state.body,
            tags: tagsArr,
            media: mediaArr
          })
        });
        let content = await res.json();
        this.setState({ id: content.id });
        if (content.status === "error") alert("Error: " + content.error);
        else {
          this.props.history.push({
            pathname: `/fquestions/${this.state.id}`
          });
        }
      })();
    }
  };

  
  render() {
    return (
      <div>
        <Fragment>
          <Navbar />
        </Fragment>
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
              label="Comma-separated List (no spaces)"
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <TextField
              className="textFields"
              type="text"
              name="media"
              label="Comma-separated List (Optional and no spaces)"
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
      </div>
    );
  }
}
export default questions;
