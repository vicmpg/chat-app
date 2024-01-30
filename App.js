import Start from './components/Start';
import Chat from './components/Chat';
import CustomActions from './components/CustomActions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { disableNetwork, enableNetwork, getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";
import { useNetInfo }from '@react-native-community/netinfo';
import { getStorage} from "firebase/storage";

const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {

  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  const firebaseConfig = {
    apiKey: "AIzaSyAXcWnd25NIE8xfGU-bYC7R9QcPRg6Wj90",
    authDomain: "chat-app-a99d9.firebaseapp.com",
    projectId: "chat-app-a99d9",
    storageBucket: "chat-app-a99d9.appspot.com",
    messagingSenderId: "365205187693",
    appId: "1:365205187693:web:5c850c61d645d3bb876364",
    measurementId: "G-NC08XKFZVW"
  };


  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const storage = getStorage(app);
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
       <Stack.Screen
          name="Chat"
        >
          {props => <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
export default App;