export type UserRole = 
  | 'FARMER' 
  | 'ADMIN' 
  | 'WORKER' 
  | 'TRANSPORT' 
  | 'BUYER' 
  | 'STORE_OWNER' 
  | 'MACHINE_OWNER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  location: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  createdAt: string;
  farmDetails?: {
    farmName: string;
    totalAcres: number;
    primaryCrops: string[];
    soilType: string;
    irrigationType: string;
  };
  workerDetails?: {
    skills: string[];
    dailyRate: number;
    rating: number;
    completedJobs: number;
    availability: 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';
  };
  transportDetails?: {
    vehicleType: string;
    vehicleNumber: string;
    capacityTons: number;
    baseRatePerKm: number;
  };
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  location: string;
  totalAreaAcres: number;
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Clay' | 'Loamy' | 'Sandy';
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal / Flood' | 'Rainfed' | 'Borewell';
  activeCrops: CropField[];
}

export interface CropField {
  id: string;
  farmId: string;
  fieldName: string;
  cropName: string;
  variety: string;
  sownDate: string;
  expectedHarvestDate: string;
  areaAcres: number;
  stage: 'Sowing' | 'Vegetative' | 'Flowering' | 'Fruit Formation' | 'Maturity' | 'Harvest Ready';
  healthScore: number; // 0-100
  soilMoisturePercent: number;
  targetYieldTons: number;
}

export interface SoilData {
  soilType: string;
  ph: number;
  nitrogen: number; // mg/kg or kg/ha
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisturePercent: number;
  waterAvailability: 'Abundant' | 'Moderate' | 'Limited' | 'Scarce';
}

export interface CropRecommendationInput {
  location: string;
  soilType: string;
  soilPh: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  waterAvailability: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  farmArea: number;
  previousCrop: string;
  irrigationType: string;
}

export interface CropRecommendationItem {
  id: string;
  cropName: string;
  variety: string;
  suitabilityScore: number; // 0-100%
  expectedYield: string; // e.g. "4.5 tons/acre"
  estimatedDuration: string; // e.g. "90-110 days"
  waterRequirement: 'Low' | 'Medium' | 'High';
  fertilizerRequirement: string; // e.g. "NPK 120:60:40 kg/ha"
  riskLevel: 'Low' | 'Moderate' | 'High';
  expectedMarketDemand: 'High' | 'Very High' | 'Moderate' | 'Stable';
  estimatedRevenuePerAcre: number;
  estimatedProfitPerAcre: number;
  whyRecommended: string;
  growthTips: string[];
}

export interface WeatherData {
  location: string;
  current: {
    tempC: number;
    tempF: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeedKmh: number;
    rainfallMm: number;
    rainProbability: number;
    uvIndex: number;
    airQuality: string;
    soilTempC: number;
  };
  forecast: {
    date: string;
    day: string;
    tempMin: number;
    tempMax: number;
    condition: string;
    rainProb: number;
    rainfallMm: number;
    icon: string;
  }[];
  advisories: {
    type: 'IRRIGATION' | 'SPRAYING' | 'HARVEST' | 'RAIN_ALERT' | 'PEST_ALERT';
    title: string;
    message: string;
    level: 'INFO' | 'WARNING' | 'CRITICAL' | 'OPTIMAL';
  }[];
}

export interface MarketPriceItem {
  id: string;
  cropName: string;
  variety: string;
  mandi: string;
  state: string;
  currentPricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  dailyChangePercent: number;
  demandIndex: 'High' | 'Moderate' | 'Low';
  supplyIndex: 'Surplus' | 'Adequate' | 'Shortage';
  predictedNextWeekPrice: number;
  historicalPrices: { date: string; price: number }[];
}

export interface IrrigationZone {
  id: string;
  zoneName: string;
  farmId: string;
  crop: string;
  areaAcres: number;
  soilMoisture: number; // percent
  targetMoisture: number;
  status: 'IDLE' | 'IRRIGATING' | 'PAUSED';
  mode: 'AUTOMATIC' | 'MANUAL';
  lastWatered: string;
  flowRateLitersPerMin: number;
  totalWaterUsedTodayLiters: number;
  schedule: string;
}

export interface LabourWorker {
  id: string;
  userId: string;
  name: string;
  phone: string;
  location: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  experienceYears: number;
  dailyWage: number;
  availability: 'Available' | 'Booked' | 'Unavailable';
  avatarUrl: string;
  completedJobsCount: number;
}

