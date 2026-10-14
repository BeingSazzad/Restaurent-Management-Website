import React from 'react';
import { RESTAURANT_INFO, DELIVERY_ZONES } from '@/Mockdata';
import { MapPin, Phone, Mail, Clock, Bike, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-bold text-[#FF8D2F] uppercase tracking-wider block mb-1">
          Store Information
        </span>
        <h1 className="text-3xl font-extrabold text-[#1F1F1F] mb-2">
          Find Us in Dublin
        </h1>
        <p className="text-xs text-[#747474]">
          Dine-in, takeaway collection, or fast doorstep delivery across Dublin zones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#1F1F1F]">Restaurant Contact</h3>
            <div className="flex items-start gap-3 text-[#3D3D3D]">
              <MapPin className="w-4 h-4 text-[#FF8D2F] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1F1F1F] block">Central Dublin Store:</span>
                {RESTAURANT_INFO.location}
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#3D3D3D]">
              <Phone className="w-4 h-4 text-[#FF8D2F] shrink-0" />
              <span>{RESTAURANT_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-[#3D3D3D]">
              <Mail className="w-4 h-4 text-[#FF8D2F] shrink-0" />
              <span>{RESTAURANT_INFO.email}</span>
            </div>
          </div>

          {/* Delivery Zones */}
          <div className="p-6 rounded-2xl bg-white border border-[#EBEBEB] shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#1F1F1F] flex items-center gap-2">
              <Bike className="w-4 h-4 text-[#0FA958]" /> Dublin Delivery Coverage
            </h3>
            <div className="space-y-2 text-xs">
              {DELIVERY_ZONES.map((zone) => (
                <div
                  key={zone.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9F9F9] border border-[#EBEBEB]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FF8D2F]">{zone.key}</span>
                    <span className="text-[#3D3D3D]">{zone.name}</span>
                  </div>
                  <span className="text-[#747474]">Fee: €{zone.fee.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Map Card */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl overflow-hidden bg-white border border-[#EBEBEB] shadow-sm p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1F1F1F] mb-1">
                South William Street Kitchen
              </h3>
              <p className="text-xs text-[#747474] mb-6">
                Situated in Dublin 2, just off Grafton Street and St. Stephen&apos;s Green.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[#F9F9F9] h-72 border border-[#EBEBEB] flex items-center justify-center p-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FFF4EC] text-[#FF8D2F] flex items-center justify-center mx-auto border border-[#FFE0CC] shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1F1F1F]">18 South William Street</h4>
                  <span className="text-xs text-[#FF8D2F] font-semibold">Dublin 2, D02 HR58</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0FA958]/10 text-[#0FA958] text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accepting Online Orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
