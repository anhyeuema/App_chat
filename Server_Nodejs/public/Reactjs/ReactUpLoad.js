/*

import React, { Component } from 'react'
//        const axios = require("axios");
import axios from 'axios';

class ReactUploadImage extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            file: null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onFormSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('myImage',this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("/upload",formData,config)
            .then((response) => {
                alert("The file is successfully uploaded");
            }).catch((error) => {
        });
    }
    onChange(e) {
        this.setState({file:e.target.files[0]});
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>
                <h1>File Upload</h1>
                <input type="file" name="myImage" onChange= {this.onChange} />
                <button type="submit">Upload</button>
            </form>
        )
    }
} */

/*

class App extends React.Component {
    state = {
        SelectedFile: null
    }
    fileSelectedHandler = event => {
        console.log(event.target.files[0])
        this.setState({
            SelectedFile: event.target.files[0],

        })
    }

    fileUploadHandler() {
        const fd = new FormData();
        fd.append('image', this.state.SelectedFile, this.state.SelectedFile.name);
        axios.post("http://localhost:2800/React/upload",fd, {
            onUploadProgress: ProgressEvent => {
                
            }

        })
            .then((response) => {
                console.log('v:::response',response);
            }).catch((error) => {
            });
    }
    render() {
        return (
            <div className="App">
                <h1>File Upload</h1>
                <input type="file" name="myImage" onChange={this.fileSelectedHandler} />
                <button onClick={this.fileUploadHandler} >Upload</button>
            </div>
        )
    }
}

// export default ReactUploadImage


/*
class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
       // this.fileInput = React.createRef();
    }
    handleSubmit(event) {
        event.preventDefault();
        alert(
            `Selected file - ${
            this.fileInput.current.files[0].name
            }`
        );
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Upload file:
            <input type="file" ref={this.fileInput} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        );
    }
}
*/

ReactDOM.render(
    <div>
        <div>
         
        </div>

    </div>

    , document.getElementById('root')
);