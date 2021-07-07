/* Importar las librerías y los componentes necesarios */
import React from 'react';
import {Text} from 'react-native';
import drizzle from "./drizzle";
import {DrizzleContext} from "@drizzle/react-plugin";
require('node-libs-expo/globals'); /* Línea necesaria para que funcionen los core modules */
import Subcomponente from './Subcomponente';

export default function App() {

	return (
	<DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
            {drizzleContext => {
                const {drizzle, drizzleState, initialized} = drizzleContext;
                if (!initialized) {
                    return (<Text>Cargando dapp...</Text>);
                }
               return (<Subcomponente drizzle={drizzle} drizzleState={drizzleState}/>);
            }}
        </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
	);
}


