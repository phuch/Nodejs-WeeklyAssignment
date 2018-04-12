import React, { Component } from 'react';
import '../styles/App.css';
import '../styles/react-tabs.css';
import ImageCards from './ImageCards';
import Modal from './Modal';
import Form from './Form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import EditForm from './EditForm';
import SearchBar from './SearchBar';

class App extends Component {

  constructor() {
    super();
    this.state = {
      images: [],
      showModal: false,
      showEditForm: false,
      modalInfo: null,
      recipeInfo: null
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/recipes/')
    .then(res => {
      this.setState({images: res.data});
    }).catch(err => {
      console.log(err);
    });
  }

  toggleModal = (info) => {
    this.setState({
      showModal: !this.state.showModal,
      modalInfo: info
    });
  };

  toggleEditForm = (info) => {
    this.setState({
      showEditForm: !this.state.showEditForm,
      recipeInfo: info
    })
  };

  deleteRecipe = () => {
    axios.get('http://localhost:8080/recipes/')
    .then(res => {
      this.setState({images: res.data});
    }).catch(err => {
      console.log(err);
    });
  };

  seachRecipe = (value) => {
    axios.get('http://localhost:8080/recipes/', {
      params: {
         search: value
      }
    }).then(res => {
      console.log(res);
      this.setState({images: res.data});
    }).catch(err => {
      console.log(err);
    });
  };

  render() {
    const categories = this.state.images
                        .map((image) => image.category)
                        .filter(
                          (category,index, self) => index === self.indexOf(category)
                        );

    return (
      <main>
        <SearchBar searchRecipe={this.seachRecipe}/>
        <Tabs>
          <TabList>
            <Tab>Recipes</Tab>
            <Tab>Add</Tab>
          </TabList>
          <TabPanel>
            {this.state.images.length ?
              <div className="App">
                {categories.map((category) => {
                  return (
                    <ul key={category} className="img-container">
                      <h2>{category}</h2>
                      {this.state.images.filter((img) => img.category === category)
                                        .map((img)=> {
                                          return (
                                            <li className="img-card" key={img._id}>
                                              <ImageCards toggleModal={this.toggleModal} image={img}/>
                                            </li>
                                          );
                                        })
                      }
                    </ul>
                  );
                })}

                {this.state.showModal &&
                  <Modal modalInfo={this.state.modalInfo}
                         show={this.state.showModal}
                         toggleModal={this.toggleModal}
                         deleteRecipe={this.deleteRecipe}
                         editRecipe={this.toggleEditForm}
                         toggleEditForm={this.toggleEditForm}
                  />
                }

                {this.state.showEditForm &&
                  <EditForm show={this.state.showEditForm}
                            toggleEditForm={this.toggleEditForm}
                            recipeInfo={this.state.recipeInfo}
                            showEditForm={this.state.showEditForm}
                  />
                }
              </div>
                :
              <h3 className="search-empty">There are no recipes found</h3>
            }
          </TabPanel>
          <TabPanel>
            <h2>Add a recipe</h2>
            <Form/>
          </TabPanel>
        </Tabs>
      </main>
    );
  }
}

export default App;
