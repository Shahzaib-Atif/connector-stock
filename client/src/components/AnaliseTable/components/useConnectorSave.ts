import { useCallback, useState } from "react";
import { getSimilarAnaliseRows } from "@/api/analiseApi";
import { AnaliseTabDto } from "@shared/dto/AnaliseTabDto";
import {
  openConnNameInDivDesk,
  refreshConnNameCache,
  updateConnName,
} from "@/utils/functions/divDesk";
import { PendingSave, ReclickWizard } from "./types";
import { buildReclickSteps } from "./buildReclickSteps";
import { recordConnNameUpdate } from "@/utils/functions/divDeskLogging";

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
      const { Encomenda: enc, NumLinha: line } = row;
      const trimmedConn = newConnector.trim();

      if (!trimmedConn || trimmedConn === (row.Conector ?? "").trim()) return;

      setIsCheckingSimilar(true);

      try {
        const similarRows = await getSimilarAnaliseRows({
          encomenda: enc,
          numLinha: line,
          estado: row.Estado ?? undefined,
          cliente: row.Cliente ?? undefined,
          cduProjetoCliente: row.CDU_ProjetoCliente ?? undefined,
          newConnector: trimmedConn,
        });

        if (similarRows.length === 0) {
          await updateConnName({
            enc,
            line,
            con: trimmedConn,
            userAgent: user || "undefined",
          });
          applyConnectorLocally(enc, line, trimmedConn);

          return;
        }

        setPendingSave({ row, newConnector: trimmedConn, similarRows });
      } catch (error) {
        console.error("Failed to check similar rows:", error);

        await updateConnName({
          enc,
          line,
          con: trimmedConn,
          userAgent: user || "undefined",
        });
        applyConnectorLocally(enc, line, trimmedConn);
      } finally {
        setIsCheckingSimilar(false);
      }
    },

    [applyConnectorLocally],
  );

  // Applies connector change to the edited row only.
  const handleOnlyThisRow = useCallback(async () => {
    if (!pendingSave) return;
    const { row, newConnector } = pendingSave;
    const { Encomenda: enc, NumLinha: line } = row;

    const errMsg = await openConnNameInDivDesk(enc, line, newConnector);

    // Log the update attempt with result and error message if applicable, then refresh cache.
    recordConnNameUpdate({
      enc,
      line,
      con: newConnector,
      userAgent: user || "undefined",
      errMsg,
    }).then(() => refreshConnNameCache());

    applyConnectorLocally(enc, line, newConnector);

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
  const handleLaunchReclickStep = useCallback(async () => {
    if (!reclickWizard) return;

    // Extract current step data.
    const { steps, currentStep, newConnector } = reclickWizard;
    const step = steps[currentStep];
    const { enc, line, con } = step;

    // Open DIVDESK and capture any error message.
    const errMsg = await openConnNameInDivDesk(enc, Number(line), con);

    // Log the update attempt
    void recordConnNameUpdate({
      enc,
      line: Number(line),
      con,
      userAgent: user || "undefined",
      errMsg,
    }).then(() => {
      applyConnectorLocally(enc, Number(line), newConnector);
    });

    // Move to next step or finish wizard.
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setReclickWizard({ steps, currentStep: nextStep, newConnector });
      return;
    }

    // All steps done - refresh cache to sync with any manual DIVDESK changes, and close wizard.
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
