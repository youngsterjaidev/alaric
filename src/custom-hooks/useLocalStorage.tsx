import React, { useState } from "react";

// Hook
/**
 * To set the Local storage of the web page
 * @param key - the name of key to store the value
 * @param initialValue - the initial value
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store the value
  // Pass the initial state function to useState so logic is only
  // executed one
  // In typescript the T means insert comming type defination in this variable
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // get the localstorage value by key
      let item = window.localStorage.getItem(key);
      // parse stored json or if none return initialValue
      console.log("storage run : ", JSON.parse(item));
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.error(
        "Error Occured while setting the initial value in state: ",
        e
      );
      // if some error occured return the initial value
      return initialValue;
    }
  });

  /**
   *
   * @param value
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API state
      // check if the val is the instance of the function if it call the passed function
      // with the store value
      // @ts-ignore
      const valueToStore: string =
        value instanceof Function ? value(storedValue) : value;

      //save the state
      setStoredValue(valueToStore);

      // set the localstorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error("Error occured while setting the localStorage value : ", e);
    }
  };

  return [storedValue, setValue] as const;
}
