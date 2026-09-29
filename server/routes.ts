import { Router, Request, Response } from 'express';
import { db } from './db.ts';
import { getAiCropRecommendations, getAiPestDiagnosis } from './gemini.ts';
import { UserRole } from '../src/types/index.ts';

export const apiRouter = Router();

// Helper for standardized API responses
function sendSuccess<T>(res: Response, message: string, data?: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res: Response, message: string, statusCode = 400, error?: any) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error || message,
  });
}

// -------------------------------------------------------------
// AUTHENTICATION & RBAC
// -------------------------------------------------------------
let currentUser = db.users[0]; // Default to Ramesh Patel (FARMER)

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  return sendSuccess(res, 'Active user session retrieved', currentUser);
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  const user = db.users.find((u) => u.email === email || (role && u.role === role));
  if (!user) {
    return sendError(res, 'User with these credentials not found', 404);
  }
  if (user.status === 'SUSPENDED') {
    return sendError(res, 'This account has been suspended by system administrators', 403);
  }
  currentUser = user;
  db.addAuditLog({
    userId: user.id,
    userName: user.name,
    action: 'USER_LOGIN',
    module: 'AUTH',
    details: `User logged in with role ${user.role}`,
    ipAddress: req.ip || '127.0.0.1',
    result: 'SUCCESS'
  });
  return sendSuccess(res, `Welcome back, ${user.name}! Logged in as ${user.role}`, user);
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role, location, farmDetails } = req.body;
  if (!name || !email || !role) {
    return sendError(res, 'Name, email, and role are required', 422);
  }
  const existing = db.users.find((u) => u.email === email);
  if (existing) {
    return sendError(res, 'A user with this email address already exists', 409);
  }
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone: phone || '+91 99999 00000',
    role: role as UserRole,
    location: location || 'Punjab, India',
    isVerified: role === 'FARMER' ? true : false,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    farmDetails: role === 'FARMER' ? farmDetails : undefined
  };
  db.users.push(newUser);
  currentUser = newUser;
  db.addAuditLog({
    userId: newUser.id,
    userName: newUser.name,
    action: 'USER_REGISTRATION',
    module: 'AUTH',
    details: `New account registered as ${newUser.role}`,
    ipAddress: req.ip || '127.0.0.1',
    result: 'SUCCESS'
  });
  return sendSuccess(res, 'Account created successfully', newUser, 201);
});

apiRouter.post('/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const targetUser = db.users.find((u) => u.role === role);
  if (!targetUser) {
    return sendError(res, `No demo user found for role ${role}`, 404);
  }
  currentUser = targetUser;
  return sendSuccess(res, `Switched persona to ${targetUser.name} (${targetUser.role})`, targetUser);
});

apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const updates = req.body;
  Object.assign(currentUser, updates);
  return sendSuccess(res, 'Profile updated successfully', currentUser);
});

// -------------------------------------------------------------
// FARM & CROP FIELDS MANAGEMENT
// -------------------------------------------------------------
apiRouter.get('/farms', (req: Request, res: Response) => {
  const userFarms = db.farms.filter((f) => f.farmerId === currentUser.id);
  // If user has no farm yet, return the default farm for demonstration
  return sendSuccess(res, 'Farms retrieved', userFarms.length > 0 ? userFarms : db.farms);
});

apiRouter.post('/farms', (req: Request, res: Response) => {
  const { name, location, totalAreaAcres, soilType, irrigationType } = req.body;
  const newFarm = {
    id: `farm-${Date.now()}`,
    farmerId: currentUser.id,
    name: name || `${currentUser.name}'s Farm`,
    location: location || currentUser.location,
    totalAreaAcres: Number(totalAreaAcres) || 10,
    soilType: soilType || 'Alluvial',
    irrigationType: irrigationType || 'Drip',
    activeCrops: []
  };
  db.farms.push(newFarm);
  return sendSuccess(res, 'New farm registered', newFarm, 201);
});

