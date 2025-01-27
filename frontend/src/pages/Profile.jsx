import { useState, useEffect } from "react";
import { VStack, Input, Button, Heading, Box, useToast } from "@chakra-ui/react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    contactNumber: "",
    password: "", 
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:${import.meta.env.VITE_PORT}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
      } catch (error) {
        toast({
          title: "Error fetching profile",
          description: error.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleChange = (e) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:${import.meta.env.VITE_PORT}/api/profile`,
        { ...profile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6}>
      <Heading mb={6} textAlign="center">
        Profile
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="First Name"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
          />
          <Input
            placeholder="Last Name"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Age"
            name="age"
            type="number"
            value={profile.age}
            onChange={handleChange}
          />
          <Input
            placeholder="Contact Number"
            name="contactNumber"
            type="tel"
            value={profile.contactNumber}
            onChange={handleChange}
          />
          <Input
            placeholder="Password"
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Updating"
            w="full"
          >
            Update Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Profile;
