import {IonButton, IonIcon, IonImg} from '@ionic/react';
import imageAddIcon from "../img/photo_add.png";
import React, {useRef, useState} from "react";
import {getImageUrl} from './utils';

import './ImagePicker.css';
import {closeOutline as closeIcon} from "ionicons/icons";

type ImagePickerProps = {
    eventImage: string|null|undefined,
    onPick: (f:File|null) => void
};

const ImagePicker: React.FC<ImagePickerProps> = ({eventImage, onPick}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string|null|undefined>(eventImage ? getImageUrl(eventImage) : null);

    const openFileDialog = () => {
        fileInputRef.current!.click();
    };

    const setImage = (_event: any) => {
        let file = _event.target.files![0];
        onPick(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            typeof e.target!.result === "string" && setImagePreview(e.target!.result);
        };

        reader.readAsDataURL(file);
    }

    const unsetImage = () => {
        setImagePreview(null);
        onPick(null);
        fileInputRef.current!.value = '';
    }

    return (<>
        <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={setImage}
            accept="image/jpeg, image/png"
        />
        {imagePreview ? <>
            <img src={imagePreview} className="event-preview-image"/>
            <IonButton className="event-preview-image_close" size="small" onClick={unsetImage}><IonIcon slot="icon-only" icon={closeIcon}/></IonButton>
        </> : <div className="add-photo" onClick={openFileDialog}>
                <IonImg src={imageAddIcon}/>
            </div>
        }
    </>);
};

export default ImagePicker;
