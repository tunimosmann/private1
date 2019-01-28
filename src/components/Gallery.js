import React, { Component } from 'react';
import firebase from "../firebase.js";
import MyGallery from "./MyGallery.js";
import UserGallery from "./UserGallery.js";

//VARIABLES START
const auth = firebase.auth();
const activePage = window.location.href.split("/").reverse()[0];
//VARIABLES END

class Gallery extends Component {
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
            generatedLink: "",
            dbUserImages: []
        }
    }
    //CONSTRUCTOR END
    
    //FUNCTIONS START
    generateLink = (event) => {
        event.preventDefault();

        const imageName = event.target.id;

        const imagePath = `https://tread-a683d.firebaseio.com/${this.state.userName}/${imageName}`;

        this.setState({
            generatedLink: imagePath
        })
    }

    //FUNCTIONS END

    //RENDER START
    render () {
        return (
            <section className="userGallery">
                {
                    this.state.userName === activePage 
                    ? (
                        <MyGallery 
                        userName={this.state.userName}
                        greetingName={this.state.greetingName}
                        generateLink={this.generateLink}
                        generatedLink={this.state.generatedLink}
                        />
                    ) 
                    : (
                        <UserGallery 
                        user={this.state.user}
                        userName={this.state.userName}
                        dbUserImages={this.state.dbUserImages}
                        activePage={activePage}
                        generateLink={this.generateLink}
                        generatedLink={this.state.generatedLink}
                        />
                    )
                }

                {/* <Route path="/:userName" component={Gallery} /> */}
            </section>
        )
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

                    if (user.displayName) {
                        
                        // const userName = user.displayName.toLowerCase().split(" ").join("");
                        const greetingName = user.displayName.split(" ")[0]

                        this.setState({
                            userName: userName,
                            greetingName: greetingName
                        })
                    } else {
                        this.setState({
                            userName: userName,
                            greetingName: userName
                        })
                    };	

                    //USER IMAGES
                    this.dbUserImages = firebase.database().ref(`/${this.state.userName}/images`);

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
        if (this.dbUserImages) {
            this.dbUserImages.off();
        }
    }
	//COMPONENT WILL UNMOUNT END
}

export default Gallery;

