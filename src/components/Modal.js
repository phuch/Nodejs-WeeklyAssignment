import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
const GOOGLE_MAP_KEY = 'AIzaSyBs07YNX4Jell2IAOW0NasfblozQAHki7Y';

class Modal extends Component {

  render() {

    if (!this.props.show) {
     return null
    }
    return (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">{this.props.modalInfo.title}</h4>
                <button type="button" className="close" onClick={this.props.toggleModal}>&times;</button>
              </div>
              <div className="modal-body">
                {this.props.modalInfo.coordinates &&
                  <Map
                      className="google-map"
                      google={this.props.google}
                      zoom={12}
                      center={{
                        lat: this.props.modalInfo.coordinates.lat,
                        lng: this.props.modalInfo.coordinates.lng
                      }}
                  >
                    <Marker position={{
                      lat: this.props.modalInfo.coordinates.lat,
                      lng: this.props.modalInfo.coordinates.lng
                    }}/>
                  </Map>
                }
                <img src={this.props.modalInfo.image} alt="thumb" width="100%"/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.props.toggleModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAP_KEY)
})(Modal)