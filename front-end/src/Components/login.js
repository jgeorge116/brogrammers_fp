import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'

class login extends Component {

  constructor(){
    super()
    this.state={
      username: '',
      pwd: '',
      isValidated: false
    }
  }

  handleRequest = (e) => {
    e.preventDefault()
    if( this.state.username === '' || this.state.pwd === '')
      alert("ONE OR MORE OF THE FIELDS ARE EMPTY!")
    else
      //post to db
      this.setState({isValidated: true})
  }

  handleChange = (e) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  render() {
    if(this.state.isValidated)
      return <Redirect push to="/home"/>;
    
    return (
      <div>
        <header>
          <h1>Login boi!!</h1>
          <link rel="stylesheet" href="style/styles.css"></link>
        </header>
        <form onSubmit={this.handleRequest}> 
          <input type="text" name="username" placeholder='username' onChange={this.handleChange}/>
          <br/>
          <input type="password" name="pwd" placeholder='password' onChange={this.handleChange}/>
          <br/>
          <button id="sub" type="submit">Submit</button>
        </form>
      </div>
    );
  } 
}

export default login