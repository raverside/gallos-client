import {IonSelect, IonSelectOption} from '@ionic/react';
import React, {useState} from "react";
import {setLanguage} from "react-multi-lang";
import Cookies from "js-cookie";

import './LanguagePicker.css';


const LanguagePicker: React.FC = () => {
    const currentLang = Cookies.get('lang');
    const [lang, setLang] = useState(currentLang ? currentLang : 'en');

    const pickLanguage = (lang:string) => {
        setLang(lang);
        setLanguage(lang);
        Cookies.set('lang', lang, { expires: 365 });
    }

    return (
        <IonSelect className="language-picker" value={lang} interface="alert" onIonChange={(e) => pickLanguage(e.detail.value)}>
            <IonSelectOption value="en">EN</IonSelectOption>
            <IonSelectOption value="esp">ESP</IonSelectOption>
        </IonSelect>);
};

export default LanguagePicker;
