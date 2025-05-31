import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from './Login.styles';
import { Platform } from 'react-native';

const backend_url =
    Platform.OS === 'web'
        ? 'http://192.168.199.81:3000'       // For browser or Expo web
        : 'http://192.168.199.81:3000';   // For physical phone

export default function Login() {
    const [username, setUsername] = useState('');

    const handleLogin = async () => {
        // Handle login logic here
        alert(`Welcome, ${username}!`);
        console.log('Fetching user data for:', username);
        const res = await fetch(`${backend_url}/users/by-username/${username}`);
        console.log((await res.json()).success);
        console.log((await res.json()).UserID);
        // res.then(response => response.json())
        //     .then(data => {
        //         if (data.user) {
        //             // Navigate to the main app or store user data
        //             console.log('User data:', data.user);
        //         } else {
        //             alert('User not found');
        //             console.error('User not found:', username);
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error fetching user:', error);
        //         alert('Error logging in');
        //     });
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