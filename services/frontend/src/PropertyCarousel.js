// src/PropertyCarousel.js
import React, { useState, useEffect, useCallback } from 'react';
import { Carousel } from 'react-responsive-3d-carousel';
import 'react-responsive-3d-carousel/dist/styles.css';

const PropertyCarousel = ({ urls, startIndex, onChangeIndex }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [curIndex, setCurIndex] = useState(startIndex)
    const handleClickCenteredItem = (index) => {
        // TODO: Want to find a library that I can use to make this image full screen to view entirely. 
        // react-photo-view might be useful
        setSelectedImage(urls[index]);
      };
      
    const items = urls.map((url, index) => (
        <img key={index} src={url} alt={index} /> 
    ));

    useEffect(() => {
        setCurIndex(startIndex);
    }, [startIndex]);

    const onChange = useCallback((index) => {
        setCurIndex(index);
        if (onChangeIndex) onChangeIndex(index);
    }, [onChangeIndex]);

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
            onChange={onChange} 
            onClickCenteredItem={handleClickCenteredItem}
            items={items}/>
        </div>
    );
};

export default PropertyCarousel;
