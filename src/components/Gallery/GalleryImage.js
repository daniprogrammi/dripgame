// import some stuff I'm sure

export default function GalleryImage({imgSource, imgWidth, imgHeight}){
    return (
            <img className="gallery-image" src={`${imgSource}`} width={imgWidth} height={imgHeight}>
            </img>
    );
};   