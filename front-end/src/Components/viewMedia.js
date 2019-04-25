import React, { Component, Fragment } from "react";
import Navbar from "./navbar";
import CircularProgress from "@material-ui/core/CircularProgress";

class viewMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            isLoading: true,
            media:""
        };
    }

    async componentDidMount() {
        this.setState({
          id: this.props.match.params.id,
          isLoading: true // for checking if question was feteched
        });
        this.getMedia();
    }
    
    getMedia = _ => {
        fetch(`http://localhost:4000/media/${this.props.match.params.id}`)
            .then(response => response.blob())
            .then(data => {
            if (data) {
                this.setState({ media: data, isLoading: false });
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({url: e.target.result});
                }
                reader.readAsDataURL(this.state.media);
            }
            })
            .catch(err => console.error(err));
    };

    render() {
        if (this.state.isLoading) {
          return <CircularProgress size="100" />;
        } else {
            return (
                <div>
                    <Fragment>
                        <Navbar />
                    </Fragment>
                    
                    <img src={this.state.url} alt="" />
                </div>
            );

        }
    }
}


export default viewMedia;
