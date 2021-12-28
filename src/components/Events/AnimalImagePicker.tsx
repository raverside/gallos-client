import {IonButton, IonIcon, IonImg} from '@ionic/react';
import imageAddIcon from "../../img/rooster_transparent.png";
import React, {useRef, useState, useEffect} from "react";
import {getImageUrl} from '../utils';

import flipperIcon from '../../img/flipper.png';
import {closeOutline as closeIcon} from "ionicons/icons";
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
    const [crop, setCrop] = useState<any>({
        unit: '%',
        width: 90,
        height: 90,
        aspect: 1,
    });
    const imgRef = useRef(null);

    useEffect(() => {
        setImagePreview(eventImage ? getImageUrl(eventImage) : null);
    }, [eventImage]);

    const openFileDialog = () => {
        fileInputRef.current!.click();
    };

    const setImage = async (_event: any) => {
        const file = _event.target.files![0];
        onPick(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            if (typeof e.target!.result === "string") {
                setImagePreview(e.target!.result);
            }
        };

        // @ts-ignore
        reader.readAsDataURL(file);
    }

    const unsetImage = () => {
        setImagePreview(null);
        onPick(null);
        fileInputRef.current!.value = '';
    }

    const onImageLoaded = (img:any) => {
        imgRef.current = img;
        const aspect = crop.aspect;
        const width = img.width / aspect < img.height * aspect ? 100 : ((img.height * aspect) / img.width) * 100;
        const height = img.width / aspect > img.height * aspect ? 100 : (img.width / aspect / img.height) * 100;
        setCrop((currentCrop:any) => ({...currentCrop, width, height}));
        return false;
    };

    const onCropComplete = (crop:any) => {
        if (imgRef.current && crop.width && crop.height) {
            pickCroppedImg(imgRef.current, crop, +new Date() + ".jpg");
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

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

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
            crop.width,
            crop.height
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
                   keepSelection
                   onComplete={onCropComplete}
                   onChange={onCropChange}
                   onImageLoaded={onImageLoaded}
                   minWidth={150}
                   minHeight={150}
                   className={isFlipped ? "participant-crop-image flipped" : "participant-crop-image"}
                   spin={isFlipped ? (180) : 0}
                />
            </>}
        </> : <div className="add-photo" onClick={openFileDialog}>
            <IonImg src={imageAddIcon}/>
        </div>
        }
    </>);
};

export default ImagePicker;
