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
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation, db }) => {
  const color = route.params.color;
  const name = route.params.name;
  const userID = route.params._id;
  // console.log(name);

  const [messages, setMessages] = useState([]);
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
    console.log(messages);
  };

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

  //cheatsheet ref
  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);
  useEffect(() => {
    navigation.setOptions({ title: name });
  });
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{ id: 1, name: name }}
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
    // fontSize: 40,
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    fontSize: 40,
  },
});
export default Chat;