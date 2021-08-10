import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Button, Linking, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import * as Contacts from 'expo-contacts';

export default function App() {
  const [permission, setPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [contacts, setContacts] = useState([]);


  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        // fetch our contacts and set them to component "state"
        let contactList = await Contacts.getContactsAsync();
        setContacts(contactList.data);
      }
    }

    getContacts();
  }, []);


  function call(person) {
    const phoneNumber = person.phoneNumbers[0].digits;
    const link = `tel:${phoneNumber}`;

    console.log(link);
    Linking.canOpenURL(link)
      .then(supported => Linking.openURL(link))
      .catch(console.error);
  }



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  if (permission === null) {
    return <View />;
  }
  if (permission === false) {
    return <Text>No access to camera</Text>;
  }



  return (
    <>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {/* <Button onPress={() => console.log('Ive been pressed')} title="Click Here!" /> */}
        <Text style={styles.topText}> Want to Call Someone? </Text>

        <FlatList
          style={styles.list}
          data={contacts}
          // function for what to render given the value of he data Prop.
          renderItem={({ item }) => item.name === undefined ? <Button style={styles.contact} title='undefined' onPress={() => console.log(item.name)} /> : <Button style={styles.contact} title={item.name} onPress={() => call(item)} />}

          // key extractor is here for react to manage dynamic rendering of native components.
          keyExtractor={item => item.id}


        // key extractor is here for react to manage dynamic rendering of native components.

        />

        <Text style={styles.topText}> You Look 👌 </Text>
        <Camera style={styles.cam} type={type}>
          <View style={styles.view}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={styles.text}> 🔁 </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    </>
  );
}


const styles = StyleSheet.create({

  container: {
    display: 'flex',
    flex: 1,
    borderWidth: 10,
    borderColor: "#6997bf",
    backgroundColor: '#6997bf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cam: {
    width: '100%',
    height: '50%',
  },
  button: {
    height: 70,
    width: 70,
    // backgroundColor: '#c4f7b0',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: '82%'

  },
  text: {
    fontSize: 50,
    flex: 2,
    marginTop: '10%',
  },
  topText: {
    fontSize: 30,
    marginTop: '10%',
    color: 'white',
  },
  list: {
    color: 'white',
    maxHeight: '20%',
    flex: 2,
    borderColor: 'red',
    borderWidth: 2,
    backgroundColor: '#c4f7b0',
  },
  contact: {
    color: 'white',
    backgroundColor: 'grey',
  },
});
