import React, { Component, Fragment } from "react";
import Navbar from "./navbar";
import { withStyles } from "@material-ui/core/styles";
import {Grid, Paper} from "@material-ui/core";

const styles = theme => ({
  mainContainer: {
    // height: "1000px",
    // background: "#fff",
    marginTop: '10px',
    ...theme.mixins.toolbar
  }
});

class Home extends Component {
  //add logic

  render() {
    const { classes } = this.props;
    return (
      //add logic..
      <div>
        <header className="App-header">
          <link rel="stylesheet" href="style/styles.css" />
        </header>
        <Fragment>
          <Navbar />
        </Fragment>
        <div className={classes.mainContainer}>
          <Grid container justify="center">
            <Grid item md={10}>
              <Paper>
                <h1 class="toolbar">HOMEEEE...</h1>
              </Paper>
            </Grid>
            <Grid item md={10}>
              <Paper>
                <h1 class="toolbar">HOMEEEE...</h1>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Home);
