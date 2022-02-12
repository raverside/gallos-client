import {
    IonButton,
    IonButtons,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonContent,
    IonText,
    IonAvatar,
    IonImg,
    IonInput,
    IonSelectOption,
    IonSelect,
    IonItemDivider,
    IonItem
} from '@ionic/react';

import React, {useRef, useState, useEffect} from "react";
import {closeOutline as closeIcon} from "ionicons/icons";
import PhoneInput from 'react-phone-input-2';
import {upsertUser} from "../../api/Users";
import {formatPasscode, getImageUrl} from '../utils';

import './UserEditor.css';
import {useTranslation} from "react-multi-lang";
import {fetchAllStadiums} from "../../api/Stadiums";

const UserEditor: React.FC<any> = ({user, close}) => {
    const t = useTranslation();
    const [showPasscode, setShowPasscode] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string>((user?.photo && user?.photo !== 'avatar') ? getImageUrl(user.photo) : getImageUrl('avatar'));
    const [stadiums, setStadiums] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({
        id: user ? user.id : undefined,
        username: user?.username,
        phone: user?.phone,
        passcode: user?.passcode,
        role: user?.role || "admin",
        photo: user?.photo,
        photo_upload: null,
        stadium_id: user?.stadium_id
    });

    useEffect(() => {
        if (!user?.passcode) generatePasscode();
    }, []);


    useEffect(() => {
        if (formData.role === "creator" || formData.role === "worker" || formData.role === "judge" || formData.role === "stadium_admin_worker") {
            fetchStadiums();
        } else {
            setStadiums([]);
            setFormData((currentFormData:any) => ({...currentFormData, stadium_id: null}))
        }
    }, [formData.role]);

    const fetchStadiums = async() => {
        const response = await fetchAllStadiums();
        if (response.stadiums) {
            setStadiums(response.stadiums);
        };
    }

    const canSubmit = () => {
        return formData.phone && formData.phone.length >= 5 && formData.phone.length <= 15 && formData.username.length > 1;
    }

    const generatePasscode = () => {
        const generatedPasscode = Math.random().toString(36).substr(2, 9).toUpperCase();
        if (generatedPasscode && generatedPasscode.length === 9) {
            setFormData((currentFormData:any) => ({...currentFormData, passcode: generatedPasscode}));
            setShowPasscode(true);
        } else generatePasscode();
    }

    const Submit = async () => {
        if (!canSubmit()) return;
        await upsertUser(formData);
        close();
    }

    const setImage = (_event: any) => {
        let file = _event.target.files![0];
        setFormData({...formData, photo_upload: file});
        const reader = new FileReader();
        reader.onload = (e) => {
            typeof e.target!.result === "string" && setImagePreview(e.target!.result);
        };

        reader.readAsDataURL(file);
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title"><p>{user?.id ? t('users.edit') : t('users.add')}</p>{user?.role !== "user" && <p className="page-subtitle">{t('users.dash_team')}</p>}</IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="update-profile-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="update-profile-save" onClick={Submit}>{t('users.save')}</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent>
            <div className="update-profile-form">
                <div className="image-upload-wrapper">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={setImage}
                        accept="image/jpeg, image/png"
                    />
                    <IonText>{t('profile.picture')}</IonText>
                    <IonAvatar><IonImg src={imagePreview} /></IonAvatar>
                    <IonButton fill="clear" onClick={() => fileInputRef.current!.click()}>{t('profile.upload')}</IonButton>
                </div>
                <IonText className="update-label">{t('users.username')}</IonText>
                <IonInput placeholder={t('users.username')} value={formData.username} onIonChange={(e) => setFormData((currentFormData:any) => ({...currentFormData, username: e.detail.value!}))} />
                {user?.role !== "user" && <>
                    <IonText className="update-label">{t('users.role')}</IonText>
                    <IonSelect interface="alert" name="role" value={formData.role} onIonChange={(e) => setFormData((currentFormData:any) => ({...currentFormData, role: e.detail.value!}))} placeholder={t('users.role')}>
                        <IonSelectOption value="admin">{t('users.role_admin')}</IonSelectOption>
                        <IonSelectOption value="admin_manager">{t('users.role_admin_manager')}</IonSelectOption>
                        <IonSelectOption value="admin_worker">{t('users.role_admin_worker')}</IonSelectOption>
                        <IonSelectOption value="stadium_admin_worker">{t('users.role_stadium_admin_worker')}</IonSelectOption>
                        <IonSelectOption value="judge">{t('users.role_judge')}</IonSelectOption>
                        <IonSelectOption value="creator">{t('users.role_creator')}</IonSelectOption>
                        <IonSelectOption value="worker">{t('users.role_worker')}</IonSelectOption>
                    </IonSelect>
                    {stadiums.length > 0 && <>
                        <IonText className="update-label">{t('stadiums.stadium')}</IonText>
                        <IonItem lines="none">
                            <IonSelect value={formData.stadium_id} placeholder={t('stadiums.stadium')} interface="alert" onIonChange={(e) => setFormData({...formData, stadium_id: e.detail.value!})}>
                                {stadiums.map((stadium) => (<IonSelectOption key={stadium.id} value={stadium.id}>{stadium.name}</IonSelectOption>))}
                            </IonSelect>
                        </IonItem>
                    </>}
                </>}
                <IonText className="update-label">{t('users.phone')}</IonText>
                <PhoneInput
                    country={'us'}
                    countryCodeEditable={false}
                    placeholder={t('users.phone')}
                    value={formData.phone}
                    onChange={(phone) => setFormData((currentFormData:any) => ({...currentFormData, phone}))}
                />

                <IonText className="update-label">{t('users.passcode')}</IonText>
                <IonText>{showPasscode ? formatPasscode(formData.passcode) : "*** *** ***"}</IonText>
                <IonButton className="update-toggle-passcode" fill="clear" onClick={() => setShowPasscode(!showPasscode)}>{showPasscode ? t('auth.hide') : t('auth.show')}</IonButton>
                <IonButton expand="block" className="generate-passcode" onClick={generatePasscode}>{t('users.generate_passcode')}</IonButton>
            </div>
        </IonContent>
    </>);
};

export default UserEditor;