export interface LabourBooking {
  id: string;
  farmerId: string;
  farmerName: string;
  workerId: string;
  workerName: string;
  jobRole: string;
  startDate: string;
  daysCount: number;
  totalCost: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  farmLocation: string;
  specialInstructions?: string;
  createdAt: string;
  ratingGiven?: number;
}

export interface MachineItem {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  title: string;
  category: 'Tractor' | 'Harvester' | 'Rotavator' | 'Cultivator' | 'Sprayer Drone' | 'Seed Drill' | 'Baler';
  brand: string;
  model: string;
  hp: number;
  ratePerHour: number;
  ratePerDay: number;
  location: string;
  availableFrom: string;
  imageUrl: string;
  rating: number;
  specs: string[];
  isAvailable: boolean;
}

export interface MachineBooking {
  id: string;
  machineId: string;
  machineTitle: string;
  farmerId: string;
  farmerName: string;
  rentalDurationDays: number;
  startDate: string;
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'IN_USE' | 'COMPLETED' | 'REJECTED';
  location: string;
  createdAt: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Organic Products' | 'Agricultural Tools';
  brand: string;
  price: number;
  mrp: number;
  unit: string; // e.g. "kg", "50kg bag", "liter", "piece"
  stockQuantity: number;
  rating: number;
  imageUrl: string;
  description: string;
  certifications: string[];
  dosageInstructions?: string;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface StoreOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  totalAmount: number;
  deliveryAddress: string;
  status: 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';
  paymentMethod: string;
  createdAt: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string;
  variety: string;
  grade: 'Grade A+' | 'Grade A' | 'Grade B' | 'Organic Certified';
  quantityQuintals: number;
  pricePerQuintal: number;
  location: string;
  harvestDate: string;
  imageUrl: string;
  status: 'ACTIVE' | 'UNDER_OFFER' | 'SOLD';
  createdAt: string;
}

export interface CropOrder {
  id: string;
  listingId: string;
  cropName: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  farmerId: string;
  farmerName: string;
  quantityQuintals: number;
  agreedPricePerQuintal: number;
  totalAmount: number;
  deliveryLocation: string;
  status: 'ORDER_PLACED' | 'CONFIRMED' | 'TRANSPORT_ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'PAYMENT_RELEASED';
  createdAt: string;
}

export interface TransportVehicle {
  id: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  vehicleType: 'Pickup Mini (1.5T)' | 'Medium Flatbed (5T)' | 'Heavy Truck (10T)' | 'Refrigerated Carrier (8T)' | 'Refrigerated Agri Carrier (8T)' | 'Tractor Trolley (4T)';
  vehicleNumber: string;
  capacityTons: number;
  ratePerKm: number;
  currentLocation: string;
  isAvailable: boolean;
  rating: number;
}

export interface TransportBooking {
  id: string;
  farmerId: string;
  farmerName: string;
  vehicleId: string;
  providerName: string;
  pickupLocation: string;
  dropLocation: string;
  cropName: string;
  tonnage: number;
  pickupDate: string;
  distanceKm: number;
  totalFare: number;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  status: 'BOOKED' | 'DRIVER_EN_ROUTE' | 'LOADED' | 'IN_TRANSIT' | 'DELIVERED';
  liveStep: number; // 0 to 4
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  category: 
    | 'Crop Sale' 
    | 'Government Subsidy' 
    | 'Seeds' 
    | 'Fertilizer' 
    | 'Labour Wage' 
    | 'Machinery Rent' 
    | 'Transport' 
    | 'Electricity / Irrigation' 
    | 'Pesticides' 
    | 'Other';
  amount: number;
  date: string;
  description: string;
  relatedCrop?: string;
  paymentMode: 'Cash' | 'Bank Transfer' | 'UPI / Digital';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMarginPercent: number;
  monthlyTrend: {
    month: string;
    income: number;
    expense: number;
    profit: number;
  }[];
  cropBreakdown: {
    cropName: string;
    revenue: number;
    cost: number;
    net: number;
  }[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorLocation: string;
  category: 'Crop' | 'Pest' | 'Weather' | 'Market' | 'Technology' | 'Government Schemes' | 'General';
  title: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  isLikedByUser?: boolean;
  repliesCount: number;
  createdAt: string;
  comments: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  isExpert: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'WEATHER' | 'MARKET' | 'AI_ADVICE' | 'IRRIGATION' | 'LABOUR' | 'MACHINE' | 'TRANSPORT' | 'ORDER' | 'PAYMENT' | 'SYSTEM';
  title: string;
  message: string;
  linkTab?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  result: 'SUCCESS' | 'WARNING' | 'BLOCKED';
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
