import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text, SimpleGrid, VStack, CheckboxGroup, Button, Input, HStack, Container, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";

const Search = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([]);
  const [categories, setCategories] = useState([]);

  const toast = useToast();
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(`http://localhost:${import.meta.env.VITE_PORT}/api/items`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });  
        setItems(data.items);
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
        toast({
          title: "An error occurred.",
          description: "Unable to fetch items.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };


    fetchItems();
  }, [toast]);

  const fetchFiltered = async () => {
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.append("search", searchQuery);
      if (filters.length) query.append("categories", filters.join(","));
      const { data } = await axios.get(`http://localhost:5000/api/items?${query.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setItems(data.items);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: "Unable to fetch items.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (selectedFilters) => {
    setFilters(selectedFilters);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFiltered();
  };

  return <Container p={8}>
    <Heading mb={6} textAlign={"center"}>
      Search
    </Heading>

    <form onSubmit={handleSearchSubmit}>
      <HStack spacing={4} mb={4}> 
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button type="submit">Search</Button>
      </HStack>

      <CheckboxGroup onChange={handleFilter} value={filters} colorScheme="blue">
        <VStack align="start" mb={4}>
          {categories.map((category) => (
            <Checkbox key={category} value={category}>
              {category}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </form>

    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
      {items.length > 0 ? (
        items.map((item) => (
          <Box
            key={item.id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            onClick={() => Navigate(`/items/${item.id}`)}
            cursor="pointer"
            _hover={{ shadow: "lg" }}
          >
            <Heading size="md" mb={2}>
              {item.name}
            </Heading>
            <Text>Price: ₹{item.price}</Text>
            <Text>Vendor: {item.vendor}</Text>
            <Text>Category: {item.category}</Text>
          </Box>
        ))
      ) : (
        <Text>No items for sale</Text>
      )}
    </SimpleGrid>

  </Container>
}

export default Search;