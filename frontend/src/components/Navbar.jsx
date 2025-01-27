import { Container, Flex, Text, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Navbar = ({ onLogout }) => {
   const navigate = useNavigate();

   const handleLogout = () => { 
      localStorage.removeItem('token');
      onLogout();
      navigate('/');
   }

  return <Container maxW={"100%"} px={4}>
      <Flex 
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
        flexDir= {{
          base: 'column',
          sm: 'row'
        }}
      >

        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={ 'bold' }
          textTransform={ 'uppercase' }
          textAlign={ 'center' }
          bgGradient='linear(to-r, cyan.400, blue.500)' 
          bgClip={ 'text' }
          whiteSpace={ 'nowrap' }
        >
          <Link to={"/"}>Buy-Sell-IIIT</Link>
        </Text>


        <HStack spacing={6} alignItems="center">
               <Link
                  to="/profile"
                  px={3}
                  py={1}
                  rounded="md"
                  _hover={{ textDecoration: "none", bg: "cyan.100" }}
                  fontWeight="semibold"
               >
                  Profile
               </Link>
               <Link
                  to="/search"
                  px={3}
                  py={1}
                  rounded="md"
                  _hover={{ textDecoration: "none", bg: "cyan.100" }}
                  fontWeight="semibold"
               >
                  Search
               </Link>
               <Link
                  to="/cart"
                  px={3}
                  py={1}
                  rounded="md"
                  _hover={{ textDecoration: "none", bg: "cyan.100" }}
                  fontWeight="semibold"
               >
                  Cart
               </Link>
               <Link
                  to="/orders"
                  px={3}
                  py={1}
                  rounded="md"
                  _hover={{ textDecoration: "none", bg: "cyan.100" }}
                  fontWeight="semibold"
               >
                  Orders
               </Link>
               <Link
                  to="/deliveries"
                  px={3}
                  py={1}
                  rounded="md"
                  _hover={{ textDecoration: "none", bg: "cyan.100" }}
                  fontWeight="semibold"
               >
                  Deliveries
               </Link>
               <Link
                  to="/add-item"
                  px={3}
                  py={1}
                  rounded="md"
                  _hover={{ textDecoration: "none", bg: "cyan.100" }}
                  fontWeight="semibold"
               >
                  Add Item
               </Link>
               <Link
                  to="/logout"
                  onClick={handleLogout}
                  px={3}
                  py={1}
                  rounded="md"
                  _hover={{ textDecoration: "none", bg: "cyan.100" }}
                  fontWeight="semibold"
               >
                  Logout
               </Link>
            </HStack>

      </Flex>
    </Container>
}

export default Navbar;