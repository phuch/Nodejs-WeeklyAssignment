import React, { Component } from 'react';
import EXIF from 'exif-js';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imgPrev: null
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('handle uploading');
  };

  handleImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imgPrev: reader.result
      });
    };
    this.readEXIF(file);
    reader.readAsDataURL(file);
  };

  readEXIF = (image) => {
    let decimalLng, decimalLat;
    EXIF.getData(image, function() {
      const lng = EXIF.getTag(this, "GPSLongitude");
      const lat = EXIF.getTag(this, "GPSLatitude");
      if (lng && lat) {
        decimalLng = convertCoor(lng);
        decimalLat = convertCoor(lat);
        console.log({lat: decimalLat, lng: decimalLng});
      } else {
        console.log("No GPS data");
      }
    });

    const convertCoor = (number) => {
      return number[0].numerator + number[1].numerator /
          (60 * number[1].denominator) + number[2].numerator /
          (3600 * number[2].denominator);
    }
  };


  render() {

    const {imgPrev} = this.state;
    return (
      <form className="img-form" onSubmit={(e) => this.handleSubmit(e)}>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text" className="form-control" id="category" placeholder="Enter category" name="category"/>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" id="title" placeholder="Enter title" name="title"/>
        </div>

        <div className="form-group">
          <label htmlFor="desc">Description</label>
          <textarea className="form-control" id="desc" name="desc"/>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input type="file"
                 onChange={(e) => this.handleImageChange(e)}
                 className="form-control"
                 ref={(input) => this.input = input}
                 id="image"
                 name="image"/>
        </div>

        {this.state.imgPrev &&
          <div><img src={imgPrev} className="img-preview" alt="prev"/></div>
        }

        <button type="submit" className="btn btn-primary submit-btn">Submit</button>
      </form>

    );
  }
}

export default Form;