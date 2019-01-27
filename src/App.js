import React, { Component } from 'react';
import firebase from "./firebase.js";
import {
	BrowserRouter as Router,
	Route, Link
} from 'react-router-dom';
import Gallery from "./components/Gallery.js";
import "./App.css";

//VARIABLES START
const provider = new firebase.auth.GithubAuthProvider();
const auth = firebase.auth();
//VARIABLES END

class App extends Component {
	//CONSTRUCTOR START
	constructor() {
		super();
		this.state = {
			user: null,
			userName: null,
			// greetingName: null,
			// imageURL: "",
			// imageFile: "",
			// fileName: "",
			dbUser: {},
			dbUserImages: []
		}
	}
	//CONSTRUCTOR END

	//FUNCTIONS START
	logIn = () => {
		//login with GitHub
		auth.signInWithPopup(provider).then(result => {
			// This gives you a GitHub Access Token. You can use it to access the GitHub API.
			// const token = result.credential.accessToken;
			
			//creating an username
			const userName = result.user.displayName.toLowerCase().split(" ").join("");

			//getting user's first name
			// const greetingName = result.user.displayName.split(" ")[0]
			
			//updating state
			this.setState({
				user: result.user,
				userName: userName,
				// greetingName: greetingName
			})

			//redirecting to user's page
			window.location.href = `/${this.state.userName}`;
   		});
	}
	  
	logOut = () => {
		//login out and reseting state
		auth.signOut().then(() => {
			this.setState({
				user: null,
				userName: null,
				// greetingName: null
			})

			//redirecting to home
			window.location.href = "/";
		})
	}

	// //selecting a file
	// handleFileSelection = event => {
	// 	//the selected file
	// 	const selectedImage = event.target.files[0];

	// 	//the name of the file
	// 	const fileName = event.target.files[0].name;

	// 	//transforming the file into data url
	// 	let readImage = new FileReader();

	// 	readImage.readAsDataURL(selectedImage);

	// 	//updating state with the result
	// 	readImage.onload = () => {
	// 		this.setState({
	// 			imageURL: readImage.result
	// 		})
	// 	}

	// 	//updating state with the image file and name
	// 	this.setState({
	// 		imageFile: selectedImage,
	// 		fileName: fileName
	// 	})
	// }

	// //sending the image
	// handleFileSubmition = event => {
	// 	event.preventDefault();

	// 	//getting all stored images
	// 	const imageList = this.state.dbUserImages

	// 	//checking if user already updated that file
	// 	//return true if all stored images have a file name different than the file name that the user is trying to send
	// 	const checkImage = imageList.every(image => image[1].name !== this.state.fileName);

	// 	//if true (all stored images have a different file name)
	// 	if (checkImage) {
	// 		//store new values and push to firebase
	// 		const newImage = {
	// 			url: this.state.imageURL,
	// 			name: this.state.fileName
	// 		};

	// 		this.dbUserImages.push(newImage);
	// 	} else { //if false (there's an image with that file name already)
	// 		//alert user
	// 		alert("You already uploaded this image!")
	// 	};

	// 	//reset state
	// 	this.setState({
	// 		imageURL: "",
	// 		imageFile: "",
	// 		fileName: "",
	// 	});
	// }
	//FUNCTIONS END

	//RENDER START
	render() {
		return (
			<Router>
				<div className="App">
					<header className="App-header">
						<button className="logIn" onClick={this.logIn}>Log In</button>
						<button className="logIn" onClick={this.logOut}>Log Out</button>
					</header>

					<main className="main">
						<section className="home">
							{
								this.state.user === null && window.location.href === "http://localhost:3000/" 
								? (
									<div className="home__wrapper">
										<h2 className="home__h2 heading__h2">Hello!</h2>

										<p className="home__text">Please login if you want to save images to your gallery.</p>

										<p className="home__text">You can check other people's galleries by visiting https://tread-a683d.firebaseio.com/firstnamelastname</p>
									</div>
								)
								: (
									<Gallery />
								)
							}		
						</section>
					</main>
				</div>
			</Router>
		);
	}
	//RENDER END

	//COMPONENT DID MOUNT START
	componentDidMount() {
		auth.onAuthStateChanged(user => {
			if (user) {
				this.setState({
					user: user,
				}, () => {
					const userName = user.displayName.toLowerCase().split(" ").join("");

					// const greetingName = user.displayName.split(" ")[0]

					this.setState({
						userName: userName,
						// greetingName: greetingName 
					})

					//USER INFO
					// this.dbUser = firebase.database().ref(`/${user.uid}`);

					// this.dbUser.on("value", snapshot => {
					// 	this.setState({
					// 		dbUser: snapshot.val() || {}
					// 	})
					// })

					//USER IMAGES
					// this.dbUserImages = firebase.database().ref(`/${userName}/images`); 

					// this.dbUserImages.on("value", snapshot => {
					// 	if (snapshot.val()) {

					// 		const imagesArray = Object.entries(snapshot.val())

					// 		this.setState({
					// 			dbUserImages: imagesArray
					// 		})
					// 	} else {
					// 		this.setState({
					// 			dbUserImages: []
					// 		})
					// 	}
					// })	
				})	
			} else {
				this.setState({
					user: null
				})
			}
		})
	}
  //COMPONENT DID MOUNT END

  //COMPONENT WILL UNMOUNT START
  componentWillUnmount() {
		if (this.dbUser) {
			this.dbUser.off();
		}
		if (this.dbUserImages) {
			this.dbUserImages.off();
		}
	}
}

export default App;
