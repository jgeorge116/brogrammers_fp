import React, { Component, Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Navbar from "./navbar";

class ViewUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      reputation: -1,
      questions: [],
      answers: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    this.setState({ username: this.props.match.params.id }, this.getUserInfo());
    this.setState({ isLoading: false });
  }

  getUserInfo() {
    fetch(`/user/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === "error")
          this.setState({
            email: "DOES NOT EXIST!!",
            reputation: "DOES NOT EXIST!!"
          });
        else
          this.setState({
            email: data.user.email,
            reputation: data.user.reputation
          });
        console.log(data);
        this.getUserQuestions();
      })
      .catch(err => console.log(err));
  }

  getUserQuestions() {
    fetch(`/user/${this.props.match.params.id}/questions`)
      .then(response => response.json())
      .then(data => {
        if (data.status === "error") this.setState({ questions: null });
        else this.setState({ questions: data.questions });
        console.log(data);
        this.getUserAnswers();
      })
      .catch(err => console.log(err));
  }

  showQuestions() {
    if (this.state.questions) {
      return this.state.questions.map(item => (
        <div key={item}>
          <Link component={RouterLink} to={`/fquestions/${item}`}>
            {item}
          </Link>
        </div>
      ));
    } else {
      return "No questions to display.";
    }
  }

  render() {
    if (this.state.isLoading) return <p>Loading ...</p>;
    else {
      return (
        <div>
          <Fragment>
            <Navbar />
          </Fragment>
          <div className="userContainer">
            <div className="userInfo">
              <h2>Username: {this.state.username}</h2>
              <h2>Email: {this.state.email}</h2>
              <h2>Reputation: {this.state.reputation}</h2>
            </div>
            <div className="userActivity">
              <h3>User Question Ids: </h3>
              {this.showQuestions()}
              <br />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ViewUserInfo;
