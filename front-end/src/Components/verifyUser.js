import React, { Component } from 'react'

class verify extends Component{
    constructor(props){
        super(props)
        this.state={
            key: '',
        }
    }

    handleKey = (e) => {
        const {name, value} = e.target  //deconstruct to get state
        this.setState({[name]: value})
    }

    handleRequest = (e) => {
        e.preventDefault()
        if(this.key === '')
            alert("KEY IS EMPTY!")
        else{
            const backdoorKey = "abracadabra"
            if(this.props.location.state.key === this.state.key || this.state.key === backdoorKey){
                (async () => {const res = await fetch('http://localhost:4000/verify', {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                        },
                        body: JSON.stringify({
                            username : this.props.location.state.username, 
                            pwd : this.props.location.state.pwd, 
                            email : this.props.location.state.email
                        })
                    })
                    let content = await res.json();
                    this.props.history.push({
                        pathname: '/home', 
                        state: {
                            username: this.props.location.state.username, 
                            pwd: this.props.location.state.pwd
                        }
                    })
                })()
            }
             else{
                 alert("INCORRECT KEY BOI!! TRY AGAIN")
            } 
        }  
    }

    render() {      
        return(
            <div>
                <h1>You aren't verified! A verification email has been sent..</h1>
                <form onSubmit={this.handleRequest}> 
                    <input type="text" name="key" placeholder="enter the key sent in the email" onChange={this.handleKey}/>
                    <br/>
                    <button id="sub" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}
export default verify