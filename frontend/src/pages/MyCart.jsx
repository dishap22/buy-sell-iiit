import { useEffect, useState } from "react";
import { Container, useToast, Box, Button, Text, Stack, Heading, Divider } from "@chakra-ui/react";
import axios from "axios";

const MyCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {   
        const fetchCartItems = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/api/cart", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setCartItems(response.data.cartItems || []);
                setTotalPrice(response.data.totalPrice || 0);
            } catch (error) {
                console.error(error);
                toast({
                    title: "An error occurred.",
                    description: "Unable to fetch cart items.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [toast]);

    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setCartItems(response.data.cartItems || []);
            setTotalPrice(response.data.totalPrice || 0);
            toast({
                title: "Item removed from cart.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "An error occurred.",
                description: "Unable to remove item from cart.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };  
    
    const handleCheckout = async () => {
        try {
            await axios.post("http://localhost:5000/api/cart/checkout", {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setCartItems([]);
            setTotalPrice(0);
            toast({
                title: "Order placed successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "An error occurred.",
                description: "Unable to place order.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return (
            <Container maxW="container.xl" py="12">
                <Text>Loading...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" py="12">
            <Heading as="h1" size="lg" mb="6">My Cart</Heading>
            {(!cartItems || cartItems.length === 0) ? (
                <Text>Cart is empty.</Text>
            ) : (
                <Box>
                    <Stack spacing="4">
                        {cartItems.map((item) => (
                            <Box key={item._id} p="4" borderWidth="1px" borderRadius="md">
                                <Text fontSize="lg">{item.name}</Text>
                                <Text>Price: ₹{item.price}</Text>
                                <Button
                                    colorScheme="red"
                                    size="sm"
                                    mt="2"
                                    onClick={() => handleRemoveFromCart(item._id)}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                    <Divider my="6" />
                    <Text fontSize="lg">Total Price: ₹{totalPrice}</Text>
                    <Button
                        colorScheme="green"
                        mt="4"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default MyCart;