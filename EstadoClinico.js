/* Importar las librerías y los componentes necesarios */
import React, {Component} from 'react';
import {Text, Image, StyleSheet, ImageBackground, Dimensions, TextInput, TouchableHighlight, View, Alert} from 'react-native';
import * as FileSystem from 'expo-file-system';

/* Definir las dimensiones de la pantalla del dispositivo */
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class EstadoClinico extends Component {

constructor(props){
	super(props);
	this._onPressButtonUno = this._onPressButtonUno.bind(this);
	this._onPressButtonTres = this._onPressButtonTres.bind(this);
	this._onPressButtonCinco = this._onPressButtonCinco.bind(this);
}

/*Funcion que se utiliza para obtener en que turno
lectivo nos encontramos en funcion de la hora actual*/
 _obtenerTurno(turno) {	
  let fechaYhora = new Date();
  let horas = fechaYhora.getHours() ;
 
	if ((horas >= 8) && (horas <= 10)) {
            turno = 1;
        }
        else if ((horas > 10) && (horas <= 12)) {
            turno = 2;
		}
        else if ((horas > 12) && (horas <= 14)) {
            turno = 3;
        }
		else if ((horas > 14) && (horas <= 16)) {
            turno = 4;
        }	
		else if ((horas > 16) && (horas <= 18)) {
            turno = 5;
        }
		else if ((horas > 18) && (horas <= 20)) {
            turno = 6;
        }
		
		else if ((horas > 20) && (horas <= 21)) {
            turno = 7;
        }
        else {
			turno = 8;
        }
		return turno;
 }

/*Funcion que se ejecuta al pulsar el boton de volver.
Cambia la correspondiente variable de estado que controla
la transicion de una pantalla a otra*/
_onPressButtonUno(){
  let x = 0;
  this.props.cambiarPulsado(x);
}

/*Funcion que se ejecuta al pulsar el boton de Registrar Positivo.
Cambia las variables de estado correspondientes, y ejecuta el metodo
"estadoPositivo" del contrato Escuela*/
_onPressButtonTres(){
  let fechaYhora = new Date();
  let fecha = fechaYhora.getDate() + '/' + (fechaYhora.getMonth() + 1) + '/' + fechaYhora.getFullYear();
  let mensaje = "Positivo Registrado";
  this.props.actualizar(mensaje);;
  this.props.cambiarEstadoClinico("Positivo");
  let turno; 
  turno = this._obtenerTurno(turno);
  const {Escuela} = this.props.drizzleState.contracts;
  if (!Escuela || !Escuela.initialized) return; 
  const instance = this.props.drizzle.contracts.Escuela;
  instance.methods.estadoPositivo.cacheSend(fecha, {from: this.props.direccion, gas: 600000});
}

/*Funcion que se ejecuta al pulsar el boton de Registrar Negativo.
Cambia las variables de estado correspondientes, y ejecuta el metodo
"estadoNegativo" del contrato Escuela*/
_onPressButtonCinco(){
  let fechaYhora = new Date();
  let fecha = fechaYhora.getDate() + '/' + (fechaYhora.getMonth() + 1) + '/' + fechaYhora.getFullYear();
  let mensaje = "Ninguna Alerta";
  this.props.actualizar(mensaje);
  this.props.cambiarEstadoClinico("Negativo");
  const {Escuela} = this.props.drizzleState.contracts;
  if (!Escuela || !Escuela.initialized) return; 
  const instance = this.props.drizzle.contracts.Escuela;
  instance.methods.estadoNegativo.cacheSend(fecha, {from: this.props.direccion, gas: 300000});
}

 render(){
	let vista;
	vista = <ImageBackground source={require("./assets/fondo8.jpg")} imageStyle={{ resizeMode: 'stretch' }} style={{width:DEVICE_WIDTH , height:DEVICE_HEIGHT, marginTop:35}}>

		<View style={{backgroundColor:'transparent', position: 'absolute',width:290 , height:270,  justifyContent: 'center', alignItems: 'center', marginLeft:50, marginTop:200}}>
		   <Text style={{ fontSize: 25, color: '#252850', fontWeight: "bold", textAlign: 'center' }}>Actualmente tu estado clínico es: {this.props.estadoClinico}</Text>
		</View>
		
		<View style={{position: 'absolute', marginLeft:230, marginTop:50}}>
		   <TouchableHighlight style={{backgroundColor: '#252850', width:140, height:36, marginBottom: 2}} onPress={this._onPressButtonUno}>
			<Image source={require("./assets/volver.jpg")} style={{width:140, height:36}}/>
		   </TouchableHighlight>
		</View>

		<View style={{ position: 'absolute', marginLeft:97, marginTop:600}}>
		   <TouchableHighlight style={{backgroundColor: 'red', width:200, height:56, borderRadius: 200 / 2, justifyContent: 'center' }} onPress={this._onPressButtonTres}>
			<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Registrar Positivo</Text>
		   </TouchableHighlight>
		</View>
		  
		<View style={{position: 'absolute', marginLeft:97, marginTop:525}}>
		   <TouchableHighlight style={{backgroundColor: 'black', width:200, height:56, borderRadius: 200 / 2, justifyContent: 'center'}} onPress={this._onPressButtonCinco}>
			<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Registrar Negativo</Text>
		   </TouchableHighlight>
		</View>
     </ImageBackground>;

    return (vista);
  }
}