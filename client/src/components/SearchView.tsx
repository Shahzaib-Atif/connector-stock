import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Connector } from '../types';
import { searchByClientRef } from '../services/connectorService';
import { ConnectorSummary } from './ConnectorView/components/ConnectorSummary';
import { useAppSelector } from '../store/hooks';

export const SearchView: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Connector[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const masterData = useAppSelector(state => state.stock.masterData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !masterData) return;

    // Pass string directly to searchByClientRef
    const searchResults = searchByClientRef(searchQuery.trim(), masterData);
    setResults(searchResults);
    setHasSearched(true);
  };

  const onSelectConnector = (connector: Connector) => {
    navigate(`/connector/${connector.id}`);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Client Reference (e.g., 8432)..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </form>

      <div className="space-y-4">
        {hasSearched && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results ({results.length})
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {results.map((connector) => (
            <div 
              key={connector.id}
              onClick={() => onSelectConnector(connector)}
              className="cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <ConnectorSummary connector={connector} currentStock={connector.stock} />
            </div>
          ))}
          
          {hasSearched && results.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No connectors found for this reference.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
