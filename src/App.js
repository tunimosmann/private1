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
		}
	}
	//CONSTRUCTOR END

	//FUNCTIONS START
	logIn = () => {
		//login with GitHub
		auth.signInWithPopup(provider).then(result => {
			//updating state
			this.setState({
				user: result.user,
			})
			
			//creating an username
			const userName = result.user.email.toLowerCase().split("@")[0];

			this.setState({
				userName: userName
			})

			// if (result.user.displayName) {
				
			// } else {
			// 	const emailUser = 

			// 	this.setState({
			// 		userName: emailUser
			// 	})
			// }	

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
			})

			//redirecting to home
			window.location.href = "/";
		})
	}
	//FUNCTIONS END

	//RENDER START
	render() {
		return (
			<Router>
				<div className="App">
					<header className="header">
						<button className="header__button" onClick={this.logIn}>Log In</button>
						<button className="header__button" onClick={this.logOut}>Log Out</button>
					</header>



					<main className="main">
						<section className="home">
							{
								this.state.user === null && window.location.href === "http://localhost:3000/" 
								? (
									<div className="home__wrapper">
										<h2 className="home__h2 heading__h2">Hello!</h2>

										<p className="home__text">Please login if you want to save images to your gallery.</p>

										<p className="home__text">You can check other people's galleries by visiting https://tread-a683d.firebaseio.com/username</p>
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
					const userName = user.email.toLowerCase().split("@")[0];

					this.setState({
						userName: userName
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
		if (this.dbUserImages) {
			this.dbUserImages.off();
		}
	}
}

export default App;
