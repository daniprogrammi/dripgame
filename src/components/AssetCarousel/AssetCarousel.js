// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import CanvasAsset from '../Canvas/CanvasAsset';
import Drawer from './Drawer';

// Rename ... eventually
export default function AssetCarousel(props){
    const [index, setIndex] = useState(0);
    const show = 3;
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    }

    const carouselItems = 
    props.carouselItems.map(item => {
            return (
                <CanvasAsset className={`${item.category.name}`} src={item.imageURL} key={`${item._id}-key`} id={item._id} width={50} height={50}>
                </CanvasAsset>
            );
        } 
    );
    return (
        <Drawer categoryName={props.categoryName}>
            <div className={`${props.categoryName}-items`} children={carouselItems}>
            </div>
        </Drawer>
    );
}