apiRouter.post('/farms/:farmId/fields', (req: Request, res: Response) => {
  const { farmId } = req.params;
  const farm = db.farms.find((f) => f.id === farmId);
  if (!farm) return sendError(res, 'Farm not found', 404);

  const { fieldName, cropName, variety, sownDate, expectedHarvestDate, areaAcres, stage } = req.body;
  const newField = {
    id: `field-${Date.now()}`,
    farmId,
    fieldName: fieldName || 'New Field Zone',
    cropName: cropName || 'Wheat',
    variety: variety || 'Standard',
    sownDate: sownDate || new Date().toISOString().split('T')[0],
    expectedHarvestDate: expectedHarvestDate || '2026-12-15',
    areaAcres: Number(areaAcres) || 4,
    stage: stage || 'Vegetative',
    healthScore: 92,
    soilMoisturePercent: 55,
    targetYieldTons: 12
  };
  farm.activeCrops.push(newField);
  return sendSuccess(res, 'Field zone added to farm', newField, 201);
});

// -------------------------------------------------------------
// AI CROP RECOMMENDATION & PEST DIAGNOSTICS
// -------------------------------------------------------------
apiRouter.post('/ai/crop-recommendation', async (req: Request, res: Response) => {
  try {
    const input = req.body;
    const recommendations = await getAiCropRecommendations(input);
    db.addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'RUN_AI_CROP_RECOMMENDATION',
      module: 'AI_ADVISORY',
      details: `Generated AI crop recommendations for ${input.location} (${input.soilType} soil, pH ${input.soilPh})`,
      ipAddress: req.ip || '127.0.0.1',
      result: 'SUCCESS'
    });
    return sendSuccess(res, 'Crop recommendations computed successfully', recommendations);
  } catch (err: any) {
    return sendError(res, 'Failed to generate recommendations', 500, err?.message);
  }
});

apiRouter.post('/ai/pest-diagnosis', async (req: Request, res: Response) => {
  try {
    const { crop, symptom, stage } = req.body;
    if (!crop || !symptom) {
      return sendError(res, 'Crop and symptoms are required for diagnosis', 422);
    }
    const result = await getAiPestDiagnosis(crop, symptom, stage || 'Vegetative');
    return sendSuccess(res, 'Pest & disease diagnosis computed', result);
  } catch (err: any) {
    return sendError(res, 'Pest diagnosis failed', 500, err?.message);
  }
});

// -------------------------------------------------------------
// WEATHER FORECAST & AGRICULTURAL ADVISORIES
// -------------------------------------------------------------
apiRouter.get('/weather', (req: Request, res: Response) => {
  return sendSuccess(res, 'Live agricultural weather telemetry retrieved', db.weather);
});

// -------------------------------------------------------------
// MARKET DEMAND & PRICE INTELLIGENCE
// -------------------------------------------------------------
apiRouter.get('/market/prices', (req: Request, res: Response) => {
  return sendSuccess(res, 'APMC mandi prices retrieved', db.marketPrices);
});

// -------------------------------------------------------------
// SMART IRRIGATION
// -------------------------------------------------------------
apiRouter.get('/irrigation/zones', (req: Request, res: Response) => {
  return sendSuccess(res, 'Irrigation zones retrieved', db.irrigationZones);
});

apiRouter.post('/irrigation/toggle', (req: Request, res: Response) => {
  const { zoneId } = req.body;
  const zone = db.irrigationZones.find((z) => z.id === zoneId);
  if (!zone) return sendError(res, 'Zone not found', 404);

  const nextStatus = zone.status === 'IRRIGATING' ? 'IDLE' : 'IRRIGATING';
  zone.status = nextStatus;
  if (nextStatus === 'IRRIGATING') {
    zone.lastWatered = 'Active Now (Started just now)';
    zone.totalWaterUsedTodayLiters += 350;
    zone.soilMoisture = Math.min(100, zone.soilMoisture + 15);
  }
  db.addNotification({
    userId: currentUser.id,
    type: 'IRRIGATION',
    title: `Irrigation ${nextStatus === 'IRRIGATING' ? 'Started' : 'Stopped'}`,
    message: `${zone.zoneName} valve has been set to ${nextStatus}`,
    linkTab: 'irrigation',
    read: false
  });
  return sendSuccess(res, `Irrigation valve is now ${nextStatus}`, zone);
});

