import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Text, Button, Container, VStack, Heading, Box, Input, useColorModeValue, useToast } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    contactNumber: "",
    password: "",
  });

  const toast = useToast();
  const Navigate = useNavigate();

  const handleAddNewUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.age || !newUser.contactNumber || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }

    try {
      const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/register`, newUser);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        Navigate('/login');
      } else {  
        console.log(response);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return <Container maxW="container.xl" py={12} pt={16}>
    <VStack
        spacing={8}
      >
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Sign Up!
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
              placeholder="First name"
              name="firstName"
              type="text"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            />

            <Input 
              placeholder="Last name"
              name="lastName"
              type="text"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />

            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />

            <Input
              placeholder="Age"
              name="age"
              type="number"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            />

            <Input
              placeholder="Contact Number"
              name="contactNumber"
              type="number"
              value={newUser.contactNumber}
              onChange={(e) => setNewUser({ ...newUser, contactNumber: e.target.value })}
            />

            <Input
              placeholder="Password"
              name="password"
              type="text"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />

            <Button colorScheme="blue" onClick={handleAddNewUser} w='full'>
              Sign Up
            </Button>

            <Text fontSize="sm" pt={8}> Already a user?</Text>
          <Link to="/login" ><Text color={"blue.500"} fontSize={"sm"}>Login instead</Text></Link>
          </VStack>
        </Box>
      </VStack> 
  </Container>;
}

export default SignUp