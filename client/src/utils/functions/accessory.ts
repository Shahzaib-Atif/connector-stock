import { fetchWithAuth } from "@/utils/functions/fetchWithAuth";
import { API } from "@/utils/api";
import { AccessoryDto } from "@shared/dto/AccessoryDto";
import { AccessoryExtended } from "@/utils/types";

export const parseAccessory = (
  apiAccessory: AccessoryDto,
): AccessoryExtended => {
  const posId = apiAccessory.ConnName?.substring(0, 4);

  return {
    ...apiAccessory,
    posId,
  };
};

export const updateAccessoryApi = async (
  accessoryId: number,
  data: AccessoryDto,
) => {
  const response = await fetchWithAuth(
    `${API.accessories}/${accessoryId}/update`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update accessory");
  }

  return response.json();
};
