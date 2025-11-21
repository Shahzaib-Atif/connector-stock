import React, { useEffect, useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { Connector, StockInsight } from '../types';

interface InsightCardProps {
  connector: Connector;
}

export const InsightCard: React.FC<InsightCardProps> = ({ connector }) => {
  const [insight, setInsight] = useState<StockInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchInsight = async () => {
      setLoading(true);
      // const data = await generateStockInsight(connector);
      if (mounted) {
        setInsight(null);
        setLoading(false);
      }
    };
    fetchInsight();
    return () => { mounted = false; };
  }, [connector.id, connector.stock]);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700 animate-pulse flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-slate-500" />
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      </div>
    );
  }

  if (!insight) return null;

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'critical': return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'low': return 'bg-orange-500/10 border-orange-500/20 text-orange-300';
      case 'overstock': return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
      default: return 'bg-green-500/10 border-green-500/20 text-green-300';
    }
  };

  const getIcon = (s: string) => {
    switch (s) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'low': return <TrendingDown className="w-5 h-5 text-orange-500" />;
      case 'overstock': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <div className={`mt-4 p-4 rounded-xl border shadow-sm transition-all ${getStatusColor(insight.status)}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {getIcon(insight.status)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-70">AI Stock Insight</h4>
            <span className="text-xs font-semibold px-2 py-0.5 bg-white/10 rounded-full">
              {insight.actionable}
            </span>
          </div>
          <p className="text-sm font-medium leading-relaxed opacity-90">
            {insight.message}
          </p>
        </div>
      </div>
    </div>
  );
};