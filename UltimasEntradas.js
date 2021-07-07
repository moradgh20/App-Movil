/* Importar las librerías y los componentes necesarios */
import React, {Component} from 'react';
import {Text, Image, StyleSheet, ImageBackground, Dimensions, TextInput, TouchableHighlight, View, Alert, ScrollView} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

/* Definir las dimensiones de la pantalla del dispositivo */
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class UltimasEntradas extends Component {

constructor(props){
	super(props);
	this.state = {
		/* La variable de estado "num" se utiliza para almacenar el numero
		de ultimas entradas introducido en el filtro. */
		num: 0	
	};
	this._onPressButtonUno = this._onPressButtonUno.bind(this);
	this._formatoTurno = this._formatoTurno.bind(this);
}

/*Funcion que se ejecuta al introducir un numero
en el filtro. Actualiza la variable de estado "num". */
_textUno(texto){
	this.setState({num: texto});
}

/*Funcion que se ejecuta al pulsar el boton de volver.
Cambia la correspondiente variable de estado que controla
la transicion de una pantalla a otra*/
_onPressButtonUno(){
 let x = 0;
 this.props.cambiarPulsado(x);
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

/*Funcion que se utiliza para pasar el numero
de turno a su correspondiente formato de hora*/
 _formatoTurno(turno) {	
 let cadena;
	if (turno==1) {
            cadena = "8:00-10:00";
        }
        else if (turno==2) {
            cadena = "10:00-12:00";
		}
        else if (turno==3) {
            cadena = "12:00-14:00";
        }
		else if (turno==4) {
            cadena = "14:00-16:00";
        }	
		else if (turno==5) {
            cadena = "16:00-18:00";
        }
		else if (turno==6) {
            cadena = "18:00-20:00";
        }
		
		else if (turno==7) {
            cadena = "20:00-21:00";
        }
         else {
			cadena = "21:00-8:00";
        }
		return cadena;
 }

/*Cada vez que se renderiza el componente, se obtiene del contrato Escuela
la longitud y el contenido del array de los ultimos registros*/
componentDidUpdate() {
 const {Escuela} = this.props.drizzleState.contracts;
 if (!Escuela || !Escuela.initialized) return; 
 const instance = this.props.drizzle.contracts.Escuela;
 let changed = false;
 let {entradaKey, entradasLengthKey} = JSON.parse(JSON.stringify(this.props.estado));
 if (!entradasLengthKey) { 
 entradasLengthKey = instance.methods.ultimosRegistrosLength.cacheCall(this.props.direccion);
 changed = true;
 } 
 else{	
	let el = Escuela.ultimosRegistrosLength[this.props.entradasLengthKey];
	el = el ? el.value : 0;
	for (let i = entradaKey.length; i < el; i++) {
		entradaKey[i] = instance.methods.ultimosRegistros.cacheCall(this.props.direccion,i,{from: this.props.direccion, gas: 400000});
		changed = true;
	}
 }

 if (changed) {
	changed = false;
    this.props.actualizarKeyDos(entradaKey, entradasLengthKey);
 }
}
 

 render(){
	 
	/*Construccion del contenido de la tabla de ultima entradas*/
	const HeadTable = ['Fecha','Turno','Aula'];
	let o = [];
	let contenido = [];
	let entradasLength;
	let entradas = [];
	const {Escuela} = this.props.drizzleState.contracts;
	if (Escuela && Escuela.initialized ) {
		let el = Escuela.ultimosRegistrosLength[this.props.entradasLengthKey];
		entradasLength = el ? el.value : 0;
		if(this.props.entradaKey.length > 0){
			for (let i = 0; i < this.props.entradaKey.length; i++) {
				const eva = Escuela.ultimosRegistros[this.props.entradaKey[i]];
				entradas[i] = eva ? eva.value : {aula: "??", turno: 0, fecha: "??"};
			}
		let g;
		let h;
		if(entradas.length >0){
			for (let r = 0; r < entradas.length; r++) {
				h =  this._formatoTurno(entradas[r].turno);
				o[r] = [];
				o[r].push(entradas[r].fecha);
				o[r].push(h);
				o[r].push(entradas[r].aula);
			}
		let f;
		let l;
		l = this.state.num;
		if(this.state.num >= entradas.length+1){
			l = entradas.length ;
		}
		for (let u = entradas.length-1; u > entradas.length-1-l ; u--) {
			f =  this._formatoTurno(entradas[u].turno);
			contenido[u] = [];
			contenido[u].push(entradas[u].fecha);
			contenido[u].push(f);
			contenido[u].push(entradas[u].aula);
		}
		}
		}
	}
	if(o.length == 0){
		o[0] = [];
		o[0].push(["No hay entradas"]);
	}
	if(entradas.length == 0){
		contenido[0] = [];
		contenido[0].push(["No hay entradas"]);
	}
	
	let vista;
	
	/*Si en el filtro se introduce un valor mayor que 0, se muestra el numero de entradas introducido.
	En caso contrario, se muestra el mensaje "No hay entradas" en la tabla*/
	if(this.state.num > 0){
		vista = <ImageBackground source={require("./assets/fondo8.jpg")} imageStyle={{ resizeMode: 'stretch' }} style={{width:DEVICE_WIDTH , height:DEVICE_HEIGHT, marginTop:35}}>

		<Text style={{fontSize: 15, fontWeight: 'bold', marginLeft: 47}}>Filtro</Text>
			<TextInput style={{fontSize: 15, borderColor: 'black', borderWidth: 2,  marginLeft: 45, marginTop:1, height:30, width: 40}}
			keyboardType = 'numeric' onChangeText={this._textUno.bind(this)}>
		</TextInput>
	 
		<ScrollView vertical={true}>
			<View style={styles.container}>
				<Table borderStyle={{borderWidth: 1, borderColor: '#ffa1d2'}}>
					<Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.TableText}/>
					<Rows data={contenido} textStyle={styles.RowText}/>
				</Table>
			</View>
		</ScrollView>
	
		<View style={{position: 'absolute', marginLeft:240, marginTop:10}}>
			<TouchableHighlight style={{backgroundColor: '#252850', width:140, height:36}} onPress={this._onPressButtonUno}>
				<Image source={require("./assets/volver.jpg")} style={{width:140, height:36}}/>
			</TouchableHighlight>
		</View>
       </ImageBackground>;
	}
	else{	
		vista = <ImageBackground source={require("./assets/fondo8.jpg")} imageStyle={{ resizeMode: 'stretch' }} style={{width:DEVICE_WIDTH , height:DEVICE_HEIGHT, marginTop:35}}>
		<Text style={{fontSize: 15, fontWeight: 'bold', marginLeft: 47}}>Filtro</Text>
			<TextInput style={{fontSize: 15, borderColor: 'black', borderWidth: 2,  marginLeft: 45, marginTop:1, height:30, width: 40}}
			keyboardType = 'numeric' onChangeText={this._textUno.bind(this)}>
		</TextInput>
	 
		<ScrollView vertical={true}>
			<View style={styles.container}>
				<Table borderStyle={{borderWidth: 1, borderColor: '#ffa1d2'}}>
					<Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.TableText}/>
					<Rows data={o} textStyle={styles.RowText}/>
				</Table>
			</View>
		</ScrollView>
	
		<View style={{position: 'absolute', marginLeft:240, marginTop:10}}>
			<TouchableHighlight style={{backgroundColor: '#252850', width:140, height:36}} onPress={this._onPressButtonUno}>
				<Image source={require("./assets/volver.jpg")} style={{width:140, height:36}}/>
			</TouchableHighlight>
		</View>
	   </ImageBackground>;
	}
    return (vista);
  }
}

/*Estilo para la tabla de entradas*/
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 18,
    paddingTop: 10,
	backgroundColor: 'transparent',
  },
  HeadStyle: { 
    height: 50,
    alignContent: "center",
    backgroundColor: '#ffe0f0',
	marginTop:2,
  },
  TableText: { 
    margin: 10,
	fontSize: 25, 
	color: 'black', 
	fontWeight: "bold"
  },
  RowText: { 
    margin: 10,
	fontSize: 18, 
	color: 'black', 
	fontWeight: "normal"
  },
   dataWrapper: { 
    marginTop: -1 
  }
});