'use client';

import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LiveMapProps {
  vanNumber: string;
  driverName: string;
  currentLocation: string;
  eta: string;
  distance: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  vanNumber,
  driverName,
  currentLocation,
  eta,
  distance,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Tracking</CardTitle>
          <Badge variant="success" className="flex items-center gap-1">
            <span className="status-dot status-active animate-pulse" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder */}
        <div className="relative w-full h-80 bg-neutral-100 rounded-xl overflow-hidden mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-2" />
              <p className="text-sm text-neutral-600">Map Integration</p>
              <p className="text-xs text-neutral-500">Google Maps / Mapbox</p>
            </div>
          </div>
          
          {/* Floating Info Card */}
          <div className="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-neutral-900">{vanNumber}</h4>
                <p className="text-sm text-neutral-600">{driverName}</p>
              </div>
              <Button variant="primary" size="sm">
                <Navigation className="w-4 h-4" />
                Navigate
              </Button>
            </div>
          </div>

          {/* ETA Card */}
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-card p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-neutral-600">ETA</p>
                <p className="text-sm font-bold text-neutral-900">{eta}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-5 h-5 text-secondary mx-auto mb-1" />
                <p className="text-xs text-neutral-600">Distance</p>
                <p className="text-sm font-bold text-neutral-900">{distance}</p>
              </div>
              <div className="text-center">
                <Navigation className="w-5 h-5 text-highlight mx-auto mb-1" />
                <p className="text-xs text-neutral-600">Status</p>
                <p className="text-sm font-bold text-neutral-900">On Route</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Location */}
        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-neutral-900">Current Location</p>
            <p className="text-sm text-neutral-600">{currentLocation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
