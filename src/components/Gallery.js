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
                        dbUserImages={this.state.dbUserImages}
                        />
                    ) 
                    : (
                        <UserGallery 
                        user={this.state.user}
                        dbUserImages={this.state.dbUserImages}
                        activePage={activePage}
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
        if (this.dbUserImages) {
            this.dbUserImages.off();
        }
    }
	//COMPONENT WILL UNMOUNT END
}

export default Gallery;

