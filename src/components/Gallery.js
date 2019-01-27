import React, { Component } from 'react';
import firebase from "../firebase.js";

class Gallery extends Component {

	deleteImage = (event) => {
		event.preventDefault();

		const key = event.target.id;

		const imagePath = firebase.database().ref(`/${this.props.userName}/images/${key}`); 

		imagePath.remove();	
	}

    render() {
        return(
            <section className="userGallery">
               <div className="userGallery__wrapper">
                	<h2 className="userGallery__h2 heading__h2">{this.props.greetingName}'s Gallery</h2>

					<p className="userGallery__text">You can share your gallery by using this link:</p>

					<a href="" className="userGallery__link">{`https://tread-a683d.firebaseio.com/${this.props.userName}`}</a>

					<div className="userGallery__items">
						{
						this.props.dbUserImages.length === 0
						? (
							<div className="userGallery__empty">
								<p className="userGallery__text">You don't have any images.</p>
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

										<button onClick={this.deleteImage} id={image[0]}>Delete Image</button>

										{/* <button onClick={this.addToGallery} id={image[1].name}>Add to My Gallery</button> */}
									</div>
								)
							})
						)
						}
					</div>
               </div>
            </section>
        )
    }
}

export default Gallery;