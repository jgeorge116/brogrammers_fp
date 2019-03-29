import React, { Component } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class viewQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id:"",
        question: [],
        isLoading: true,
        isLoadingAnswers: true,
        body: "",
        media: [],
        answers: []
    };
  }

  async componentDidMount() {
    this.setState({
        id: this.props.match.params.id,
        isLoading:true,
        isLoadingAnswers:true
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
        .then(data => this.setState({answers: [data.answers], isLoadingAnswers:false}))
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
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8"
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
                <p>{body}</p>
                <p>Tags: {tags.map(el=><span key={el} className="tag">{el}</span>)}</p>
                <p>Accepted Answer ID: {accepted_answer_id}</p>
            </div>
          </div>
      )
  }

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

  render() {
    if(this.state.isLoading) {
        return <p>Loading ...</p>;
    }
    else if(this.state.answers[0].length !== 0){
        return (
            <div className="question">
                {this.state.question.map(this.renderQuestion)}
                <div className="answers">
                    <hr />
                    <h1>Answers</h1>
                    {this.state.answers[0].map(this.renderAnswers)}
                </div>
                <div className="submitAnswer">
                    <hr />
                    <h1>Your Answer</h1>
                    <form onSubmit={this.handleRequest}>
                        <TextField
                            type="text"
                            name="body"
                            label="Body"
                            onChange={this.handleChange}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            multiline
                        />
                        <Button id="sub" type="submit">
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="question">
                {this.state.question.map(this.renderQuestion)}
                <div className="submitAnswer">
                    <hr />
                    <h1>Your Answer</h1>
                    <form onSubmit={this.handleRequest}>
                        <TextField
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
export default viewQuestions;
