import React, { Component } from "react"

class ViewUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:"",
            questions: [],
            answers: [],
            isLoading: true
        };
      }

    async componentDidMount() {
        this.setState({username: this.props.match.params.id}, this.getUserQuestionsAndAnswers());
        this.setState({isLoading: false});
    }

    getUserQuestionsAndAnswers () { 
        fetch(`http://localhost:4000/user/${this.props.match.params.id}/questions`)
            .then(response => response.json())
            .then(data => {
                if(data.status === "error") this.setState({questions: ["NOT FOUND!"], isLoading: false})
                else this.setState({questions: data.questions, isLoading: false})
                console.log(data)})
            .catch(err => console.log(err))
    }

    showQuestions() {
        return(
            this.state.questions.map(item =>
            <div key={item}>
                <p>{item}</p>
            </div>
         ))
    }

    render() { 
        if(this.state.isLoading) return (<p>Loading ...</p>)
        else{
            return(
                <div>
                    <h2>UserName: {this.state.username}</h2>
                    <h3>User question Ids: </h3>
                    {this.showQuestions()}
                </div>
                 
        )}
    } 
}

export default ViewUserInfo