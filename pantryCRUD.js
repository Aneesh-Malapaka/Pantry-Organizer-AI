"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  addDoc,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";

const pantryOperations = (setData) => {
  const updateInventory = async (userId) => {
    const snapshot = query(collection(firestore, `users/${userId}/pantry`));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ id: doc.id, ...doc.data() });
    });
    setData(inventoryList);
  };

  const addToInventory = async (userId, item) => {
    const newItem = item;

    const docRef = doc(collection(firestore, `users/${userId}/pantry`));

    const docSnap = await getDoc(docRef);
    console.log(docSnap);
    if (docSnap.exists()) {
      const { unit_value } = docSnap.data();
      await setDoc(
        docRef,
        { unit_value: newItem.unit_value, unit: newItem.unit },
        { merge: true }
      );
    } else {
      await setDoc(docRef, newItem);
    }
    await updateInventory(userId);
  };

  const removeItem = async (userId, itemId) => {
    try {
      const docRef = doc(firestore, `users/${userId}/pantry`, itemId);
      console.log(docRef);
      await deleteDoc(docRef);
      await updateInventory(userId);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const editInventory = async (userId, item, id) => {
    console.log(userId, item);
    try {
      const docRef = doc(firestore, `users/${userId}/pantry`, id);
      await updateDoc(docRef, {
        name: item.itemName,
        unit: item.unit,
        unit_value: parseInt(item.quantity),
      });
      await updateInventory(userId);
    } catch (error) {
      console.error("Error Editing document: ", error);
    }
  };

  return { addToInventory, removeItem, updateInventory, editInventory };
};
export default pantryOperations;
