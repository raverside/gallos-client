import {useContext, useEffect, useState} from "react";
import {AppContext} from "./State";
import Cookies from "js-cookie";
import {tokenLogin} from "./api/Auth";
import { IonSpinner } from '@ionic/react';

const AutoRelogin: React.FC = ({children}) => {
    const { state, dispatch } = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        if (!state.user?.id) {
            setLoading(true);
            (async () => { // using a self-invoking async function here because useEffect doesn't expect the callback function to return a Promise
                const token = Cookies.get('token');
                if (token) {
                    const response = await tokenLogin();
                    if (response.user) {
                        dispatch({
                            type: 'setUser',
                            user: response.user || {}
                        });
                    }
                }
                setLoading(false);
            })();
        }
    }, [state.user?.id]);

    return loading ? (<IonSpinner color="primary" style={{margin: "auto"}} />) : (<>{children}</>);
}

export default AutoRelogin;
