import React from 'react';

const ImageCards = props => (

  <div className="card">
    <img className="card-img-top" src={props.image.thumbnail} alt="Card" styles={{width:'100%'}}/>
    <div className="card-body">
      <h4 className="card-title">{props.image.title}</h4>
      <p className="card-text">{props.image.details}</p>
      <button className="btn btn-primary">See Profile</button>
    </div>
  </div>

);

export default ImageCards;

