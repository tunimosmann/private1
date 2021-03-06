import React, { Component } from 'react';
import firebase from "../firebase.js";

//VARIABLES START
const activePage = window.location.href.split("/").reverse()[0];
// const activeGallery = firebase.database().ref(`/${activePage}/images`);
//VARIABLES END

class UserGallery extends Component {
    constructor() {
        super();
        this.state = {
            activeGallery: [],
            dbUserImages: []
        }
    }

    //FUNCTION START
    addToGallery = (event) => {
        event.preventDefault();

        //getting the url of the image
        const newImageURL = event.target.id;

        //giving a name to the image
        const newImageName = prompt("Give this image an unique name");

        //getting all stored images
        const imageList = this.state.dbUserImages

        //checking if user already updated an image with that name or URL
        //return true if all stored images have a file name different than the new image name
        const checkImage = imageList.every(image => image[1].name !== newImageName);
        //return true if all stored images have an URL different than the new image URL
        const checkURL = imageList.every(image => image[1].url !== newImageURL);
        //if true (all stored images have a different file name)
        if (checkImage && checkURL) {
            //store new values and push to firebase
            const newImage = {
                url: newImageURL,
                name: newImageName
            };

            //the path to user images
            const imagesPath = firebase.database().ref(`/${this.props.userName}/images`);

            imagesPath.push(newImage);

            alert("Image added!");
        } else { //if false (there's an image with that file name already)
            //alert user
            alert("You already uploaded this image or an image with the same name!")
        };
    }
    //FUNCTION END

    //RENDER START
    render() {
        return (
            <div className="userGallery__wrapper wrapper">
                <div className="userGallery__gallery">
                    {
                        this.props.user
                        ? (
                            <a href={`https://tread-a683d.firebaseapp.com/${this.props.userName}`} className="userGallery__link">Back to Your Gallery</a>
                        )
                        : (
                            <div className="empty"></div>  
                        )
                    }
                    
                    <h2 className="userGallery__h2 heading__h2">{this.props.activePage}'s Gallery</h2>

                    <div className="userGallery__items">
                        {
                            this.state.activeGallery.length === 0
                            ? (
                                <div className="userGallery__empty">
                                    <p className="userGallery__text">This gallery doesn't have any images yet.</p>
                                </div>
                            )
                            : (
                                this.state.activeGallery.map((image, i) => {

                                    const imageName = image[1].name.split(".")[0];

                                    const nameTurnedPath = image[1].name.split(".")[0].split(" ").join("").toLowerCase()

                                    return (

                                        <div className="userGallery__item" key={i}>
                                            <div className="userGallery__imageContainer">
                                                <img src={image[1].url} alt={imageName} className="userGallery__image" />
                                            </div>

                                            <h3 className="userGallery__title">{imageName}</h3>

                                            <button className="userGallery__button" onClick={this.props.generateLink} id={nameTurnedPath}>Generate Link</button>

                                            {
                                                this.props.generatedLink.split("/").reverse()[0] === nameTurnedPath
                                                    ? (
                                                        <p className="userGallery__text">{this.props.generatedLink}</p>
                                                    )
                                                    : (
                                                        <div className="empty"></div>
                                                    )
                                            }

                                            {
                                                this.props.user
                                                ? (
                                                    <button className="userGallery__button" onClick={this.addToGallery} id={image[1].url}>Add to My Gallery</button>
                                                )
                                                : (
                                                    <div className="empty"></div>
                                                )
                                            }   
                                        </div>
                                    )
                                })
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
    //RENDER END

    //COMPONENT DID MOUNT START
    componentDidMount() {
        this.activeGallery = firebase.database().ref(`/${activePage}/images`);
        
        this.activeGallery.on("value", snapshot => {
            if (snapshot.val()) {

                const imagesArray = Object.entries(snapshot.val())

                this.setState({
                    activeGallery: imagesArray
                })
            } else {
                this.setState({
                    activeGallery: []
                })
            }
        });
    }
    //COMPONENT DID MOUNT END

    //COMPONENT WILL UNMOUNT START
    componentWillUnmount() {
        if (this.activeGallery) {
            this.activeGallery.off();
        };
    }
	//COMPONENT WILL UNMOUNT END
}

export default UserGallery;