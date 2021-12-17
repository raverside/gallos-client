import {IonButton, IonContent, IonModal, IonText} from '@ionic/react';
import './ConfirmPrompt.css';
import {useTranslation} from "react-multi-lang";

type addLabelProps = {
    data?: any;
    show: boolean;
    title: string;
    subtitle?: string;
    onResult: (data: any, isSuccess:boolean) => void;
};

const ConfirmPrompt: React.FC<addLabelProps> = ({data, show, title, subtitle, onResult}) => {
    const t = useTranslation();

    return (
        <IonModal isOpen={show} onDidDismiss={() => onResult(data, false)} cssClass="prompt-modal">
            <IonContent>
                <IonText className="modal-title">{title}</IonText>
                {subtitle && <IonText className="modal-subtitle">{subtitle}</IonText>}
                <IonButton onClick={() => onResult(data, true)}>{t('general.confirm_yes')}</IonButton>
                <IonButton fill="outline" onClick={() => onResult(data, false)}>{t('general.confirm_no')}</IonButton>
            </IonContent>
        </IonModal>
    );
};

export default ConfirmPrompt;
