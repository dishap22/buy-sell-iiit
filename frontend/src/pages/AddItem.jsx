import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Box, useColorModeValue, Heading, VStack, Button, Container, useToast } from "@chakra-ui/react";

 const AddItem = () => {
    const [details, setDetails] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
    });

    const toast = useToast();
    const Navigate = useNavigate();

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
            Navigate("/add-item");
        } catch (error) {
            console.log(error);
            toast({
                title: "Failed to add item",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return <Container>
        <VStack
        spacing={8}
      >
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Add Product!
        </Heading>

        <Box
          w={"full"}
          bg={useColorModeValue('white', 'gray.800')}
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
      </VStack> 
    </Container>
}

export default AddItem