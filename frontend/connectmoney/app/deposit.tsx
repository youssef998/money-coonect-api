import { useEffect, useState } from "react";
import { View, Text, Button, TextInput, Alert, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useRouter } from "expo-router";

const API_URL = "http://10.0.2.2:3000"; // Change to match your backend

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [idempotencyKey, setIdempotencyKey] = useState(uuid.v4());

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          Alert.alert("Error", "User not found. Please log in again.");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    };

    const loadTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}/transactions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    loadUserData();
    loadTransactions();
  }, []);

  const handleDeposit = async () => {
    if (loading) return;
    setLoading(true);

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid deposit amount.");
      setLoading(false);
      return;
    }

    console.log("Generated Idempotency Key:", idempotencyKey);
    try {
      console.log("Sending deposit request with key:", idempotencyKey);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/transactions/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount), idempotencyKey }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Deposit failed");

      Alert.alert("Success", `Deposited $${amount} successfully!`);

      // Update balance
      const updatedBalance = (Number(user.balance) + Number(amount)).toFixed(2);
      const updatedUser = { ...user, balance: updatedBalance };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // Refresh transactions
      const updatedTransactions = [{ ...data, created_at: new Date().toISOString() }, ...transactions];
      setTransactions(updatedTransactions);

      setAmount(""); // Reset input
      setIdempotencyKey(uuid.v4());
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.name}!</Text>
          <Text style={styles.balance}>Balance: ${user.balance}</Text>

          <TextInput
            placeholder="Enter deposit amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <Button title="Deposit" onPress={handleDeposit} disabled={!amount || isNaN(Number(amount)) || Number(amount) <= 0} />
          )}

          <Button title="Logout" onPress={handleLogout} />

          <Text style={styles.subTitle}>Transaction History</Text>

          {transactions.length === 0 ? (
            <Text>No transactions found</Text>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                 <Text>{item.type ? item.type.toUpperCase() : "UNKNOWN"}: ${item.amount}</Text>
                  <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
                </View>
              )}
            />
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold" },
  balance: { fontSize: 18, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  subTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20 },
  transactionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  date: { fontSize: 12, color: "gray" },
});

export default Dashboard;