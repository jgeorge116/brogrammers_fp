import React, { Component, Fragment } from "react";
import Cookies from "js-cookie";
import Button from "@material-ui/core/Button";
import Navbar from "./navbar";
import {DropzoneArea} from 'material-ui-dropzone'

class addMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content:"",
      files:[]
    };
  }


  handleChange(files) {
      this.setState({
          files: files,
      });
  }

  handleRequest = e => {
    e.preventDefault();
    if (
      this.state.files[0] === ""
    ) {
      alert("MEDIA FIELD IS EMPTY!");
    } else {
      let formData = new FormData();
      formData.append('content', this.state.files[0]);
      console.log(formData.get('content'));
      (async () => {
        const res = await fetch("http://localhost:4000/addmedia", {
          method: "POST",
          credentials: "include",
          headers: {
            "Authorization": "Bearer " + Cookies.get("access_token")
          },
          body: formData
        });
        let content = await res.json();
        this.setState({ id: content.id });
        if (content.status === "error") alert("Error: " + content.error);
        else {
          this.props.history.push({
            pathname: `/fmedia/${this.state.id}`
          });
        }
      })();
    }
  };

  
  render() {
    return (
      <div>
        <Fragment>
          <Navbar />
        </Fragment>
        <div className="mediaContainer">
          <header className="App-header">
            <link rel="stylesheet" href="style/styles.css" />
          </header>
          <h1>Submit your Media</h1>
          <form onSubmit={this.handleRequest} encType="multipart/form-data">
              <div>
                <DropzoneArea
                    onChange={this.handleChange.bind(this)}
                    acceptedFiles={['image/*', 'video/*']}
                    maxFileSize={50000000}
                    filesLimit={1}
                />
              </div><br />
              <Button variant="contained" type="submit">yeah boy!</Button>
           </form>
        </div>
      </div>
    );
  }
}
export default addMedia;
