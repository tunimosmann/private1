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
			imageLink: "",
			dbUserImages: []
		}
	}
	//CONSTRUCTOR END

	//FUNCTIONS START

	//selecting a file
	handleFileSelection = event => {
		//the selected file
		const selectedImage = event.target.files[0];

		//the name of the file
		const fileName = event.target.files[0].name.split(".")[0];

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

		const file = this.state.fileName;

		if (file.trim() !== "") {
			//getting all stored images
			const imageList = this.state.dbUserImages

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

				document.getElementById("imageFile").value = "";
			} else { //if false (there's an image with that file name already)
				//alert user
				alert("You already uploaded this image or an image with the same name!")
			};

			//reset state
			this.setState({
				imageURL: "",
				imageFile: "",
				fileName: "",
			});
		} else {
			alert("Please select an image file.")
		}
	}

	//selecting a link
	handleLinkSelection = event => {
		this.setState({
			[event.target.id]: event.target.value
		})
	}

	//sending the link
	handleLinkSubmition = event => {
		event.preventDefault();

		const link = this.state.imageLink;

		//checking if the input is not empty
		if (link.trim() === "") {
			alert("Please provide a link to an image");
		} else if (link.search("http") === -1) { //checking if the user typed the link with or without http
			alert("Plese provide a link with http or https");
		} else {
			//giving a name to the image
			const newImageName = prompt("Give this image an unique name");

			//getting all stored images
			const imageList = this.state.dbUserImages

			//checking if user already updated that file
			//return true if all stored images have a file name different than the new image name
			const checkImage = imageList.every(image => image[1].name !== newImageName);

			//if true (all stored images have a different file name)
			if (checkImage) {
				//store new values and push to firebase
				const newImage = {
					url: this.state.imageLink,
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

			//reset state
			this.setState({
				imageLink: ""
			});
		}
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
        return (
            <div className="userGallery__wrapper">
				<div className="userGallery__panel">
					<h2 className="userGallery__h2 heading__h2">Hello {this.props.greetingName}</h2>

					<form action="" className="userGallery__form form" onSubmit={this.handleFileSubmition}>
						<label htmlFor="imageFile" className="form__label">Upload an image from your computer:</label>
						<input
							type="file"
							className="form__entry"
							id="imageFile"
							accept="image/*"
							onChange={this.handleFileSelection}
						/>

						<input
							type="submit"
							className="form__submit"
							value="Upload Image"
						/>
					</form>

					<form action="" className="userGallery__form form" onSubmit={this.handleLinkSubmition}>
						<label htmlFor="imageLink" className="form__label">Upload using an image link:</label>
						<input
							type="input"
							className="form__entry"
							id="imageLink"
							onChange={this.handleLinkSelection}
							value={this.state.imageLink}
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
						this.state.dbUserImages.length === 0
						? (
							<div className="userGallery__empty">
								<p className="userGallery__text">You don't have any images yet.</p>
							</div>			
						) 
						: (
							this.state.dbUserImages.map((image, i) => {

								const imageName = image[1].name;

								const nameTurnedPath = image[1].name.split(" ").join("").toLowerCase()

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

	//COMPONENT DID MOUNT START
	componentDidMount() {
		this.dbUserImages = firebase.database().ref(`/${this.props.userName}/images`);

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

export default MyGallery;