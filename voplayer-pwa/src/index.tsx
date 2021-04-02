// @ts-nocheck

import React from 'react';
import ReactDOM from 'react-dom';
import * as Route from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import Home from './Home';
import Loading from './Loading';
import Ui from './Ui';

ReactDOM.render(
  <Route.BrowserRouter>
    <React.StrictMode>
      <Route.Switch>
        <Route.Route exact path="/">
          <Home/>
        </Route.Route>
        <Route.Route path="/Loading">
          <Loading/>
        </Route.Route>
        <Route.Route path="/Ui">
          <Ui/>
        </Route.Route>
      </Route.Switch>
    </React.StrictMode>
  </Route.BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
