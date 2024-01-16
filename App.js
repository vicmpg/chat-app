import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const Stack = createNativeStackNavigator();
const App = () => {

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
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start}></Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default App;