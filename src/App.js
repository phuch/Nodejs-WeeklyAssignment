import React, { Component } from 'react';
import './App.css';
import ImageCards from './components/ImageCards';
import Modal from './components/Modal';

class App extends Component {

  constructor() {
    super();
    this.state = {
      images: [
        {
          "id": 12,
          "time": "2017-03-02 22:55",
          "category": "Wife",
          "title": "Title 1",
          "details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales enim eget leo condimentum vulputate. Pellentesque eu consequat justo, eu sodales eros.",
          "coordinates": {
            "lat": 60.2196781,
            "lng": 24.8079786
          },
          "thumbnail": "http://placekitten.com/320/300",
          "image": "http://placekitten.com/768/720",
          "original": "http://placekitten.com/2048/1920"
        },
        {
          "id": 15,
          "time": "2017-03-01 19:23",
          "category": "Wife",
          "title": "Title 2",
          "details": "Donec dignissim tincidunt nisl, non scelerisque massa pharetra ut. Sed vel velit ante. Aenean quis viverra magna. Praesent eget cursus urna. Sed vel velit ante.",
          "coordinates": { "lat": 60.3196781, "lng": 24.9079786 },
          "thumbnail": "http://placekitten.com/321/300",
          "image": "http://placekitten.com/770/720",
          "original": "http://placekitten.com/2041/1920"
        },
        {
          "id": 34,
          "time": "2017-12-04 09:45",
          "category": "Girlfriend",
          "title": "Title 3",
          "details": "Phasellus imperdiet nunc tincidunt molestie vestibulum. Donec dictum suscipit nibh. Sed vel velit ante. Aenean quis viverra magna. Praesent eget cursus urna. ",
          "coordinates": { "lat": 60.3196781, "lng": 24.9079786 },
          "thumbnail": "http://placekitten.com/319/300",
          "image": "http://placekitten.com/769/720",
          "original": "http://placekitten.com/2039/1920"
        }
      ],
      showModal: false,
      modalInfo: null
    }
  }

  toggleModal = (info) => {
    this.setState({
      showModal: !this.state.showModal,
      modalInfo: info
    })
  }

  render() {
    return (
      <div className="App">
        <ul className="img-container">
          {this.state.images.map((image) => {
            return (
              <li className="img-card" key={image.id}>
                <ImageCards toggleModal={this.toggleModal} image={image}/>
              </li>
            );
          })}
        </ul>
        {this.state.showModal && <Modal modalInfo={this.state.modalInfo} show={this.state.showModal} toggleModal={this.toggleModal}/>}
      </div>
    );
  }
}

export default App;
