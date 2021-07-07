/* Importar las librerías y los componentes necesarios */
import React, {Component} from 'react';
import {Text, Image, StyleSheet, ImageBackground, Dimensions, TextInput, TouchableHighlight, View, RNCamera} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as FileSystem from 'expo-file-system';
import Configuracion from './Configuracion';
import EstadoClinico from './EstadoClinico';
import UltimasEntradas from './UltimasEntradas';

/* Definir las dimensiones de la pantalla del dispositivo */
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class UserScreen extends Component {

constructor(props){
	super(props);
	this.state = {
		/* La variable de estado "estado" se utiliza para almacenar la
		ubicacion del usuario. */
		estado:"Fuera del Aula",
		/* La variable de estado "aula" se utiliza para almacenar el
		nombre del aula en el que ha entrado el usuario. */
		aula:"",
		/* La variable de estado "showCamera" se utiliza para saber cuando
		mostrar la camara y cuando no. */
		showCamera: false,
		/* La variable de estado "estadoClinico" se utiliza para almacenar
		el estado clinico del usuario. */
		estadoClinico: "Negativo",
		/* La variable de estado "pulsado" se utiliza para saber que pantalla
		hay que cargar en cada momento. */
		pulsado: 0,
		/* La variable de estado "CameraPermissionGranted" se utiliza para saber
		si el usuario a dado permisos para que la aplicacion utilice la camara. */
		CameraPermissionGranted: null	
	};
	this._onPressButtonUno = this._onPressButtonUno.bind(this);
	this._onPressButtonDos = this._onPressButtonDos.bind(this);
	this._onPressButtonTres = this._onPressButtonTres.bind(this);
	this._onPressButtonCuatro = this._onPressButtonCuatro.bind(this);
	this._onPressButtonCinco = this._onPressButtonCinco.bind(this);
	this._barCodeScanned = this._barCodeScanned.bind(this);
	this._cambiarEstado = this._cambiarEstado.bind(this);
	this._cambiarPulsado = this._cambiarPulsado.bind(this);
	this._cambiarEstadoClinico = this._cambiarEstadoClinico.bind(this);
}

/*Funcion que actualiza la variable de estado "estadoClinico".
Es utilizada por componentes hijos a los que se pasa como propiedad */
_cambiarEstadoClinico(x){
  this.setState({estadoClinico: x});
}

/*Antes de renderizar por segunda vez el componente, se pregunta al usuario si 
acepta dar permisos de acceso a la camara por parte de la aplicacion */
async componentDidMount() {
	this.setState({pulsado:0});
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ CameraPermissionGranted: status === "granted" ? true : false });
}

/*Funcion que actualiza la variable de estado "estado".
Es utilizada por componentes hijos a los que se pasa como propiedad */
_cambiarEstado(x) {	
 this.setState({estado: x}); 
}

