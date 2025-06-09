import React, { useState } from 'react';
import { View, Text, TextInput, Button, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Login.styles';
import { getLocalIP } from "./util/helpers";

const backend_url = `http://${getLocalIP()}:3000`;   // For physical phone

export default function SignUp({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            const uid = await fetch(`${backend_url}/users/by-username/${username}`);
            if (uid.status === 200) {
                alert('Username already exists. Please choose a different username.');
                return;
            }
            const res = await fetch(`${backend_url}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserName: username, Password: password }),
            });
            const data = await res.json();
            console.log(data.success);
            console.log(data.message);
            if (data.success) {
                alert('Sign up successful! You can now log in.');
                navigation.navigate('Login');
            } else {
                alert('Sign up failed. Please try again.');
            }
        } catch (error) {
            console.error('Sign up error:', error);
            alert('Sign up failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
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
            <Button title="註冊" onPress={handleSignUp} />
            <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: 'blue', marginTop: 30, textAlign: "center" }}>已有帳號？登入</Text>
            </Pressable>
        </View>
    );
}