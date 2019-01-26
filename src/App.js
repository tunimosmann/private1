import React, { Component } from 'react';
import firebase from "./firebase.js"
import './App.css';

//VARIABLES START
const provider = new firebase.auth.GithubAuthProvider();

const auth = firebase.auth()

//VARIABLES END

class App extends Component {
	//CONSTRUCTOR START
	constructor() {
		super();
		this.state = {
		}
	}
	//CONSTRUCTOR END

	//FUNCTIONS START
	logIn = () => {
		auth.signInWithPopup(provider).then(result => {
			// This gives you a GitHub Access Token. You can use it to access the GitHub API.
			// const token = result.credential.accessToken;
			
			const userName = result.user.displayName.toLowerCase().split(" ").join("")
			
			this.setState({
			user: result.user,
			userName: userName
			})
			
			console.log(userName, this.state.user.uid);
   	});
  	}
	//FUNCTIONS END

	//RENDER START
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<button className="logIn" onClick={this.logIn}>Login</button>

					{
						this.state.user 
						? ( 
							<div className="greeting">
								<h2>Hello {this.state.userName}</h2>
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
				this.dbUser = firebase.database().ref(`/${user.uid}`);

				this.dbUser.on("value", snapshot => {
					this.setState({
						dbUser: snapshot.val() || {}
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
