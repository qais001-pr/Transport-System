'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Car, Fuel, Construction, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface DelayReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details?: string) => void;
}

export const DelayReportModal: React.FC<DelayReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customDetails, setCustomDetails] = useState('');

  const delayReasons = [
    { id: 'traffic', label: 'Traffic Jam', icon: Car, color: 'text-accent', bgColor: 'bg-accent-50' },
    { id: 'accident', label: 'Accident', icon: AlertTriangle, color: 'text-accent', bgColor: 'bg-accent-50' },
    { id: 'vehicle', label: 'Vehicle Issue', icon: Construction, color: 'text-highlight', bgColor: 'bg-highlight-50' },
    { id: 'fuel', label: 'Fuel Shortage', icon: Fuel, color: 'text-highlight', bgColor: 'bg-highlight-50' },
    { id: 'weather', label: 'Bad Weather', icon: Clock, color: 'text-secondary', bgColor: 'bg-secondary-50' },
    { id: 'other', label: 'Other Reason', icon: AlertTriangle, color: 'text-neutral-500', bgColor: 'bg-neutral-100' },
  ];

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, customDetails);
      setSelectedReason(null);
      setCustomDetails('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Report Delay</h2>
              <p className="text-sm text-neutral-600 mt-1">Select the reason for delay</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          {/* Delay Reasons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {delayReasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                  selectedReason === reason.id
                    ? 'border-primary bg-primary-50 shadow-card'
                    : 'border-neutral-200 hover:border-neutral-300 hover:shadow-soft'
                )}
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', reason.bgColor)}>
                  <reason.icon className={cn('w-5 h-5', reason.color)} />
                </div>
                <p className="font-semibold text-neutral-900 text-sm">{reason.label}</p>
              </button>
            ))}
          </div>

          {/* Custom Details */}
          {selectedReason && (
            <div className="mb-6 animate-slide-down">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Provide more information about the delay..."
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Estimated Delay */}
          {selectedReason && (
            <div className="mb-6 animate-slide-down">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Estimated Delay Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['5 min', '10 min', '15 min', '20+ min'].map((time) => (
                  <button
                    key={time}
                    className="px-3 py-2 text-sm font-medium border-2 border-neutral-200 hover:border-primary hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedReason}
              className="flex-1"
            >
              <AlertTriangle className="w-4 h-4" />
              Submit Report
            </Button>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
            <p className="text-xs text-secondary-700">
              <strong>Note:</strong> Parents and school guards will be notified immediately about the delay.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