apiRouter.post('/irrigation/mode', (req: Request, res: Response) => {
  const { zoneId } = req.body;
  const zone = db.irrigationZones.find((z) => z.id === zoneId);
  if (!zone) return sendError(res, 'Zone not found', 404);

  zone.mode = zone.mode === 'AUTOMATIC' ? 'MANUAL' : 'AUTOMATIC';
  return sendSuccess(res, `Zone mode updated to ${zone.mode}`, zone);
});

// -------------------------------------------------------------
// LABOUR HIRING MARKETPLACE
// -------------------------------------------------------------
apiRouter.get('/labour/workers', (req: Request, res: Response) => {
  return sendSuccess(res, 'Agricultural workers directory retrieved', db.labourWorkers);
});

apiRouter.get('/labour/bookings', (req: Request, res: Response) => {
  return sendSuccess(res, 'Labour bookings retrieved', db.labourBookings);
});

apiRouter.post('/labour/book', (req: Request, res: Response) => {
  const { workerId, jobRole, startDate, daysCount, farmLocation, specialInstructions } = req.body;
  const worker = db.labourWorkers.find((w) => w.id === workerId);
  if (!worker) return sendError(res, 'Worker not found', 404);

  const days = Number(daysCount) || 1;
  const totalCost = worker.dailyWage * days;

  const booking = {
    id: `lbook-${Date.now()}`,
    farmerId: currentUser.id,
    farmerName: currentUser.name,
    workerId: worker.id,
    workerName: worker.name,
    jobRole: jobRole || 'Field Labour',
    startDate: startDate || new Date().toISOString().split('T')[0],
    daysCount: days,
    totalCost,
    status: 'ACCEPTED' as const,
    farmLocation: farmLocation || 'Patel Bio-Farms, Ludhiana',
    specialInstructions,
    createdAt: new Date().toISOString()
  };

  db.labourBookings.unshift(booking);

  // Automatically record expense in finance ledger
  db.financialTransactions.unshift({
    id: `fin-${Date.now()}`,
    userId: currentUser.id,
    type: 'EXPENSE',
    category: 'Labour Wage',
    amount: totalCost,
    date: new Date().toISOString().split('T')[0],
    description: `Labour booking: ${worker.name} for ${jobRole} (${days} days)`,
    paymentMode: 'Cash'
  });

  // Notify farmer
  db.addNotification({
    userId: currentUser.id,
    type: 'LABOUR',
    title: 'Labour Confirmed!',
    message: `${worker.name} is booked for ${jobRole} starting ${booking.startDate}. Total ₹${totalCost}.`,
    linkTab: 'labour',
    read: false
  });

  return sendSuccess(res, `Worker ${worker.name} booked successfully!`, booking, 201);
});

apiRouter.put('/labour/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, ratingGiven } = req.body;
  const booking = db.labourBookings.find((b) => b.id === id);
  if (!booking) return sendError(res, 'Booking not found', 404);

  booking.status = status;
  if (ratingGiven) booking.ratingGiven = ratingGiven;
  return sendSuccess(res, `Booking status updated to ${status}`, booking);
});

// -------------------------------------------------------------
// AGRICULTURAL MACHINE RENTALS
// -------------------------------------------------------------
apiRouter.get('/machines', (req: Request, res: Response) => {
  return sendSuccess(res, 'Machinery fleet catalog retrieved', db.machines);
});

