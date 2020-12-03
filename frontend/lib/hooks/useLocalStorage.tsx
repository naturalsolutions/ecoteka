import { useState, SetStateAction } from "react";

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
}

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);

      console.log(item);

      if (isJSON(item)) {
        return item ? JSON.parse(item) : initialValue;
      } else {
        return item ? item : initialValue;
      }
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      setStoredValue(value);

      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        const item = JSON.stringify(value);
        window.localStorage.setItem(key, item);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
