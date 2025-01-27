import { useEffect, useState } from "react";
import axios from "axios";
import { Text, Grid, GridItem, Input, Box, useColorModeValue, Heading, VStack, Button, Container, useToast } from "@chakra-ui/react";

 const AddItem = () => {
    const [details, setDetails] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
    });

    const [products, setProducts] = useState([]);
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const productBgColor = useColorModeValue("gray.100", "gray.700");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:${import.meta.env.VITE_PORT}/api/items/seller-products`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Failed to fetch products",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
        }

        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/items/add`, JSON.stringify(details), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log(response);
            toast({
                title: "Item added successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setDetails({
              name: "",
              description: "",
              price: "",
              category: "",
            });

            setProducts((prev) => [...prev, response.data]);
        } catch (error) {
            console.log(error);
            toast({
                title: "Failed to add item",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:${import.meta.env.VITE_PORT}/api/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            setProducts((prev) => prev.filter((product) => product._id !== id));
            toast({
                title: "Item deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Failed to delete item",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return <Container>
        <VStack
        spacing={8}
      >
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Add Product!
        </Heading>

        <Box
          w={"full"}
          bg={bgColor}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input 
              placeholder="Name"
              name="name"
              type="text"
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
            />

            <Input 
              placeholder="Description"
              name="description"
              type="text"
              value={details.description}
              onChange={(e) => setDetails({ ...details, description: e.target.value })}
            />

            <Input 
              placeholder="Price"
              name="price"
              type="number"
              value={details.price}
              onChange={(e) => setDetails({ ...details, price: e.target.value })}
            />

            <Input 
              placeholder="Category"
              name="category"
              type="text"
              value={details.category}
              onChange={(e) => setDetails({ ...details, category: e.target.value })}
            />

            <Button colorScheme="blue" onClick={handleSubmit} w='full'>
              Add Product
            </Button>
          </VStack>
        </Box>

        <Heading as={"h2"} size={"lg"} textAlign={"center"} mt={8}>
          Your Products
        </Heading>


        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {products.length === 0 ? (
            <Text>No products found.</Text>
          ) : (
            products.map((product) => (
              <GridItem
                key={product._id}
                bg={productBgColor}
                p={4}
                rounded="lg"
                shadow="md"
              >
                <VStack spacing={2}>
                  <Text fontWeight="bold">{product.name}</Text>
                  <Text>{product.description}</Text>
                  <Text>Price: ${product.price}</Text>
                  <Text>Category: {product.category}</Text>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </VStack>
              </GridItem>
            ))
          )}
        </Grid>

      </VStack> 
    </Container>
}

export default AddItem