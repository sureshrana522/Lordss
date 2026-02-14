
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { Customer, Material, Order, OrderStage, UserRole, Stats, MeasurementData, InvestmentState, AppConfig, GalleryItem, SystemUser, Rate, StitchingRate, WalletTransaction, TransactionRequest, SystemLog } from '../types';
import { MOCK_CUSTOMERS, MOCK_MATERIALS, MOCK_ORDERS, MOCK_GALLERY, MOCK_SYSTEM_USERS } from '../services/mockData';
import { db, initError } from '../services/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, writeBatch, orderBy, limit, getDoc, serverTimestamp, getDocs, where, addDoc } from 'firebase/firestore';

interface AppContextType {
  role: UserRole;
  currentUser: SystemUser | null;
  setRole: (role: UserRole) => void;
  loginUser: (role: UserRole, specificUserId?: string) => void;
  authenticateUser: (mobile: string, password: string) => SystemUser | null;
  registerUser: (newUser: SystemUser) => void;
  autoRegister: (name: string, mobile: string, role: UserRole, uplineId: string) => { id: string, password: string };
  orders: Order[];
  customers: Customer[];
  materials: Material[];
  galleryItems: GalleryItem[];
  systemUsers: SystemUser[];
  logs: SystemLog[];
  stats: Stats;
  investment: InvestmentState;
  config: AppConfig;
  rates: Rate[];
  stitchingRates: StitchingRate[];
  transactions: WalletTransaction[];
  requests: TransactionRequest[];
  updateOrderStage: (orderId: string, newStage: OrderStage) => void;
  addCustomer: (customer: Customer, orderType: Order['type'], price: number, assignedWorker?: string, quality?: 'Normal' | 'Medium' | 'Regular' | 'VIP', creatorId?: string) => Promise<boolean>;
  addOrder: (order: Order) => Promise<void>; 
  addMaterial: (material: Material) => void; 
  moveOrder: (orderId: string, folder: 'Self' | 'Save' | 'Inbox' | 'Return' | 'Completed', assignedWorker?: string, nextStage?: OrderStage, codAmount?: number) => void;
  confirmHandover: (orderId: string) => Promise<boolean>;
  saveMeasurements: (orderId: string, data: MeasurementData, updatedPrice: number) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  investFunds: (amount: number, planName: string) => Promise<boolean>;
  withdrawReturns: (amount: number) => Promise<boolean>;
  transferFunds: (recipientId: string, amount: number) => Promise<boolean>;
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateRates: (newRates: Rate[]) => void;
  updateStitchingRates: (newRates: StitchingRate[]) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'code'>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => void;
  resetSystemIDs: () => void;
  resetDatabase: () => Promise<void>;
  addFrequentWorker: (workerId: string) => void;
  getDashboardStats: () => Stats;
  getWalletHistory: (walletType: string) => WalletTransaction[];
  requestAddFunds: (amount: number, utr: string) => Promise<boolean>;
  requestWithdrawal: (amount: number, method: string, paymentDetails: string) => Promise<boolean>;
  requestJoin: (name: string, mobile: string, role: UserRole, uplineId: string) => void; 
  approveRequest: (reqId: string, approved: boolean) => Promise<boolean>;
  releaseFundsManually: (userId: string, amount: number, walletType: string, description: string) => Promise<boolean>;
  addLog: (action: string, details: string, type: SystemLog['type']) => Promise<void>;
  seedDatabase: () => Promise<{ success: boolean; message: string }>; 
  isDemoMode: boolean; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const toFixedNumber = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) return 0;
    return Math.round((num + Number.EPSILON) * 100000) / 100000;
};

