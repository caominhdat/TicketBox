import React from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from "react-native";
import API, { endpoints } from "../../configs/API";
import { List, Checkbox, IconButton, TextInput, Button, Snackbar } from "react-native-paper";
import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

const BookTicket = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { eventId } = route.params;
    const [discountCode, setDiscountCode] = React.useState("");
    const [discountPercent, setDiscountPercent] = React.useState(0);
    const [typeTickets, setTypeTickets] = React.useState([]);
    const [selectedTypes, setSelectedTypes] = React.useState([]); // [{id, name, price, quantity}]
    const [loading, setLoading] = React.useState(true);
    const [expanded, setExpanded] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarError, setSnackbarError] = React.useState(false);


    React.useEffect(() => {
        const loadTypeTickets = async () => {
            try {
                const res = await API.get(`/events/${eventId}/type_ticket/`);
                setTypeTickets(res.data);
            } catch (error) {
                console.error("Failed to load type ticket:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTypeTickets();
    }, [eventId]);

    const checkDiscountCode = async () => {
        if (!discountCode) return;
    
        try {
            const res = await API.get(`${endpoints['discount']}?code=${discountCode}`);
            if (res.status === 200 && res.data.length > 0 && res.data[0].percent) {
                setDiscountPercent(res.data[0].percent);
                setSnackbarMessage(`✅ Áp dụng mã giảm ${res.data[0].percent}% thành công!`);
                setSnackbarError(false);
            } else {
                setDiscountPercent(0);
                setSnackbarMessage("❌ Mã giảm giá không hợp lệ.");
                setSnackbarError(true);
            }
            
        } catch (error) {
            setDiscountPercent(0);
            setSnackbarMessage("❌ Mã giảm giá không hợp lệ.");
            setSnackbarError(true);
        } finally {
            setSnackbarVisible(true);
        }
    };

    const toggleSelect = (ticket) => {
        const exists = selectedTypes.find(t => t.id === ticket.id);
        if (exists) {
            // Remove
            setSelectedTypes(prev => prev.filter(t => t.id !== ticket.id));
        } else {
            // Add with quantity = 1
            setSelectedTypes(prev => [...prev, { ...ticket, quantity: 1 }]);
        }
    };

    const increaseQty = (id) => {
        setSelectedTypes(prev =>
            prev.map(t => t.id === id ? { ...t, quantity: t.quantity + 1 } : t)
        );
    };

    const decreaseQty = (id) => {
        setSelectedTypes(prev =>
            prev.map(t =>
                t.id === id ? { ...t, quantity: Math.max(1, t.quantity - 1) } : t
            )
        );
    };

    const removeTicket = (id) => {
        setSelectedTypes(prev => prev.filter(t => t.id !== id));
    };

    const totalAmount = useMemo(() => {
        return selectedTypes.reduce((sum, t) => sum + t.price * t.quantity, 0);
    }, [selectedTypes]);
    
    const discountedAmount = useMemo(() => {
        return totalAmount * (1 - discountPercent / 100);
    }, [totalAmount, discountPercent]);


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Chọn loại vé</Text>

            <List.Accordion
                title="Danh sách loại vé"
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}
            >
                {typeTickets.map(ticket => {
                    const checked = selectedTypes.some(t => t.id === ticket.id);
                    return (
                        <TouchableOpacity
                            key={ticket.id}
                            style={styles.ticketItem}
                            onPress={() => toggleSelect(ticket)}
                        >
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => toggleSelect(ticket)}
                            />
                            <View>
                                <Text style={styles.ticketName}>{ticket.name}</Text>
                                <Text style={styles.ticketPrice}>Giá: {ticket.price.toLocaleString()} VND</Text>
                            </View>
                        </TouchableOpacity>

                    );
                })}
            </List.Accordion>

            {selectedTypes.length > 0 && (
                <>
                    <Text style={styles.title}>Vé đã chọn</Text>
                    {selectedTypes.map(ticket => (
                        <View key={ticket.id} style={styles.selectedItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.ticketName}>{ticket.name}</Text>
                                <Text>Giá: {ticket.price} VND</Text>
                            </View>

                            <View style={styles.quantityControl}>
                                <IconButton icon="minus" size={20} onPress={() => decreaseQty(ticket.id)} />
                                <Text style={{ marginHorizontal: 8 }}>{ticket.quantity}</Text>
                                <IconButton icon="plus" size={20} onPress={() => increaseQty(ticket.id)} />
                            </View>

                            <IconButton icon="delete" onPress={() => removeTicket(ticket.id)} />
                        </View>
                    ))}

                    <TextInput
                        label="Mã giảm giá"
                        value={discountCode}
                        onChangeText={setDiscountCode}
                        style={{ marginTop: 16 }}
                    />
                    <Button mode="contained" onPress={checkDiscountCode} style={{ marginTop: 8 }}>
                        Áp dụng mã
                    </Button>

                    <Text style={styles.total}>
                        Tổng tiền: {totalAmount.toLocaleString()} VND
                    </Text>
                    {discountPercent > 0 && (
                        <Text style={styles.total}>
                            Giảm {discountPercent}%: {discountedAmount.toLocaleString()} VND
                        </Text>
                    )}

                    <View style={styles.contai}>
                        <Pressable
                            style={styles.button}
                            onPress={() => navigation.navigate('Pay')}
                        >
                            <Text style={styles.buttonText}>Đặt Vé</Text>
                        </Pressable>
                    </View>
                </>
            )}
            
            <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            style={{ backgroundColor: snackbarError ? "#e74c3c" : "#27ae60" }}
            >
            {snackbarMessage}
            </Snackbar>


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    },
    selectedItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 10,
    },
    ticketName: {
        fontSize: 16,
        fontWeight: "500",
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },
    total: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        textAlign: "right",
        color: "#2c3e50"
    },
    ticketItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 8,
    },
    ticketPrice: {
        color: "#555",
    },
    contai: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#1E90FF',
        padding: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white', fontSize: 16, fontWeight: 'bold',
    },
});

export default BookTicket;
