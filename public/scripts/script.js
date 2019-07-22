document.addEventListener('DOMContentLoaded', function() {
    // // 🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //

    console.log("It works!");

    //get elements
    const signInBtn = document.querySelector("#signInBtn");
    const signUpBtn = document.querySelector("#signUpBtn");
    const signOutBtn = document.querySelector("#signOutBtn");
    const emailInput = document.querySelector("#inputEmail");
    const passInput = document.querySelector("#inputPass");

    signUpBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const pass = passInput.value;
        firebase.auth().createUserWithEmailAndPassword(email, pass)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    })

    signInBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const pass = passInput.value;
        firebase.auth().signInWithEmailAndPassword(email, pass)
        .then(user => {
            fetch(`https://us-central1-do-it-app-1b4c7.cloudfunctions.net/getUserData?user=${user.uid}`)
            .then(data => {
                console.log(data);
            })
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    })

    signOutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    })

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid);
            signOutBtn.classList.remove('hide');
            
        } else {
            console.log("Not logged in");
            signOutBtn.classList.add('hide');
        }
    })
    // // 🔥
  });