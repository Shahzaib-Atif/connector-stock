import { ConnPositionsMap } from "../types";

export function getCoordinates(posId: string, positions: ConnPositionsMap) {
    if (positions?.[posId]) {
        return positions[posId];
    }

    return null;
}