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
        if(this.props.route_image){
            this.setState({
                image: this.props.route_image,
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
    // Sets base64 to state to be previewed.
    // calls setFormData from EditRoute and sets the formData to state there so it can be sent
    //through redux when the route is posted or edited
        let setImage = (base64, file) => {
            this.setState({
                image: base64,
            })
            let formData = new FormData();
            formData.set('abc', file)
            this.props.setFormData(formData)
       }
    // binds this.state and this.props into setImage.
        setImage = setImage.bind(this);

    //invokes readImage and passed in the file object that we get from the form.
        readImage(this.fileInput.files[0])   
    }


//gets the filename from state and sends it through redux to remove the image from our db / s3/ and redux state
removeImage(){
        let fileName = this.state.image.split('.com/')[1]
        Promise.resolve(this.props.removeImage(this.props.route_id, fileName))
            .then(response=>{
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
                    <button className='pink-button remove-image' onClick={()=>this.removeImage()}>X</button>
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