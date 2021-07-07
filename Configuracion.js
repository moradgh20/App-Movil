/* Importar las librerías y los componentes necesarios */
import React, {Component} from 'react';
import {Text, Image, StyleSheet, ImageBackground, Dimensions, TextInput, TouchableHighlight, View, Alert} from 'react-native';
import * as FileSystem from 'expo-file-system';

/* Definir las dimensiones de la pantalla del dispositivo */
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class UserScreen extends Component {

constructor(props){
	super(props);
	this.state = {
		/* La variable de estado "balance" se utiliza para almacenar el saldo disponible
		en ethers en la cuenta del usuario. */
		balance: 0,
		/* La variable de estado "CameraPermissionGranted" se utiliza para saber si el
		usuario a concedido permisos para que la aplicacion utilice la camara. */
		CameraPermissionGranted: null	
	};
	this._onPressButtonUno = this._onPressButtonUno.bind(this);
	this._onPressButtonCuatro = this._onPressButtonCuatro.bind(this);
	this._dismiss = this._dismiss.bind(this);
}

/*Justo antes de renderizar el componente por segunda vez, se realiza la conversion del saldo de la cuenta a ethers*/
async componentDidMount() {
	let ba = await this.props.drizzle.web3.eth.getBalance(this.props.direccion);
	let bal = (parseFloat(ba/1000000000000000000).toFixed(2));
	this.setState({ balance: bal });
}

/*Funcion que se ejecuta al pulsar el boton de volver.
Cambia la correspondiente variable de estado que controla
la transicion de una pantalla a otra*/
_onPressButtonUno(){
	let x = 0;
	this.props.cambiarPulsado(x);
}

/*Funcion que se ejecuta al seleccionar una opcion
despues de haber pulsado el boton de Resetear Cuenta.
Si su parametro de entrada es true, lleva a cabo la eliminacion de
la cuenta del usuario*/
_dismiss(hacer){
	if(hacer){	
	  /*Actualizar la variable de estado correspondiente y comprobar 
	  si el contrato Datos esta inicializado, creando despues una 
	  instancia del mismo*/
	  let p = 0;
      this.props.cambiarPulsado(p);	
	  const {Datos} = this.props.drizzleState.contracts;
	  if (!Datos || !Datos.initialized) return; 
	  const instance = this.props.drizzle.contracts.Datos;
	  
	  /*Ejecutar el metodo resetearCuenta del Contrato Datos*/
	  instance.methods.resetearCuenta.cacheSend({from: this.props.direccion, gas: 300000});
	  
	  /*Actualizar las variables de estado correspondiente*/
	  let mensaje = "Ninguna Alerta";
	  this.props.actualizar(mensaje);
	  let u = "OFF";
	  this.props.cambiarEstado(u);
	  let g = null;
	  let m = null;
	  let x = false;
	  let y = true;
	  this.props.actualizarReg(x, y);
	  
	  /*Comprobar que el contrato Escuela esta iniciado y crear una instancia del mismo*/
	  const {Escuela} = this.props.drizzleState.contracts;
	  if (!Escuela || !Escuela.initialized) return; 
	  const inst = this.props.drizzle.contracts.Escuela;
	  
	  /*Ejecutar el metodo reiniciarAlerta del Contrato Escuela*/
	  inst.methods.reiniciarAlerta.cacheSend({from: this.props.direccion, gas: 300000});
	  
	  /*Actualizar las variables de estado correspondiente*/
	  let k = [];
	  let n = null;
	  this.props.actualizarKeyDos([], null);
	  let h = null;
	  this.props.actualizarKey(h);
	  hacer = false;
	}
}

/*Funcion que se ejecuta al pulsar el boton de Resetear Cuenta.
Muestra las opciones a elegir, y para cada una de ellas
ejecuta la funcion dismiss con un parametro de entrada diferente*/
_onPressButtonCuatro(){
	let hacer = false;
    Alert.alert(
      'Reset',
      '¿Esta seguro de que desea resetear la cuenta?',
      [
        {text: 'Si', onPress: () => this._dismiss(true)},
        {text: 'No', onPress: () => this._dismiss(false)},
      ],
    );
}

 render(){
	let vista;
    let numero = (parseFloat(this.props.balance/1000000000000000000).toFixed(2));
	vista = <ImageBackground source={require("./assets/fondo8.jpg")} imageStyle={{ resizeMode: 'stretch' }} style={{width:DEVICE_WIDTH , height:DEVICE_HEIGHT, marginTop:35}}>

	<View style={{backgroundColor:'transparent', position: 'absolute',width:290 , height:270,  justifyContent: 'center', alignItems: 'center', marginLeft:55, marginTop:200}}>
	 <Text style={{ fontSize: 25, color: '#252850', fontWeight: "bold",  textAlign: 'center' }}>Registrado con la direccion: {this.props.direccion}</Text>
	 <Text style={{ fontSize: 25, color: '#252850', fontWeight: "bold",  textAlign: 'center' }}>Balance: {this.state.balance} ETH</Text>
	</View>
	
	<View style={{position: 'absolute', marginLeft:230, marginTop:50}}>
	   <TouchableHighlight style={{backgroundColor: '#252850', width:140, height:36}} onPress={this._onPressButtonUno}>
		<Image source={require("./assets/volver.jpg")} style={{width:140, height:36}}/>
	   </TouchableHighlight>
	</View>

	<View style={{position: 'absolute', marginLeft:100, marginTop:570}}>
	   <TouchableHighlight style={{backgroundColor: 'black', width:200, height:56, borderRadius: 200 / 2, justifyContent: 'center'}} onPress={this._onPressButtonCuatro}>
	    <Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Resetear Cuenta</Text>
	   </TouchableHighlight>
	</View>
    </ImageBackground>;
		
    return (vista);
  }
}