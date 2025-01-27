import React, { useEffect, useState } from 'react';
import { spaceId, accessToken } from '@env';
import BodyCarousel from './BodyCarousel';
import { View, Text, StyleSheet, Alert, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function Body(props) {
    const { items, setitems } = props;
    const [cart, setcart] = useState([]);
    const [list, setList] = useState([]);
    const [assets, setassets] = useState([]);
    const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=product`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                setList(response?.data?.items);
                setassets(response?.data?.includes?.Asset);
                const initialcart = response?.data?.items?.map(() => ({ added: false }));
                setcart(initialcart);
            } catch (error) {
                console.error('Error fetching data from Contentful:', error);
            }
        };
        fetchData();
    }, []);

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
        description: {
            fontSize: 14,
            color: '#555',
            marginBottom: 10,
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
    });

    const renderProduct = ({ item, index }) => {
        const imageAsset = assets?.find(asset => asset?.sys?.id === item.fields.image.sys.id);
        const imageUrl = ("https://" + imageAsset?.fields?.file?.url) || 'https://via.placeholder.com/100';
        const handlechange = (index) => {
            const newcart = cart;
            if (newcart[index].added) setitems(items - 1);
            else setitems(items + 1);
            newcart[index].added = !newcart[index].added;
            setcart(newcart);
        };
        return (
            <View style={container.sectionContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={container.image}
                />
                <View style={container.textContainer}>
                    <Text style={container.title}>{item.fields.title}</Text>
                    <Text style={container.price}>${item.fields.price}</Text>
                    <Text style={container.description}>{item.fields.description}</Text>
                    {cart[index].added ? (
                        <TouchableOpacity style={container.redbutton} onPress={() => { alert(`${item.fields.title} removed from cart`); handlechange(index); }}>
                            <Text style={container.buttonText}>Remove from Cart</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={container.button} onPress={() => { alert(`${item.fields.title} added to cart`); handlechange(index); }}>
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
                <Text style={container.categoriesText}>Home</Text>
                <BodyCarousel props={assets}></BodyCarousel>
                <Text style={container.categoriesText}>Categories</Text>
            </View>
        );
    };

    return (
        <FlatList
            ListHeaderComponent={renderHeader}
            data={list}
            keyExtractor={(item) => item.sys.id}
            renderItem={renderProduct}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 10 }}
        />
    );
}
