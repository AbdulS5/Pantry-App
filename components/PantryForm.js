"use client";

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';

const PantryForm = ({ onAdd }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itemName && quantity) {
      try {
        const q = query(collection(db, 'pantry'), where('name', '==', itemName));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Item already exists, update its quantity
          querySnapshot.forEach(async (docSnapshot) => {
            const docRef = docSnapshot.ref;
            const newQuantity = docSnapshot.data().quantity + parseInt(quantity, 10);
            console.log(`Updating item: ${itemName} with new quantity: ${newQuantity}`);
            await updateDoc(docRef, { quantity: newQuantity });
            onAdd({ id: docSnapshot.id, name: itemName, quantity: newQuantity });
          });
        } else {
          // Item does not exist, add a new one
          const docRef = await addDoc(collection(db, 'pantry'), {
            name: itemName,
            quantity: parseInt(quantity, 10),
          });
          console.log(`Adding new item: ${itemName} with quantity: ${quantity}`);
          onAdd({ id: docRef.id, name: itemName, quantity: parseInt(quantity, 10) });
        }
        setItemName('');
        setQuantity('');
      } catch (e) {
        console.error('Error adding/updating document: ', e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        type="number"
      />
      <Button type="submit">Add Item</Button>
    </form>
  );
};

export default PantryForm;
