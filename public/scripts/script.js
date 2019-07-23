'use strict';

// Initializes the App.
function App() {
  document.addEventListener('DOMContentLoaded', function() {
    // Variable for url + user.uid
    this.userDataUrl = 'http://localhost:5001/do-it-app-1b4c7/us-central1/app/global';

    // Shortcuts to DOM Elements.
    this.signInButton = document.getElementById('google-btn');
    this.signOutButton = document.getElementById('sign-out-btn');
    this.responseContainer = document.getElementById('response-container');
    this.responseContainerCookie = document.getElementById('response-cookie-container');
    this.urlContainer = document.getElementById('url-container');
    this.urlContainerCookie = document.getElementById('url-cookie');
    //this.usersDataUrl = window.location.href + 'users/';
    //this.signedOutCard = document.getElementById('App-signed-out-card');
    //this.signedInCard = document.getElementById('App-signed-in-card');

    // Bind events.
    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }.bind(this));
}

// Triggered on Firebase auth state change.
App.prototype.onAuthStateChanged = function(user) {
  if (user) {
    this.urlContainer.textContent = this.userDataUrl;
    this.urlContainerCookie.textContent = this.userDataUrl;
    this.signInButton.style.display = 'none';
    this.signOutButton.style.display = 'block';
    this.startFunctionsRequest();
    this.startFunctionsCookieRequest();
  } else {
    this.signInButton.style.display = 'block';
    this.signOutButton.style.display = 'none';
  }
};

// Initiates the sign-in flow using GoogleAuthProvider sign in in a popup.
App.prototype.signIn = function() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

// Signs-out of Firebase.
App.prototype.signOut = function() {
  firebase.auth().signOut();
  // clear the __session cookie
  document.cookie = '__session=';
};

// Does an authenticated request to a Firebase Functions endpoint using an Authorization header.
App.prototype.startFunctionsRequest = function() {
  firebase.auth().currentUser.getIdToken().then(function(token) {
    console.log('Sending request to', this.userDataUrl , 'with ID token in Authorization header.');
    var req = new XMLHttpRequest();
    req.onload = function() {
      this.responseContainer.innerText = req.responseText;
    }.bind(this);
    req.onerror = function() {
      this.responseContainer.innerText = 'There was an error';
    }.bind(this);
    req.open('GET', this.userDataUrl , true);
    req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.send();
  }.bind(this));
};

// Does an authenticated request to a Firebase Functions endpoint using a __session cookie.
App.prototype.startFunctionsCookieRequest = function() {
  // Set the __session cookie.
  firebase.auth().currentUser.getIdToken(true).then(function(token) {
    // set the __session cookie
    document.cookie = '__session=' + token + ';max-age=3600';

    console.log('Sending request to', this.userDataUrl, 'with ID token in __session cookie.');
    var req = new XMLHttpRequest();
    req.onload = function() {
      this.responseContainerCookie.innerText = req.responseText;
    }.bind(this);
    req.onerror = function() {
      this.responseContainerCookie.innerText = 'There was an error';
    }.bind(this);
    req.open('GET', this.userDataUrl, true);
    req.send();
  }.bind(this));
};

// Load the App.
window.App = new App();
