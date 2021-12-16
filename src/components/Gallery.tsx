import {
    IonModal, IonContent, IonToolbar, IonButtons, IonTitle, IonHeader, IonIcon, IonImg, IonSlides, IonSlide
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";

import './Gallery.css';

type GalleryProps = {
    title: string;
    showModal: boolean;
    setShowModal: (show:boolean) => void;
    images: any[]
};

const Gallery: React.FC<GalleryProps> = ({title, showModal, setShowModal, images}) => {

    return (
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} cssClass="gallery-modal">
            <IonHeader>
                <IonToolbar className="modal-header">
                    <IonTitle className="page-title">{title}</IonTitle>
                    <IonButtons slot="end">
                        <IonIcon
                            icon={closeIcon}
                            className="gallery-close-icon"
                            slot="end"
                            size="large"
                            onClick={() => setShowModal(false)}
                        />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonSlides className="gallery-slider">
                    {images.map((image, index) => (
                        <IonSlide key={index}><IonImg src={image} /></IonSlide>
                    ))}
                </IonSlides>
                {/*<IonSlides className="gallery-slider-thumbnails">*/}
                {/*    {images.map((image, index) => (*/}
                {/*        <IonSlide key={"thumb_"+index} className="gallery-slider-thumbnail"><IonImg src={image} /></IonSlide>*/}
                {/*    ))}*/}
                {/*</IonSlides>*/}
            </IonContent>
        </IonModal>
    );
};

export default Gallery;
