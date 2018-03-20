import React, { Component } from 'react';

class ImageCards extends Component {

  showModal = (image) => {
    const modalInfo = {
      id: image.id,
      image: image.image,
      title: image.title
    }

    this.props.toggleModal(modalInfo);
  }

  render() {
    return (
      <div className="card">
        <img className="card-img-top" src={this.props.image.thumbnail} alt="Card" style={{width:'100%'}}/>
        <div className="card-body">
          <h4 className="card-title">{this.props.image.title}</h4>
          <p className="card-text">{this.props.image.details}</p>
          <button className="btn btn-primary" onClick={() => this.showModal(this.props.image)}>View</button>
        </div>
      </div>
    );
  }
}

export default ImageCards;

