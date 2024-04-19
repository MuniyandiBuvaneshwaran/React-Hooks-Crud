// index.js (or the entry point of your app)
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import Store from './Store'; // Import your Redux store

import App from './App'; // Your root component
import Store from './Components/Pages/reduxsaga/Reducer/Store';

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
