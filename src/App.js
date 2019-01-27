import React, { Component } from 'react';
import firebase from "./firebase.js"
// import { read } from 'fs';

//VARIABLES START
const provider = new firebase.auth.GithubAuthProvider();
const auth = firebase.auth();
// const storage = firebase.database().ref();

//VARIABLES END

class App extends Component {
	//CONSTRUCTOR START
	constructor() {
		super();
		this.state = {
			user: null,
			userName: null,
			greetingName: null,
			imageURL: "",
			imageFile: "",
			fileName: "",
			dbUser: {},
		}
	}
	//CONSTRUCTOR END

	//FUNCTIONS START
	logIn = () => {
		auth.signInWithPopup(provider).then(result => {
			// This gives you a GitHub Access Token. You can use it to access the GitHub API.
			// const token = result.credential.accessToken;
			
			const userName = result.user.displayName.toLowerCase().split(" ").join("");

			const greetingName = result.user.displayName.split(" ")[0]
			
			this.setState({
			user: result.user,
			userName: userName,
			greetingName: greetingName
			})
   	});
	}
	  
	logOut = () => {
		auth.signOut().then(() => {
			this.setState({
				user: null,
				userName: null,
				greetingName: null
			})
		})
	}

	handleFileSelection = event => {
		//the selected file
		const selectedImage = event.target.files[0];

		const fileName = event.target.files[0].name;

		//transforming the file into data url
		let readImage = new FileReader();

		readImage.readAsDataURL(selectedImage);

		//updating state with the result
		readImage.onload = () => {
			this.setState({
				imageURL: readImage.result
			})
		}

		//updating state with the image file and name
		this.setState({
			imageFile: selectedImage,
			fileName: fileName
		})
	}

	handleFileSubmition = event => {
		event.preventDefault();

		const imageList = this.state.dbUserImages

		const checkImage = imageList.every(image => image[1].name !== this.state.fileName);

		if (checkImage) {
			const newImage = {
				url: this.state.imageURL,
				name: this.state.fileName
			};

			this.dbUserImages.push(newImage);
		} else {
			alert("You already uploaded this image!")
		};

		this.setState({
			imageURL: "",
			imageFile: "",
			fileName: "",
		});
	}

	//FUNCTIONS END

	//RENDER START
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<button className="logIn" onClick={this.logIn}>Log In</button>
					<button className="logIn" onClick={this.logOut}>Log Out</button>

					{
						this.state.user 
						? ( 
							<div className="greeting">
									<h2>Hello {this.state.greetingName}</h2>

									<label htmlFor="uploadImage">Upload an Image</label>
									<input type="file" id="uploadImage" accept="image/*" onChange={this.handleFileSelection}/>

									<input type="submit" value="Upload Image" onClick={this.handleFileSubmition}/>
							</div>
						) 
						: (
							<div className="greeting">
								<h2>Please login</h2>
							</div>
						)
					}		
				</header>
			</div>
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

					const greetingName = user.displayName.split(" ")[0]

					this.setState({
						userName: userName,
						greetingName: greetingName 
					})

					//USER INFO
					this.dbUser = firebase.database().ref(`/${user.uid}`);

					this.dbUser.on("value", snapshot => {
						this.setState({
							dbUser: snapshot.val() || {}
						})
					})

					//USER IMAGES
					this.dbUserImages = firebase.database().ref(`/${userName}/images`); 

					this.dbUserImages.on("value", snapshot => {
						if (snapshot.val()) {

							const imagesArray = Object.entries(snapshot.val())

							this.setState({
								dbUserImages: imagesArray
							})
						} else {
							this.setState({
								dbUserImages: []
							})
						}
					})	
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
  }
}

export default App;
