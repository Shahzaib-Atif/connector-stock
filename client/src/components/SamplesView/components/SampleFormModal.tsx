import React, { useState, useEffect } from "react";
import { Sample } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createSampleThunk,
  updateSampleThunk,
} from "@/store/slices/samplesSlice";

interface SampleFormModalProps {
  sample: Sample | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const SampleFormModal: React.FC<SampleFormModalProps> = ({
  sample,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.samples);
  const isEditing = !!sample;

  const [formData, setFormData] = useState({
    Cliente: "",
    Projeto: "",
    EncDivmac: "",
    Ref_Descricao: "",
    Ref_Fornecedor: "",
    Amostra: "",
    Data_do_pedido: "",
    Data_recepcao: "",
    Entregue_a: "",
    N_Envio: "",
    Quantidade: "",
    Observacoes: "",
    NumORC: "",
    CreatedBy: "",
    ActualUser: "",
  });

  useEffect(() => {
    if (sample) {
      setFormData({
        Cliente: sample.Cliente || "",
        Projeto: sample.Projeto || "",
        EncDivmac: sample.EncDivmac || "",
        Ref_Descricao: sample.Ref_Descricao || "",
        Ref_Fornecedor: sample.Ref_Fornecedor || "",
        Amostra: sample.Amostra || "",
        Data_do_pedido: sample.Data_do_pedido || "",
        Data_recepcao: sample.Data_recepcao || "",
        Entregue_a: sample.Entregue_a || "",
        N_Envio: sample.N_Envio || "",
        Quantidade: sample.Quantidade || "",
        Observacoes: sample.Observacoes || "",
        NumORC: sample.NumORC || "",
        CreatedBy: sample.CreatedBy || "",
        ActualUser: sample.ActualUser || "",
      });
    }
  }, [sample]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && sample) {
        await dispatch(
          updateSampleThunk({
            id: sample.ID,
            data: {
              ...formData,
              LasUpdateBy: formData.ActualUser || "system",
            },
          })
        ).unwrap();
      } else {
        await dispatch(createSampleThunk(formData)).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  const labelClass = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-100">
            {isEditing ? "Edit Sample" : "Create New Sample"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div>
              <label className={labelClass}>Cliente</label>
              <input
                type="text"
                name="Cliente"
                value={formData.Cliente}
                onChange={handleChange}
                className={inputClass}
                placeholder="Client name"
              />
            </div>

            {/* Projeto */}
            <div>
              <label className={labelClass}>Projeto</label>
              <input
                type="text"
                name="Projeto"
                value={formData.Projeto}
                onChange={handleChange}
                className={inputClass}
                placeholder="Project name"
              />
            </div>

            {/* EncDivmac */}
            <div>
              <label className={labelClass}>EncDivmac</label>
              <input
                type="text"
                name="EncDivmac"
                value={formData.EncDivmac}
                onChange={handleChange}
                className={inputClass}
                placeholder="EncDivmac"
              />
            </div>

            {/* NumORC */}
            <div>
              <label className={labelClass}>NumORC</label>
              <input
                type="text"
                name="NumORC"
                value={formData.NumORC}
                onChange={handleChange}
                className={inputClass}
                placeholder="ORC Number"
              />
            </div>

            {/* Ref_Descricao */}
            <div>
              <label className={labelClass}>Ref. Descrição</label>
              <input
                type="text"
                name="Ref_Descricao"
                value={formData.Ref_Descricao}
                onChange={handleChange}
                className={inputClass}
                placeholder="Reference description"
              />
            </div>

            {/* Ref_Fornecedor */}
            <div>
              <label className={labelClass}>Ref. Fornecedor</label>
              <input
                type="text"
                name="Ref_Fornecedor"
                value={formData.Ref_Fornecedor}
                onChange={handleChange}
                className={inputClass}
                placeholder="Supplier reference"
              />
            </div>

            {/* Amostra */}
            <div>
              <label className={labelClass}>Amostra</label>
              <input
                type="text"
                name="Amostra"
                value={formData.Amostra}
                onChange={handleChange}
                className={inputClass}
                placeholder="Sample code"
              />
            </div>

            {/* Quantidade */}
            <div>
              <label className={labelClass}>Quantidade</label>
              <input
                type="text"
                name="Quantidade"
                value={formData.Quantidade}
                onChange={handleChange}
                className={inputClass}
                placeholder="Quantity"
              />
            </div>

            {/* Data_do_pedido */}
            <div>
              <label className={labelClass}>Data do Pedido</label>
              <input
                type="text"
                name="Data_do_pedido"
                value={formData.Data_do_pedido}
                onChange={handleChange}
                className={inputClass}
                placeholder="Request date"
              />
            </div>

            {/* Data_recepcao */}
            <div>
              <label className={labelClass}>Data Receção</label>
              <input
                type="text"
                name="Data_recepcao"
                value={formData.Data_recepcao}
                onChange={handleChange}
                className={inputClass}
                placeholder="Reception date"
              />
            </div>

            {/* Entregue_a */}
            <div>
              <label className={labelClass}>Entregue A</label>
              <input
                type="text"
                name="Entregue_a"
                value={formData.Entregue_a}
                onChange={handleChange}
                className={inputClass}
                placeholder="Delivered to"
              />
            </div>

            {/* N_Envio */}
            <div>
              <label className={labelClass}>N. Envio</label>
              <input
                type="text"
                name="N_Envio"
                value={formData.N_Envio}
                onChange={handleChange}
                className={inputClass}
                placeholder="Shipping number"
              />
            </div>

            {/* CreatedBy */}
            <div>
              <label className={labelClass}>Created By</label>
              <input
                type="text"
                name="CreatedBy"
                value={formData.CreatedBy}
                onChange={handleChange}
                className={inputClass}
                placeholder="Creator"
                disabled={isEditing}
              />
            </div>

            {/* ActualUser */}
            <div>
              <label className={labelClass}>Actual User</label>
              <input
                type="text"
                name="ActualUser"
                value={formData.ActualUser}
                onChange={handleChange}
                className={inputClass}
                placeholder="Current user"
              />
            </div>

            {/* Observacoes - Full width */}
            <div className="md:col-span-2">
              <label className={labelClass}>Observações</label>
              <textarea
                name="Observacoes"
                value={formData.Observacoes}
                onChange={handleChange}
                rows={3}
                className={inputClass}
                placeholder="Notes and observations"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
