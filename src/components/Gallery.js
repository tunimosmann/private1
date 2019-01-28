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
            dbUser: {},
            dbUserImages: []
        }
    }
    //CONSTRUCTOR END
    
    //FUNCTIONS START
    copyLink = (event) => {
        event.preventDefault();

        console.log(event.target.id);
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
                        copyLink={this.copyLink}
                        />
                    ) 
                    : (
                        <UserGallery 
                        user={this.state.user}
                        userName={this.state.userName}
                        dbUserImages={this.state.dbUserImages}
                        activePage={activePage}
                        copyLink={this.copyLink}
                        />
                    )
                }
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