apiRouter.get('/machines/bookings', (req: Request, res: Response) => {
  return sendSuccess(res, 'Machine bookings retrieved', db.machineBookings);
});

apiRouter.post('/machines/book', (req: Request, res: Response) => {
  const { machineId, rentalDurationDays, startDate, location } = req.body;
  const machine = db.machines.find((m) => m.id === machineId);
  if (!machine) return sendError(res, 'Machine not found', 404);

  const days = Number(rentalDurationDays) || 1;
  const totalAmount = machine.ratePerDay * days;

  const booking = {
    id: `mbook-${Date.now()}`,
    machineId: machine.id,
    machineTitle: machine.title,
    farmerId: currentUser.id,
    farmerName: currentUser.name,
    rentalDurationDays: days,
    startDate: startDate || new Date().toISOString().split('T')[0],
    totalAmount,
    status: 'APPROVED' as const,
    location: location || 'Patel Bio-Farms, Ludhiana',
    createdAt: new Date().toISOString()
  };

  db.machineBookings.unshift(booking);

  // Record finance expense
  db.financialTransactions.unshift({
    id: `fin-${Date.now()}`,
    userId: currentUser.id,
    type: 'EXPENSE',
    category: 'Machinery Rent',
    amount: totalAmount,
    date: new Date().toISOString().split('T')[0],
    description: `Equipment rental: ${machine.title} for ${days} days`,
    paymentMode: 'Bank Transfer'
  });

  db.addNotification({
    userId: currentUser.id,
    type: 'MACHINE',
    title: 'Equipment Rental Approved',
    message: `${machine.title} rental booked starting ${booking.startDate}. Total ₹${totalAmount}.`,
    linkTab: 'machines',
    read: false
  });

  return sendSuccess(res, `Machine ${machine.title} booked successfully`, booking, 201);
});

// -------------------------------------------------------------
// SEEDS & FERTILIZERS STORE
// -------------------------------------------------------------
apiRouter.get('/store/products', (req: Request, res: Response) => {
  return sendSuccess(res, 'Store inventory retrieved', db.products);
});

apiRouter.get('/store/orders', (req: Request, res: Response) => {
  return sendSuccess(res, 'Store orders retrieved', db.storeOrders);
});

apiRouter.post('/store/order', (req: Request, res: Response) => {
  const { items, deliveryAddress, paymentMethod } = req.body;
  if (!items || !items.length) {
    return sendError(res, 'Cart is empty', 422);
  }

  let totalAmount = 0;
  const orderItems = items.map((item: any) => {
    const product = db.products.find((p) => p.id === item.productId);
    const qty = Number(item.quantity) || 1;
    const price = product ? product.price : 500;
    totalAmount += price * qty;
    if (product) {
      product.stockQuantity = Math.max(0, product.stockQuantity - qty);
    }
    return {
      productId: item.productId,
      productName: product ? product.name : 'Agri Product',
      price,
      quantity: qty,
      unit: product ? product.unit : 'unit'
    };
  });

  const order = {
    id: `sord-${Date.now()}`,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    items: orderItems,
    totalAmount,
    deliveryAddress: deliveryAddress || 'Patel Bio-Farms, Ludhiana North, Punjab',
    status: 'CONFIRMED' as const,
    paymentMethod: paymentMethod || 'UPI / RuPay Kisan Card',
    createdAt: new Date().toISOString()
  };

  db.storeOrders.unshift(order);

  // Financial expense entry
  db.financialTransactions.unshift({
    id: `fin-${Date.now()}`,
    userId: currentUser.id,
    type: 'EXPENSE',
    category: 'Fertilizer',
    amount: totalAmount,
    date: new Date().toISOString().split('T')[0],
    description: `Agri store order #${order.id} (${orderItems.length} items)`,
    paymentMode: 'UPI / Digital'
  });

  db.addNotification({
    userId: currentUser.id,
    type: 'ORDER',
    title: 'Store Order Confirmed!',
    message: `Order #${order.id} placed for ₹${totalAmount}. Dispatch in 24 hours.`,
    linkTab: 'store',
    read: false
  });

  return sendSuccess(res, 'Store order placed successfully', order, 201);
});

