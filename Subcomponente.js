/* Importar las librerías y los componentes necesarios */
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ImageBackground } from 'react-native';
import Auxiliar from './Auxiliar';
import * as FileSystem from 'expo-file-system';

export default class Subcomponente extends React.Component {

constructor(props){
	super(props)
	this.state = {
		/* La variable de estado "ready" se utiliza para saber si la aplicacion esta lista para ser cargada.*/
		ready: false,
		/* La variable de estado "direccion" se utiliza para almacenar la direccion hexadecimal del usuario.*/
		direccion: "0x0000000000000000000000000000000000000000",
		/* La variable de estado "registrado" se utiliza para saber si el usuario esta o no registrado.*/
		registrado: false
	};
	this._actualizarRegistrado = this._actualizarRegistrado.bind(this);
	this._cambiarDir = this._cambiarDir.bind(this);
}

/*Funcion para actualizar las variables de estado "registrado" y "ready".
Es utilizada por componentes hijos a los que se pasa como propiedad*/
 _actualizarRegistrado(x, y) {
	this.setState({registrado: x});
	this.setState({ready: y});
 }

/*Funcion para actualizar la variable de estado "direccion".
Es utilizada por componentes hijos a los que se pasa como propiedad*/ 
  _cambiarDir(x) {
	this.setState({direccion: x});
 }
 
async componentDidMount() {

	/* Comprobar si existe un fichero con la direccion del ususario
	Para saber si el usuario esta registrado o no*/
	let {exists} = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "direccion.txt");
	
	/*Si existe, se obtiene la direccion almacendada en el fichero y se actualiza la variable de estado
	direccion*/
	if(exists){
		let y = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "direccion.txt"); 
		this.setState({direccion: y});
		this.setState({registrado: true});
	}
	
	this.setState({ready: true});
}
 
render(){
		if(this.state.ready){
			return <Auxiliar drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} direccion={this.state.direccion} actualizarReg={this._actualizarRegistrado} registrado={this.state.registrado} cambiarDir={this._cambiarDir} />;
		}else{
			return <Text> CARGANDO </Text>
		}
}

}

