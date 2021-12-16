import {IonSelect, IonSelectOption} from '@ionic/react';
import React, {useState} from "react";
import {setLanguage} from "react-multi-lang";
import Cookies from "js-cookie";
import moment from 'moment';

import './LanguagePicker.css';


const LanguagePicker: React.FC = () => {
    const defaultLang = process.env.REACT_APP_DEFAULT_LANG || 'en';
    const currentLang = Cookies.get('lang') || defaultLang;
    const [lang, setLang] = useState(currentLang);

    const pickLanguage = (lang:string) => {
        setLang(lang);
        setLanguage(lang);
        Cookies.set('lang', lang, { expires: 365 });
        moment.locale(lang);
    }

    return (
        <IonSelect className="language-picker" value={lang} interface="popover" onIonChange={(e) => pickLanguage(e.detail.value)}>
            <IonSelectOption value="en">English</IonSelectOption>
            <IonSelectOption value="esp">Español</IonSelectOption>
        </IonSelect>);
};

export default LanguagePicker;