apiRouter.post('/store/products', (req: Request, res: Response) => {
  const { name, category, brand, price, mrp, unit, stockQuantity, description, certifications } = req.body;
  const newProd = {
    id: `prod-${Date.now()}`,
    name,
    category: category || 'Seeds',
    brand: brand || 'National Agro',
    price: Number(price) || 500,
    mrp: Number(mrp) || 600,
    unit: unit || '10kg bag',
    stockQuantity: Number(stockQuantity) || 50,
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&auto=format&fit=crop',
    description: description || 'Premium certified agricultural input',
    certifications: certifications || ['Govt Approved', 'Organic Grade']
  };
  db.products.push(newProd);
  return sendSuccess(res, 'New product added to store', newProd, 201);
});

// -------------------------------------------------------------
// CROP MARKETPLACE (FARMER TO BUYER)
// -------------------------------------------------------------
apiRouter.get('/marketplace/listings', (req: Request, res: Response) => {
  return sendSuccess(res, 'Crop marketplace listings retrieved', db.cropListings);
});

apiRouter.post('/marketplace/listings', (req: Request, res: Response) => {
  const { cropName, variety, grade, quantityQuintals, pricePerQuintal, location, harvestDate, imageUrl } = req.body;
  if (!cropName || !quantityQuintals || !pricePerQuintal) {
    return sendError(res, 'Crop name, quantity, and price per quintal are required', 422);
  }

  const newListing = {
    id: `clist-${Date.now()}`,
    farmerId: currentUser.id,
    farmerName: currentUser.name,
    farmerPhone: currentUser.phone,
    cropName,
    variety: variety || 'Standard High Yield',
    grade: grade || 'Grade A+',
    quantityQuintals: Number(quantityQuintals),
    pricePerQuintal: Number(pricePerQuintal),
    location: location || currentUser.location,
    harvestDate: harvestDate || new Date().toISOString().split('T')[0],
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop',
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString()
  };

  db.cropListings.unshift(newListing);
  db.addAuditLog({
    userId: currentUser.id,
    userName: currentUser.name,
    action: 'CREATE_CROP_LISTING',
    module: 'MARKETPLACE',
    details: `Listed ${newListing.quantityQuintals}Q of ${newListing.cropName} at ₹${newListing.pricePerQuintal}/Q`,
    ipAddress: req.ip || '127.0.0.1',
    result: 'SUCCESS'
  });

  return sendSuccess(res, 'Crop listed on marketplace for buyers!', newListing, 201);
});

apiRouter.get('/marketplace/orders', (req: Request, res: Response) => {
  return sendSuccess(res, 'Marketplace crop orders retrieved', db.cropOrders);
});

apiRouter.post('/marketplace/order', (req: Request, res: Response) => {
  const { listingId, quantityQuintals, deliveryLocation, offeredPrice } = req.body;
  const listing = db.cropListings.find((l) => l.id === listingId);
  if (!listing) return sendError(res, 'Listing not found', 404);

  const qty = Number(quantityQuintals) || listing.quantityQuintals;
  const price = Number(offeredPrice) || listing.pricePerQuintal;
  const totalAmount = qty * price;

  const order = {
    id: `cord-${Date.now()}`,
    listingId: listing.id,
    cropName: `${listing.cropName} (${listing.variety})`,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    buyerCompany: currentUser.name,
    farmerId: listing.farmerId,
    farmerName: listing.farmerName,
    quantityQuintals: qty,
    agreedPricePerQuintal: price,
    totalAmount,
    deliveryLocation: deliveryLocation || 'Chandigarh APMC Processing Yard',
    status: 'CONFIRMED' as const,
    createdAt: new Date().toISOString()
  };

  db.cropOrders.unshift(order);

  // Income entry for the farmer
  db.financialTransactions.unshift({
    id: `fin-${Date.now()}`,
    userId: listing.farmerId,
    type: 'INCOME',
    category: 'Crop Sale',
    amount: totalAmount,
    date: new Date().toISOString().split('T')[0],
    description: `Marketplace contract: ${qty}Q ${listing.cropName} to ${currentUser.name}`,
    relatedCrop: listing.cropName,
    paymentMode: 'Bank Transfer'
  });

  db.addNotification({
    userId: listing.farmerId,
    type: 'ORDER',
    title: 'New Crop Purchase Order!',
    message: `${currentUser.name} purchased ${qty}Q of ${listing.cropName} for ₹${totalAmount}.`,
    linkTab: 'marketplace',
    read: false
  });

  return sendSuccess(res, 'Crop order created successfully! Transport can now be booked.', order, 201);
});

