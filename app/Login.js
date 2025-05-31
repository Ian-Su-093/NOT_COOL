import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Login.styles';
import { Platform } from 'react-native';

const backend_url =
    Platform.OS === 'web'
        ? 'http://192.168.199.81:3000'       // For browser or Expo web
        : 'http://192.168.199.81:3000';   // For physical phone

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');

    const handleLogin = async () => {
        try {
            const res = await fetch(`${backend_url}/users/by-username/${username}`);
            const data = await res.json();
            console.log(data.success);

            if (data.success) {
                // 導航到主要的 Tab Navigator
                await AsyncStorage.setItem('userID', data.UserID);
                await AsyncStorage.setItem('username', username);
                navigation.navigate('MainTabs');
            } else {
                alert('Login failed. Please check your username.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}