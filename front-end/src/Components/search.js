import React, { Component } from "react"
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

class Search extends Component {
  constructor() {
    super()
    this.state = {
      limit: 25,
      accepted: false,
      timestamp: false
    };
  }

  handleRequest = e => {
    e.preventDefault()
    (async () => {
      const res = await fetch("http://localhost:4000/search", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          title: this.state.timestamp,
          body: this.state.limit,
          tags: this.state.accepted
        })
      });
      let content = await res.json();
      console.log(content) //display this content by making a separate post component (i'll do later)
    })();
  };

  handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    const name = e.target.name
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <link rel="stylesheet" href="style/styles.css" />
        </header>
        <form onSubmit={this.handleRequest}>
            <TextField
                type="text"
                name="limit"
                label="Number of Posts to Show"
                onChange={this.handleInputChange}
                margin="normal"
                variant="outlined"
                fullWidth
            />
            <br />
            <label>
            By Time Stamp? :
            <input
                name="timestamp"
                type="checkbox"
                checked={this.state.timestamp}
                onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
            By Accepted Answer? :
            <input
                name="accepted"
                type="checkbox"
                value={this.state.accepted}
                onChange={this.handleInputChange} />
            </label>
            <Button id="sub" type="submit">
            Submit
          </Button>
      </form>        
      </div>
    );
  }
}

export default Search;