// -------------------------------------------------------------
// AGRICULTURAL FREIGHT & TRANSPORT BOOKING
// -------------------------------------------------------------
apiRouter.get('/transport/vehicles', (req: Request, res: Response) => {
  return sendSuccess(res, 'Transport fleet retrieved', db.transportVehicles);
});

apiRouter.get('/transport/bookings', (req: Request, res: Response) => {
  return sendSuccess(res, 'Transport bookings retrieved', db.transportBookings);
});

apiRouter.post('/transport/book', (req: Request, res: Response) => {
  const { vehicleId, pickupLocation, dropLocation, cropName, tonnage, pickupDate, distanceKm } = req.body;
  const vehicle = db.transportVehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return sendError(res, 'Vehicle not found', 404);

  const km = Number(distanceKm) || 75;
  const totalFare = km * vehicle.ratePerKm;

  const booking = {
    id: `tbook-${Date.now()}`,
    farmerId: currentUser.id,
    farmerName: currentUser.name,
    vehicleId: vehicle.id,
    providerName: vehicle.providerName,
    pickupLocation: pickupLocation || 'Patel Bio-Farms, Ludhiana North',
    dropLocation: dropLocation || 'Chandigarh APMC Processing Unit',
    cropName: cropName || 'Fresh Harvest Produce',
    tonnage: Number(tonnage) || 5,
    pickupDate: pickupDate || new Date().toISOString().split('T')[0],
    distanceKm: km,
    totalFare,
    driverName: 'Harbhajan Singh',
    driverPhone: vehicle.providerPhone,
    vehicleNumber: vehicle.vehicleNumber,
    status: 'BOOKED' as const,
    liveStep: 0,
    createdAt: new Date().toISOString()
  };

  db.transportBookings.unshift(booking);

  // Financial expense entry
  db.financialTransactions.unshift({
    id: `fin-${Date.now()}`,
    userId: currentUser.id,
    type: 'EXPENSE',
    category: 'Transport',
    amount: totalFare,
    date: new Date().toISOString().split('T')[0],
    description: `Transport booking: ${vehicle.vehicleType} (${km} km)`,
    paymentMode: 'UPI / Digital'
  });

  db.addNotification({
    userId: currentUser.id,
    type: 'TRANSPORT',
    title: 'Transport Booked',
    message: `${vehicle.providerName} carrier assigned. Estimated fare: ₹${totalFare}.`,
    linkTab: 'transport',
    read: false
  });

  return sendSuccess(res, 'Transport booked successfully!', booking, 201);
});

apiRouter.post('/transport/bookings/:id/step', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = db.transportBookings.find((b) => b.id === id);
  if (!booking) return sendError(res, 'Transport booking not found', 404);

  const steps: ('BOOKED' | 'DRIVER_EN_ROUTE' | 'LOADED' | 'IN_TRANSIT' | 'DELIVERED')[] = [
    'BOOKED',
    'DRIVER_EN_ROUTE',
    'LOADED',
    'IN_TRANSIT',
    'DELIVERED'
  ];

  booking.liveStep = Math.min(steps.length - 1, (booking.liveStep ?? 0) + 1);
  booking.status = steps[booking.liveStep];

  return sendSuccess(res, `Transit updated: ${booking.status}`, booking);
});

