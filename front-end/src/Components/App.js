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
    e.preventDefault()
    if (this.state.username === '' || this.state.email === '' || this.state.pwd === '')
      alert("ONE OR MORE OF THE FIELDS ARE EMPTY!")
    else 
      (async () => {const res = await fetch('http://localhost:4000/adduser', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          username : this.state.username, 
          pwd : this.state.pwd, 
          email : this.state.email
        })
      })
      const content = await res.json();
      console.log(content);
      })()
      this.setState({isValidated: true})
  }

  handleChange = (e) => {
    const {name, value} = e.target  //deconstruct to get state
    this.setState({[name]: value})
  }

  handleLogin = () => {
    this.props.history.push('/login')
  }

  render() {
    if(this.state.isValidated)
      return <Redirect to={{
        pathname: '/verify', 
        state: {username: this.state.username, pwd: this.state.pwd, email: this.state.email}}}/>; //not null
    
    return (//gotta add login component
      <div className="App">
        <header className="App-header">
          <h1> Register For StackOverFlow!!</h1>
          <link rel="stylesheet" href="style/styles.css"></link>
        </header>
        <button id="login" onClick={this.handleLogin}>Login</button>
        <form onSubmit={this.handleRequest}> 
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