const DEFAULT_CONFIG: AppConfig = {
    isInvestmentEnabled: true,
    investmentOrderPercent: 5,
    isWithdrawalEnabled: true, 
    isGalleryEnabled: true,
    announcement: { isActive: false, imageUrl: null },
    maintenance: { isActive: false, imageUrl: null, liveTime: null },
    deductions: { 
        workDeductionPercent: 15,
        downlineSupportPercent: 100, 
        magicFundPercent: 5,
    },
    incomeEligibility: { isActive: false, minMonthlyWorkAmount: 3000 },
    levelRequirements: Array(10).fill(null).map((_,i) => ({ level: i+1, requiredDirects: i+1, isOpen: true })),
    levelDistributionRates: [25, 15, 10, 10, 10, 10, 5, 5, 5, 5], 
    companyDetails: {
        qrUrl: null,
        upiId: '9571167318@paytm',
        bankName: 'LORD\'S BESPOKE',
        accountNumber: '1234567890',
        ifscCode: 'IFSC0000123',
        accountName: 'LORD\'S BESPOKE TAILORS'
    }
};

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(UserRole.SHIRT_MAKER);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [stitchingRates, setStitchingRates] = useState<StitchingRate[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [requests, setRequests] = useState<TransactionRequest[]>([]);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [hasCheckedInitialData, setHasCheckedInitialData] = useState(false);
  
  const isDemoMode = !db || !!initError;

  const addLog = useCallback(async (action: string, details: string, type: SystemLog['type']) => {
      const newLog: SystemLog = { id: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), userId: currentUser?.id || 'GUEST', userName: currentUser?.name || 'Guest User', action, details, type };
      if (isDemoMode) setLogs(prev => [newLog, ...prev]);
      else try { await setDoc(doc(db!, 'system_logs', newLog.id), { ...newLog, serverTime: serverTimestamp() }); } catch (e) {}
  }, [currentUser, isDemoMode]);

  const seedDatabase = useCallback(async () => { 
      if (!db) return { success: false, message: "No DB Connection" }; 
      try { 
          const batch = writeBatch(db); 
          MOCK_SYSTEM_USERS.forEach(user => { batch.set(doc(db!, 'system_users', user.id), user); });
          batch.set(doc(db, 'app_config', 'settings'), DEFAULT_CONFIG); 
          const initialRates: StitchingRate[] = [
              { id: '1', type: 'Shirt Measurement', normal: 30, medium: 40, regular: 50, vip: 70, rateType: 'Fixed' },
              { id: '2', type: 'Shirt Cutting', normal: 50, medium: 60, regular: 80, vip: 100, rateType: 'Fixed' },
              { id: '3', type: 'Shirt Maker', normal: 200, medium: 250, regular: 300, vip: 450, rateType: 'Fixed' },
              { id: '4', type: 'Pant Measurement', normal: 30, medium: 40, regular: 50, vip: 70, rateType: 'Fixed' },
              { id: '5', type: 'Pant Cutting', normal: 50, medium: 60, regular: 80, vip: 100, rateType: 'Fixed' },
              { id: '6', type: 'Pant Maker', normal: 200, medium: 250, regular: 300, vip: 450, rateType: 'Fixed' },
              { id: '7', type: 'Kaaj Button', normal: 10, medium: 15, regular: 20, vip: 30, rateType: 'Fixed' },
              { id: '8', type: 'Press (Paresh)', normal: 15, medium: 20, regular: 25, vip: 40, rateType: 'Fixed' },
              { id: 'p1', type: 'Trendy Fit Edition', normal: 800, medium: 1000, regular: 1200, vip: 1800, rateType: 'Fixed' }
          ];
          initialRates.forEach(r => batch.set(doc(db!, 'stitching_rates', r.id), r));
          await batch.commit(); 
          return { success: true, message: "System Initialized Successfully!" }; 
      } catch (e: any) { return { success: false, message: e.message }; } 
  }, []);

  useEffect(() => {
      if (isDemoMode || !db) return;

      const unsubUsers = onSnapshot(collection(db, 'system_users'), (snap) => {
          const users = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as SystemUser));
          setSystemUsers(users);
          if (!hasCheckedInitialData && users.length === 0) { seedDatabase(); }
          setHasCheckedInitialData(true);
      });

      const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => setOrders(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order))));
      const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => setCustomers(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Customer))));
      const unsubLogs = onSnapshot(query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(50)), (snap) => setLogs(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as SystemLog))));
      const unsubTx = onSnapshot(query(collection(db, 'transactions'), orderBy('date', 'desc'), limit(500)), (snap) => setTransactions(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as WalletTransaction))));
      const unsubReq = onSnapshot(query(collection(db, 'requests'), orderBy('date', 'desc'), limit(50)), (snap) => setRequests(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as TransactionRequest))));
      const unsubConfig = onSnapshot(doc(db, 'app_config', 'settings'), (snap) => { if (snap.exists()) setConfig(snap.data() as AppConfig); });
      const unsubRates = onSnapshot(collection(db, 'rates'), (snap) => setRates(snap.docs.map(doc => doc.data() as Rate).sort((a,b) => a.id - b.id)));
      const unsubStitch = onSnapshot(collection(db, 'stitching_rates'), (snap) => setStitchingRates(snap.docs.map(doc => doc.data() as StitchingRate)));
      const unsubGallery = onSnapshot(collection(db, 'gallery_items'), (snap) => setGalleryItems(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryItem))));
      
      return () => { unsubUsers(); unsubOrders(); unsubCustomers(); unsubLogs(); unsubTx(); unsubReq(); unsubConfig(); unsubRates(); unsubStitch(); unsubGallery(); };
  }, [isDemoMode, hasCheckedInitialData, seedDatabase]);

  const addTransaction = useCallback(async (userId: string, amount: number | string, type: 'Credit' | 'Debit', walletType: string, description: string, relatedOrderId?: string, relatedUser?: string, level?: string) => {
      let cleanAmount = 0;
      if (typeof amount === 'number') {
          cleanAmount = amount;
      } else if (typeof amount === 'string') {
          const sanitized = amount.toString().replace(/[^0-9.-]+/g, "");
          cleanAmount = parseFloat(sanitized);
      }

      if (isNaN(cleanAmount) || cleanAmount <= 0) {
          console.error("FAILED TRANSACTION: Invalid Amount detected", amount);
          return false;
      }

      const newTx: WalletTransaction = { 
          id: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, 
          userId, 
          date: new Date().toISOString(), 
          amount: toFixedNumber(cleanAmount), 
          type, 
          walletType: walletType as any, 
          description, 
          relatedOrderId, 
          relatedUser, 
          level 
      };

      try {
          if (isDemoMode) { 
              setTransactions(prev => [newTx, ...prev]); 
              return true; 
          } else if (db) { 
              await setDoc(doc(db, 'transactions', newTx.id), { ...newTx, serverTime: serverTimestamp() }); 
              return true; 
          }
          return false;
      } catch (e) {
          console.error("Transaction Error:", e);
          return false;
      }
  }, [isDemoMode]);

  const liveStats = useMemo(() => {
    const totalRev = orders.reduce((acc, o) => acc + (o.price || 0), 0);
    const activeW = systemUsers.filter(u => u.status === 'Active').length;
    const pendingD = orders.filter(o => o.stage !== OrderStage.DELIVERED).length;

    if (!currentUser) return { totalOrders: orders.length, revenue: totalRev, activeWorkers: activeW, pendingDeliveries: pendingD, uplineWallet: 0, downlineWallet: 0, todaysWallet: 0, performanceWallet: 0, bookingWallet: 0, magicIncome: 0, totalIncome: 0 };
    
    const myTx = transactions.filter(t => t.userId === currentUser.id);
    const walletSums = myTx.reduce((acc, curr) => {
      const val = curr.type === 'Credit' ? curr.amount : -curr.amount;
      if (curr.walletType === 'Booking') acc.booking += val;
      else if (curr.walletType === 'Upline') acc.upline += val;
      else if (curr.walletType === 'Downline') acc.downline += val;
      else if (curr.walletType === 'Magic') acc.magic += val;
      else if (curr.walletType === 'Daily') acc.daily += val;
      else if (curr.walletType === 'Performance') acc.perf += val;
      return acc;
    }, { booking: 0, upline: 0, downline: 0, magic: 0, daily: 0, perf: 0 });

    return { 
        totalOrders: orders.length,
        revenue: totalRev,
        activeWorkers: activeW,
        pendingDeliveries: pendingD,
        bookingWallet: toFixedNumber(walletSums.booking), 
        uplineWallet: toFixedNumber(walletSums.upline), 
        downlineWallet: toFixedNumber(walletSums.downline), 
        magicIncome: toFixedNumber(walletSums.magic), 
        todaysWallet: toFixedNumber(walletSums.daily), 
        performanceWallet: toFixedNumber(walletSums.perf),
        totalIncome: toFixedNumber(walletSums.booking + walletSums.upline + walletSums.downline + walletSums.magic + walletSums.daily + walletSums.perf) 
    };
  }, [orders, systemUsers, transactions, currentUser]);

  const distributeMagicRewards = useCallback(async (startUserId: string, magicPool: number, orderId: string, originalSourceId: string) => {
      const startUser = systemUsers.find(u => u.id === startUserId);
      if (!startUser) return;
      let currMagicUplineId = startUser.magicUplineId;
      for (let i = 0; i < 10; i++) {
          if (!currMagicUplineId) break; 
          const magicUpline = systemUsers.find(u => u.id === currMagicUplineId);
          if (!magicUpline) break;
          const levelRate = config.levelDistributionRates[i] || 0;
          const share = (magicPool * levelRate) / 100;
          if (share > 0) {
              await addTransaction(magicUpline.id, share, 'Credit', 'Magic', `Magic Matrix (L${i+1}) from ${startUser.name}`, orderId, originalSourceId, `M-L${i+1}`);
          }
          currMagicUplineId = magicUpline.magicUplineId;
      }
  }, [systemUsers, config, addTransaction]);

  const distributeNetworkRewards = useCallback(async (targetUserId: string, basePayout: number, order: Order) => {
      const deductionPercent = config.deductions.workDeductionPercent || 15;
      const totalDedPool = (basePayout * deductionPercent) / 100; 
      const workerNet = basePayout - totalDedPool;
      await addTransaction(targetUserId, workerNet, 'Credit', 'Daily', `Released Work Payout: ${order.billNumber} (${order.type})`, order.id);
      
      const targetUser = systemUsers.find(u => u.id === targetUserId);
      let currUplineId = targetUser?.uplineId;
      
      for (let i = 0; i < 10; i++) {
          if (!currUplineId) break;
          const upline = systemUsers.find(u => u.id === currUplineId);
          if (!upline) break;
          const levelRate = config.levelDistributionRates[i] || 0; 
          const grossShare = (totalDedPool * levelRate) / 100;
          if (grossShare > 0) {
              const magicTax = (grossShare * 20) / 100;
              const netWalletIncome = grossShare - magicTax;
              await addTransaction(upline.id, netWalletIncome, 'Credit', 'Downline', `L${i+1} Income (Net 80%) from ${targetUser?.name}`, order.id, targetUserId, `L${i+1}`);
              await distributeMagicRewards(upline.id, magicTax, order.id, targetUserId);
          }
          currUplineId = upline.uplineId;
      }
  }, [config, systemUsers, addTransaction, distributeMagicRewards]);

  const confirmHandover = useCallback(async (orderId: string) => {
      const order = orders.find(o => o.id === orderId);
      if (!order || !currentUser) return false;
      const updates: any = { handoverStatus: 'Accepted', folder: 'Save', lastUpdated: new Date().toISOString() };
      
      if (order.previousWorkerId) {
          const prevWorker = systemUsers.find(u => u.id === order.previousWorkerId);
          if (prevWorker && prevWorker.role !== UserRole.ADMIN) {
              let searchKeyword = order.type;
              let roleKeyword = "";
              if (prevWorker.role === UserRole.MEASUREMENT) roleKeyword = "Measurement";
              else if (prevWorker.role === UserRole.CUTTING) roleKeyword = "Cutting";
              else if (prevWorker.role === UserRole.SHIRT_MAKER || prevWorker.role === UserRole.PANT_MAKER || prevWorker.role === UserRole.COAT_MAKER) roleKeyword = "Maker";
              else if (prevWorker.role === UserRole.FINISHING) roleKeyword = "Button";
              else if (prevWorker.role === UserRole.PRESS) roleKeyword = "Press";

              const rateObj = stitchingRates.find(r => r.type.toLowerCase().includes(searchKeyword.toLowerCase()) && (roleKeyword ? r.type.toLowerCase().includes(roleKeyword.toLowerCase()) : true));
              let basePayout = 0;
              const q = order.quality?.toLowerCase() || 'regular';
              
              if (rateObj) {
                  let rawRate = 0;
                  if (q === 'normal') rawRate = rateObj.normal;
                  else if (q === 'medium') rawRate = rateObj.medium;
                  else if (q === 'regular') rawRate = rateObj.regular;
                  else if (q === 'vip') rawRate = rateObj.vip;
                  if (rateObj.rateType === 'Percentage') basePayout = (order.price * rawRate) / 100;
                  else basePayout = rawRate;
                  await distributeNetworkRewards(prevWorker.id, basePayout, order);
              }
          }
      }
      
      if (!order.isPaid && currentUser.role === UserRole.CUTTING) {
          updates.isPaid = true;
      }
      
      if (isDemoMode) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
      else await updateDoc(doc(db!, 'orders', orderId), updates);
      return true;
  }, [orders, currentUser, stitchingRates, distributeNetworkRewards, isDemoMode, addTransaction, systemUsers]);

  const moveOrder = useCallback(async (orderId: string, folder: any, nextWorkerId?: string, nextStage?: OrderStage, codAmount?: number) => {
    const isSending = folder === 'Inbox';
    const finalFolder = nextStage === OrderStage.DELIVERED ? 'Completed' : folder;
    
    const updates: any = { 
        folder: finalFolder, 
        assignedWorker: nextWorkerId || currentUser?.id, 
        lastUpdated: new Date().toISOString(), 
        stage: nextStage || OrderStage.ORDER_PLACED, 
        handoverStatus: isSending ? 'Pending' : 'Accepted', 
        previousWorker: currentUser?.name || 'System', 
        previousWorkerId: currentUser?.id 
    };
    
    if (nextWorkerId) { 
        const order = orders.find(o => o.id === orderId); 
        updates.workerHistory = Array.from(new Set([...(order?.workerHistory || []), nextWorkerId])); 
    }
    
    if (codAmount && codAmount > 0 && nextStage === OrderStage.DELIVERED) {
        const order = orders.find(o => o.id === orderId);
        await addTransaction(order?.creatorId || 'LBT-ADMIN', codAmount, 'Credit', 'Booking', `COD Collection: ${order?.billNumber}`, orderId);
    }

    if (isDemoMode) setOrders(prev => prev.map(o => o.id === orderId ? {...o, ...updates} : o)); 
    else await updateDoc(doc(db!, 'orders', orderId), updates);
  }, [isDemoMode, orders, currentUser, addTransaction]);

  const saveMeasurements = useCallback(async (orderId: string, data: MeasurementData, updatedPrice: number) => {
    const updateData = { measurements: data, price: updatedPrice, lastUpdated: new Date().toISOString() };
    if (isDemoMode) setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updateData } : o));
    else await updateDoc(doc(db!, 'orders', orderId), updateData);
  }, [isDemoMode]);

  const addCustomer = useCallback(async (customer: Customer, orderType: string, price: number, assignedWorker?: string, quality?: any, creatorId?: string) => {
    const newOrder: Order = { 
        id: `o${Date.now()}`, 
        customerId: customer.id, 
        customerName: customer.name, 
        billNumber: customer.billNumber, 
        type: orderType, 
        stage: OrderStage.ORDER_PLACED, 
        createdAt: new Date().toISOString(), 
        lastUpdated: new Date().toISOString(), 
        price: Number(price), // Ensure number 
        quality: quality || 'Regular', 
        createdBy: assignedWorker || 'Admin', 
        creatorId: creatorId || 'LBT-ADMIN', 
        folder: 'Self', 
        assignedWorker: creatorId || 'LBT-ADMIN', 
        handoverStatus: 'Accepted', 
        securityCode: Math.floor(1000 + Math.random() * 9000).toString(), 
        workerHistory: [creatorId || 'LBT-ADMIN'], 
        isPaid: false 
    };
    
    // Safety check for undefined fields which crash Firestore
    const cleanCustomer = JSON.parse(JSON.stringify(customer));
    const cleanOrder = JSON.parse(JSON.stringify(newOrder));

    try {
        if (isDemoMode) { 
            setCustomers(prev => [...prev, cleanCustomer]); 
            setOrders(prev => [...prev, cleanOrder]); 
            return true;
        } else if (db) { 
            const batch = writeBatch(db);
            const custRef = doc(db, 'customers', customer.id);
            const orderRef = doc(db, 'orders', newOrder.id);
            
            batch.set(custRef, cleanCustomer);
            batch.set(orderRef, cleanOrder);
            
            await batch.commit();
            return true;
        }
        return false;
    } catch (e) {
        console.error("Firebase Add Error:", e);
        return false;
    }
  }, [isDemoMode]);

  const addOrder = useCallback(async (order: Order) => {
      try {
          // Safety Check
          const cleanOrder = JSON.parse(JSON.stringify(order));
          if (isDemoMode) setOrders(prev => [...prev, cleanOrder]);
          else if(db) await setDoc(doc(db, 'orders', order.id), cleanOrder);
      } catch (e) {
          console.error("Add Order Failed:", e);
          throw e; 
      }
  }, [isDemoMode]);

  const deleteOrder = useCallback(async (orderId: string) => {
      if (isDemoMode) setOrders(prev => prev.filter(o => o.id !== orderId));
      else await deleteDoc(doc(db!, 'orders', orderId));
  }, [isDemoMode]);

  const authenticateUser = useCallback((mobile: string, password: string) => systemUsers.find(u => u.mobile === mobile && u.loginPassword === password) || null, [systemUsers]);
  const loginUser = useCallback((selectedRole: UserRole, specificUserId?: string) => {
     let user = specificUserId ? systemUsers.find(u => u.id === specificUserId) : systemUsers.find(u => u.role === selectedRole);
     if (user) { setCurrentUser(user); setRole(user.role); }
  }, [systemUsers]);

  const autoRegister = useCallback((name: string, mobile: string, role: UserRole, uplineId: string) => {
      const id = `LBT-${Math.floor(1000 + Math.random() * 9000)}`;
      const password = Math.floor(100000 + Math.random() * 900000).toString();
      const newUser: SystemUser = { id, name, role, mobile, status: 'Active', joinDate: new Date().toISOString().split('T')[0], uplineId, magicUplineId: uplineId, loginPassword: password, canWithdraw: true };
      if (isDemoMode) setSystemUsers(prev => [...prev, newUser]); 
      else setDoc(doc(db!, 'system_users', newUser.id), newUser);
      return { id, password };
  }, [isDemoMode]);

  const updateConfig = useCallback(async (updates: Partial<AppConfig>) => { if (isDemoMode) setConfig(prev => ({...prev, ...updates})); else await setDoc(doc(db!, 'app_config', 'settings'), { ...config, ...updates }); }, [config, isDemoMode]);
  
  const updateStitchingRates = useCallback(async (newRates: StitchingRate[]) => { 
      if (isDemoMode) setStitchingRates(newRates); 
      else { 
          const batch = writeBatch(db!); 
          newRates.forEach(r => batch.set(doc(db!, 'stitching_rates', r.id), r)); 
          await batch.commit(); 
      } 
  }, [isDemoMode]);

  const updateSystemUser = useCallback(async (id: string, updates: Partial<SystemUser>) => {
      if (isDemoMode) setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      else await updateDoc(doc(db!, 'system_users', id), updates);
  }, [isDemoMode]);

  const releaseFundsManually = useCallback(async (userId: string, amount: number, walletType: string, description: string) => {
      return await addTransaction(userId, amount, 'Credit', walletType, description);
  }, [addTransaction]);

  const transferFunds = useCallback(async (recipientId: string, amount: number) => {
      if (!currentUser || amount > liveStats.bookingWallet) return false;
      const recipient = systemUsers.find(u => u.id === recipientId || u.mobile === recipientId);
      if (!recipient) return false;

      const debitSuccess = await addTransaction(currentUser.id, amount, 'Debit', 'Booking', `Transfer to ${recipient.name} (${recipient.id})`);
      if (debitSuccess) {
          await addTransaction(recipient.id, amount, 'Credit', 'Booking', `Transfer from ${currentUser.name} (${currentUser.id})`);
          return true;
      }
      return false;
  }, [currentUser, liveStats.bookingWallet, systemUsers, addTransaction]);

  const approveRequest = useCallback(async (reqId: string, approved: boolean) => {
    const status = approved ? 'APPROVED' : 'REJECTED';
    const req = requests.find(r => r.id === reqId);
    if (!req) return false;
    
    let transactionSuccess = true;

    if (approved) {
        let safeAmount = 0;
        if (typeof req.amount === 'number') {
            safeAmount = req.amount;
        } else if (typeof req.amount === 'string') {
            safeAmount = parseFloat((req.amount as string).replace(/[^0-9.-]+/g, ""));
        }

        if (isNaN(safeAmount) || safeAmount <= 0) {
            console.error("Approve Failed: Invalid Amount detected", req.amount);
            return false;
        }

        if (req.type === 'ADD_FUNDS') {
            transactionSuccess = await addTransaction(req.userId, safeAmount, 'Credit', 'Booking', `Admin Approved Fund Deposit: ${req.utr || 'Direct'}`);
        } else if (req.type === 'WITHDRAW') {
            transactionSuccess = await addTransaction(req.userId, safeAmount, 'Debit', 'Daily', `Admin Approved Withdrawal`);
        }
    }

    if (!transactionSuccess) return false;

    if (isDemoMode) { 
        setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r)); 
        return true; 
    } else { 
        try { 
            await updateDoc(doc(db!, 'requests', reqId), { status }); 
            return true; 
        } catch (e) { 
            console.error("Firestore Update Failed:", e);
            return false; 
        } 
    }
  }, [isDemoMode, requests, addTransaction]);

  const requestAddFunds = useCallback(async (amount: number, utr: string) => {
    if (isNaN(amount) || amount <= 0) return false;
    const newReq: TransactionRequest = { id: `REQ-${Date.now()}`, userId: currentUser?.id || '', userName: currentUser?.name || '', type: 'ADD_FUNDS', amount, status: 'PENDING', date: new Date().toISOString(), utr };
    try {
        if (isDemoMode) { setRequests(prev => [newReq, ...prev]); return true; }
        else { await setDoc(doc(db!, 'requests', newReq.id), newReq); return true; }
    } catch(e) { return false; }
  }, [currentUser, isDemoMode]);

  const requestWithdrawal = useCallback(async (amount: number, method: string, paymentDetails: string) => {
    if (isNaN(amount) || amount <= 0) return false;
    const newReq: TransactionRequest = { id: `REQ-${Date.now()}`, userId: currentUser?.id || '', userName: currentUser?.name || '', type: 'WITHDRAW', amount, status: 'PENDING', date: new Date().toISOString(), method, paymentDetails };
    try {
        if (isDemoMode) { setRequests(prev => [newReq, ...prev]); return true; }
        else { await setDoc(doc(db!, 'requests', newReq.id), newReq); return true; }
    } catch(e) { return false; }
  }, [currentUser, isDemoMode]);

  const investFunds = useCallback(async (amount: number, planName: string) => {
      if (!currentUser || amount > liveStats.bookingWallet) return false;
      const success = await addTransaction(currentUser.id, amount, 'Debit', 'Booking', `Investment Plan Activation: ${planName}`);
      return success;
  }, [currentUser, liveStats.bookingWallet, addTransaction]);

  const withdrawReturns = useCallback(async (amount: number) => {
      if (!currentUser) return false;
      return await addTransaction(currentUser.id, amount, 'Credit', 'Daily', `ROI Withdrawal to Main Wallet`);
  }, [currentUser, addTransaction]);

  const addMaterial = useCallback(async (m: Material) => {
      if (isDemoMode) setMaterials(prev => [...prev, m]);
      else await setDoc(doc(db!, 'materials', m.id), m);
  }, [isDemoMode]);

  const addGalleryItem = useCallback(async (item: Omit<GalleryItem, 'id' | 'code'>) => {
      const id = `gal-${Date.now()}`;
      const newItem: GalleryItem = { ...item, id, code: `LB-${Math.floor(1000 + Math.random() * 9000)}` };
      if (isDemoMode) setGalleryItems(prev => [...prev, newItem]);
      else await setDoc(doc(db!, 'gallery_items', id), newItem);
  }, [isDemoMode]);

  const deleteGalleryItem = useCallback(async (id: string) => {
      if (isDemoMode) setGalleryItems(prev => prev.filter(i => i.id !== id));
      else await deleteDoc(doc(db!, 'gallery_items', id));
  }, [isDemoMode]);

  const resetDatabase = useCallback(async () => {
    if (isDemoMode) { setOrders([]); setCustomers([]); setTransactions([]); setRequests([]); return; }
    const collections = ['orders', 'customers', 'transactions', 'requests', 'system_logs', 'materials', 'gallery_items'];
    for (const col of collections) {
        const snap = await getDocs(collection(db!, col));
        const batch = writeBatch(db!);
        snap.forEach(d => batch.delete(d.ref));
        await batch.commit();
    }
  }, [isDemoMode]);

  const value = useMemo(() => ({ 
      role, setRole, loginUser, authenticateUser, currentUser, registerUser: (u: any) => {}, autoRegister, orders, customers, materials, galleryItems, systemUsers, logs, stats: liveStats, investment: { invested: 0, totalEarnings: 0, totalWithdrawn: 0, activePlans: [] }, config, rates, stitchingRates, transactions, requests, updateOrderStage: (id: string, s: OrderStage) => moveOrder(id, 'Save', undefined, s), addCustomer, addOrder, addMaterial, moveOrder, confirmHandover, saveMeasurements, deleteOrder, investFunds, withdrawReturns, transferFunds, updateConfig, updateRates: (r: any) => {}, updateStitchingRates, addGalleryItem, deleteGalleryItem, updateSystemUser, resetSystemIDs: () => {}, resetDatabase, addFrequentWorker: (id: any) => {}, getDashboardStats: () => liveStats, getWalletHistory: (t: any) => transactions.filter(tx => tx.userId === currentUser?.id && (t === 'Total' || tx.walletType === t)).sort((a,b) => b.date.localeCompare(a.date)), requestAddFunds, requestWithdrawal, requestJoin: (n: any, m: any, r: any, u: any) => {}, approveRequest, releaseFundsManually, addLog, seedDatabase, isDemoMode 
  }), [role, currentUser, orders, customers, materials, galleryItems, systemUsers, logs, liveStats, config, rates, stitchingRates, transactions, requests, loginUser, authenticateUser, autoRegister, addCustomer, addOrder, moveOrder, confirmHandover, saveMeasurements, deleteOrder, updateConfig, updateStitchingRates, addGalleryItem, deleteGalleryItem, approveRequest, addLog, seedDatabase, isDemoMode, resetDatabase, requestAddFunds, requestWithdrawal, updateSystemUser, releaseFundsManually, transferFunds, investFunds, withdrawReturns, addMaterial]);
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useApp = () => { const context = useContext(AppContext); if (!context) throw new Error('useApp must be used within AppProvider'); return context; };
