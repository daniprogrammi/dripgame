// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
//import Asset from '../Asset/Asset';
import CanvasAsset from '../Canvas/CanvasAsset';
import Drawer from './Drawer';

export default function AssetCarousel(props){
    const [index, setIndex] = useState(0);
    const show = 3;
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    }

    const carouselItems = 
    props.carouselItems.map(item => {
            return (
                <Carousel.Item className={`carousel-item-${item.category}`} >
                        <CanvasAsset inCloset={true} key={`key${item.id}`} src={item.src} id={item.id} width={item.width} height={item.height}></CanvasAsset>
                    <Carousel.Caption>
                        <h4>{item.caption}</h4>
                    </Carousel.Caption>
                </Carousel.Item>
            );
        } 
    );
    return (
        <Drawer >
            <Carousel slide={false} controls={true} className="carousel-content" activeIndex={index} onSelect={handleSelect} children={carouselItems}>

                {/* <Carousel.Item>
                    <img className="card-img-top" src="https://tr.rbxcdn.com/b3b3a4e014a6ea6650f18662ec2fd8cd/420/420/Image/Png"/>
                    <Carousel.Caption>
                        <h4>Card 3</h4>
                    </Carousel.Caption>
                </Carousel.Item> */}
            </Carousel>
        </Drawer>
    );
}
