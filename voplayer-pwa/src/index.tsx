import React from 'react';
import ReactDOM from 'react-dom';
import * as Route from 'react-router-dom';
import { randomBytes, createHash } from 'crypto';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import Home from './Home';
import Loading from './Loading';

function base64URLEncode(str: any) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

function sha256(buffer: any) {
  return createHash('sha256').update(buffer).digest();
};

var verifier = base64URLEncode(randomBytes(43));
var challenge = base64URLEncode(sha256(verifier));

ReactDOM.render(
  <Route.BrowserRouter>
    <React.StrictMode>
      <Route.Switch>
        <Route.Route exact path="/">
          <Home crypto={{verifier, challenge}}/>
        </Route.Route>
        <Route.Route path="/Loading">
          <Loading crypto={{verifier, challenge}}/>
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
