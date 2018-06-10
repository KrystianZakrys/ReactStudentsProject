import React, {Component} from 'react';
import { StyleSheet, Text, View ,
Button, TouchableOpacity, AppRegistry,
ImageBackground, TextInput, Slider, ListView} from 'react-native';

import{PagerTabIndicator, IndicatorViewPager,
PagerTitleIndicator, PagerDotIndicator} from 'rn-viewpager';

import mapAPI from './utilities/MapAPI';

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
      <View style={{margin: 5}}>
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
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      address:"Wpisz adres...",
      radius: 10,
      mapAPI_locals: [],
      dataSource: ds.cloneWithRows(['row1','row2'])
    }
  }

  componentWillMount(){
    mapAPI.getLocals().then((res=>{
      this.setState({
        mapAPI_locals: res.results,
        dataSource: ds.cloneWithRows(res.results),
      })
    }))
  }

 onValueChange(value){
   this.setState({radius: value});
 }

  render() {
    return (
      <View style={{flex:1,}}>
      <IndicatorViewPager
      style={{flex:1}}
      indicator={this._renderDotIndicator()}>
      {/* PIERWSZY WIDOK/ FORMA / WPROWADZENIE DANYCH PRZEZ UŻYTKOWNIKA */}
          <View style={{flex:1}}>
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
          <View style={styles.flexItems}>
              {/* <Text>{this.state.mapAPI_status}</Text> */}
            <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}/>
          </View>

          {/* PRZEDSTAWIENIE LOKALI DOOKOŁA W POSTACI LISTY */}
          <View style={{backgroundColor:'#1AA094'}}>
          <Button onPress={()=>this.update()}
          style={{
            fontSize: 20,
            margin: 120,
          }}
          title="XD"></Button>
          <Items
            ref={done => (this.done = done)}
            onPressItem={this.update()}
          />
          </View>

            {/* PRZEDSTAWIENIE LOKALI DOOKOŁA W POSTACI LISTY */}
            <View style={{backgroundColor:'#f00'}}>
              <Text>page 4</Text>
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
    width: 5,
    height: 5
  },

  selectedDotStyle:{
    width: 12,
    height: 12,
    borderRadius: 250,
  }

});

const listStyles = StyleSheet.create({
  listItemView:{
    margin: 10,
  },
  localHeader:{
    fontSize: 20,
    color: 'orange',
    fontWeight: 'bold',
  }

});
