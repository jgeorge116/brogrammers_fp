import React, { Component, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Post from "./post";
import Chip from "@material-ui/core/Chip";
import Navbar from "./navbar";
import { Grid, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
const queryString = require("query-string");

const styles = theme => ({
  questionPost: {
    // marginLeft: "5%",
    // marginRight: "5%"
  },
  resultBox: {
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingLeft: "5%",
    paddingRight: "5%"
  }
});

class Search extends Component {
  constructor() {
    super();
    this.state = {
      limit: 25,
      accepted: false,
      timestamp: 0,
      show: false,
      search_str: ""
    };
  }

  getResults(search_string, timestamp, limit, accepted) {
    (async () => {
      const res = await fetch("/search", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          timestamp: timestamp,
          limit: limit,
          accepted: accepted,
          q: search_string //milestone 2
        })
      });
      let content = await res.json();
      //   console.log(content);
      //   data = content.questions;
      this.setState({ data: content.questions });
      this.forceUpdate();
    })();
  }
  handleRequest = e => {
    e.preventDefault();
    this.getResults(
      this.state.search_str,
      this.state.timestamp,
      this.state.limit,
      this.state.accepted,
      this.state.search_str
    );
  };

  showResults = _ => {
    //display results
    let data = this.state.data;

    if (!data || data.length === 0) return <h2> No results found.</h2>;
    // let i = 0;
    const { classes } = this.props;
    return data.map(function(item, i) {
      console.log(i);
      return (
        <div className={classes.questionPost}>
          <Post
            key={i}
            username={item.user.username}
            rep={item.user.reputation}
            title={item.title}
            body={item.body}
            views={item.view_count}
            time={item.time}
            tags={item.tags.map(tag => (
              <Chip key={tag} label={tag} clickable={true} className="chips" />
            ))}
          />
        </div>
      );
    });
  };

  //   clearSearch = () => {
  //     this.setState({ show: false });
  //   }; //clear all posts from previous search

  handleInputChange = e => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value
    });
  };

  componentWillMount() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.q) {
      this.getResults(parsed.q, Date.now(), 25, false);
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Fragment>
          <Navbar />
        </Fragment>
        <div className="searchContainer">
          <header className="App-header">
            <link rel="stylesheet" href="style/styles.css" />
          </header>
          <h1>Search</h1>
          <form onSubmit={this.handleRequest}>
            <Grid container justify="center">
              <Grid item md={8}>
                <TextField
                  className="textFields"
                  type="text"
                  name="search_str"
                  label="Search"
                  onChange={this.handleInputChange}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              {/* <br /> */}
              <Grid item md={2}>
                <TextField
                  className="textFields"
                  type="number"
                  name="timestamp"
                  label="Timestamp"
                  onChange={this.handleInputChange}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              {/* <br /> */}
              <Grid item md={2}>
                <TextField
                  className="textFields"
                  type="number"
                  name="limit"
                  label="Number of Posts"
                  onChange={this.handleInputChange}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <label>
              By Accepted Answer? :
              <Checkbox
                name="accepted"
                type="checkbox"
                value={this.state.accepted}
                onChange={this.handleInputChange}
              />
            </label>
            <div className="searchButtons">
              <Button id="sub" type="submit">
                Submit
              </Button>
            </div>
          </form>
          <div className="searchButtons">
            {/* <Button id="clear" onClick={this.clearSearch}>
            Clear Search Results
          </Button> */}
            {/* {this.showResults(data)} */}
          </div>
          {/* <Paper>{this.showResults(data)}</Paper> */}
        </div>
        <Grid container justify="center">
          <Grid item md={9}>
            <Paper className={classes.resultBox}>
              <h1>Search Results</h1>
              {this.showResults()}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Search);
