import React, { Component } from 'react';
import firebase from "../firebase.js";

class MyGallery extends Component {
	//CONSTRUCTOR START
	constructor() {
		super();
		this.state = {
			imageURL: "",
			imageFile: "",
			fileName: "",
		}
	}
	//CONSTRUCTOR END

	//FUNCTIONS START

	//selecting a file
	handleFileSelection = event => {
		//the selected file
		const selectedImage = event.target.files[0];

		//the name of the file
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

	//sending the image
	handleFileSubmition = event => {
		event.preventDefault();

		//getting all stored images
		const imageList = this.props.dbUserImages

		//checking if user already updated that file
		//return true if all stored images have a file name different than the file name that the user is trying to send
		const checkImage = imageList.every(image => image[1].name !== this.state.fileName);

		//if true (all stored images have a different file name)
		if (checkImage) {
			//store new values and push to firebase
			const newImage = {
				url: this.state.imageURL,
				name: this.state.fileName
			};

			//the path to user images
			const imagesPath = firebase.database().ref(`/${this.props.userName}/images`);

			imagesPath.push(newImage);

			alert("Image added!");
		} else { //if false (there's an image with that file name already)
			//alert user
			alert("You already uploaded this image!")
		};

		//reset state
		this.setState({
			imageURL: "",
			imageFile: "",
			fileName: "",
		});
	}

	//deleting an image
	deleteImage = (event) => {
		event.preventDefault();

		//getting the id of the button, that corresponds to the image node key on firebase
		const key = event.target.id;

		//the path to the image
		const imagePath = firebase.database().ref(`/${this.props.userName}/images/${key}`); 

		//removing the image
		imagePath.remove();	

		alert("Image deleted!");
	}
	//FUNCTIONS END

	//RENDER START
    render() {
        return(
            <div className="userGallery__wrapper">
				<div className="userGallery__panel">
					<h2 className="userGallery__h2 heading__h2">Hello {this.props.greetingName}</h2>

					<form action="" className="userGallery__form form" onSubmit={this.handleFileSubmition}>
						<label htmlFor="uploadImage" className="form__label">Upload an Image</label>
						<input
							type="file"
							className="form__file"
							id="uploadImage"
							accept="image/*"
							onChange={this.handleFileSelection}
						/>

						<input
							type="submit"
							className="form__submit"
							value="Upload Image"
						/>
					</form>
				</div>

               	<div className="userGallery__gallery">
                	<h2 className="userGallery__h2 heading__h2">{this.props.greetingName}'s Gallery</h2>

					<p className="userGallery__text">You can share your gallery by using this link:</p>

					<a href={`http://localhost:3000/${this.props.userName}`} className="userGallery__link">{`https://tread-a683d.firebaseio.com/${this.props.userName}`}</a>

					<div className="userGallery__items">
						{
						this.props.dbUserImages.length === 0
						? (
							<div className="userGallery__empty">
								<p className="userGallery__text">You don't have any images yet.</p>
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

										<button className="userGallery__button" onClick={this.deleteImage} id={image[0]}>Delete Image</button>
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

export default MyGallery;