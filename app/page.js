"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { firestore } from "@/firebase";
import { Box, Modal, Stack, Typography, TextField, Button, AppBar, Toolbar } from "@mui/material";
import { collection, deleteDoc, query, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

// Dynamically import components that might depend on `window`
const AppBarComponent = dynamic(() => import("@mui/material/AppBar"), { ssr: false });
const ToolbarComponent = dynamic(() => import("@mui/material/Toolbar"), { ssr: false });
const TextFieldComponent = dynamic(() => import("@mui/material/TextField"), { ssr: false });
const ButtonComponent = dynamic(() => import("@mui/material/Button"), { ssr: false });
const ModalComponent = dynamic(() => import("@mui/material/Modal"), { ssr: false });
const StackComponent = dynamic(() => import("@mui/material/Stack"), { ssr: false });

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "Inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      if (doc.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        inventoryList.push({
          name: doc.id,
          ...data,
        });
      }
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "Inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "Inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateInventory();
    }
  }, [searchTerm]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" gap={2} padding={3}>
      <AppBarComponent position="static">
        <ToolbarComponent>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Management
          </Typography>
        </ToolbarComponent>
      </AppBarComponent>
      <Box
        component="main"
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        maxWidth="800px"
        padding={2}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
          marginTop: 3,
        }}
      >
        <TextFieldComponent
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <ButtonComponent variant="contained" color="primary" onClick={handleOpen}>
          Add New Item
        </ButtonComponent>
        <ModalComponent open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <StackComponent width="100%" direction="row" spacing={2}>
              <TextFieldComponent
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
              <ButtonComponent
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </ButtonComponent>
            </StackComponent>
          </Box>
        </ModalComponent>
        <Box border="1px solid #333" width="100%" marginTop={2} borderRadius={2} overflow="hidden">
          <Box
            width="100%"
            height="100px"
            bgcolor="#1976d2"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
          >
            <Typography variant="h4">Inventory Items</Typography>
          </Box>
          <StackComponent width="100%" spacing={2} overflow="auto" padding={2}>
            {inventory.length > 0 ? (
              inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="100px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#fff"
                  padding={2}
                  borderRadius={1}
                  boxShadow="0 1px 3px rgba(0,0,0,0.1)"
                >
                  <Typography variant="h5" color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <StackComponent direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5" color="#333">
                      {quantity}
                    </Typography>
                    <ButtonComponent variant="contained" color="primary" onClick={() => addItem(name)}>
                      Add
                    </ButtonComponent>
                    <ButtonComponent variant="contained" color="secondary" onClick={() => removeItem(name)}>
                      Remove
                    </ButtonComponent>
                  </StackComponent>
                </Box>
              ))
            ) : (
              <Typography variant="h6" color="#333" textAlign="center">
                No items found
              </Typography>
            )}
          </StackComponent>
        </Box>
      </Box>
    </Box>
  );
}
