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
        fetch(`/media/${this.props.match.params.id}`)
            .then(response => response.json())
            .then(data => {
            if (data.media)
                this.setState({ media: [data.media], isLoading: false });
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

                </div>
            );
        }
    }
}


export default viewMedia;