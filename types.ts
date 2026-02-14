
export enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  SHOWROOM = 'Showroom',
  MEASUREMENT = 'Measurement',
  CUTTING = 'Cutting',
  SHIRT_MAKER = 'Shirt Maker',
  PANT_MAKER = 'Pant Maker',
  COAT_MAKER = 'Coat Maker',
  FINISHING = 'Finishing (Kaaj/Button)',
  PRESS = 'Press (Paresh)',
  DELIVERY = 'Delivery',
  CUSTOMER = 'Customer'
}

export enum OrderStage {
  ORDER_PLACED = 'Order Placed',
  MEASUREMENT = 'Measurement',
  CUTTING = 'Cutting',
  SEWING = 'Sewing',
  FINISHING = 'Finishing (Kaaj/Button)', 
  PRESS = 'Press (Paresh)',              
  READY = 'Ready for Delivery',
  DELIVERED = 'Delivered',
  RETURNED = 'Returned to Showroom'      
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
}

export interface WalletTransaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  type: 'Credit' | 'Debit';
  walletType: 'Upline' | 'Downline' | 'Booking' | 'Performance' | 'Magic' | 'Daily' | 'Work';
  description: string;
  relatedOrderId?: string;
  relatedUser?: string;
  level?: string;
}

export interface TransactionRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'ADD_FUNDS' | 'WITHDRAW' | 'JOIN_REQUEST';
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  utr?: string;
  method?: string;
  paymentDetails?: string;
  newUserName?: string;
  newUserMobile?: string;
  newUserRole?: UserRole;
  uplineId?: string;
}

export interface SystemUser {
  id: string; 
  name: string;
  role: UserRole;
  mobile: string;
  status: 'Active' | 'Blocked';
  joinDate: string;
  uplineId?: string;
  magicUplineId?: string;
  frequentContacts?: string[]; 
  canWithdraw?: boolean;
  loginPassword?: string;
  tPassword?: string;
  upiId?: string;
  bankDetails?: {
      accountName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address?: string; 
  billNumber: string;
  clothMeters: number;
  deliveryDate: string;
  isVIP: boolean;
}

export interface MeasurementData {
  length?: string;      
  chest?: string;       
  stomach?: string;     
  seat?: string;        
  shoulder?: string;    
  sleeve?: string;      
  cuff?: string;        
  collar?: string;      
  notes?: string;
  deliveryDate?: string;
  isUrgent?: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  billNumber: string;
  type: string; 
  stage: OrderStage;
  assignedWorker?: string; 
  previousWorker?: string; 
  previousWorkerId?: string;
  createdBy?: string; 
  creatorId?: string; 
  createdAt: string;
  lastUpdated: string;
  deliveryDate?: string;   
  price: number;
  quality?: 'Normal' | 'Medium' | 'Regular' | 'VIP'; 
  folder?: 'Self' | 'Save' | 'Inbox' | 'Return' | 'Completed'; 
  handoverStatus?: 'Pending' | 'Accepted'; 
  securityCode?: string; 
  measurements?: MeasurementData;
  amountDeducted?: number;
  workerHistory?: string[];
  isPaid?: boolean;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minLevel: number;
}

export interface GalleryItem {
  id: string;
  code: string;
  imageUrl: string;
  type: string;
  customerPrice: number;
  stitchingCost: number;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  amount: number;
  date: string;
  roi: string;
}

export interface InvestmentState {
  invested: number;
  totalEarnings: number;
  totalWithdrawn: number;
  activePlans: InvestmentPlan[];
}

export interface Stats {
  totalOrders: number;
  revenue: number;
  activeWorkers: number;
  pendingDeliveries: number;
  uplineWallet: number;
  downlineWallet: number;
  todaysWallet: number;
  performanceWallet: number;
  bookingWallet: number; 
  magicIncome: number;
  totalIncome: number;
}

export interface AppConfig {
  isInvestmentEnabled: boolean;
  investmentOrderPercent: number;
  isWithdrawalEnabled: boolean; 
  isGalleryEnabled: boolean;
  announcement: {
    isActive: boolean;
    imageUrl: string | null;
  };
  maintenance: {
    isActive: boolean;
    imageUrl: string | null;
    liveTime: string | null; 
  };
  deductions: {
    workDeductionPercent: number;
    downlineSupportPercent: number;
    magicFundPercent: number;
  };
  incomeEligibility: {
    isActive: boolean;
    minMonthlyWorkAmount: number;
  };
  levelRequirements: { level: number; requiredDirects: number; isOpen: boolean }[];
  levelDistributionRates: number[]; 
  companyDetails: {
    qrUrl: string | null;
    upiId: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountName: string;
  };
}

export interface Rate {
  id: number;
  role: string;
  type: 'fixed' | 'percent';
  normal: number;
  medium: number;
  regular: number;
  vip: number;
  targetStage?: OrderStage; 
}

export interface StitchingRate {
  id: string;
  type: string; 
  normal: number;
  medium: number;
  regular: number;
  vip: number;
  rateType?: 'Fixed' | 'Percentage';
}
