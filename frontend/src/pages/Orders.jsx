import React, { useEffect, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Text, Spinner, Stack, Heading } from "@chakra-ui/react";
import axios from "axios";

const Orders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setboughtItems] = useState([]);
  const [soldItems, setsoldItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (type) => {
    try {
      setLoading(true);
      let endpoint = "";
      if (type === "pending") endpoint = "/api/orders/pending";
      if (type === "bought") endpoint = "/api/orders/bought";
      if (type === "sold") endpoint = "/api/orders/sold";

      const  response = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (type === "pending") setPendingOrders(response.data);
      if (type === "bought") setboughtItems(response.data);
      if (type === "sold") setsoldItems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders("pending"); 
  }, []);

  return <Box maxW="container.lg" mx="auto" py="6">
    <Heading as="h1" size="lg" mb="6" p={4}>Orders History</Heading>
    <Tabs variant="soft-rounded" colorScheme="green" p={4}>
        <TabList>
            <Tab onClick={() => fetchOrders("pending")}>Pending Orders</Tab>
            <Tab onClick={() => fetchOrders("bought")}>Bought Items</Tab>
            <Tab onClick={() => fetchOrders("sold")}>Sold Items</Tab>
        </TabList>

        <TabPanels>
            <TabPanel>
                {loading ? (
                    <Spinner />
                ) : (
                    <Stack spacing="4">
                        {pendingOrders.length > 0 ? (
                            pendingOrders.map((order) => (
                                <Box key={order._id} p="4" borderWidth="1px" borderRadius="md">
                                    <Text fontSize="lg">Item: {order.itemId.name}</Text>
                                    <Text>Seller: {order.sellerId.firstName} {order.sellerId.lastName}</Text>
                                    <Text>Price: ₹{order.totalAmount}</Text>
                                    <Text>OTP: {order.otp}</Text>
                                    <Text>Status: {order.status}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text>No pending orders.</Text>
                        )}
                    </Stack>
                )}
            </TabPanel>

            <TabPanel>
                {loading ? (
                    <Spinner />
                ) : (
                    <Stack spacing="4">
                        {boughtItems.length > 0 ? (
                            boughtItems.map((order) => (
                                <Box key={order._id} p="4" borderWidth="1px" borderRadius="md">
                                    <Text fontSize="lg">Item: {order.itemId.name}</Text>
                                    <Text>Seller: {order.sellerId.firstName} {order.sellerId.lastName}</Text>
                                    <Text>Price: ₹{order.totalAmount}</Text>
                                    <Text>Status: {order.status}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text>No bought items found.</Text>
                        )}
                    </Stack>
                )}
            </TabPanel>

            <TabPanel>
                {loading ? (
                    <Spinner />
                ) : (
                    <Stack spacing="4">
                        {soldItems.length > 0 ? (
                            soldItems.map((order) => (
                                <Box key={order._id} p="4" borderWidth="1px" borderRadius="md">
                                    <Text fontSize="lg">Item: {order.itemId.name}</Text>
                                    <Text>Buyer: {order.buyerId.firstName} {order.buyerId.lastName}</Text>
                                    <Text>Price: ₹{order.totalAmount}</Text>
                                    <Text>Status: {order.status}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text>No sold items found.</Text>
                        )}
                    </Stack>
                )}
            </TabPanel>
        </TabPanels>
    </Tabs>
  </Box>
}

export default Orders