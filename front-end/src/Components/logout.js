import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
class logout extends Component {

  handleLogin = () => {
    this.props.history.push('/login')
  }

  handleRegister = () => {
    this.props.history.push('/adduser')
  }

  render() {    
    return (
      <div>
        <header>
          <link rel="stylesheet" href="style/styles.css"></link>
        </header>
        <h1 id="logoutText">YOU ARE LOGGED OUT...</h1>
        <Button id="login" onClick={this.handleLogin}>Log Back In!</Button> 
        <br/>
        <Button id="register" onClick={this.handleRegister}>Register</Button> 
      </div>
    );
  } 
}

export default logout