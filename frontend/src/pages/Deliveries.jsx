import React, { useEffect, useState } from "react";
import { Box, Text, Stack, Heading, Input, Button, useToast, Spinner } from "@chakra-ui/react";
import axios from "axios";

const Deliveries = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [otpInputs, setOtpInputs] = useState({});
    const toast = useToast();

    // Fetch pending orders for the seller
    const fetchPendingOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/deliveries", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setPendingOrders(response.data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch pending orders.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP submission
    const handleCompleteTransaction = async (orderId) => {
        try {
            const enteredOtp = otpInputs[orderId];
            if (!enteredOtp) {
                toast({
                    title: "Error",
                    description: "Please enter the OTP.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/deliveries/complete",
                { orderId, enteredOtp },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast({
                title: "Success",
                description: response.data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Refresh the pending orders list
            fetchPendingOrders();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to complete the transaction.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    if (loading) {
        return (
            <Box textAlign="center" py="20">
                <Spinner size="lg" />
                <Text mt="4">Loading pending orders...</Text>
            </Box>
        );
    }

    return (
        <Box maxW="container.lg" mx="auto" py="6">
            <Heading as="h1" size="lg" mb="6">
                Deliver Items
            </Heading>

            {pendingOrders.length === 0 ? (
                <Text>No pending orders to deliver.</Text>
            ) : (
                <Stack spacing="4">
                    {pendingOrders.map((order) => (
                        <Box key={order._id} p="4" borderWidth="1px" borderRadius="md">
                            <Text fontSize="lg">Item: {order.itemId.name}</Text>
                            <Text>Price: ₹{order.itemId.price}</Text>
                            <Text>
                                Buyer: {order.buyerId.firstName} {order.buyerId.lastName}
                            </Text>
                            <Input
                                mt="3"
                                placeholder="Enter OTP"
                                value={otpInputs[order._id] || ""}
                                onChange={(e) =>
                                    setOtpInputs({ ...otpInputs, [order._id]: e.target.value })
                                }
                            />
                            <Button
                                mt="3"
                                colorScheme="green"
                                onClick={() => handleCompleteTransaction(order._id)}
                            >
                                Complete Transaction
                            </Button>
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default Deliveries;
