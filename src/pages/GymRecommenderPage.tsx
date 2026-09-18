import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Star,
  DollarSign,
  Dumbbell,
  Check,
  Search,
  Filter,
  CalendarCheck
} from 'lucide-react';
import { GymFacility } from '../types';
import { api } from '../services/api';

export const GymRecommenderPage: React.FC = () => {
  const [gyms, setGyms] = useState<GymFacility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    api.getGyms().then((data) => {
      setGyms(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const filteredGyms = gyms.filter((gym) => {
    const matchesGoal = selectedGoal === 'all' || gym.recommendedPrograms.some((p) => p.toLowerCase().includes(selectedGoal.toLowerCase()));
    const matchesDistance = gym.distanceKm <= maxDistance;
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gym.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGoal && matchesDistance && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Facility Intelligence
          </span>
          <span className="text-xs text-slate-400">Gym Finder &amp; Schedule Planner</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Gym Recommender &amp; Equipment Locator
        </h1>
        <p className="text-xs text-slate-300">
          Matches your athletic training goals with nearby specialized gyms, platforms, calibrated plates, and wellness amenities.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gym by name or location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 outline-none"
          />
        </div>

        {/* Goal Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Training Focus:</span>
          <select
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none"
          >
            <option value="all">All Specialties</option>
            <option value="Hypertrophy">Hypertrophy &amp; Bodybuilding</option>
            <option value="CrossFit">CrossFit &amp; Conditioning</option>
            <option value="Powerlifting">Powerlifting &amp; Strength</option>
          </select>
        </div>

        {/* Distance Range */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Radius: &lt;= {maxDistance} km</span>
          <input
            type="range"
            min={1}
            max={15}
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-24 accent-cyan-400"
          />
        </div>
      </div>

      {/* Gym Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredGyms.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
          No gyms found matching your criteria. Try widening your distance radius.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGyms.map((gym) => (
            <div
              key={gym.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group shadow-sm"
            >
              <div>
                {/* Photo Banner */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                  <img
                    src={gym.imageUrl}
                    alt={gym.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-slate-700 text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{gym.rating} ({gym.reviewsCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Tier: {gym.pricingTier}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 truncate">{gym.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {gym.distanceKm} km away
                    </span>
                    <span className="text-slate-300 font-medium">
                      {gym.openingHours}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] line-clamp-1">{gym.address}</p>

                  {/* Equipment Pills */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300 block mb-1">Key Equipment:</span>
                    <div className="flex flex-wrap gap-1">
                      {gym.equipment.slice(0, 3).map((eq: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] border border-slate-800">
                          {eq}
                        </span>
                      ))}
                      {gym.equipment.length > 3 && (
                        <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">
                          +{gym.equipment.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300 block mb-1">Amenities:</span>
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                      {gym.facilities.map((fac: string, idx: number) => (
                        <span key={idx} className="flex items-center gap-1 text-emerald-400">
                          <Check className="w-3 h-3" /> {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => alert(`Selected ${gym.name} as your home facility for scheduled workouts!`)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-cyan-400" /> Schedule Workouts Here
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
