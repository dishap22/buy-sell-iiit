import { Button, Container, HStack, VStack, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const Home = () => {
  return <Container maxW="container.xl" py={12} pt={16}>
        <VStack spacing={8}>
            <Text
            fontSize="30"
            fontWeight="bold"
            bgGradient="linear(to-r, cyan.400, blue.500)"
            bgClip="text"
            textAlign="center"
            >
                Welcome to Buy Sell IIIT!
            </Text>
            <HStack>
                <Link to={"/login"}> <Button colorScheme="blue" size="lg"> Login </Button></Link>  
                <Text> or </Text>
                <Link to={"/signup"}><Button colorScheme="green" size="lg"> Sign Up </Button></Link> 
            </HStack>
        </VStack>
    </Container>
}

export default Home