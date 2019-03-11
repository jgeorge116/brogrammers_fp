import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'

class App extends Component {

  constructor(){
    super()
    this.state={
      username: '',
      email: '',
      pwd: '',
      isValidated: false
    }
  }

  handleRequest = (e) => {
    e.preventDefault();
    this.setState({isValidated: true})
    // console.log(this.state.email)
    // console.log(this.state.pwd)
    // console.log(this.state.username)
  }

  handleChange = (e) => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  render() {
    if(this.state.isValidated)
      return <Redirect push to="/home" />;
    
    return (//gotta add login component
      <div className="App">
        <header className="App-header">
          <h1> Register For StackOverFlow!!</h1>
          <link rel="stylesheet" href="style/styles.css"></link>
        </header>
        <button id="login">Login</button>
        <form onSubmit={this.handleRequest} action= '/Components/home'> 
          <input type="text" name="username" placeholder='username' onChange={this.handleChange}/>
          <br/>
          <input type="email" name="email" placeholder='email' onChange={this.handleChange}/>
          <br/>
          <input type="password" name="pwd" placeholder='password' onChange={this.handleChange}/>
          <br/>
          <button id="sub" type="submit">Submit</button>
        </form>
      </div>
    );
  } 
}

export default App