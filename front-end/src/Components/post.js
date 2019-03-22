import React from 'react'

function Post(props) {
    return (
        <div>
            <hr/>
            <h1>By: {props.username} <br/> Reputation: {props.rep}</h1> 
            <h2>{props.title}</h2>
            <h3>{props.body}</h3>
            <h3>Views: {props.views}</h3>
            <h4>{props.time}</h4>
            <h4>Tags: {props.tags}</h4> 
            <hr/>
        </div>
    )
}

export default Post