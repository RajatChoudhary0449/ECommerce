import React, { useState, useEffect, createContext } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header2 from './Components/Header2';
import Body from './Components/Body';
import Footer from './Components/Footer';
import Cart from './Components/Cart';
import axios from 'axios';
import { spaceId, accessToken } from '@env';

export const AppContext = createContext(null);

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [items, setItems] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [cart, setCart] = useState([]);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [assets, setAssets] = useState([]);
  const [quantity, setQuantity] = useState([]);

  const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=product`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        response?.data?.items.sort();
        setList(response?.data?.items);
        setAssets(response?.data?.includes?.Asset);
        const initialCart = response?.data?.items?.map((item) => ({ title: item.fields?.title, added: false }));
        const initialQuantity = response?.data?.items?.map((item) => ({ title: item.fields?.title, quantity: 0 }));
        setCart(initialCart);
        setQuantity(initialQuantity);
      } catch (error) {
        console.error('Error fetching data from Contentful:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Called");
    if (search === "") {
      setFilteredList(list);
    } else {
      const filtered = list.filter(item =>
        item.fields.title.toLowerCase().includes(search.toLowerCase())
      );
      console.log(filtered);
      setFilteredList(filtered);
    }
  }, [search, list]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    }
  });

  return (
    <AppContext.Provider value={{ items, setItems, search, setSearch, cart, setCart, list, filteredList, assets, quantity, setQuantity }}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <Header2 items={items} setSearch={setSearch} />
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Body} />
            <Stack.Screen name="Cart" component={Cart} />
          </Stack.Navigator>
          <Footer />
        </NavigationContainer>
      </SafeAreaView>
    </AppContext.Provider>
  );
}

export default App;
