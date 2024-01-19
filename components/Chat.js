import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";

const Chat = ({ route, navigation, db, isConnected }) => {
  const color = route.params.color;
  const name = route.params.name;
  const userID = route.params._id;
  // console.log(name);
  const [messages, setMessages] = useState([]);
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
    // console.log(messages);
  };
  //customizes chat bubble colors
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: "#000" },
          left: { backgroundColor: "#fff" },
        }}
      />
    );
  };
  //message example
  // useEffect(() => {
  //   onSnapshot(query(collection(db, "messages")), orderBy("createdAt", "desc"));
  // }, []);

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setLists(JSON.parse(cachedMessages));
  };

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };
  //local storage code
  let unsubMessages;

  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages();

      // Clean up code
      return () => {
        if (unsubShoppinglists) unsubShoppinglists();
      };
    }

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  //backup
  // useEffect(() => {
  //   navigation.setOptions({ title: name });
  //   const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  //   const unsubMessages = onSnapshot(q, (docs) => {
  //     let newMessages = [];
  //     docs.forEach((doc) => {
  //       newMessages.push({
  //         id: doc.id,
  //         ...doc.data(),
  //         createdAt: new Date(doc.data().createdAt.toMillis()),
  //       });
  //     });
  //     setMessages(newMessages);
  //   });
  //   return () => {
  //     if (unsubMessages) unsubMessages();
  //   };
  // }, []);

  useEffect(() => {
    //sets chat page title to username given on start page
    navigation.setOptions({ title: name });
  });

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };
  return (
    //sets background color to the color selected in start
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1, name: name }}
      />
      {/* when typing, makes the keyboard not hide imput or information that would be behind it */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 40,
  },
});
export default Chat;