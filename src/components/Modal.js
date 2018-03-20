import React, { Component } from 'react';

class Modal extends Component {

  render() {

    if (!this.props.show) {
     return null
    }

    return (
        <div className="modal-overlay">
          <div class="modal">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.props.toggleModal}>&times;</button>
                <h4 className="modal-title">{this.props.modalInfo.title}</h4>
              </div>
              <div className="modal-body">
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
export default Modal;