// -------------------------------------------------------------
// FINANCIAL DASHBOARD & LEDGER
// -------------------------------------------------------------
apiRouter.get('/finance/summary', (req: Request, res: Response) => {
  const userTx = db.financialTransactions.filter((t) => t.userId === currentUser.id);
  const totalIncome = userTx.filter((t) => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = userTx.filter((t) => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMarginPercent = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const monthlyTrend = [
    { month: 'Jun', income: 45000, expense: 22000, profit: 23000 },
    { month: 'Jul', income: 72000, expense: 31000, profit: 41000 },
    { month: 'Aug', income: 98000, expense: 42000, profit: 56000 },
    { month: 'Sep', income: totalIncome, expense: totalExpense, profit: netProfit }
  ];

  const cropBreakdown = [
    { cropName: 'Tomato', revenue: 168000, cost: 21406, net: 146594 },
    { cropName: 'Wheat', revenue: 95000, cost: 18200, net: 76800 },
    { cropName: 'Mustard', revenue: 38000, cost: 8400, net: 29600 }
  ];

  return sendSuccess(res, 'Financial analytics compiled', {
    totalIncome,
    totalExpense,
    netProfit,
    profitMarginPercent,
    monthlyTrend,
    cropBreakdown
  });
});

apiRouter.get('/finance/transactions', (req: Request, res: Response) => {
  const userTx = db.financialTransactions.filter((t) => t.userId === currentUser.id);
  return sendSuccess(res, 'Financial transactions retrieved', userTx.length > 0 ? userTx : db.financialTransactions);
});

apiRouter.post('/finance/transactions', (req: Request, res: Response) => {
  const { type, category, amount, description, relatedCrop, paymentMode } = req.body;
  if (!type || !category || !amount) {
    return sendError(res, 'Type, category, and amount are required', 422);
  }

  const newTx = {
    id: `fin-${Date.now()}`,
    userId: currentUser.id,
    type: type as 'INCOME' | 'EXPENSE',
    category,
    amount: Number(amount),
    date: new Date().toISOString().split('T')[0],
    description: description || `${type} entry`,
    relatedCrop,
    paymentMode: paymentMode || 'UPI / Digital'
  };

  db.financialTransactions.unshift(newTx);
  return sendSuccess(res, 'Transaction recorded in financial ledger', newTx, 201);
});

// -------------------------------------------------------------
// COMMUNITY FORUM
// -------------------------------------------------------------
apiRouter.get('/community/posts', (req: Request, res: Response) => {
  return sendSuccess(res, 'Community posts retrieved', db.communityPosts);
});

apiRouter.post('/community/posts', (req: Request, res: Response) => {
  const { title, content, category } = req.body;
  if (!title || !content) return sendError(res, 'Title and content are required', 422);

  const newPost = {
    id: `post-${Date.now()}`,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorRole: currentUser.role,
    authorLocation: currentUser.location,
    category: category || 'General',
    title,
    content,
    likesCount: 0,
    isLikedByUser: false,
    repliesCount: 0,
    createdAt: new Date().toISOString(),
    comments: []
  };

  db.communityPosts.unshift(newPost);
  return sendSuccess(res, 'Discussion post published to community', newPost, 201);
});

apiRouter.post('/community/posts/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const post = db.communityPosts.find((p) => p.id === id);
  if (!post) return sendError(res, 'Post not found', 404);

  post.isLikedByUser = !post.isLikedByUser;
  post.likesCount += post.isLikedByUser ? 1 : -1;
  return sendSuccess(res, 'Post like toggled', { likesCount: post.likesCount, isLikedByUser: post.isLikedByUser });
});

apiRouter.post('/community/posts/:id/comment', (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) return sendError(res, 'Comment text is required', 422);

  const post = db.communityPosts.find((p) => p.id === id);
  if (!post) return sendError(res, 'Post not found', 404);

  const newComment = {
    id: `c-${Date.now()}`,
    postId: id,
    authorName: currentUser.name,
    authorRole: currentUser.role,
    content,
    isExpert: currentUser.role === 'ADMIN',
    createdAt: new Date().toISOString()
  };

  post.comments.push(newComment);
  post.repliesCount = post.comments.length;
  return sendSuccess(res, 'Comment posted', newComment, 201);
});

