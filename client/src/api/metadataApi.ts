import {
  ColorApiResponse,
  ViasApiResponse,
  PositionApiResponse,
} from "@/types";
import { API } from "@/utils/api";
import { fetchWithAuth } from "@/utils/fetchClient";

export const fetchColors = async (): Promise<{
  colorsUK: Record<string, string>;
  colorsPT: Record<string, string>;
}> => {
  try {
    const response = await fetchWithAuth(API.cors);
    if (!response.ok) {
      throw new Error("Failed to fetch colors");
    }
    const data: ColorApiResponse[] = await response.json();

    const colorsUK: Record<string, string> = {};
    const colorsPT: Record<string, string> = {};

    data.forEach((item) => {
      colorsUK[item.Cor_Id] = item.Cores_UK; // UK/English name
      colorsPT[item.Cor_Id] = item.CORES; // Portuguese name
    });

    return { colorsUK, colorsPT };
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { colorsUK: { U: "color?" }, colorsPT: { U: "color?" } };
  }
};

export const fetchVias = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetchWithAuth(API.vias);
    if (!response.ok) {
      throw new Error("Failed to fetch vias");
    }
    const data: ViasApiResponse[] = await response.json();

    const viasMap: Record<string, string> = {};
    data.forEach((item) => {
      viasMap[item.ContagemVias] = String(item.QtdVias);
    });

    return viasMap;
  } catch (error) {
    console.error("Error fetching vias:", error);
    return { "0": "vias?" };
  }
};

export const fetchPositions = async (): Promise<
  Record<string, { cv: string; ch: string }>
> => {
  const response = await fetchWithAuth(API.positions);
  if (!response.ok) {
    throw new Error("Failed to fetch positions");
  }
  const data: PositionApiResponse[] = await response.json();

  const positions: Record<string, { cv: string; ch: string }> = {};
  data.forEach((item) => {
    if (item.CON) {
      const key = item.CON.trim();
      positions[key] = {
        cv: String(item.CV).trim(),
        ch: String(item.CH).trim(),
      };
    }
  });

  return positions;
};

export const fetchFabricantes = async (): Promise<string[]> => {
  const response = await fetchWithAuth(API.fabricantes);
  if (!response.ok) {
    throw new Error("Failed to fetch fabricantes");
  }
  const data: { Fabricante: string }[] = await response.json();
  const fabricantes: string[] = data.map((item) => item.Fabricante.trim());
  return fabricantes;
};
