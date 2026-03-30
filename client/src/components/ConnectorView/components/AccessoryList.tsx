import React from "react";
import { AccessoryItem } from "./AccessoryItem";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Wrench } from "lucide-react";
import { TransactionOpenOptions } from "@/utils/types/transactionTypes";
import { AccessoryDto } from "@shared/dto/AccessoryDto";

interface Props {
  accessories: AccessoryDto[];
  onTransaction: (txOptions: TransactionOpenOptions) => void;
  onInspect: (id: number) => void;
}

export const AccessoryList: React.FC<Props> = ({
  accessories,
  onTransaction,
  onInspect,
}) => {
  return (
    <CollapsibleSection
      title="Associated Accessories"
      icon={<Wrench className="w-4 h-4" />}
      count={accessories.length}
    >
      {accessories.map((acc) => (
        <AccessoryItem
          key={acc.Id}
          accessory={acc}
          stock={acc.Qty}
          onInspect={onInspect}
          onTransaction={onTransaction}
        />
      ))}
    </CollapsibleSection>
  );
};
