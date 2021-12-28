import React, { createContext, useReducer } from "react";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
const socket = io(process.env.REACT_APP_WEBSOCKET_URL!, {
    path: process.env.REACT_APP_WEBSOCKET_PATH,
    transports: ['websocket'],
    rejectUnauthorized: false
});

const initialState = {user: {}};
const AppContext = createContext(initialState as any);

const reducer = (state: any, action: any) => {
    switch(action.type) {
        case "setUser": {
            return { ...state, user: action.user, socket }
        }
        case "resetUser": {
            Cookies.remove('token');
            return { ...state, user: {}, socket: undefined };
        }
    }
    return state;
};

function AppContextProvider(props: any) {
    const fullInitialState = {
        ...initialState,
    }

    let [state, dispatch] = useReducer(reducer, fullInitialState);
    let value = { state, dispatch };


    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
