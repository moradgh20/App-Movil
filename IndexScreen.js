/* Importar las librerías y los componentes necesarios */
import React from 'react';
import {Text, Image, TextInput, TouchableHighlight, View, ImageBackground} from 'react-native';
import * as FileSystem from 'expo-file-system';

export default class IndexScreen extends React.Component {

constructor(props){
	super(props);
	this.state = {
		/* La variable de estado "privKey" se utiliza para almacenar la clave privada introducida
		por el usuario. */
		privKey:""
	};
	this._onPressButtonYes = this._onPressButtonYes.bind(this);
	this._onPressButtonNo = this._onPressButtonNo.bind(this);
}

/*Funcion para actualizar la variable de estado "privKey".
Es ejecutada automaticamente al introducir un nuevo valor 
en la entrada de "Clave Privada"*/
_textUno(texto){
	this.setState({privKey: texto});
}

/*Funcion para importar una cuenta existente.
Es ejecutada automaticamente al pulsar el boton de 
"Importar", depues de haber introducido la clave privada*/
async _onPressButtonYes(){
	  /*Importar cuenta a partir de la clave privada*/
	  const {address, privateKey} = await this.props.drizzle.web3.eth.accounts.privateKeyToAccount(this.state.privKey);

	  /*Actualizar variables de estado correspondientes*/
	  this.props.cambiarDir(address);
	  this.setState({direccion: address});
	  this.setState({ready: true});
	  
	  /*Comprobar que el contrato Datos esta iniciado y crear una instancia del mismo*/
	  const {Datos} = this.props.drizzleState.contracts;
	  if (!Datos || !Datos.initialized) return; 
	  const instance = this.props.drizzle.contracts.Datos;
	  
	  /*Registrar la direccion existente en el contrato Datos*/
	  instance.methods.autoregistro.cacheSend({from: address, gas: 300000});
	  
	  /*Actualizar las correspondientes variables de estado*/
	  let x = true;
	  let y = true;
	  this.props.actualizarReg(x, y);
	  
	  /*Crear el fichero direccion.txt y escribir en el la nueva direccion*/
	  await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "direccion.txt", address);
}

/*Funcion para crear una cuenta nueva.
Es ejecutada automaticamente al pulsar el boton de "Crear"*/
async _onPressButtonNo(){
	/*Comprobar que el contrato Datos esta iniciado y crear una instancia del mismo*/
	const {Datos} = this.props.drizzleState.contracts;
	if (!Datos || !Datos.initialized) return; 
	const inst = this.props.drizzle.contracts.Datos;
	
	/*Crear una nueva cuenta y desbloquearla*/
	const address = await this.props.drizzle.web3.eth.personal.newAccount('test');
	await this.props.drizzle.web3.eth.personal.unlockAccount(address, 'test', 0);
	
	/*Actualizar la direccion del usuario*/
	alert("Nueva dirección: " + address);
	this.props.cambiarDir(address);
	
	/*Enviar 10 ethers a la nueva cuenta*/
	const accounts = await this.props.drizzle.web3.eth.getAccounts();
	await this.props.drizzle.web3.eth.sendTransaction({to:address, from:accounts[9], value:this.props.drizzle.web3.utils.toWei("10", "ether")});
	
	/*Crear una nueva instancia del contrato Datos*/
	if (!Datos || !Datos.initialized) return; 
	const instance = this.props.drizzle.contracts.Datos;
	
	/*Registrar la nueva direccion en el contrato Datos*/
	instance.methods.autoregistro.cacheSend({from: address, gas: 300000});
	
	/*Actualizar las correspondientes variables de estado*/
	let x = true;
	let y = true;
	this.props.actualizarReg(x, y);
	
	/*Crear el fichero direccion.txt y escribir en el la nueva direccion*/
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "direccion.txt", address);
}

/*Justo antes de renderizar el componente por segunda vez, se comprueba si existe un fichero previo para borrarlo*/
 async componentDidMount() {
	 let {exists} = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "direccion.txt");
	 if(exists){
		await FileSystem.deleteAsync(FileSystem.documentDirectory + "direccion.txt");
	 }
}

 render(){		 
    return (
			<ImageBackground source={require("./assets/fondo_verde.jpg")} style={{width:420 , height:730, marginTop:30 }}>
				<View style={{
					 backgroundColor:'#9acd32',
					 flex: 1,
					 flexDirection: 'row',
					 justifyContent: 'space-around',
					 alignItems: 'flex-start',
					 marginTop: 70 ,
				}}>
					<View style={{backgroundColor:'#9acd32', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 10, marginTop: 5}}>
						<Image source={require("./assets/Escudo.jpg")} style={{width:80, height:75}} />
					</View>
					
					<View style={{backgroundColor:'#9acd32', flex: 2, flexDirection: 'row', justifyContent: 'flex-start', marginRight: 110}}>
						<Text style={{ fontSize: 30, color:'#191970', fontWeight: 'bold' }}>¡Bienvenido/a!</Text>
					</View>
				</View>
					
				<View style={{backgroundColor:'#9acd32', flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, marginRight: 20}}>
					<Text style={{ fontSize: 20, color:'#191970'}}>Importar o crear una cuenta:</Text>
				</View>

				<View style={{
					 backgroundColor:'#9acd32',
					 flex: 1,
					 flexDirection: 'row',
					 justifyContent: 'space-around',
					 alignItems: 'center',
					 marginTop: 20 ,
					 marginRight: 25,
				}}>
					 <View style={{backgroundColor:'#9acd32', flex: 1}}>
						<Text style={{fontSize: 20, fontWeight: 'bold', marginLeft: 130, marginBottom: 10}}>Clave Privada:</Text>
						<TextInput style={{fontSize: 12, borderColor: 'blue', borderWidth: 2, height: 40, width: 300, marginLeft: 45}}	
						 onChangeText={this._textUno.bind(this)}/>
					 </View>
					  
				</View>

				<View style={{
					 backgroundColor:'#9acd32',
					 flex: 1,
					 flexDirection: 'row',
					 justifyContent: 'space-around',
					 alignItems: 'center',
					 marginRight: 190,
				}}>
					 <View>
					   <TouchableHighlight style={{backgroundColor: '#191970',  width:100, height:40, marginBottom: 90, marginLeft: 160, marginTop: 60, borderRadius: 50 / 2, justifyContent: 'center'}} onPress={this._onPressButtonYes}>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Importar</Text>
					   </TouchableHighlight>
					 </View>
					 
					 <View>
					   <TouchableHighlight style={{backgroundColor: '#191970', width:100, height:40, marginBottom: 90, marginLeft: 180, marginTop: 60, borderRadius: 50 / 2, justifyContent: 'center'}} onPress={this._onPressButtonNo}>
						<Text style={{ fontSize: 20, color: 'white', fontWeight: "normal", textAlign: 'center' }}>Crear</Text>
					   </TouchableHighlight>
					 </View>
					 
				</View>

				<View style={{
					 backgroundColor:'#9acd32',
					 flex: 1,
					 flexDirection: 'column',
					 justifyContent: 'space-around',
					 alignItems: 'center',
				}}>
					<View style={{backgroundColor:'#9acd32'}}>
						<Text style={{ fontSize: 25, color:'#0000cd', marginTop: 100, marginLeft: 20, marginBottom: 100  }}>AULAS COVID</Text>
					</View>
				</View>
			</ImageBackground>
    );
  }
}

