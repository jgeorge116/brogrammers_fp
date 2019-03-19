import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
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
                    <link rel="stylesheet" href="style/styles.css"></link>
                </header>  
                <h1 id="homeText">HOMEEEE...</h1>
                <Button id="logout" onClick={this.handleLogout}>Logout</Button> 
            </div>
        )
    }
}
export default home