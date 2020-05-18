import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, Button } from "react-native";
import MapView, { AnimatedRegion, Animated } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import axios from 'axios'
import Geocoder from 'react-native-geocoding'

Geocoder.init("AIzaSyARYJ1PEjq9z8K3TVlPxY2Ib52-PTLTZ7A")



export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState('-6.206726966135964,107.00868818131161')
  const [hospitals, setHospitals] = useState([])
  // const [latDestination, setLatDestination] = useState(-6.2260)
  // const [lngDestination, setLngDestination] = useState(107.0011)
  // const [latDel, setLatDel] = useState(0.2)
  // const [lngDel, setLngDel] = useState(0.2)
  // const [details, setDetails] = useState([])
  // let details
  // console.log(hospitals)
  useEffect(() => {
    getPosition()
      .then(({ data }) => {
        setCurrentLocation(data.lat + ',' + data.long)
        return fetchNearHospital(currentLocation)
      })
      .then(({ data }) => {
        const { results } = data
        setHospitals(results)
      })
      .catch(err => console.log(err))
  }, [currentLocation])
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        initialRegion={{
          latitude: +currentLocation.split(",")[0],
          longitude: +currentLocation.split(",")[1],
          latitudeDelta: 0.2,
          longitudeDelta: 0.2
        }}
        zoomControlEnabled={true}


      >

        {
          hospitals.map(hospital => (hospital.name.toLowerCase().includes("sakit") || hospital.name.toLowerCase().includes("rs") || hospital.name.toLowerCase().includes("hospital")) ?
            (
              <MapView.Marker coordinate={{ latitude: hospital.geometry.location.lat, longitude: hospital.geometry.location.lng }} title={hospital.name} description={hospital.vicinity} key={hospital.id} />
            ) : <></>)
        }
        <MapView.Marker coordinate={{ latitude: +currentLocation.split(",")[0], longitude: +currentLocation.split(",")[1] }} title={'rumahsaya'} pinColor={"white"} />


        {
          hospitals.map(hospital => (hospital.name.toLowerCase().includes("sakit") || hospital.name.toLowerCase().includes("rs") || hospital.name.toLowerCase().includes("hospital")) ? <MapViewDirections
            origin={{ latitude: +currentLocation.split(",")[0], longitude: +currentLocation.split(",")[1] }}
            destination={{ latitude: hospital.geometry.location.lat, longitude: hospital.geometry.location.lng }}
            apikey={'AIzaSyBfRZ4teg55GyBfA7mtR-NlIDugDXYELSc'}
            strokeWidth={3}
            strokeColor={"blue"}
          /> : <></>)
        }



      </MapView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});

function fetchNearHospital(currentLocation) {
  return axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLocation}&radius=5000&type=hospital&key=AIzaSyAsbtF5SxylGRFRTSRwI6tcWRTSvJchYiM`)
}

const fetchDetailHospital = async (place_id) => {
  let { data } = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=AIzaSyAsbtF5SxylGRFRTSRwI6tcWRTSvJchYiM`)
  const { result } = data
  const { international_phone_number } = result
  console.log({ international_phone_number })
}

// console.log(fetchDetailHospital("ChIJPWppQ7qOaS4Rn9vOEFhFqH4"))

function getPosition() {
  return axios.get("http://localhost:3000/location")
}