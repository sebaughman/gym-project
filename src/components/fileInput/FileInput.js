import React, { Component } from 'react';
import { connect } from 'react-redux';
import {addImage, removeImage} from '../../redux/action-creators'
import './fileInput.css'


class FileInput extends Component {
    constructor(props) {
      super(props);
      this.state = {
          image: null,
          uploaded: false
      }
      this.handleSubmit = this.handleSubmit.bind(this);
    }

//receives the route image from props from the EditRoute component. 
//if it exists.... is not null then set it to state and uploaded to true
//this effects which button will show up
    componentWillMount(){
        if(this.props.routeImage){
            this.setState({
                image: this.props.routeImage,
                uploaded: true
            })
        }
    }

//this is called with +pic is clicked... it renders the preview
    handleSubmit(event) {
      event.preventDefault();
    // give us the object for handling form-data aka files from our computer
       const reader = new FileReader();
    // function .onload reads the file and .result converts it to base64.
       const readImage = (file) =>{
                reader.readAsDataURL(file);
                const allowedFileTypes = ['png', 'jpg', 'jpeg', 'gif' ]
                const fileType = file.name.split('.')[1];
                if(allowedFileTypes.includes(fileType)){
                    reader.onload = function(){
                        setImage(reader.result, file);
                    }
                }else{
                        alert("we only except images");
                    }
                }
    // Sets base64 to state.
       let setImage = (base64, file) => {
        this.setState({
            image: base64,
            fileToUpload: file,
        })
       }
    // binds this.state and this.props into setImage.
       setImage = setImage.bind(this);

    //invokes readImage and passed in the file object that we get from the form.
       readImage(this.fileInput.files[0]) 
    }

//sends the file through redux to send to the db and set to redux state
//I needed to set the image to local state here as well to allow the preview to function
uploadImage(){
        let formData = new FormData();
        formData.set('abc', this.state.fileToUpload)
        Promise.resolve(this.props.addImage(this.props.route_id, formData))
            .then(response=>{
                console.log(response)
                this.setState({
                    image: this.props.routeImage,
                    uploaded: true
                })
            })
}

//gets the filename from state and sends it through redux to remove the image from our db / s3/ and redux state
removeImage(){
        let fileName = this.state.image.split('.com/')[1]
        Promise.resolve(this.props.removeImage(this.props.route_id, fileName))
            .then(response=>{
                console.log(response)
                this.setState({
                    image: this.props.routeImage,
                    uploaded:false
                })
            })
}
    
    render() {
      return (
            <div className='routeImage' style={this.state.image ? {backgroundImage:`url(${this.state.image})`}: {fontSize: '.8em'}}>
                {this.state.image ?
                    <div>
                        { this.state.uploaded ?
                            <button className='pink-button remove-image' onClick={()=>this.removeImage()}>X</button>
                            :
                            <div>
                                <button className='inputfile-upload' onClick={()=>this.uploadImage()}></button>
                                <button className='pink-button remove-image' onClick={()=>this.removeImage()}>X</button>
                            </div>
                        }
                    </div>
                :
                    <div>
                            <input className="inputfile"
                            name='file'
                            id='file'
                            type="file"
                            ref={input => {this.fileInput = input}}
                            onChange={this.handleSubmit}
                            />
                            <div className='inputfile-label green-button'><label className='label' htmlFor="file" >+ pic</label></div>
                    </div>
                }   
            </div>
      );
    }
  }

  function mapStateToProps ({ routeImage}) {
    return { routeImage};
    }
  
  export default connect(mapStateToProps,{addImage, removeImage} )(FileInput); 