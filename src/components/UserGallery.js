import React, { Component } from 'react';
import firebase from "../firebase.js";

class UserGallery extends Component {
    //FUNCTION START
    addToGallery = (event) => {
        event.preventDefault();

        console.log(event.target.id)
    }
    //FUNCTION END

    //RENDER START
    render() {
        return (
            <div className="userGallery__wrapper">


                <div className="userGallery__gallery">
                    <h2 className="userGallery__h2 heading__h2">{this.props.activePage}'s Gallery</h2>

                    <div className="userGallery__items">
                        {
                            this.props.dbUserImages.length === 0
                            ? (
                                <div className="userGallery__empty">
                                    <p className="userGallery__text">This gallery doesn't have any images yet.</p>
                                </div>
                            )
                            : (
                                this.props.dbUserImages.map((image) => {

                                    return (

                                        <div className="userGallery__item">
                                            <div className="userGallery__imageContainer">
                                                <img src={image[1].url} alt={image[1].name.split(".")[0]} className="userGallery__image" />
                                            </div>

                                            <h3 className="userGallery__title">{image[1].name.split(".")[0]}</h3>

                                            {
                                                this.props.user
                                                ? (
                                                    <button className="userGallery__button" onClick={this.addToGallery} id={image[1].name}>Add to My Gallery</button>
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
}

export default UserGallery;