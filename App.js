import React, { useEffect, useState } from 'react';

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Button,
  } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';

import Snackbar from 'react-native-snackbar';

const busData = [
  { busName: 'Bus 1', busValue: '1'},
  { busName: 'Bus 2', busValue: '2' },
  { busName: 'Bus 3', busValue: '3'},
  { busName: 'Bus 4', busValue: '4'} ,
  { busName: 'Bus 5', busValue: '5'},
  { busName: 'Bus 6', busValue: '6'},
  { busName: 'Bus 7', busValue: '7'},
  { busName: 'Bus 8', busValue: '8'},
];

const fromData = [
    { fromPlace: 'Place 1', fromValue: '1' },
    { fromPlace: 'Place 2', fromValue: '2' },
    { fromPlace: 'Place 3', fromValue: '3' },
    { fromPlace: 'Place 4', fromValue: '4' },
    { fromPlace: 'Place 5', fromValue: '5' },
    { fromPlace: 'Place 6', fromValue: '6' },
    { fromPlace: 'Place 7', fromValue: '7' },
    { fromPlace: 'Place 8', fromValue: '8' },
];

const toData = [
    { toPlace: 'Place 1', toValue: '1' },
    { toPlace: 'Place 2', toValue: '2' },
    { toPlace: 'Place 3', toValue: '3' },
    { toPlace: 'Place 4', toValue: '4' },
    { toPlace: 'Place 5', toValue: '5' },
    { toPlace: 'Place 6', toValue: '6' },
    { toPlace: 'Place 7', toValue: '7' },
    { toPlace: 'Place 8', toValue: '8' },
];

const App = () => {
    const [fromValue, setFromValue] = useState(null);
    const [isFromFocus, setIsFromFocus] = useState(false);
    const [toValue, setToValue] = useState(null);
    const [isToFocus, setIsToFocus] = useState(false);
    const [busValue, setBusValue] = useState(null);
    const [isBusFocus, setIsBusFocus] = useState(false);

    const [currentLongitude,setCurrentLongitude] = useState('...');
    const [currentLatitude,setCurrentLatitude] = useState('...');
    const [locationStatus,setLocationStatus] = useState('');



  useEffect(() => {
    
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition((position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        
        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };


  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition((position) => {
        //Will give you the location on location change
        
        setLocationStatus('You are Here');
        // console.log(position);
      
        //getting the Longitude from the location json        
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };




const onPressLearnMore = () => {
   

    if ((fromValue == null) || (toValue == null) || (busValue == null)) {
        Snackbar.show({
            text: 'Please select from and to places and bus also',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "#D82E2F"
          });
    } else {
        Snackbar.show({
            text: 'Started',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "#4DD637"
          });


          var liveBusData = {
            fromValue,
            toValue,
            currentLatitude,
            currentLongitude
          };
          
          // Convert the JavaScript object to JSON
          var json = JSON.stringify(liveBusData);
          
          console.log(json);
      
          // Send the data to the server
          axios.post('http://your-server-ippadress:portnumer/livebus/post', data)
          .then(response => {
            console.log('Data sent successfully');
            console.log(response.data);
          })
          .catch(error => {
            console.error('Error sending data:', error);
          });
      
    }
}
    

    const renderFromLabel = () => {
      if (fromValue || isFromFocus) {
        return (
          <Text style={[styles.label, isFromFocus && { color: 'blue' }]}>
            From
          </Text>
        );
      }
      return null;
    };

    const renderToLabel = () => {
        if (toValue || isToFocus) {
          return (
            <Text style={[styles.label, isToFocus && { color: 'blue' }]}>
              To
            </Text>
          );
        }
        return null;
      };


    return (
        <>


<View style={styles.lcontainer}>
        <View style={styles.lcontainer}>
          <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
            }}
            style={{width: 100, height: 100}}
          />
          <Text style={styles.lboldText}>
            {locationStatus}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Longitude: {currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}>
            Latitude: {currentLatitude}
          </Text>
          <View style={{marginTop: 20}}>
            <Button
              title="Refresh"
              onPress={getOneTimeLocation}
            />
          </View>
        </View>
      </View>

      <View style={styles.container}>
        {renderFromLabel()}
        <Dropdown
          style={[styles.dropdown, isBusFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={busData}
          search
          maxHeight={300}
          labelField="busName"
          valueField="busValue"
          placeholder={!isBusFocus ? 'Bus name' : '...'}
          searchPlaceholder="Search..."
          value={busValue}
          onFocus={() => setIsBusFocus(true)}
          onBlur={() => setIsBusFocus(false)}
          onChange={item => {
            setBusValue(item.busValue);
            setIsBusFocus(false);
          }}
        />
        
      </View>
      
      <View style={styles.container}>
        {renderFromLabel()}
        <Dropdown
          style={[styles.dropdown, isFromFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={fromData}
          search
          maxHeight={300}
          labelField="fromPlace"
          valueField="fromValue"
          placeholder={!isFromFocus ? 'From' : '...'}
          searchPlaceholder="Search..."
          value={fromValue}
          onFocus={() => setIsFromFocus(true)}
          onBlur={() => setIsFromFocus(false)}
          onChange={item => {
            setFromValue(item.fromValue);
            setIsFromFocus(false);
          }}
        />
        
      </View>

      <View style={styles.container}>
        {renderToLabel()}
        <Dropdown
          style={[styles.dropdown, isToFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={toData}
          search
          maxHeight={300}
          labelField="toPlace"
          valueField="toValue"
          placeholder={!isToFocus ? 'To' : '...'}
          searchPlaceholder="Search..."
          value={fromValue}
          onFocus={() => setIsToFocus(true)}
          onBlur={() => setIsToFocus(false)}
          onChange={item => {
            setToValue(item.toValue);
            setIsToFocus(false);
          }}
        />
        
      </View>
      <Button
  onPress={onPressLearnMore}
  title="start"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>




      </>
    );
  };

  export default App;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    lcontainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      lboldText: {
        fontSize: 25,
        color: 'red',
        marginVertical: 16,
        textAlign: 'center'
      },
});