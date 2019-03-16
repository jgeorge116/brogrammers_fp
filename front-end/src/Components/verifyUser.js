import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
class verify extends Component{
    constructor(props){
        super(props)
        this.state={
            key: '',
            isValidated: false
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
        else
            console.log(this.props.location.state.username)
            console.log(this.props.location.state.email)
            console.log(this.props.location.state.pwd)
            this.setState({isValidated: true})
    }

    render() {
        if(this.state.isValidated)
            return <Redirect push to="/home" />
            
        return(
            <div>
                <h1>An email has been sent.. enter the key to continue</h1>
                <form onSubmit={this.handleRequest}> 
                    <input type="text" name="key" placeholder="key" onChange={this.handleKey}/>
                    <br/>
                    <button id="sub" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}
export default verify