/*Funcion que actualiza la variable de estado "pulsado".
Es utilizada por componentes hijos a los que se pasa como propiedad */ 
_cambiarPulsado(x) {	
 this.setState({pulsado: x});
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

/*Funcion que se ejecuta automaticamente al leer un codigo QR*/ 
_barCodeScanned = ({ data }) => {
		/*Obtener la fecha y hora actuales*/
		let fechaYhora = new Date();
		let fecha = fechaYhora.getDate() + '/' + (fechaYhora.getMonth() + 1) + '/' + fechaYhora.getFullYear();
		let hora = fechaYhora.getHours() + ':' + fechaYhora.getMinutes();
		
		/*Obtener el turno, y separar en dos partes el codigo
		leido tras el escaneo, utilizando "-" como separador*/
		let cadena;
		let turno;
	    turno = this._obtenerTurno(turno);
		cadena = data.split("-");
		
		/*Actualizar variables de estado correspondientes*/
		this.setState({aula: cadena[0]});
		this.setState({estado: "En el Aula"});
		this.setState({ showCamera: false });

	    /*Comprobar que el contrato Escuela esta iniciado y crear una instancia del mismo*/
		const {Escuela} = this.props.drizzleState.contracts;
		if (!Escuela || !Escuela.initialized) return; 
		const instance = this.props.drizzle.contracts.Escuela;
			
		/*Registrar una entrada en el contrato Escuela*/
		instance.methods.guardarEntrada.cacheSend(cadena[0], hora, fecha, cadena[1], turno, {from: this.props.direccion, gas: 400000});
  }

/*Funcion que actualiza la variable de estado "showCamera".
Es ejecutada automaticamente al pulsar el boton de "Entrar en el Aula"*/
_onPressButtonUno(){
  this.setState({showCamera: true});
  this.setState({estado: "En el Aula"});
}

/*Funcion que actualiza las variables de estado "estado" y "showCamera".
Ademas, registra una nueva salida en el contrato Escuela
Es ejecutada automaticamente al pulsar el boton de "Salir del Aula"*/
_onPressButtonDos(){
  /*Obtener la fecha y hora actuales*/
  let fechaYhora = new Date();
  let fecha = fechaYhora.getDate() + '/' + (fechaYhora.getMonth() + 1) + '/' + fechaYhora.getFullYear();
  let hora = fechaYhora.getHours() + ':' + fechaYhora.getMinutes();
  
  /*Actualizar variables de estado correspondientes*/
  this.setState({estado: "Fuera del Aula"});
  this.setState({ showCamera: false });
  
  /*Obtener el turno*/
  let turno; 
  turno = this._obtenerTurno(turno); 
  
  /*Comprobar que el contrato Escuela esta iniciado y crear una instancia del mismo*/
  const {Escuela} = this.props.drizzleState.contracts;
  if (!Escuela || !Escuela.initialized) return; 
  const instance = this.props.drizzle.contracts.Escuela;
  
  /*Registrar una salida en el contrato Escuela*/
  instance.methods.guardarSalida.cacheSend(this.state.aula, hora, fecha, turno, {from: this.props.direccion, gas: 300000});
}

/*Funcion que actualiza las variables de estado "pulsado" y "showCamera".
Es ejecutada automaticamente al pulsar el boton de "Ver Entradas"*/
_onPressButtonTres(){
this.setState({ pulsado: 1 });
this.setState({ showCamera: false });
}

/*Funcion que actualiza las variables de estado "pulsado" y "showCamera".
Es ejecutada automaticamente al pulsar el boton de "Ver Estado"*/
_onPressButtonCuatro(){
this.setState({ pulsado: 2 });
this.setState({ showCamera: false });
}

/*Funcion que actualiza las variables de estado "pulsado" y "showCamera".
Es ejecutada automaticamente al pulsar el boton de configuracion*/
_onPressButtonCinco(){
this.setState({ pulsado: 3 });
this.setState({ showCamera: false });
}

/*Cada vez que se renderiza el componente, se obtiene el estado actual de la alerta
asociada al usuario*/
componentDidUpdate() {
	const {Escuela} = this.props.drizzleState.contracts;
	if (!Escuela || !Escuela.initialized) return; 
		const instance = this.props.drizzle.contracts.Escuela;
		let changed = false;
		let {alertaKey} = JSON.parse(JSON.stringify(this.props.estado));
	if (!alertaKey) { 
		alertaKey = instance.methods.alertas.cacheCall(this.props.direccion);
		changed = true;
	} 
	else{
		changed = false;
		let alerta;
		let el = Escuela.alertas[this.props.alertaKey];
		alerta = el ? el.value : null;
		if(!(alerta == null)){ 
		if((alerta.estado == 1)&&(this.props.alertas == "Ninguna Alerta")&& (alerta.fecha != "")){
			let mensaje = "Sospechoso por contacto con positivo en la fecha " + alerta.fecha + " y aula " + alerta.aula ;
			alert(mensaje);
			let k = "Sospechoso";
			this.props.actualizar(k);
		}
		}
	}
	if (changed) {
		changed = false;
		this.props.actualizarKey(alertaKey);
	}
}

 render(){
			if(this.state.showCamera){
				const { CameraPermissionGranted } = this.state.CameraPermissionGranted;
				if(this.state.CameraPermissionGranted === null){
				/*Solicitar permiso para que la aplicacion acceda a la camara*/
				return(
					<View style={styles.container}>
						<Text>Please grant Camera permission</Text>
					</View> 
				);
				}
				if(this.state.CameraPermissionGranted === false){
				/*Permiso denegado*/
				return ( 
					<View style={styles.container}>
						<Text>Camera Permission Denied.</Text>
					</View> 
				);
				}
				if(this.state.CameraPermissionGranted === true){
				/*Permiso concedido, se procede a escanear*/
				return (
					<View style = {{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					}}>
						<BarCodeScanner
						onBarCodeScanned = {this._barCodeScanned }
						style = {{
						height:  DEVICE_HEIGHT/1.1,
						width: DEVICE_WIDTH,
						}}
						>
						</BarCodeScanner>
					</View>
				);
				}
			}

			let vista;
			if (this.state.pulsado == 1) {
				vista = <UltimasEntradas drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} cambiarPulsado={this._cambiarPulsado} actualizarKeyDos={this.props.actualizarKeyDos} cambiarEstado={this._cambiarEstado} registrado={this.props.registrado} entradaKey={this.props.entradaKey} entradasLengthKey={this.props.entradasLengthKey}  actualizar={this.props.actualizar} direccion={this.props.direccion} actualizarReg={this.props.actualizarReg} cambiarDir={this.props.cambiarDir} alertas={this.props.alertas} alertaKey={this.props.alertaKey} estado={this.props.estado}  actualizarKey={this.props.actualizarKey} />;
			}
			else if(this.state.pulsado == 2){
				vista = <EstadoClinico drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} cambiarPulsado={this._cambiarPulsado} cambiarEstado={this._cambiarEstado}  registrado={this.props.registrado}  actualizar={this.props.actualizar} direccion={this.props.direccion} actualizarReg={this.props.actualizarReg} cambiarDir={this.props.cambiarDir} alertas={this.props.alertas} alertaKey={this.props.alertaKey} estado={this.props.estado}  actualizarKey={this.props.actualizarKey} estadoClinico={this.state.estadoClinico} cambiarEstadoClinico={this._cambiarEstadoClinico}/>;
			}
			else if(this.state.pulsado == 3){
				vista = <Configuracion drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} cambiarPulsado={this._cambiarPulsado} actualizarKeyDos={this.props.actualizarKeyDos} cambiarEstado={this._cambiarEstado} registrado={this.props.registrado}  actualizar={this.props.actualizar} direccion={this.props.direccion} actualizarReg={this.props.actualizarReg} cambiarDir={this.props.cambiarDir} alertas={this.props.alertas} alertaKey={this.props.alertaKey} estado={this.props.estado}  actualizarKey={this.props.actualizarKey} />;
			}
			else{
				vista =    <ImageBackground source={require("./assets/fondo6.jpg")} imageStyle={{ resizeMode: 'stretch' }} style={{width:DEVICE_WIDTH , height:DEVICE_HEIGHT, marginTop:35}}>

				<View style={{backgroundColor:'#ffffff', position: 'absolute',width:300 , height:150,  justifyContent: 'center', alignItems: 'center', marginLeft:48, marginTop:300}}>
					<Text style={{ fontSize: 25, color: '#252850', fontWeight: "bold", textAlign: 'center' }}>Ubicación: {this.state.estado}</Text>
					<Text style={{ fontSize: 25, color: '#ff0000', fontWeight: "bold", textAlign: 'center' }}>Alertas:{'\n'}{this.props.alertas}</Text>
				</View>
	
				<View style={{position: 'absolute', marginLeft:20, marginTop:480}}>
					<TouchableHighlight style={{backgroundColor: '#191970', width:165, height:46, marginBottom: 2, borderRadius: 200 / 2, justifyContent: 'center'}} onPress={this._onPressButtonUno}>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Entrar en el Aula</Text>
					</TouchableHighlight>
				</View>

				<View style={{position: 'absolute', marginLeft:20, marginTop:360}}>
					<TouchableHighlight style={{backgroundColor: '#191970', width:165, height:46, marginBottom: 2, marginTop: 200, borderRadius: 200 / 2, justifyContent: 'center'}} onPress={this._onPressButtonDos}>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Salir del Aula</Text>
					</TouchableHighlight>
				</View>
	  
				<View style={{position: 'absolute', marginLeft:210, marginTop:278}}>
					<TouchableHighlight style={{backgroundColor: '#191970', width:165, height:46, marginBottom: 2, marginTop: 200, borderRadius: 200 / 2, justifyContent: 'center'}} onPress={this._onPressButtonTres}>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Ver Entradas</Text>
					</TouchableHighlight>
				</View>
	  
				<View style={{position: 'absolute', marginLeft:210, marginTop:360}}>
					<TouchableHighlight style={{backgroundColor: '#191970', width:165, height:46, marginBottom: 2, marginTop: 200, borderRadius: 200 / 2, justifyContent: 'center'}} onPress={this._onPressButtonCuatro}>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Ver Estado</Text>
					</TouchableHighlight>
				</View>
	  
				<View style={{position: 'absolute', marginLeft:295, marginTop:5}}>
					<TouchableHighlight style={{backgroundColor: '#8a2be2', width:100, height:80}} onPress={this._onPressButtonCinco}>
						<Image source={require("./assets/configuracion.jpg")} style={{width:100, height:80}} imageStyle={{ resizeMode: 'stretch' }}/>
					</TouchableHighlight>
				</View>
	  
				<View style={{backgroundColor:'transparent', position: 'absolute',width:230 , height:80,  justifyContent: 'center', alignItems: 'center', marginLeft:80, marginTop:640}}>
					<Text style={{ fontSize: 35, color: 'black', fontWeight: "bold", textAlign: 'center' }}>AULAS COVID</Text>
				</View>
			</ImageBackground>;
		}
		return (vista);
  }
}

/*Estilo adicional*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});