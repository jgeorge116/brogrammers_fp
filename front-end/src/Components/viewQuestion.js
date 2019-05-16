import React, { Component, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Cookies from "js-cookie";
import Navbar from "./navbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import CheckCircle from "@material-ui/icons/CheckCircle";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import Delete from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import ClassNames from "classnames";

const styles = theme => ({
  titleArea: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleSecion: {
    flexGrow: "1"
  },
  upIcon: {
    cursor: "pointer",
    fontSize: "4em",
    color: "#000",
    "& :hover": {
      color: "#00897b"
    }
  },
  upIconChose: {
    color: "#00c853",
    "& :hover": {
      color: "#757575"
    }
  },
  downIcon: {
    cursor: "pointer",
    fontSize: "4em",
    color: "#000",
    "& :hover": {
      color: "#e53935"
    },
    marginTop: "-20px"
  },
  downIconeChose: {
    color: "#b71c1c",
    "& :hover": {
      color: "#757575"
    }
  },
  deleteIcon: {
    color: "#f44336"
  },
  headerSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  questionAnswerBody: {
    display: "flex",
    flexDirection: "row"
  },
  questionDescription: {
    minHeight: "175px"
  },
  answerDescription: {
    minHeight: "100px",
    flexGrow: 1
  },
  descriptionContainer: {
    flexGrow: 2
  },
  infoSection: {
    background: "#e0f2f1",
    padding: ".5em"
  },
  info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  voteArea: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "-15px",
    marginTop: "-20px"
  },
  score: {
    textAlign: "center",
    fontSize: "2em",
    marginTop: "-20px"
  },
  pNoSpace: {
    margin: 0
  },
  answerDescriptionAccepted: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  CheckCircle: {
    color: "#00c853",
  },
  CheckCircleOutline: {
    cursor: "pointer",
    color: "#000",
    "& :hover": {
      color: "#00897b"
    }
  },
  images: {
    maxWidth:"100%"
  }
});
class viewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      question: [],
      isLoading: true,
      isLoadingAnswers: false,
      body: "",
      media: [],
      answers: [],
      allMediaQuestion: [],
      allMediaAnswer: [],
      isLoadingMedia: true
    };
  }

  async componentDidMount() {
    this.setState({
      id: this.props.match.params.id,
      isLoading: true, // for checking if question was feteched
      isLoadingAnswers: false // for checking if answers were fetched
    });
    this.getQuestion();
    this.getAnswers();
    // this.getUpvoteStatus();
  }

  handleDeleteQuestion = e => {
    (async () => {
      const res = await fetch(`/questions/${this.state.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + Cookies.get("access_token")
        }
      });
      let content = await res.json();
      if (content.status === "error") alert("Error: " + content.error);
      else {
        this.props.history.push({
          pathname: "/"
        });
      }
    })();
  };

  handleVoteQuestion(voteChoice, e) {
    e.preventDefault();
    (async () => {
      //   console.log(Cookies.get("access_token"));
      const res = await fetch(`/questions/${this.state.id}/upvote`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + Cookies.get("access_token")
        },
        body: JSON.stringify({
          upvote: voteChoice
        })
      });
      let content = await res.json();
      if (content.status === "error") alert("Error: " + content.error);
      else {
        this.getUpvoteStatus();
        this.getQuestion();
      }
    })();
  }

  handleVoteAnswer(answer_id, voteChoice, e) {
    e.preventDefault();
    (async () => {
      const res = await fetch(`/answers/${answer_id}/upvote`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + Cookies.get("access_token")
        },
        body: JSON.stringify({
          upvote: voteChoice
        })
      });
      let content = await res.json();
      if (content.status === "error") alert("Error: " + content.error);
      else {
        this.getAnswers();
      }
    })();
  }

  handleAcceptAnswer(answer_id, e) {
    e.preventDefault();
    (async () => {
      const res = await fetch(`/answers/${answer_id}/accept`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + Cookies.get("access_token")
        }
      });
      let content = await res.json();
      if (content.status === "error") alert("Error: " + content.error);
      else {
          this.getAnswers();
        this.getQuestion();
      }
    })();
  }
  getQuestion = _ => {
    fetch(`/questions/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data =>
        this.setState({ question: [data.question], isLoading: false })
      )
      .catch(err => console.error(err));
  };

  getAnswers = _ => {
    fetch(`/questions/${this.props.match.params.id}/answers`)
      .then(response => response.json())
      .then(data => {
        // this.setState({ answers: [data.answers], isLoadingAnswers: true });
        if (data.answers.length) {
          this.setState({ answers: [data.answers], isLoadingAnswers: true });
          for (let i = 0; i < data.answers.length; i++) {
            fetch(`/answers/${data.answers[i].id}/upvotestatus`)
              .then(response => response.json())
              .then(upvote => {
                //   console.log(prev_answers);
                let prev_answers = this.state.answers;
                prev_answers[0][i].upvoteStatus = upvote.upvote;
                this.setState({ answers: prev_answers });
              });
          }
        }
      })
      .catch(err => console.error(err));
  };

  getMedia = _ => {
    let allMediaQuestion = [];
    if (this.state.question[0].media[0]) {
      for (let i = 0; i < this.state.question[0].media.length; i++) {
        fetch(`/media/${this.state.question[0].media[i]}`)
          .then(response => response.blob())
          .then(data => {
            if (data) {
              var reader = new FileReader();
              reader.onload = e => {
                allMediaQuestion.push(e.target.result);
                this.setState({ allMediaQuestion: allMediaQuestion });
              };
              reader.readAsDataURL(data);
            }
          })
          .catch(err => console.error(err));
      }
    }
    this.setState({ isLoadingMedia: false });
  };

  getMediaAnswer = _ => {
    let allMediaAnswer = [];
    for(let i = 0; i < this.state.answers; i++) {
      if (this.state.answers[i].media[0]) {
        for (let j = 0; j < this.state.answers[i].media.length; i++) {
          fetch(`/media/${this.state.answers[i].media[j]}`)
            .then(response => response.blob())
            .then(data => {
              if (data) {
                var reader = new FileReader();
                reader.onload = e => {
                  allMediaAnswer.push(e.target.result);
                  this.setState({ allMediaAnswer: allMediaAnswer });
                };
                reader.readAsDataURL(data);
              }
            })
            .catch(err => console.error(err));
        }
      }
      this.setState({ isLoadingMedia: false });
    }
  };

  getUpvoteStatus = _ => {
    fetch(`/questions/${this.props.match.params.id}/upvotestatus`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Bearer " + Cookies.get("access_token")
      }
    })
      .then(response => response.json())
      .then(data => {
        if (!data.upvote) data.upvote = 0;
        this.setState({
          questionUpvoteStatus: data.upvote
        });
      })
      .catch(err => console.log(err));
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRequest = e => {
    e.preventDefault();
    if (this.state.body === "") alert("BODY IS EMPTY!");
    else {
      (async () => {
        var mediaArr = [];
        if(this.state.media.length!==0)
	        mediaArr = this.state.media.split(",").map((item) => item.trim());
        const res = await fetch(`/questions/${this.state.id}/answers/add`, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Bearer " + Cookies.get("access_token")
          },
          body: JSON.stringify({
            body: this.state.body,
            media: mediaArr
          })
        });
        let content = await res.json();
        if (content.status === "error") alert("Error: " + content.error);
        else {
          this.getAnswers();
        }
      })();
    }
  };
  renderVoteArea = score => {
    const { classes } = this.props;
    let status = this.state.questionUpvoteStatus;
    let upvoted = status === 1 ? classes.upIconChose : "";
    let downvoted = status === -1 ? classes.downIconeChose : "";
    return (
      <div className={classes.voteArea}>
        <ArrowDropUp
          onClick={e => this.handleVoteQuestion(true, e)}
          className={ClassNames(classes.upIcon, upvoted)}
        />
        <div className={classes.score}>{score}</div>
        <ArrowDropDown
          onClick={e => this.handleVoteQuestion(false, e)}
          className={ClassNames(classes.downIcon, downvoted)}
        />
      </div>
    );
  };

  renderAnswerVoteArea = (answer_id, score, status) => {
    const { classes } = this.props;
    let upvoted = status === 1 ? classes.upIconChose : "";
    let downvoted = status === -1 ? classes.downIconeChose : "";
    return (
      <div className={classes.voteArea}>
        <ArrowDropUp
          onClick={e => this.handleVoteAnswer(answer_id, true, e)}
          className={ClassNames(classes.upIcon, upvoted)}
        />
        <div className={classes.score}>{score}</div>
        <ArrowDropDown
          onClick={e => this.handleVoteAnswer(answer_id, false, e)}
          className={ClassNames(classes.downIcon, downvoted)}
        />
      </div>
    );
  };

  renderAcceptance = (answer_id, is_accepted) => {
    const { classes } = this.props;
    if (this.state.question[0].accepted_answer_id) {
        console.log(is_accepted);
      if (is_accepted) {
        return <CheckCircle className={classes.CheckCircle} />;
      }
    } else {
      return (
        <CheckCircleOutline
          className={classes.CheckCircleOutline}
          onClick={e => this.handleAcceptAnswer(answer_id, e)}
        />
      );
    }
  };
  // to display the question data
  renderQuestion = ({
    id,
    user,
    title,
    body,
    score,
    view_count,
    answer_count,
    timestamp,
    media,
    tags,
    accepted_answer_id
  }) => {
    const { classes } = this.props;
    return (
      <div className={classes.headerSection} key={id}>
        <div className={classes.titleSecion}>
          <div className={classes.titleArea}>
            <h1>{title}</h1>
            <div>
              <IconButton onClick={this.handleDeleteQuestion} color="inherit">
                <Delete className={classes.deleteIcon} />
              </IconButton>
            </div>
          </div>
          <hr />
          <div>
            <div className={classes.questionAnswerBody}>
              {this.renderVoteArea(score)}
              <div className={classes.descriptionContainer}>
                <div className={classes.questionDescription}>{body}</div>
                <div className={classes.questionMedia}>
                  {this.state.allMediaQuestion.map(el => (
                    <img key={el} src={el} className={classes.images} alt="" />
                  ))}
                </div>
                <div className={classes.infoSection}>
                  <div>
                    Tags:{" "}
                    {tags.map(el => (
                      <Chip key={el} label={el} clickable={true} />
                    ))}
                  </div>
                  <div className={classes.info}>
                    <p className={classes.pNoSpace}>
                      Posted By: {user.username} at {timestamp}
                    </p>
                    <p className={classes.pNoSpace}>{view_count} Views</p>
                    <p className={classes.pNoSpace}>{answer_count} Answers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // to display answer data
  renderAnswers = ({
    id,
    user,
    body,
    score,
    is_accepted,
    timestamp,
    media,
    upvoteStatus
  }) => {
    const { classes } = this.props;
    return (
      <div key={id} className={classes.answer}>
        <div className={classes.questionAnswerBody}>
          {this.renderAnswerVoteArea(id, score, upvoteStatus)}
          <div className={classes.descriptionContainer}>
            <div className={classes.answerMedia}>
              {this.state.allMediaAnswer.map(el => (
                <img key={el} src={el} className={classes.images} alt="" />
              ))}
            </div>
            <div className={classes.answerDescriptionAccepted}>
              <div className={classes.answerDescription}>
                <div>{body}</div>
              </div>
              {this.renderAcceptance(id, is_accepted)}
            </div>
            <div className={classes.infoSection}>
              <div className={classes.info}>
                <p className={classes.pNoSpace}>
                  Answered by: {user} at {timestamp}
                </p>
                <p className={classes.pNoSpace}>Accepted: {is_accepted}</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  };

  showQuestions = () => {
    return (
      <div className="answers">
        <hr />
        <h1>Answers</h1>
        {this.state.answers[0].map(this.renderAnswers)}
      </div>
    );
  };

  render() {
    if (this.state.isLoading) {
      return <CircularProgress size="100" />;
    } else if (this.state.isLoadingMedia) {
      this.getMedia();
      return <CircularProgress size="100" />;
    } else {
      return (
        <div>
          <Fragment>
            <Navbar />
          </Fragment>
          <div className="question">
            {this.state.question.map(this.renderQuestion)}
            {this.state.isLoadingAnswers ? this.showQuestions() : null}
            <div className="submitAnswer">
              <h1>Your Answer</h1>
              <form onSubmit={this.handleRequest}>
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
                  name="media"
                  label="Media"
                  onChange={this.handleChange}
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  multiline
                />
                <br />
                <Button id="sub" type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default withStyles(styles)(viewQuestion);
