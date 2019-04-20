import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from "js-cookie";

class viewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id:"",
        question: [],
        isLoading: true,
        isLoadingAnswers: false,
        body: "",
        media: [],
        answers: []
    };
  }

  async componentDidMount() {
    this.setState({
        id: this.props.match.params.id,
        isLoading:true, // for checking if question was feteched
        isLoadingAnswers:false // for checking if answers were fetched
    });
    this.getQuestion();
    this.getAnswers();
  }

  getQuestion = _ => {
    fetch(`/questions/${this.props.match.params.id}`)
        .then(response => response.json())
        .then(data => this.setState({question: [data.question], isLoading:false}))
        .catch(err => console.error(err))
  }

  getAnswers = _ => {
    fetch(`/questions/${this.props.match.params.id}/answers`)
      .then(response => response.json())
      .then(data => {if(data.answers.length) this.setState({answers: [data.answers],isLoadingAnswers:true})})
      .catch(err => console.error(err))
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRequest = e => {
    e.preventDefault();
    if (this.state.body === "") 
      alert("BODY IS EMPTY!");
    else {
      (async () => {
        const res = await fetch(`/questions/${this.state.id}/answers/add`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + Cookies.get("access_token")
          },
          body: JSON.stringify({
            body: this.state.body,
            media: this.state.media
          })
        });
        let content = await res.json();
        if (content.status === "error") alert("Error: " + content.error);
        else {
          this.componentDidMount();
        }
      })();
    }
  };
  // to display the question data
  renderQuestion = ({id,user,title,body,score,view_count,answer_count,timestamp,media,tags,accepted_answer_id}) => {
      return (
          <div key={id}>
            <h1>{title}</h1>
            <hr />
            <div className="questionInfo">
                <p>{user.username}</p>
                <p>Score: {score}</p>
                <p>View Count: {view_count}</p>
                <p>Answer Count: {answer_count}</p>
                <p>Timestamp: {timestamp}</p>
            </div>
            <div className="questionBody">
                <div>{body}</div>
                <div>Tags: {tags.map(el=><Chip key={el} label={el} clickable={true} />)}</div>
                <div>Accepted Answer ID: {accepted_answer_id}</div>
            </div>
          </div>
      )
  }
  // to display answer data
  renderAnswers = ({id,user,body,score,is_accepted,timestamp,media}) => {
      return (
          <div key={id} className="answer">
            <div className="answerInfo">
                <p>{user}</p>
                <p>Score: {score}</p>
                <p>Accepted: {is_accepted}</p>
                <p>Timestamp: {timestamp}</p>
            </div>
            <div className="answerBody">
                <p>{body}</p>
            </div>
          </div>
      )
  }
  
  showQuestions = () => {
    return (
      <div className="answers">
        <hr />
        <h1>Answers</h1>
        {this.state.answers[0].map(this.renderAnswers)}
      </div>
    )
  }

  render() {
    if(this.state.isLoading) {
      return <CircularProgress size="100"/>;
    }
    else {
      return (
        <div className="question">
          {this.state.question.map(this.renderQuestion)}
          {this.state.isLoadingAnswers ? this.showQuestions() : null }  
          <div className="submitAnswer">
              <hr />
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
                  <Button id="sub" type="submit">
                      Submit
                  </Button>
              </form>
          </div>
        </div>
      )
    }
  }
}
export default viewQuestion;
