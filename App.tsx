/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Header2 from './Components/Header2';
import Body from './Components/Body';
import Footer from './Components/Footer';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
  });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content"></StatusBar>
      <Header2></Header2>
      <Body></Body>
      <Footer></Footer>
    </SafeAreaView>
  );

}

export default App;
