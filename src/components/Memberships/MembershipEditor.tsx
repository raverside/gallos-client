import React, {useEffect, useState} from 'react';
import {
    IonButtons,
    IonContent,
    IonIcon,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonItemDivider,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import {closeOutline as closeIcon} from "ionicons/icons";
import {upsertMembership} from '../../api/Memberships';
import {useTranslation} from "react-multi-lang";


type EventProps = {
    close: () => void;
    membership: any;
    fetchMemberships: () => void;
};

const MembershipEditor: React.FC<EventProps> = ({membership, close, fetchMemberships}) => {
    const t = useTranslation();
    const [formData, setFormData] = useState<any>({
        id: membership ? membership.id : undefined,
        name: membership ? membership.name : "",
        type: membership ? membership.type : "",
        duration: membership ? membership.duration : "",
        price: membership ? membership.price : "",
    });

    const canSubmit = () => {
        let isFormFilled = true;

        if (!formData.name) isFormFilled = false;
        if (!formData.type) isFormFilled = false;
        if (!formData.duration) isFormFilled = false;
        if (!formData.price) isFormFilled = false;

        return isFormFilled;
    }

    const Submit = async () => {
        const response = await upsertMembership(formData);
        if (response.success) {
            fetchMemberships();
        }
        close();
    }

    return (<>
        <IonToolbar className="modal-header">
            <IonTitle className="page-title">{formData.id ? t('membership.updatee_membership') : t('membership.create_membership')}</IonTitle>
            <IonButtons slot="start">
                <IonIcon
                    icon={closeIcon}
                    className="create-event-close-icon"
                    slot="start"
                    onClick={() => close()}
                />
            </IonButtons>
            <IonButtons slot="end">
                <IonButton type="button" slot="end" disabled={!canSubmit()} color={canSubmit() ? "primary" : "dark"} fill="clear" className="create-event-post" onClick={Submit}>{t('membership.save')}</IonButton>
            </IonButtons>
        </IonToolbar>
        <IonContent id="event-editor">
            <IonList>
                <IonItemDivider>{t('membership.category')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect value={formData.type} placeholder={t('membership.category')} interface="alert" onIonChange={(e) => setFormData({...formData, type: e.detail.value!})}>
                        <IonSelectOption value="user">{t('membership.user_membership')}</IonSelectOption>
                        <IonSelectOption value="stadium">{t('membership.stadium_membership')}</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItemDivider>{t('membership.type')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect value={formData.name} placeholder={t('membership.type')} interface="alert" onIonChange={(e) => setFormData({...formData, name: e.detail.value!})}>
                        <IonSelectOption value="Gold">Gold</IonSelectOption>
                        <IonSelectOption value="Silver">Silver</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItemDivider>{t('membership.period')}</IonItemDivider>
                <IonItem lines="none">
                    <IonSelect value={formData.duration} placeholder={t('membership.period')} interface="alert" onIonChange={(e) => setFormData({...formData, duration: e.detail.value!})}>
                        <IonSelectOption value="3 months">3 months</IonSelectOption>
                        <IonSelectOption value="6 months">6 months</IonSelectOption>
                        <IonSelectOption value="1 year">1 year</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItemDivider>{t('membership.price')}</IonItemDivider>
                <IonItem lines="none">
                    <IonInput value={formData.price} type="number" className="currency-input" min="0" max="9999999" placeholder="-" onIonChange={(e) => setFormData({...formData, price: +e.detail.value!})} />
                </IonItem>
            </IonList>
        </IonContent>
    </>);
};

export default MembershipEditor;
