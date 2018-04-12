import React, { Component } from 'react';
import axios from 'axios';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      //imgPrev: null,
    }
  }

  handleSubmit = (e) => {
    console.log('handle uploading');
    const formData = new FormData(e.target);
    formData.append('file', this.state.file);

    axios({
      method: 'post',
      url: '/recipes',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then((res) => {console.log(res);})
    .catch((error) => {console.log(error);});
  };

  handleEdit = (e) => {
    e.preventDefault();
    console.log('start editing');
    const formData = new FormData(e.target);
    formData.append('file', this.state.file);

    const url = '/recipes/' + this.props.recipeInfo._id;
    axios({
      method: 'put',
      url: url,
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then((res) => {console.log(res);})
    .catch((error) => {console.log(error);});
  };


  handleImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        //imgPrev: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  render() {
    //const {imgPrev} = this.state;
    return (
      <form className="img-form" onSubmit={!this.props.showEditForm ? (e) => this.handleSubmit(e): (e) => this.handleEdit(e)}>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text"
                 className="form-control"
                 id="category"
                 placeholder="Enter category"
                 name="category"
                 defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.category}`: ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Dish's name</label>
          <input type="text"
                 className="form-control"
                 id="title"
                 placeholder="Enter the name of the dish"
                 name="title"
                 defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.title}`: ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="desc">Description</label>
          <textarea className="form-control"
                    id="desc"
                    name="details"
                    defaultValue={this.props.showEditForm ? `${this.props.recipeInfo.details}`: ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">{this.props.showEditForm ? `Change image` : `Image`}</label>
          <input type="file"
                 onChange={(e) => this.handleImageChange(e)}
                 className="form-control"
                 ref={(input) => this.input = input}
                 id="image"
          />
        </div>

        {/*{this.state.imgPrev &&*/}
          {/*<div><img src={imgPrev} className="img-preview" alt="prev"/></div>*/}
        {/*}*/}

        <button type="submit" className="btn btn-primary submit-btn">{this.props.showEditForm ? `Save` : `Submit`}</button>
      </form>

    );
  }
}

export default Form;

