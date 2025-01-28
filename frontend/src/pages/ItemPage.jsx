import { Text, Heading, useToast, Box, Button, Container } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ItemPage = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null); // Initialize item as null
    const [user, setUser] = useState(null); // Initialize user as null
    const [loadingItem, setLoadingItem] = useState(true); // Loading state for item
    const [loadingUser, setLoadingUser] = useState(true); // Loading state for user

    const toast = useToast();
    const navigate = useNavigate();

    // Fetch user data
    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch user data. Please log in again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoadingUser(false);
        }
    };

    // Fetch item data
    const fetchItem = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/items/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setItem(response.data);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch item data.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoadingItem(false);
        }
    };

    // Add item to cart
    const addToCart = async () => {
        if (!user) {
            toast({
                title: "Error",
                description: "User data is unavailable. Please log in again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (item.sellerID._id === user._id) {
            toast({
                title: "Error",
                description: "You cannot buy your own item.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/cart",
                { itemId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast({
                title: "Success",
                description: "Item added to cart.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/cart");
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message === "Item already in cart") {
                toast({
                    title: "Error",
                    description: "This item is already in your cart.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to add the item to cart.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    // Use effect to fetch both user and item data
    useEffect(() => {
        fetchUser();
        fetchItem();
    }, [itemId]);

    // Show loading messages
    if (loadingItem || loadingUser) {
        return <Text>Loading...</Text>;
    }

    // Handle item not found
    if (!item) {
        return <Text>Item not found</Text>;
    }

    return (
        <Container maxW="container.xl" py={12} pt={16}>
            <Box p={6} borderWidth={1} borderRadius="lg">
                <Heading mb={4}>{item.name}</Heading>
                <Text mb={2}>Price: ₹{item.price}</Text>
                <Text mb={2}>Category: {item.category}</Text>
                <Text mb={4}>Seller: {item.sellerID.firstName} {item.sellerID.lastName}</Text>
                <Text mb={4}>{item.description}</Text>
                <Button colorScheme="blue" onClick={addToCart}>
                    Add to Cart
                </Button>
            </Box>
        </Container>
    );
};

export default ItemPage;
