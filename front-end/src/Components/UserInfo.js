import React, { Component } from "react"

class ViewUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:"",
            email: "",
            reputation: -1,
            questions: [],
            answers: [],
            isLoading: true
        };
      }

    async componentDidMount() {
        this.setState({username: this.props.match.params.id}, this.getUserInfo());
        this.setState({isLoading: false});
    }

    getUserInfo() {
        fetch(`/user/${this.props.match.params.id}`)
            .then(response => response.json())
            .then(data => {
                if(data.status === "error") this.setState({email: "DOES NOT EXIST!!", reputation: "DOES NOT EXIST!!"})
                else this.setState({email: data.user.email, reputation: data.user.reputation})
                console.log(data)
                this.getUserQuestions()
                })
            .catch(err => console.log(err))
    }

    getUserQuestions() { 
        fetch(`/user/${this.props.match.params.id}/questions`)
            .then(response => response.json())
            .then(data => {
                if(data.status === "error") this.setState({questions: ["User didn't post anything yet:("]})
                else this.setState({questions: data.questions})
                console.log(data)
                this.getUserAnswers()
                })
            .catch(err => console.log(err))
    }

    getUserAnswers() {
        fetch(`/user/${this.props.match.params.id}/answers`)
            .then(response => response.json())
            .then(data => {
                if(data.status === "error") this.setState({answers: ["User didn't answer anything yet:("], isLoading: false})
                else this.setState({answers: data.answers, isLoading: false})
                console.log(data)
                })
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

    showAnswers() {
        return(
            this.state.answers.map(ans =>
            <div key={ans}>
                <p>{ans}</p>
            </div>
        ))
    }

    render() { 
        if(this.state.isLoading) return (<p>Loading ...</p>)
        else{
            return(
                <div>
                    <h2>UserName: {this.state.username}</h2>
                    <h2>Email: {this.state.email}</h2>
                    <h2>Reputation: {this.state.reputation}</h2>
                    <br/>
                    <h3>User Question Ids: </h3>
                    {this.showQuestions()}
                    <br/>
                    <h3>User Answer Ids: </h3>
                    {this.showAnswers()}
                </div>       
            )
        }
    } 
}

export default ViewUserInfo