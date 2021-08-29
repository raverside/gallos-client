import {IonButtons, IonHeader, IonTitle, IonToolbar, IonBackButton} from '@ionic/react';
import './ArrowHeader.css';
import React from "react";

type HeaderProps = {
    title: string;
    backHref?: string;
}

const ArrowHeader: React.FC<HeaderProps> = ({title, backHref = "/"}) => {
    return (
        <IonHeader>
            <IonToolbar className="arrow-header">
                <IonButtons slot="start">
                    <IonBackButton defaultHref={backHref}/>
                </IonButtons>
                <IonTitle className="page-title">{title}</IonTitle>
            </IonToolbar>
        </IonHeader>
);
};

export default ArrowHeader;
