'use client';

import React from 'react';
import { MapPin, Star, Users, DollarSign, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

interface VanCardProps {
  vanNumber: string;
  driverName: string;
  driverPhoto?: string;
  rating: number;
  reviews: number;
  distance: string;
  monthlyFee: number;
  availableSeats: number;
  totalSeats: number;
  isGirlsOnly?: boolean;
  amenities?: string[];
  onBook?: () => void;
  onViewDetails?: () => void;
}

export const VanCard: React.FC<VanCardProps> = ({
  vanNumber,
  driverName,
  driverPhoto,
  rating,
  reviews,
  distance,
  monthlyFee,
  availableSeats,
  totalSeats,
  isGirlsOnly = false,
  amenities = [],
  onBook,
  onViewDetails,
}) => {
  return (
    <Card hover className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Image */}
        <div className="relative h-40 bg-gradient-to-br from-primary to-secondary">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-1">{vanNumber}</h3>
              <p className="text-white/80 text-sm">School Transport Van</p>
            </div>
          </div>
          {isGirlsOnly && (
            <Badge variant="danger" className="absolute top-3 right-3 bg-accent">
              <Shield className="w-3 h-3" />
              Girls Only
            </Badge>
          )}
        </div>

        <div className="p-5">
          {/* Driver Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={driverName} src={driverPhoto} size="lg" />
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900">{driverName}</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-highlight text-highlight" />
                  <span className="text-sm font-medium text-neutral-900">{rating}</span>
                </div>
                <span className="text-sm text-neutral-500">({reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-700">{distance} away</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-700">
                {availableSeats}/{totalSeats} seats
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm col-span-2">
              <DollarSign className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-700">
                <span className="font-bold text-lg text-neutral-900">${monthlyFee}</span>/month
              </span>
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Availability Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-600">Availability</span>
              <span className="font-medium text-neutral-900">
                {availableSeats > 0 ? `${availableSeats} seats left` : 'Fully Booked'}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  availableSeats > 3 ? 'bg-green-500' : availableSeats > 0 ? 'bg-highlight' : 'bg-accent'
                }`}
                style={{ width: `${((totalSeats - availableSeats) / totalSeats) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              className="flex-1"
              onClick={onBook}
              disabled={availableSeats === 0}
            >
              {availableSeats > 0 ? 'Book Now' : 'Fully Booked'}
            </Button>
            <Button variant="outline" onClick={onViewDetails}>
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
