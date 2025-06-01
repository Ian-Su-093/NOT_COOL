import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Login.styles';


const backend_url = 'http://192.168.199.81:3000'   // For physical phone

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const uid = await fetch(`${backend_url}/users/by-username/${username}`);
            const userID = (await uid.json()).UserID;
            const res = await fetch(`${backend_url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserID: userID, Password: password }),
            });
            const data = await res.json();
            console.log(data.success);
            console.log(data.message);

            if (data.success) {
                // 導航到主要的 Tab Navigator
                await AsyncStorage.setItem('userID', userID);
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
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
            />
            <Button title="登入" onPress={handleLogin} />
        </View>
    );
}