import { useState } from "react";
import { API } from "@/utils/api";

export const useOpenFolder = () => {
  const [isOpeningFolder, setIsOpeningFolder] = useState(false);

  const openFolder = async (folderName: string) => {
    if (!folderName) return;

    setIsOpeningFolder(true);
    try {
      const response = await fetch(API.openFolder, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderName }),
      });

      if (!response.ok) {
        // You might want to use a toast notification here if available
        alert("Folder not found or could not be opened.");
      }
    } catch (error) {
      console.error("Error opening folder:", error);
      alert("Error communicating with the server.");
    } finally {
      setIsOpeningFolder(false);
    }
  };

  return { openFolder, isOpeningFolder };
};
