import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import QuestionAnswer from "@material-ui/icons/QuestionAnswer";
import Cookies from "js-cookie";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from "./materialUITheme";
import ClassNames from "classnames";

const styles = theme => ({
  root: {
    width: "100%"
  },
  mainBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 10,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 12,
      width: "auto"
    },
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    flexGrow: 2
  },
  searchIcon: {
    marginLeft: theme.spacing.unit,
    width: theme.spacing.unit * 5,
    pointerEvents: "none"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.unit
  },
  navlink: {
    cursor: "pointer"
  }
});
class Navbar extends Component {
  handleAddQuestion = () => {
    this.props.history.push("/questions/add");
  };

  handleLogout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("username");
    this.props.history.push("/logout");
  };

  handleProfile = () => {
    this.props.history.push({
      pathname: `/user/${localStorage.getItem("username")}`
    });
  };
  state = {
    anchorEl: null
  };

  render() {
    const { classes } = this.props;
    if (!localStorage.getItem("username")) {
      this.props.history.push("/login");
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <div className={classes.mainBar}>
                <Typography
                  color="inherit"
                  noWrap
                >
                  <Link className={ClassNames(classes.title, classes.navlink)}
                    color="inherit"
                    variant="h6"
                    underline="none"
                    href="home"> Stack Overflow </Link>
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                  />
                </div>
                <div />
                <div className={ClassNames(classes.navlink)}>
                  <IconButton
                    onClick={this.handleAddQuestion}
                    color="inherit"
                  >
                    <QuestionAnswer />
                  </IconButton>
                </div>
                <div className={ClassNames(classes.profile, classes.navlink)}>
                  <IconButton
                    onClick={this.handleProfile}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </div>
                <Typography noWrap onClick={this.handleLogout} color="inherit">
                  <Link
                    className={classes.navlink}
                    color="inherit"
                    variant="h6"
                    underline="none"
                  >
                    Logout
                  </Link>
                </Typography>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(withStyles(styles)(Navbar));
