import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { AppContext } from '../App';
import BodyCarousel from './BodyCarousel';

export default function Body() {
    const { items, setItems, search, setSearch, cart, setCart, list, filteredList, assets, quantity, setQuantity } = useContext(AppContext);

    const container = StyleSheet.create({
        body: {
            backgroundColor: "#fff",
            padding: 20,
        },
        categoriesText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 10,
        },
        sectionContainer: {
            flex: 1,
            margin: 10,
            backgroundColor: '#f9f9f9',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 5,
            flexDirection: 'column',
        },
        image: {
            width: '100%',
            height: 150,
            borderRadius: 10,
        },
        textContainer: {
            flex: 1,
            justifyContent: 'space-between',
            padding: 10,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        price: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
        },
        button: {
            backgroundColor: 'green',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10,
        },
        redbutton: {
            backgroundColor: 'red',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10,
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        noEntries: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#555',
            textAlign: 'center',
            marginTop: 20,
        },
    });

    const renderProduct = ({ item, index }) => {
        const imageAsset = assets?.find(asset => asset?.sys?.id === item.fields.image.sys.id);
        const imageUrl = ("https://" + imageAsset?.fields?.file?.url) || 'https://via.placeholder.com/100';

        const handleChange = (title) => {
            const newCart = [...cart];
            const itemIndex = newCart.findIndex(cartItem => cartItem.title === title);
            const newQuantity = quantity;
            if (itemIndex === -1) return;

            if (newCart[itemIndex].added) setItems(prevItems => prevItems - 1);
            else setItems(prevItems => prevItems + 1);

            newCart[itemIndex].added = !newCart[itemIndex].added;
            if (newCart[itemIndex].added) newQuantity.map(qty => qty.title === title ? { ...qty, quantity: 1 } : qty);
            else newQuantity.map(qty => qty.title === title ? { ...qty, quantity: 0 } : qty);
            setCart(newCart);
            setQuantity(newQuantity);
        };

        const checkcarteditem = (title) => {
            const cur = cart.filter(c => c.title === title);
            return cur.length > 0 && cur[0].added;
        };

        return (
            <View style={container.sectionContainer}>
                <Image source={{ uri: imageUrl }} style={container.image} />
                <View style={container.textContainer}>
                    <Text style={container.title}>{item.fields.title}</Text>
                    <Text style={container.price}>${item.fields.price}</Text>
                    {checkcarteditem(item.fields.title) ? (
                        <TouchableOpacity style={container.redbutton} onPress={() => { alert(`${item.fields.title} removed from cart`); handleChange(item.fields.title); }}>
                            <Text style={container.buttonText}>Remove from Cart</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={container.button} onPress={() => { alert(`${item.fields.title} added to cart`); handleChange(item.fields.title); }}>
                            <Text style={container.buttonText}>Add to Cart</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderHeader = () => {
        return (
            <View style={container.body}>
                <BodyCarousel props={assets} />
                <Text style={container.categoriesText}>Categories</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {filteredList.length === 0 ? (
                <Text style={container.noEntries}>No entries found</Text>
            ) : (
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={filteredList}
                    keyExtractor={(item) => item.sys.id}
                    renderItem={renderProduct}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
            )}
        </View>
    );
}
