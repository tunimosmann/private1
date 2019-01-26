import React, { Component } from 'react';
import firebase from "./firebase.js"

//VARIABLES START
const provider = new firebase.auth.GithubAuthProvider();

const auth = firebase.auth()

//VARIABLES END

class App extends Component {
	//CONSTRUCTOR START
	constructor() {
		super();
		this.state = {
			user: null,
			userName: null,
			greetingName: null
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
					this.state.userName = this.state.user.displayName.toLowerCase().split(" ").join("");

					this.state.greetingName = this.state.user.displayName.split(" ")[0]

					this.dbUser = firebase.database().ref(`/${user.uid}`);

					this.dbUser.on("value", snapshot => {
						this.setState({
							dbUser: snapshot.val() || {}
						})
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
