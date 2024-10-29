// src/PropertyCarousel.js
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-3d-carousel';

const PropertyCarousel = ({ urls, startIndex }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [curIndex, setCurIndex] = useState(startIndex)
    const handleClickCenteredItem = (index) => {
        // TODO: Want to find a library that I can use to make this image full screen to view entirely. 
        // react-photo-view might be useful
        setSelectedImage(urls[index]);
      };

    useEffect(() => {
        setCurIndex(startIndex);
    }, [startIndex]);
    return (
        <div>
            <Carousel
            isShadow={true}
            autoPlay={false}
            showIndicators={false}
            showStatus={true}
            isStatusShadow={false}
            statusColor={'black'}
            showArrows={true}
            arrowsDefaultColor={'lightgray'}
            isArrowsShadow={false}
            spread={'wide'}
            startIndex={curIndex}
            onClickCenteredItem={handleClickCenteredItem}>
                {urls.map((url, index) => (
                <img key={index} src={url} alt={`image-${index}`} />
                ))}
            </Carousel>
        </div>
    );
};

export default PropertyCarousel;
