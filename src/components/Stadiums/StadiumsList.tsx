import {IonText, IonImg, IonList, IonItem, IonLabel} from '@ionic/react';
import {getImageUrl} from '../utils';

import './StadiumsList.css';
import React from "react";

type StadiumsListProps = {
    stadiums: Array<{}>;
};

const StadiumsList: React.FC<StadiumsListProps> = ({stadiums}) => {


    return (<IonList className="eventsList">
        {stadiums.map((stadium:any, index:number) => {
            return <IonItem key={stadium.id} lines="none" className="stadium" button routerLink={"/stadium/"+stadium.id}>
                    <p className="stadium-index">{index + 1}</p>
                    <IonImg className="stadium-image" src={getImageUrl(stadium.image)} />
                    <IonLabel className="stadium-short-info">
                        <p className="stadium-short-info_name">{stadium.name}</p>
                        <p className="stadium-short-info_representative">{stadium.representative_name}</p>
                        <IonText className="stadium-short-info_membership" color="gold">Gold</IonText>
                        <p className="stadium-short-info_location">{stadium.city}, {stadium.country}</p>
                    </IonLabel>
                </IonItem>
        })}
    </IonList>);
};

export default StadiumsList;
