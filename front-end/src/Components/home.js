import React, { Component } from 'react';
class home extends Component{ //add logic
    handleLogout = () => {
        (async () => {const res = await fetch('http://localhost:4000/logout', { 
            //idk why we need this but we do according to the doc lmao
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
        const content = await res.json();
        console.log(content);
        })()
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