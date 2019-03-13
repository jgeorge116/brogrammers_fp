import React, { Component } from 'react';
class home extends Component{ //add logic
    handleLogout = () => {
        this.props.history.push('/logout')
    }

    render() {
        return( //add logic..
            <div>
                <header className="App-header">
                    <h1>HOMEEEE...</h1>
                    <link rel="stylesheet" href="style/styles.css"></link>
                </header>  
                <button id="logout" onClick={this.handleLogout}>Logout</button> 
            </div>
        )
    }
}
export default home