import React, { Component } from 'react';
import logo from './resources/logo.svg';
import linkedin from './resources/iconmonstr-linkedin-3.svg'
import './App.css';
import Dropzone from 'Components/Hooks/Dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { falink } from '@fortawesome/free-solid-svg-icons';

library.add(faUpload);
library.add(faFilePowerpoint);
library.add(faTrash);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Created by Carl Calaquian
          </p>
          <div className="linkcontainer"> 
            <img src={linkedin} className="linkedin-logo" alt="logo" />&nbsp;
            <a
              className="linkedin-link"
              href="https://linkedin.com/in/camcalaquian/"
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </div>
         
        </header>
        <div className="dropzone-container">
          <Dropzone/>
        </div>
        
      </div>
    );
  }
}

export default App;
