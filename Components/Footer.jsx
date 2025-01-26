import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Footer() {
    const styles = StyleSheet.create({
        body: {
            flex: 0,
            alignSelf: 'flex-end',
            backgroundColor: '#FF0000',
            padding: 10,
            width: '100%',
        }
    })
    return (
        <View style={styles.body}>
            <Text style={{ color: '#fff' }}>© 1996-2025, RC.com, Inc. or its affiliates</Text>
        </View>
    )
}
