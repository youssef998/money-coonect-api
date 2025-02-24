import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    console.log("Login initiated...");

    try {
      const response = await fetch("http://10.0.2.2:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response received:", response);
      const data = await response.json();
      console.log("Response JSON:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user data
      console.log("Saving token and user data to AsyncStorage...");
      await AsyncStorage.setItem("token", data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Login Successful");
      router.replace("/deposit");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 }}
      />

      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
      <Button title="Register" onPress={() => router.push("/register")} />
    </View>
  );
}