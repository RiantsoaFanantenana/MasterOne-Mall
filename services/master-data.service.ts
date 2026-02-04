
import { Injectable, signal } from '@angular/core';
import { Box, ShopType, SubscriptionType } from '../types.ts';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  // Global Mall State
  boxes = signal<Box[]>([
    { id: 1, box_number: 'A-101', floor: 1, surface_area: 120, status: 'occupied' },
    { id: 2, box_number: 'B-005', floor: 0, surface_area: 85, status: 'available' },
    { id: 3, box_number: 'C-202', floor: 2, surface_area: 60, status: 'occupied' }
  ]);

  shopTypes = signal<ShopType[]>([
    { id: 1, type_name: 'Luxury Fashion' },
    { id: 2, type_name: 'High Jewelry' },
    { id: 3, type_name: 'Gastronomy' },
    { id: 4, type_name: 'Digital Art' }
  ]);

  subscriptionTypes = signal<SubscriptionType[]>([
    { id: 1, name: 'Standard Plan', price: 1500, features: ['Directory Listing', 'Member Wallet access'] },
    { id: 2, name: 'Premium House', price: 4500, features: ['Badges', 'Push Notifications', 'Real-time AI', 'Featured Listing'] },
    { id: 3, name: 'Elite Partner', price: 9000, features: ['Bespoke Events', 'Concierge 24/7', 'Full Digital Dominance'] }
  ]);

  addBox(box: Partial<Box>) {
    this.boxes.update(v => [...v, { ...box, id: Date.now(), status: 'available' } as Box]);
  }

  deleteBox(id: number) {
    this.boxes.update(v => v.filter(b => b.id !== id));
  }

  addShopType(name: string) {
    this.shopTypes.update(v => [...v, { id: Date.now(), type_name: name }]);
  }

  deleteShopType(id: number) {
    this.shopTypes.update(v => v.filter(t => t.id !== id));
  }

  addSubscriptionType(sub: Partial<SubscriptionType>) {
    this.subscriptionTypes.update(v => [...v, { ...sub, id: Date.now(), features: ['MasterOne Essential Support'] } as SubscriptionType]);
  }

  deleteSubscriptionType(id: number) {
    this.subscriptionTypes.update(v => v.filter(s => s.id !== id));
  }
}
