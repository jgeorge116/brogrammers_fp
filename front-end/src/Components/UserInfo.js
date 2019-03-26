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
        fetch(`http://localhost:4000/user/${this.props.match.params.id}`)
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
        fetch(`http://localhost:4000/user/${this.props.match.params.id}/questions`)
            .then(response => response.json())
            .then(data => {
                if(data.status === "error") this.setState({questions: ["User didn't post anything yet:("], isLoading: false})
                else this.setState({questions: data.questions, isLoading: false})
                console.log(data)
                this.getUserAnswers()
                })
            .catch(err => console.log(err))
    }

    getUserAnswers() {

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
                    <h2>Email: {this.state.email}</h2>
                    <h2>Reputation: {this.state.reputation}</h2>
                    <h3>User question Ids: </h3>
                    {this.showQuestions()}
                </div>
                 
        )}
    } 
}

export default ViewUserInfo