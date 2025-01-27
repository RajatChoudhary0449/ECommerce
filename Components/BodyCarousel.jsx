import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const BodyCarousel = ({ props }) => {
    const [data, setdata] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const filldata = async (props) => {
        let curdata = [];
        if (!props || props.length == 0) return;
        for (let i = 0; i < props.length; i++) {
            const curobj = ({ id: props[i].sys.id, title: props[i].fields.title, imageUrl: "https:" + props[i].fields.file.url });
            curdata.push(curobj);
        }
        await setdata(curdata);
    }
    useEffect(() => {
        filldata(props);
    }, [props]);
    useEffect(() => {
        const intervalId = setInterval(() => {
            handleNext();
        }, 2000);

        return () => clearInterval(intervalId);
    }, [data, currentIndex]);
    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(data.length - 1);
        }
    };

    const handleTouch = (index) => {
        setCurrentIndex(index);
    };

    return (
        data.length == 0 ? (<View><Text>Loading...</Text></View>) : (
            <View style={styles.carouselContainer}>
                <TouchableOpacity style={[styles.navButton, styles.leftButton]} onPress={handlePrev}>
                    <Text style={styles.navButtonText}>{'<'}</Text>
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <Image source={{ uri: data[currentIndex].imageUrl }} style={styles.image} />
                    <Text style={styles.title}>{data[currentIndex].title}</Text>
                </View>

                <TouchableOpacity style={[styles.navButton, styles.rightButton]} onPress={handleNext}>
                    <Text style={styles.navButtonText}>{'>'}</Text>
                </TouchableOpacity>

                <View style={styles.dotsContainer}>
                    {data.map((_, index) => (
                        <TouchableOpacity key={index} onPress={() => handleTouch(index)}>
                            <View
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.activeDot,
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        )

    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 10,
    },
    title: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        zIndex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
    },
    leftButton: {
        left: 10,
    },
    rightButton: {
        right: 10,
    },
    navButtonText: {
        color: 'white',
        fontSize: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        margin: 5,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    activeDot: {
        backgroundColor: '#000',
    },
});

export default BodyCarousel;
