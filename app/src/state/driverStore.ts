import { create } from 'zustand';

import { emit } from '@/core/events';
import type { DriverState } from '@/domains/drivers/driverState';

export type DriverProfile = {
  color: string;
  eta: string;
  id: string;
  name: string;
  plate: string;
  phoneNumber?: string;
  rating: number;
  vehicle: string;
};

const initialDemoDrivers: DriverProfile[] = [
  {
    color: 'Black',
    eta: '4 min',
    id: 'ali',
    name: 'Ali',
    plate: 'GVPF-596',
    phoneNumber: '+16135550101',
    rating: 4.9,
    vehicle: 'Tesla Model Y Long Range',
  },
  {
    color: 'Black',
    eta: '6 min',
    id: 'fatih',
    name: 'Fatih',
    plate: 'MURRYS-02',
    rating: 4.9,
    vehicle: 'Tesla Model 3 Long Range',
  },
];

type DriverStore = {
  assignedDriverId: string;
  driverState: DriverState;
  drivers: DriverProfile[];
  getAssignedDriver: () => DriverProfile;
  setAssignedDriver: (driverId: string) => void;
  setDriverState: (nextState: DriverState) => DriverState;
};

export const useDriverStore = create<DriverStore>((set, get) => ({
  assignedDriverId: 'ali',
  driverState: 'offline',
  drivers: initialDemoDrivers,
  getAssignedDriver: () => {
    const { assignedDriverId, drivers } = get();

    return drivers.find((driver) => driver.id === assignedDriverId) ?? drivers[0];
  },
  setAssignedDriver: (driverId) => set({ assignedDriverId: driverId }),
  setDriverState: (nextState) => {
    set({ driverState: nextState });

    if (nextState === 'offline') {
      emit('driver_offline', { state: nextState });
    }

    if (nextState === 'online' || nextState === 'waiting') {
      emit('driver_online', { state: nextState });
    }

    return nextState;
  },
}));
