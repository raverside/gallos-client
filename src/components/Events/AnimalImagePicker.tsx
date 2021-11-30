import {IonButton, IonIcon, IonImg} from '@ionic/react';
import imageAddIcon from "../../img/rooster_transparent.png";
import React, {useRef, useState} from "react";
import {getImageUrl} from '../utils';

import flipperIcon from '../../img/flipper.png';
import {closeOutline as closeIcon} from "ionicons/icons";
import {reloadOutline as rotateIcon} from "ionicons/icons";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './AnimalImagePicker.css';

type ImagePickerProps = {
    eventImage: string|null|undefined,
    onPick: (f:File|null) => void,
    isFlipped: boolean,
    setIsFlipped: (isFlipped:boolean) => void
};

const ImagePicker: React.FC<ImagePickerProps> = ({eventImage, onPick, isFlipped, setIsFlipped}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string|null|undefined>(eventImage ? getImageUrl(eventImage) : null);
    const [imageForCropping, setImageForCropping] = useState<any>();
    const [crop, setCrop] = useState<any>({
        unit: '%',
        aspect: 1,
        width: 30,
        rotate: 0
    });
    const [rotate, setRotate] = useState<number>(0);
    const imgRef = useRef(null);

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
        setImageForCropping(undefined);
        onPick(null);
        fileInputRef.current!.value = '';
    }

    const onImageLoaded = (image:any) => {
        setImageForCropping(image);
        imgRef.current = image;
    };

    const onCropComplete = (crop:any) => {
        if (imageForCropping && crop.width && crop.height) {
            pickCroppedImg(imageForCropping, crop, +new Date() + ".jpg");
        }
    }

    const onCropChange = (crop:any, percentCrop:any) => {
        setCrop(percentCrop);
    }

    const pickCroppedImg = (image:any, crop:any, fileName:any) => {
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob:any) => {
                    if (!blob) {
                        //reject(new Error('Canvas is empty'));
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = fileName;
                    const file = new File([blob!], fileName, { type: "image/jpeg" });
                    onPick(file);
                },
                'image/jpeg',
                1
            );
        });
    }

    return (<>
        <IonButton fill="clear" className="image-flipper" onClick={() => setIsFlipped(!isFlipped)}>
            <IonImg src={flipperIcon}  />
        </IonButton>
        <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={setImage}
            accept="image/jpeg, image/png"
        />
        {imagePreview ? <>
            <IonButton className="participant-preview-image_close" size="small" onClick={unsetImage}><IonIcon slot="icon-only" icon={closeIcon}/></IonButton>
            {eventImage ? <img
                src={imagePreview}
                className={isFlipped ? "participant-preview-image flipped" : "participant-preview-image"}
            /> : <>
                <ReactCrop src={imagePreview}
                   crop={crop}
                   ruleOfThirds
                   rotate={rotate}
                   onComplete={onCropComplete}
                   onChange={onCropChange}
                   onImageLoaded={onImageLoaded}
                   className={isFlipped ? "participant-preview-image flipped" : "participant-preview-image"}
                />
                <IonButton className="rotate_icon" fill="clear" onClick={() => {
                    setRotate((currentRotate:number) => (currentRotate + 90 >= 180) ? -180 : currentRotate + 90);
                    setImageForCropping(imgRef.current);
                    pickCroppedImg(imgRef.current, crop, +new Date() + ".jpg");
                }}><IonIcon slot="icon-only" icon={rotateIcon}/></IonButton>
            </>}
        </> : <div className="add-photo" onClick={openFileDialog}>
            <IonImg src={imageAddIcon}/>
        </div>
        }
    </>);
};

export default ImagePicker;
