import React, { Component } from 'react';
import './App.css';
import ImageCards from './components/ImageCards';
import Modal from './components/Modal';
import axios from 'axios';

class App extends Component {

  constructor() {
    super();
    this.state = {
      images: [],
      showModal: false,
      modalInfo: null
    }
  }

  componentDidMount() {
    axios.get('https://raw.githubusercontent.com/phuch/ServerSideScriptingLanguage-Week1/master/data.json')
    .then(res => {
      this.setState({images: res.data});
    });
  }

  toggleModal = (info) => {
    this.setState({
      showModal: !this.state.showModal,
      modalInfo: info
    })
  }

  render() {
    const categories = this.state.images
                        .map((image) => image.category)
                        .filter(
                          (category,index, self) => index === self.indexOf(category)
                        );

    return (
      <div className="App">
        {categories.map((category) => {
          return (
            <ul key={category} className="img-container">
              <h2>{category}</h2>
              {this.state.images.filter((img) => img.category === category)
                                .map((img)=> {
                                  return (
                                    <li className="img-card" key={img.id}>
                                      <ImageCards toggleModal={this.toggleModal} image={img}/>
                                    </li>
                                  );
                                })
              }
            </ul>
          );
        })}

        {this.state.showModal && <Modal modalInfo={this.state.modalInfo} show={this.state.showModal} toggleModal={this.toggleModal}/>}
      </div>
    );
  }
}

export default App;
