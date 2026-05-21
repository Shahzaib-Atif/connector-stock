import { useCallback, useState } from "react";
import { getSimilarAnaliseRows } from "@/api/analiseApi";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import {
  openConnNameInDivDesk,
  recordConnNameUpdate,
  refreshConnNameCache,
  updateConnName,
} from "@/utils/functions/divDesk";
import { PendingSave, ReclickWizard } from "./types";
import { buildReclickSteps } from "./buildReclickSteps";

interface Props {
  onUpdateConnector: (
    encomenda: string,
    numLinha: number,
    newConnector: string,
  ) => void;
  user: string | null;
}

// Manages connector save flow and similar-row bulk apply.
export function useConnectorSave({ onUpdateConnector, user }: Props) {
  const [pendingSave, setPendingSave] = useState<PendingSave | null>(null);
  const [reclickWizard, setReclickWizard] = useState<ReclickWizard | null>(
    null,
  );
  const [isCheckingSimilar, setIsCheckingSimilar] = useState(false);

  // Updates connector value in the parent table state.
  const applyConnectorLocally = useCallback(
    (encomenda: string, numLinha: number, newConnector: string) => {
      onUpdateConnector(encomenda, numLinha, newConnector);
    },

    [onUpdateConnector],
  );

  // Saves connector; opens modal when similar rows exist.
  const handleConnectorSave = useCallback(
    async (row: AnaliseTabDto, newConnector: string) => {
      const trimmed = newConnector.trim();

      if (!trimmed || trimmed === (row.Conector ?? "").trim()) return;

      setIsCheckingSimilar(true);

      try {
        const similarRows = await getSimilarAnaliseRows({
          encomenda: row.Encomenda,
          numLinha: row.NumLinha,
          estado: row.Estado ?? undefined,
          cliente: row.Cliente ?? undefined,
          cduProjetoCliente: row.CDU_ProjetoCliente ?? undefined,
          newConnector: trimmed,
        });

        if (similarRows.length === 0) {
          await updateConnName(row.Encomenda, String(row.NumLinha), trimmed);
          applyConnectorLocally(row.Encomenda, row.NumLinha, trimmed);

          return;
        }

        setPendingSave({ row, newConnector: trimmed, similarRows });
      } catch (error) {
        console.error("Failed to check similar rows:", error);

        await updateConnName(row.Encomenda, String(row.NumLinha), trimmed);
        applyConnectorLocally(row.Encomenda, row.NumLinha, trimmed);
      } finally {
        setIsCheckingSimilar(false);
      }
    },

    [applyConnectorLocally],
  );

  // Applies connector change to the edited row only.
  const handleOnlyThisRow = useCallback(() => {
    if (!pendingSave) return;
    const { row, newConnector } = pendingSave;
    openConnNameInDivDesk(row.Encomenda, row.NumLinha, newConnector);

    void recordConnNameUpdate(
      row.Encomenda,
      row.NumLinha,
      newConnector,
      user,
    ).then(() => refreshConnNameCache());

    applyConnectorLocally(row.Encomenda, row.NumLinha, newConnector);

    setPendingSave(null);
  }, [pendingSave, applyConnectorLocally]);

  // Starts step-by-step DIVDESK re-click wizard for all rows.
  const handleApplyToAll = useCallback(() => {
    if (!pendingSave) return;

    const { row, newConnector, similarRows } = pendingSave;

    setReclickWizard({
      steps: buildReclickSteps(row, similarRows, newConnector),
      currentStep: 0,
      newConnector,
    });

    setPendingSave(null);
  }, [pendingSave]);

  // Launches DIVDESK for the current wizard step on user click.
  const handleLaunchReclickStep = useCallback(() => {
    if (!reclickWizard) return;
    const { steps, currentStep, newConnector } = reclickWizard;
    const step = steps[currentStep];
    openConnNameInDivDesk(step.enc, step.line, step.con);

    void recordConnNameUpdate(step.enc, step.line, step.con, user);
    applyConnectorLocally(step.enc, Number(step.line), newConnector);

    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setReclickWizard({ steps, currentStep: nextStep, newConnector });
      return;
    }

    void refreshConnNameCache();

    setReclickWizard(null);
  }, [reclickWizard, applyConnectorLocally]);

  // Dismisses the similar-rows confirmation modal.
  const closePendingModal = useCallback(() => {
    setPendingSave(null);
  }, []);

  // Cancels the re-click wizard mid-flow.
  const closeReclickWizard = useCallback(() => {
    if (reclickWizard && reclickWizard.currentStep > 0) {
      void refreshConnNameCache();
    }

    setReclickWizard(null);
  }, [reclickWizard]);

  return {
    pendingSave,
    reclickWizard,
    isCheckingSimilar,
    handleConnectorSave,
    handleOnlyThisRow,
    handleApplyToAll,
    handleLaunchReclickStep,
    closePendingModal,
    closeReclickWizard,
  };
}
