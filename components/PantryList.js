"use client";

import React, { useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PantryList = ({ items, setItems }) => {
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'pantry'));
      const fetchedItems = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log('Fetched Items:', fetchedItems); // Debugging log
      setItems(fetchedItems);
    };

    fetchItems();
  }, [setItems]);

  const handleDelete = async (id) => {
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete.quantity > 1) {
      // Decrease the quantity by 1
      const newQuantity = itemToDelete.quantity - 1;
      console.log(`Decreasing quantity of item: ${itemToDelete.name} to: ${newQuantity}`);
      await updateDoc(doc(db, 'pantry', id), { quantity: newQuantity });
      setItems(items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    } else {
      // Remove the item from Firestore and from the local state
      console.log(`Deleting item: ${itemToDelete.name}`);
      await deleteDoc(doc(db, 'pantry', id));
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <List>
      {items.length === 0 ? (
        <ListItem>
          <ListItemText primary="No items found" />
        </ListItem>
      ) : (
        items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} secondary={`Quantity: ${item.quantity}`} />
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default PantryList;
