import { Text, Heading, useToast, Box, Button, Container } from "@chakra-ui/react"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ItemPage = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null); // Initialize item as null
    const [loading, setLoading] = useState(true); // Add loading state

    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/items/${itemId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setItem(response.data);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchItem();
    }, [itemId, toast]);

    if (loading) {
        return <Text>Loading...</Text>; // Show a loading message while fetching data
    }

    if (!item) {
        return <Text>Item not found</Text>; // Handle null or undefined item gracefully
    }

    return (
        <Container maxW="container.xl" py={12} pt={16}>
            <Box p={6} borderWidth={1} borderRadius="lg">
                <Heading mb={4}>{item.name}</Heading>
                <Text mb={2}>Price: ₹{item.price}</Text>
                <Text mb={2}>Category: {item.category}</Text>
                <Text mb={4}>Seller: {item.sellerID.firstName} {item.sellerID.lastName}</Text>
                <Text mb={4}>{item.description}</Text>
                {/*<Button colorScheme="blue" onClick={addToCart}>
                  Add to Cart
                </Button>*/}
            </Box>
        </Container>
    );
}

export default ItemPage;
