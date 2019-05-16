import React, { Component, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Post from "./post";
import Chip from "@material-ui/core/Chip";
import Navbar from "./navbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Grid, Paper, RadioGroup, Radio } from "@material-ui/core";
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
      media: false,
      timestamp: 0,
      show: false,
      search_str: ""
    };
  }

  getResults(search_string, timestamp, limit, accepted, media, sort_by, tags) {
    (async () => {
      var tagsArr = [];
      if (tags) tagsArr = tags.split(",");
      const body = JSON.stringify({
        timestamp: timestamp,
        limit: limit,
        accepted: accepted,
        has_media: media,
        sort_by: sort_by,
        tags: tagsArr,
        q: search_string //milestone 2
      });
      console.log(body);
      const res = await fetch("/search", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8"
        },
        body: body
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
      this.state.search_str,
      this.state.media,
      this.state.sort_by,
      this.state.tags
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
    // console.log(name);
    // console.log(value);
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
                  label="Query"
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
            <TextField
              className="textFields"
              name="tags"
              label="Tags (comma-separated with no space)"
              onChange={this.handleInputChange}
              margin="normal"
              variant="outlined"
              fullWidth
            />
            <label>
              Accepted Answers Only? :
              <Checkbox
                name="accepted"
                type="checkbox"
                value={this.state.accepted}
                onChange={this.handleInputChange}
              />
            </label>
            <label>
              Has Media?
              <Checkbox
                name="media"
                type="checkbox"
                value={this.state.media}
                onChange={this.handleInputChange}
              />
            </label>
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Sort By</FormLabel>
              <RadioGroup
                name="sort_by"
                value={this.state.value}
                onChange={this.handleInputChange}
                row
              >
                <FormControlLabel
                  value="timestamp"
                  control={<Radio color="primary" />}
                  label="Timestamp"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="score"
                  control={<Radio color="primary" />}
                  label="Score"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
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
