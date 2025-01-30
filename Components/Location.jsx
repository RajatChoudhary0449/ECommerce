import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { spaceId, accessToken } from '@env';

const Location = () => {
    const [cities, setCities] = useState([
        { label: 'Mumbai', value: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
        { label: 'Delhi', value: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
    ]);

    const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=cities`;

    useEffect(() => {
        const fetchCities = async () => {
            const response = await axios.get(url);
            setCities(
                response?.data?.items
                    .map(item => item.fields)
                    .map(item => ({
                        label: item.title,
                        value: item.title,
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }))
            );
        };
        fetchCities();
    }, []);

    const [from, setFrom] = useState(cities[0]);
    const [to, setTo] = useState(cities[1]);
    const [mode, setMode] = useState('bus');
    const [distance, setDistance] = useState(null);
    const [cost, setCost] = useState(null);
    const [time, setTime] = useState(null);

    const rates = { bus: { cost: 2, speed: 30 }, flight: { cost: 15, speed: 500 } };

    const calculateShipping = (distance, mode) => ({
        cost: distance * rates[mode].cost,
        time: distance / rates[mode].speed,
    });

    useEffect(() => {
        if (!from || !to) return;
        fetchRoute();
    }, [from, to, mode]);

    const fetchRoute = async () => {
        try {
            const { data } = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=false`
            );
            if (!data.routes.length) return Alert.alert('Error', 'No routes found');

            const dist = data.routes[0].distance / 1000;
            setDistance(dist.toFixed(2));
            const { cost, time } = calculateShipping(dist, mode);
            setCost(cost.toFixed(2));
            setTime(time.toFixed(2));
        } catch {
            Alert.alert('Error', 'Failed to fetch route');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Shipping Calculator</Text>

            <Text style={styles.label}>From:</Text>
            <Picker
                selectedValue={from.value}
                onValueChange={itemValue => setFrom(cities.find(city => city.value === itemValue))}
                style={styles.picker}
            >
                {cities.map(city => (
                    <Picker.Item key={city.value} label={city.label} value={city.value} />
                ))}
            </Picker>

            <Text style={styles.label}>To:</Text>
            <Picker
                selectedValue={to.value}
                onValueChange={itemValue => setTo(cities.find(city => city.value === itemValue))}
                style={styles.picker}
            >
                {cities.map(city => (
                    <Picker.Item key={city.value} label={city.label} value={city.value} />
                ))}
            </Picker>

            <Text style={styles.result}>Shipping Mode: {mode}</Text>

            <View style={styles.resultContainer}>
                <Text style={styles.result}>Distance: {distance} km</Text>
                <Text style={styles.result}>Cost: ₹{cost}</Text>
                <Text style={styles.result}>Time: {time} hours</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'green' }]}
                    onPress={() => setMode('bus')}
                >
                    <Text style={styles.buttonText}>Cheapest (Bus)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#e74c3c' }]}
                    onPress={() => setMode('flight')}
                >
                    <Text style={styles.buttonText}>Fastest (Flight)</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.payNowContainer}>
                <TouchableOpacity
                    style={[styles.payNowButton, { backgroundColor: '#3471eb' }]}
                    onPress={() => Alert.alert('Payment', 'Proceeding to payment!')}
                >
                    <Text style={styles.buttonText}>Pay Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#2C3E50',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495E',
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#BDC3C7',
    },
    resultContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    result: {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '500',
        color: '#34495E',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 40,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        marginHorizontal: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#2980b9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    payNowContainer: {
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payNowButton: {
        paddingVertical: 15,
        borderRadius: 25,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    footer: {
        marginTop: 30,
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
    },
});

export default Location;
