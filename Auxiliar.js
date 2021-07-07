/* Importar las librerías y los componentes necesarios */
import React from 'react';
import { Text, View } from 'react-native';
import IndexScreen from './IndexScreen';
import UserScreen from './UserScreen';
import * as FileSystem from 'expo-file-system';

export default class Auxiliar extends React.Component {

constructor(props){
	super(props);
	this.state = {
		/* La variable de estado "alertas" se utiliza para almacenar las alertas actuales. */
		alertas: "Ninguna Alerta",
		/* La variable de estado "alertaKey" se utiliza para almacenar la clave que se utiliza
		para obtener una alerta del contrato Escuela.*/
		alertaKey: null,
		/* La variable de estado "entradaKey" se utiliza para almacenar las claves que se utilizan
		para obtener las entradas del contrato Escuela.*/
		entradaKey: [],
		/* La variable de estado "entradasLengthKey" se utiliza para almacenar la clave que se utiliza
		para obtener el número de entradas del contrato Escuela.*/
		entradasLengthKey: null
	};
	this._actualizarAlerta = this._actualizarAlerta.bind(this);
	this._actualizarKey = this._actualizarKey.bind(this);
	this._actualizarKeyDos = this._actualizarKeyDos.bind(this);
}

/*Funcion para actualizar la variable de estado "alertas".
Es utilizada por componentes hijos a los que se pasa como propiedad*/
  _actualizarAlerta(alerta) {
	this.setState({alertas: alerta});
 }

/*Funcion para actualizar la variable de estado "alertaKey".
Es utilizada por componentes hijos a los que se pasa como propiedad*/
  _actualizarKey(x) {
	this.setState({alertaKey: x}); 	
 }


/*Funcion para actualizar las variables de estado "entradaKey" y "entradasLengthKey".
Es utilizada por componentes hijos a los que se pasa como propiedad*/
  _actualizarKeyDos(x,y) {
	this.setState({entradaKey: x});
	this.setState({entradasLengthKey: y});	 	
 }

render(){
		/*Si el usuario esta ya registrado, se carga la pantalla principal*/
		if (this.props.registrado) {
			return <UserScreen drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}  registrado={this.props.registrado}  
			actualizar={this._actualizarAlerta} direccion={this.props.direccion} actualizarReg={this.props.actualizarReg} 
			cambiarDir={this.props.cambiarDir} alertas={this.state.alertas} alertaKey={this.state.alertaKey} 
			entradaKey={this.state.entradaKey} entradasLengthKey={this.state.entradasLengthKey} estado={this.state}  
			actualizarKey={this._actualizarKey} actualizarKeyDos={this._actualizarKeyDos}/>;
		}
		/*Por el contrario, si el usuario no esta registrado, se carga la pantalla de registro*/
		else{
			return <IndexScreen drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} 
			actualizarKeyDos={this._actualizarKeyDos} registrado={this.props.registrado} actualizar={this._actualizarAlerta} 
			direccion={this.props.direccion} actualizarReg={this.props.actualizarReg} cambiarDir={this.props.cambiarDir} 
			alertas={this.state.alertas} alertaKey={this.state.alertaKey} estado={this.state} actualizarKey={this._actualizarKey} 
			actualizarKeyDos={this._actualizarKeyDos}/>;
		}
}

}

