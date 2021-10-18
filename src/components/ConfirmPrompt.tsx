import {IonButton, IonContent, IonModal, IonText} from '@ionic/react';
import './ConfirmPrompt.css';

type addLabelProps = {
    data?: any;
    show: boolean;
    title: string;
    subtitle?: string;
    onResult: (data: any, isSuccess:boolean) => void;
};

const ConfirmPrompt: React.FC<addLabelProps> = ({data, show, title, subtitle, onResult}) => {

    return (
        <IonModal isOpen={show} onDidDismiss={() => onResult(data, false)} cssClass="prompt-modal">
            <IonContent>
                <IonText className="modal-title">{title}</IonText>
                {subtitle && <IonText className="modal-subtitle">{subtitle}</IonText>}
                <IonButton onClick={() => onResult(data, true)}>Yes</IonButton>
                <IonButton fill="outline" onClick={() => onResult(data, false)}>Cancel</IonButton>
            </IonContent>
        </IonModal>
    );
};

export default ConfirmPrompt;