// -------------------------------------------------------------
// NOTIFICATIONS
// -------------------------------------------------------------
apiRouter.get('/notifications', (req: Request, res: Response) => {
  return sendSuccess(res, 'Notifications retrieved', db.notifications);
});

apiRouter.put('/notifications/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) notif.read = true;
  return sendSuccess(res, 'Notification marked as read', notif);
});

apiRouter.put('/notifications/read-all', (req: Request, res: Response) => {
  db.notifications.forEach((n) => (n.read = true));
  return sendSuccess(res, 'All notifications marked as read');
});

// -------------------------------------------------------------
// ADMIN DASHBOARD & AUDIT LOGS
// -------------------------------------------------------------
apiRouter.get('/admin/metrics', (req: Request, res: Response) => {
  const totalUsers = db.users.length;
  const farmersCount = db.users.filter((u) => u.role === 'FARMER').length;
  const workersCount = db.users.filter((u) => u.role === 'WORKER').length;
  const buyersCount = db.users.filter((u) => u.role === 'BUYER').length;
  const transportCount = db.users.filter((u) => u.role === 'TRANSPORT').length;
  const storeCount = db.users.filter((u) => u.role === 'STORE_OWNER').length;
  const machineCount = db.users.filter((u) => u.role === 'MACHINE_OWNER').length;

  const totalGMV = db.cropOrders.reduce((sum, o) => sum + o.totalAmount, 0) +
                   db.storeOrders.reduce((sum, o) => sum + o.totalAmount, 0) +
                   db.machineBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return sendSuccess(res, 'Admin analytics metrics compiled', {
    totalUsers,
    farmersCount,
    workersCount,
    buyersCount,
    transportCount,
    storeCount,
    machineCount,
    totalCropListings: db.cropListings.length,
    totalCropOrders: db.cropOrders.length,
    totalStoreOrders: db.storeOrders.length,
    totalMachineBookings: db.machineBookings.length,
    totalLabourBookings: db.labourBookings.length,
    totalTransportBookings: db.transportBookings.length,
    totalGMV
  });
});

apiRouter.get('/admin/users', (req: Request, res: Response) => {
  return sendSuccess(res, 'All ecosystem users retrieved', db.users);
});

apiRouter.put('/admin/users/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, isVerified } = req.body;
  const user = db.users.find((u) => u.id === id);
  if (!user) return sendError(res, 'User not found', 404);

  if (status) user.status = status;
  if (isVerified !== undefined) user.isVerified = isVerified;

  db.addAuditLog({
    userId: currentUser.id,
    userName: currentUser.name,
    action: status === 'SUSPENDED' ? 'SUSPEND_USER' : 'VERIFY_USER_KYC',
    module: 'USER_MANAGEMENT',
    details: `Updated user ${user.name} (${user.id}) status=${user.status}, verified=${user.isVerified}`,
    ipAddress: req.ip || '127.0.0.1',
    result: 'SUCCESS'
  });

  return sendSuccess(res, `User ${user.name} updated`, user);
});

apiRouter.get('/admin/audit-logs', (req: Request, res: Response) => {
  return sendSuccess(res, 'Security audit logs retrieved', db.auditLogs);
});
