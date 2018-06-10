import React, {Component} from 'react';
import { StyleSheet, Text, View ,
Button, TouchableOpacity, AppRegistry,
ImageBackground, TextInput, Slider, ListView, Dimensions} from 'react-native';

import{PagerTabIndicator, IndicatorViewPager,
PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';

import mapAPI from './utilities/MapAPI';

import MapView from 'react-native-maps';

class Items extends React.Component{
  state={
    items: "",
  };

  componentDidMount(){
    this.update();
  }

  render(){
    const{items}= this.state;
    if(items ===null || items.length ===0){
      return null;
    }

    return(
      <View style={styles.itemstyle}>
        {items.map(({id,nazwa,kaliber,zasieg})=>(
          <TouchableOpacity
          key={id}
          onPress={()=> this.props.onPressItem && this.props.onPressItem(id)}
          style={{
            padding:5,
            borderColor: 'black',
            borderWidth: 1,
          }}>
            <Text>{nazwa}</Text>
            <Text>{kaliber}</Text>
            <Text>{zasieg}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  
  update(){
    
   //TODO: jAKIŚ UPDATE
  }
}


const IMG_BG_LOGIN = "https://image.ibb.co/dkwQxS/IMG_BG_LOGIN.jpg";
const IMG_BG_MAIN = "https://image.ibb.co/cq9Oj7/IMG_BG_MAIN.jpg";
//const IMG_URL = "https://image.ibb.co/kdJNu7/IMG_THUMB.png";
const TXT_MAIN1 = "Podaj adres lub pozostaw puste by użyć twojej aktualnej lokalizacji";
const TXT_MAIN2 = "i podaj odległość od wybranej lokalizacji.";
const ds = new ListView.DataSource({rowHasChanged:(row1,row2)=>row1!=row2});


//GPS
const {width,height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width/height
const LATITUDE_DELTA = 0.0922
const LONGTITUDE_DELTA=LATITUDE_DELTA * ASPECT_RATIO
export default class App extends React.Component {

  watchID: ?number = null
  constructor(props){
    super(props);
    this.callbackFunction = this.callbackFunction.bind(this);

    

    this.state={
      initialPosition:{
        longitude: 0,
        latitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGTITUDE_DELTA,
      },     
      markerPosition:{
        latitude: 0,
        longitude: 0
      },
      address:"Wpisz adres...",
      radius: 10,
      mapAPI_locals: [],
      dataSource: ds.cloneWithRows(['row1','row2'])
    };

    //GPS
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);
    
      var lastRegion = {
        latitude: lat,
        longitude: long,
        longitudeDelta: LONGTITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA
      };
      this.setState({initialPosition: lastRegion});
      this.setState({markerPosition: lastRegion});


      //Ładowanie pobliskich lokali
      mapAPI.getLocals(lat, long, this.state.radius).then((res=>{
        this.setState({
          mapAPI_locals: res.results,
          dataSource: ds.cloneWithRows(res.results),
        });
      }));
      
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: false, timeout: 2000, maximumAge: 1000});

    
  }

  callbackFunction = (autoCompleteData) => {
    alert(autoCompleteData);
  }


 onValueChange(value){
   this.setState({radius: value});

   mapAPI.getLocals(this.state.initialPosition.latitude, this.state.initialPosition.longitude, this.state.radius).then((res=>{
    this.setState({
      mapAPI_locals: res.results,
      dataSource: ds.cloneWithRows(res.results),
    });
  }));

 }


// componentWillMount(){
//   // navigator.geolocation.getCurrentPosition(
//   //   (position) => {
//   //   var lat = parseFloat(position.coords.latitude);
//   //   var long = parseFloat(position.coords.longitude);

//   //   var initialRegion = {
//   //     latitude: lat,
//   //     longitude: long,
//   //     latitudeDelta: LATITUDE_DELTA,
//   //     longitudeDelta: LONGTITUDE_DELTA
//   //   };
//   //   this.setState({initialPosition: initialRegion});
//   //   this.setState({markerPosition: initialRegion});
//   // }, 
//   // (error) => alert(JSON.stringify(error)),
//   // {enableHighAccuracy: false, timeout: 2000, maximumAge: 1000, distanceFilter: 10});


 
// }

componentWillUnmount(){
  navigator.geolocation.clearWatch(this.watchID)
}

  render() {
    return (
      <View style={{flex:1,}}>
      <IndicatorViewPager
      style={{flex:1}}
      indicator={this._renderDotIndicator()}>
      {/* PIERWSZY WIDOK/ FORMA / WPROWADZENIE DANYCH PRZEZ UŻYTKOWNIKA */}
          <View style={{flex:1}}>
            <View style={styles.topbar}/>
            <ImageBackground
            style={{
            flex: 1,
            }}
            source={{ uri: IMG_BG_MAIN }}>
              <View style={[styles.flexItems]}>
                <Text
                style={[styles.textStyle]}>
                  {TXT_MAIN1}
                </Text>
              
                <TextInput
                value={this.state.address}
                onChangeText={(address)=>this.setState({address})}
                style={[styles.textInputStyle]}
                underlineColorAndroid='transparent'
                />
                  <Text
                style={[styles.textStyle]}>
                  {TXT_MAIN2}
                </Text>
                <Text
                style={[styles.rangeStyle]}>
                  {this.state.radius}km
                </Text>
                <Slider
                style={styles.sliderStyle}
                thumbTintColor="#ff9933"
                step={1}
                minimumValue={1}
                maximumValue={20}
                minimumTrackTintColor='white'
                maximumTrackTintColor='white'
                //thumbImage={{uri:IMG_URL}}
                value={this.state.radius}
                onValueChange={(value) => this.onValueChange(value)}
                />
              </View>
            </ImageBackground>
          </View>
          {/* WIDOK Z MAPĄ */}
          <View style={styles.viewstyle}>
            <View style={styles.topbar}/>
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}/>
          </View>

          {/* PRZEDSTAWIENIE LOKALI DOOKOŁA W POSTACI LISTY */}
          <View style={styles.viewstyle}>
            <View style={styles.topbar}/>
            <MapView
                  region={this.state.initialPosition}

                  style={styles.map}
                  initialRegion={this.state.initialPosition}
                >
                <MapView.Marker 
                coordinate={this.state.markerPosition}>
                  <View style={styles.radius}>
                    <View style={styles.marker}/>
                  </View>
                </MapView.Marker>
              </MapView>
          </View>

          {/* PRZEDSTAWIENIE LOKALI DOOKOŁA W POSTACI LISTY */}
          <View style={styles.viewstyle}>       
          </View>
      </IndicatorViewPager>
      </View>
    );
  }


update(){
  this.done && this.done.update();
};

_renderDotIndicator(){
  return <PagerDotIndicator pageCount={4}
  style={{marginBottom:30}}
  dotStyle={styles.dotStyle}
  selectedDotStyle={styles.selectedDotStyle}/>
}

_renderRow(rowData){
  return(
    <View style={listStyles.listItemView}>
      <Text style={listStyles.localHeader}>{rowData.name}</Text>
      <Text >{rowData.rating}</Text>
      <Text>{rowData.vicinity}</Text>
    </View>
  );
}
}
const styles = StyleSheet.create({
  itemstyle:{
    margin: 3,
    marginLeft: 10,
    marginRight: 10,
    padding: 20,
    backgroundColor: "#ffffff",
    
  },
  topbar:{
    height: 25,
    backgroundColor:'#ff9933',
  },
  viewstyle:{
    backgroundColor:'#ff9933'
  },
  map:{ 
      left: 0,
      right: 0,
      top: 25,
      bottom: 90,
      position: 'absolute'
  },
  radius:{
      height: 50,
      width: 50,
      borderRadius: 50/2,
      overflow: 'hidden',
      backgroundColor: 'rgba(0,122,255,0.1)',
      borderWidth: 1,
      borderColor: 'rgba(0,112,255,0.3)',
      alignItems: 'center',
      justifyContent: 'center'
  },
  marker:{
      height: 20,
      width: 20,
      borderWidth: 3,
      borderColor: 'white',
      borderRadius: 20/2,
      overflow: 'hidden',
      backgroundColor: '#007AFF'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle:{
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    fontSize: 20,
    paddingLeft: 70,
    paddingRight: 70,
    paddingBottom: 15,
    marginTop: 15,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,255)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 20,
    textAlign: 'center'
  },
  flexItems:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'

  },
  textInputStyle:{
    height: 40,
    borderColor: 'orange',
    borderWidth: 2,
    backgroundColor: 'white',
    width: '80%',
    padding:  10,
    color: 'gray',
  },
  rangeStyle:{
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    fontSize: 60,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 20,
    textAlign: 'center',
  },

  track:{
    height: 4,
    borderRadius: 2
  },
  thumb:{
    width: 100,
    height: 100,
    borderRadius: 30/2,
    backgroundColor: 'white',
    borderColor:'#ff9933',
    borderWidth: 2,
  },

  sliderStyle:{
    width: '80%',
    marginBottom: 60,
  },

  dotStyle:{
    backgroundColor: 'white',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    width: 5,
    height: 5
  },

  selectedDotStyle:{
    width: 12,
    height: 12,
    borderRadius: 250,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  }

});

const listStyles = StyleSheet.create({
  listItemView:{
    margin: 3,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width:1, height:2},
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  localHeader:{
    fontSize: 20,
    color: 'orange',
    fontWeight: 'bold',
  }

});
