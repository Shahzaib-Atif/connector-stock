import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchByClientRef } from "../services/inventoryService";
import { Connector } from "../types";
import { ArrowRight } from "lucide-react";

export const SearchView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q");

  if (!query) {
    return <div>No search query provided.</div>;
  }

  const results = searchByClientRef(parseInt(query, 10));

  const handleSelectConnector = (c: Connector) => {
    navigate(`/connector/${c.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 p-4 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-400 hover:bg-slate-700 rounded-lg"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-bold mt-2">Search Results for "{query}"</h1>
        <p className="text-sm text-slate-400">
          Found {results.length} connectors.
        </p>
      </header>
      <div className="p-4">
        {results.map((connector) => (
          <div
            key={connector.id}
            onClick={() => handleSelectConnector(connector)}
            className="bg-slate-800 p-4 rounded-lg mb-2 cursor-pointer hover:bg-slate-700"
          >
            <p className="font-bold">{connector.id}</p>
            <p className="text-sm text-slate-400">{connector.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
