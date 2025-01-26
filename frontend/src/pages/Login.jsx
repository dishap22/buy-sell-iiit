import React from 'react'
import { Container, VStack, Heading, Box, Input, Button, useToast, useColorModeValue } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = React.useState({ email: '', password: '' });

  const toast = useToast();
  const Navigate = useNavigate();

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/login`, credentials);
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onLogin();
        localStorage.setItem('token', response.data.token);
        Navigate('/profile');
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
  }

  return <Container maxW="container.xl" py={12} pt={16}>
  <VStack
      spacing={8}
    >
      <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
        Sign In
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
            placeholder="Email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />

          <Input
            placeholder="Password"
            name="password"
            type="text"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />

          <Button colorScheme="blue" onClick={handleLogin} w='full'>
            Sign In
          </Button>
        </VStack>
      </Box>
    </VStack> 
</Container>;
}

export default Login