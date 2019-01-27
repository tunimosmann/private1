import React, { Component } from 'react';

class Gallery extends Component {
    render() {
        return(
            <section className="userGallery">
               <div className="userGallery__wrapper">
                  <h2 className="userGallery__h2 heading__h2">{this.props.greetingName}'s Gallery</h2>

						<div className="userGallery__images">
						  {
							  this.props.dbUserImages.map((image, i) => {
								  return (
										<div className="userGallery__imageContainer" id={i}>
										  <img src={image[1].url} alt="" className="userGallery__image"/>
										</div>
								  )
							  })
						  }
						</div>
               </div>
            </section>
        )
    }
}

export default Gallery;