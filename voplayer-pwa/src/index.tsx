import React from 'react';
import ReactDOM from 'react-dom';
import * as Route from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import Home from './Home';
import Ui from './host/Ui';
import ClientUi from './client/Ui';

import { io } from "socket.io-client";

const ipAdress = 'localhost:3050'
const socket = io('http://' + ipAdress)

ReactDOM.render(
  <Route.BrowserRouter>
    <React.StrictMode>
      <Route.Switch>
        <Route.Route exact path="/">
          <Home/>
        </Route.Route>
        <Route.Route exact path="/Ui">
          <Ui socket={socket}/>
        </Route.Route>
        <Route.Route exact path="/client/Ui">
          <ClientUi socket={socket}/>
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
