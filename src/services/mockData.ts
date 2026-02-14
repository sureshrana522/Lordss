
import { Customer, Material, Order, GalleryItem, SystemUser, UserRole, OrderStage } from '../types';

// --- INITIAL DATA FOR FRESH DATABASE ---

export const MOCK_CUSTOMERS: Customer[] = [];

export const MOCK_ORDERS: Order[] = [];

export const MOCK_MATERIALS: Material[] = [];

export const MOCK_GALLERY: GalleryItem[] = [];

// SABHI PANELS KI HIERARCHY CHAIN (FOR TESTING)
// Admin -> Manager -> Showroom -> Master -> Cutter -> Shirt -> Pant -> Finish -> Delivery
export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { 
      id: 'LBT-ADMIN', 
      name: 'Owner (Admin)', 
      role: UserRole.ADMIN, 
      mobile: '9571167318', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      canWithdraw: true,
      loginPassword: 'admin123' 
  },
  { 
      id: 'LBT-MANAGER', 
      name: 'Store Manager', 
      role: UserRole.MANAGER, 
      mobile: '9999999999', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-ADMIN',
      magicUplineId: 'LBT-ADMIN',
      canWithdraw: true,
      loginPassword: '123456' 
  },
  { 
      id: 'LBT-SHOWROOM', 
      name: 'Showroom Counter', 
      role: UserRole.SHOWROOM, 
      mobile: '9000000000', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-MANAGER',
      magicUplineId: 'LBT-MANAGER',
      canWithdraw: true,
      loginPassword: '123456' 
  },
  { 
      id: 'LBT-MASTER', 
      name: 'Master Hitesh', 
      role: UserRole.MEASUREMENT, 
      mobile: '8888888888', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-SHOWROOM',
      magicUplineId: 'LBT-SHOWROOM',
      canWithdraw: true,
      loginPassword: '123456' 
  },
  { 
      id: 'LBT-CUTTER', 
      name: 'Cutter Suresh', 
      role: UserRole.CUTTING, 
      mobile: '7777777777', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-MASTER',
      magicUplineId: 'LBT-MASTER',
      canWithdraw: true,
      loginPassword: '123456' 
  },
  { 
      id: 'LBT-SHIRT', 
      name: 'Shirt Tailor', 
      role: UserRole.SHIRT_MAKER, 
      mobile: '4444444444', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-CUTTER',
      magicUplineId: 'LBT-CUTTER',
      canWithdraw: true,
      loginPassword: '123456' 
  },
  { 
      id: 'LBT-PANT', 
      name: 'Pant Maker', 
      role: UserRole.PANT_MAKER, 
      mobile: '5555555555', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-SHIRT',
      magicUplineId: 'LBT-SHIRT',
      canWithdraw: true,
      loginPassword: '123456' 
  },
  { 
      id: 'LBT-FINISH', 
      name: 'Kaaj/Button Dept', 
      role: UserRole.FINISHING, 
      mobile: '6666666666', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-PANT',
      magicUplineId: 'LBT-PANT',
      canWithdraw: true,
      loginPassword: '123456' 
  },
  { 
      id: 'LBT-DELIVERY', 
      name: 'Delivery Boy', 
      role: UserRole.DELIVERY, 
      mobile: '1111111111', 
      status: 'Active', 
      joinDate: '2025-01-01', 
      uplineId: 'LBT-FINISH',
      magicUplineId: 'LBT-FINISH',
      canWithdraw: true,
      loginPassword: '123456' 
  }
];
