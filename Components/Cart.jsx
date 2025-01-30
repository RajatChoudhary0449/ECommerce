import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import { AppContext } from '../App';
import { useNavigation } from '@react-navigation/native';

export default function Cart() {
    const { items, setItems, search, setSearch, cart, setCart, list, filteredList, assets, quantity, setQuantity } = useContext(AppContext);
    const navigation = useNavigation();
    const [cartedlist, setCartedList] = useState([]);

    useEffect(() => {
        const newList = [];
        for (let it of list) {
            if (cart.filter(c => c.title === it.fields.title)[0].added) newList.push(it);
        }
        setCartedList(newList);
    }, [list, cart]);

    const handleQuantityChange = (title, newQuantity) => {
        setQuantity(prevState =>
            prevState.map(item =>
                item.title === title ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemove = (title) => {
        let newQuantity = quantity, newcart = cart;
        newQuantity = newQuantity.map(qty => qty.title !== title ? qty : { ...qty, quantity: 0 });
        newcart = newcart.map(cart => {
            if (cart.title === title) return { ...cart, added: false };
            else return cart;
        });
        setQuantity(newQuantity);
        setCart(newcart);
        setItems(items - 1);
    };

    const calculateTotalAmount = () => {
        return cartedlist.reduce((total, item) => {
            const itemQuantity = quantity.find(q => q.title === item.fields.title)?.quantity || 1;
            return total + (item.fields.price * itemQuantity);
        }, 0);
    };

    const section = ({ item, index }) => {
        const imageAsset = assets?.find(asset => asset?.sys?.id === item.fields.image.sys.id);
        const imageUrl = ("https:" + imageAsset?.fields?.file?.url) || 'https://via.placeholder.com/100';

        const itemQuantity = quantity.find(q => q.title === item.fields.title)?.quantity || 1;
        const totalPrice = item.fields.price * itemQuantity;

        return (
            <View style={styles.cardContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.fields.title}</Text>
                    <Text style={styles.description}>{item.fields.description}</Text>
                    <View style={styles.quantityContainer}>
                        <Button
                            title="-"
                            onPress={() => handleQuantityChange(item.fields.title, Math.max(1, itemQuantity - 1))}
                            style={styles.quantityButton}
                        />
                        <TextInput
                            style={styles.quantityInput}
                            value={String(itemQuantity)}
                            keyboardType="numeric"
                            onChangeText={(text) => handleQuantityChange(item.fields.title, parseInt(text) || 1)}
                        />
                        <Button
                            title="+"
                            onPress={() => handleQuantityChange(item.fields.title, itemQuantity + 1)}
                            style={styles.quantityButton}
                        />
                        <Text style={styles.priceText}>{`$ ${totalPrice.toFixed(2)}`}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => handleRemove(item.fields.title)}>
                    <Text style={styles.buttonText}>Remove from Cart</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleCheckout = () => {
        const totalAmount = calculateTotalAmount();
        // Alert.alert(
        //     "Checkout",
        //     `Your total price is $${totalAmount.toFixed(2)}\nHappy shopping!`,
        //     [{ text: "OK" }]
        // );
        navigation.navigate("Location")
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={cartedlist}
                renderItem={section}
                keyExtractor={(item) => item.fields.title}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.total}>Total Price: $ {calculateTotalAmount().toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 15,
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityButton: {
        width: 30,
        height: 30,
        padding: 10,
    },
    quantityInput: {
        width: 40,
        height: 50,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginHorizontal: 10,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#FF4F5A',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    totalContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 20,
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    checkoutButton: {
        backgroundColor: '#FF4F5A',
        paddingVertical: 15,
        marginHorizontal: 10,
        marginBottom: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
