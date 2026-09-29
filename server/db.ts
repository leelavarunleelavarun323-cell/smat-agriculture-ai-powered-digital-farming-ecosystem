import {
  User,
  Farm,
  WeatherData,
  MarketPriceItem,
  IrrigationZone,
  LabourWorker,
  LabourBooking,
  MachineItem,
  MachineBooking,
  StoreProduct,
  StoreOrder,
  CropListing,
  CropOrder,
  TransportVehicle,
  TransportBooking,
  FinancialTransaction,
  CommunityPost,
  NotificationItem,
  AuditLogItem,
  CropRecommendationItem
} from '../src/types/index.ts';

// Initial Seed Users for each role
export const initialUsers: User[] = [
  {
    id: 'user-farmer-1',
    name: 'Ramesh Patel',
    email: 'farmer@smartagri.org',
    phone: '+91 98765 43210',
    role: 'FARMER',
    location: 'Ludhiana, Punjab',
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2025-01-15T10:00:00Z',
    farmDetails: {
      farmName: 'Patel Organic Bio-Farms',
      totalAcres: 18.5,
      primaryCrops: ['Wheat', 'Tomato', 'Mustard', 'Basmati Rice'],
      soilType: 'Alluvial',
      irrigationType: 'Drip & Borewell'
    }
  },
  {
    id: 'user-admin-1',
    name: 'Dr. Sunita Rao',
    email: 'admin@smartagri.org',
    phone: '+91 91234 56789',
    role: 'ADMIN',
    location: 'National Agri Tech Center, New Delhi',
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2024-11-01T08:30:00Z'
  },
  {
    id: 'user-worker-1',
    name: 'Vikram Singh',
    email: 'vikram.worker@smartagri.org',
    phone: '+91 98111 22334',
    role: 'WORKER',
    location: 'Khanna, Punjab',
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2025-02-10T11:20:00Z',
    workerDetails: {
      skills: ['Combine Harvesting', 'Precision Pruning', 'Organic Sowing', 'Fertilizer Application'],
      dailyRate: 650,
      rating: 4.9,
      completedJobs: 42,
      availability: 'AVAILABLE'
    }
  },
  {
    id: 'user-transport-1',
    name: 'Gurpreet Logistics',
    email: 'transport@smartagri.org',
    phone: '+91 94567 89012',
    role: 'TRANSPORT',
    location: 'Jalandhar Transport Hub',
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2025-01-20T14:15:00Z',
    transportDetails: {
      vehicleType: 'Refrigerated Agri Carrier (8T)',
      vehicleNumber: 'PB-08-AG-4921',
      capacityTons: 8,
      baseRatePerKm: 32
    }
  },
  {
    id: 'user-buyer-1',
    name: 'Rajesh Agrotech Foods',
    email: 'buyer@smartagri.org',
    phone: '+91 97890 12345',
    role: 'BUYER',
    location: 'Chandigarh Wholesale APMC',
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2025-02-01T09:40:00Z'
  },
  {
    id: 'user-store-1',
    name: 'Kisan Krishi Seva Kendra',
    email: 'store@smartagri.org',
    phone: '+91 93456 78901',
    role: 'STORE_OWNER',
    location: 'Ludhiana Central Agro Market',
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2025-01-10T12:00:00Z'
  },
  {
    id: 'user-machine-1',
    name: 'Bharat Agro Equipment Fleet',
    email: 'machine@smartagri.org',
    phone: '+91 98700 11223',
    role: 'MACHINE_OWNER',
    location: 'Moga Agritech Park',
    isVerified: true,
    status: 'ACTIVE',
    createdAt: '2025-01-05T09:00:00Z'
  }
];

export const initialFarms: Farm[] = [
  {
    id: 'farm-1',
    farmerId: 'user-farmer-1',
    name: 'Patel Organic Bio-Farms',
    location: 'Ludhiana North Sector, Punjab (Plot 42-A)',
    totalAreaAcres: 18.5,
    soilType: 'Alluvial',
    irrigationType: 'Drip',
    activeCrops: [
      {
        id: 'field-1',
        farmId: 'farm-1',
        fieldName: 'North Basin Field A',
        cropName: 'Tomato',
        variety: 'Himsona Hybrid',
        sownDate: '2026-07-15',
        expectedHarvestDate: '2026-10-10',
        areaAcres: 5.5,
        stage: 'Fruit Formation',
        healthScore: 94,
        soilMoisturePercent: 42,
        targetYieldTons: 22
      },
      {
        id: 'field-2',
        farmId: 'farm-1',
        fieldName: 'South Sector Field B',
        cropName: 'Wheat',
        variety: 'HD-2967 High Yield',
        sownDate: '2026-08-01',
        expectedHarvestDate: '2026-11-20',
        areaAcres: 8.0,
        stage: 'Vegetative',
        healthScore: 88,
        soilMoisturePercent: 68,
        targetYieldTons: 16
      },
      {
        id: 'field-3',
        farmId: 'farm-1',
        fieldName: 'East Orchard Field C',
        cropName: 'Mustard',
        variety: 'Pusa Bold',
        sownDate: '2026-08-20',
        expectedHarvestDate: '2026-12-05',
        areaAcres: 5.0,
        stage: 'Sowing',
        healthScore: 91,
        soilMoisturePercent: 26,
        targetYieldTons: 7.5
      }
    ]
  }
];

export const initialWeatherData: WeatherData = {
  location: 'Ludhiana Agri Zone, Punjab',
  current: {
    tempC: 28.5,
    tempF: 83.3,
    condition: 'Partly Sunny',
    icon: 'SunCloud',
    humidity: 58,
    windSpeedKmh: 14.2,
    rainfallMm: 0.0,
    rainProbability: 15,
    uvIndex: 6,
    airQuality: 'Good (AQI 45)',
    soilTempC: 24.1
  },
  forecast: [
    { date: '2026-09-29', day: 'Today', tempMin: 22, tempMax: 31, condition: 'Partly Sunny', rainProb: 15, rainfallMm: 0, icon: 'Sun' },
    { date: '2026-09-30', day: 'Wed', tempMin: 21, tempMax: 30, condition: 'Clear Sky', rainProb: 10, rainfallMm: 0, icon: 'Sun' },
    { date: '2026-10-01', day: 'Thu', tempMin: 23, tempMax: 29, condition: 'Scattered Clouds', rainProb: 35, rainfallMm: 2.4, icon: 'Cloud' },
    { date: '2026-10-02', day: 'Fri', tempMin: 20, tempMax: 27, condition: 'Moderate Showers', rainProb: 75, rainfallMm: 18.5, icon: 'CloudRain' },
    { date: '2026-10-03', day: 'Sat', tempMin: 19, tempMax: 26, condition: 'Light Rain', rainProb: 60, rainfallMm: 8.0, icon: 'CloudRain' },
    { date: '2026-10-04', day: 'Sun', tempMin: 21, tempMax: 30, condition: 'Sunny & Fresh', rainProb: 10, rainfallMm: 0, icon: 'Sun' },
    { date: '2026-10-05', day: 'Mon', tempMin: 22, tempMax: 32, condition: 'Sunny', rainProb: 5, rainfallMm: 0, icon: 'Sun' }
  ],
  advisories: [
    {
      type: 'IRRIGATION',
      title: 'Irrigate Field C Today (Low Moisture: 26%)',
      message: 'Soil moisture is in the critical absorption zone for Mustard seedlings. Run drip cycle for 45 minutes.',
      level: 'WARNING'
    },
    {
      type: 'SPRAYING',
      title: 'Optimal Spray Window: Next 36 Hours',
      message: 'Wind speed is low (14 km/h) and no heavy rain expected until Friday. Complete prophylactic bio-fungicide spraying on tomatoes.',
      level: 'OPTIMAL'
    },
    {
      type: 'RAIN_ALERT',
      title: 'Monsoon Front Approaching Friday (18.5mm)',
      message: 'Clean field drainage channels and ensure open furrows to prevent water stagnation in Field A.',
      level: 'INFO'
    },
    {
      type: 'HARVEST',
      title: 'Advance Harvest Window for Early Crops',
      message: 'Favorable dry sunny conditions over the next 48 hours make it ideal for pre-harvest checks.',
      level: 'INFO'
    }
  ]
};

export const initialMarketPrices: MarketPriceItem[] = [
  {
    id: 'mkt-1',
    cropName: 'Tomato',
    variety: 'Hybrid Grade A',
    mandi: 'Ludhiana Mandi Hub',
    state: 'Punjab',
    currentPricePerQuintal: 2850,
    minPrice: 2400,
    maxPrice: 3200,
    modalPrice: 2850,
    dailyChangePercent: 4.8,
    demandIndex: 'High',
    supplyIndex: 'Shortage',
    predictedNextWeekPrice: 3100,
    historicalPrices: [
      { date: '2026-09-23', price: 2500 },
      { date: '2026-09-24', price: 2580 },
      { date: '2026-09-25', price: 2650 },
      { date: '2026-09-26', price: 2700 },
      { date: '2026-09-27', price: 2720 },
      { date: '2026-09-28', price: 2780 },
      { date: '2026-09-29', price: 2850 }
    ]
  },
  {
    id: 'mkt-2',
    cropName: 'Wheat',
    variety: 'Sharbati Premium',
    mandi: 'Khanna Grain Market',
    state: 'Punjab',
    currentPricePerQuintal: 2450,
    minPrice: 2320,
    maxPrice: 2550,
    modalPrice: 2450,
    dailyChangePercent: 1.2,
    demandIndex: 'High',
    supplyIndex: 'Adequate',
    predictedNextWeekPrice: 2500,
    historicalPrices: [
      { date: '2026-09-23', price: 2380 },
      { date: '2026-09-24', price: 2400 },
      { date: '2026-09-25', price: 2410 },
      { date: '2026-09-26', price: 2420 },
      { date: '2026-09-27', price: 2440 },
      { date: '2026-09-28', price: 2445 },
      { date: '2026-09-29', price: 2450 }
    ]
  },
  {
    id: 'mkt-3',
    cropName: 'Basmati Rice',
    variety: '1121 Export Grade',
    mandi: 'Amritsar APMC',
    state: 'Punjab',
    currentPricePerQuintal: 4350,
    minPrice: 4100,
    maxPrice: 4600,
    modalPrice: 4350,
    dailyChangePercent: 3.5,
    demandIndex: 'High',
    supplyIndex: 'Shortage',
    predictedNextWeekPrice: 4500,
    historicalPrices: [
      { date: '2026-09-23', price: 4150 },
      { date: '2026-09-24', price: 4200 },
      { date: '2026-09-25', price: 4240 },
      { date: '2026-09-26', price: 4280 },
      { date: '2026-09-27', price: 4300 },
      { date: '2026-09-28', price: 4320 },
      { date: '2026-09-29', price: 4350 }
    ]
  },
  {
    id: 'mkt-4',
    cropName: 'Cotton',
    variety: 'Medium Staple',
    mandi: 'Bathinda Cotton Yard',
    state: 'Punjab',
    currentPricePerQuintal: 6850,
    minPrice: 6500,
    maxPrice: 7100,
    modalPrice: 6850,
    dailyChangePercent: -0.8,
    demandIndex: 'Moderate',
    supplyIndex: 'Surplus',
    predictedNextWeekPrice: 6800,
    historicalPrices: [
      { date: '2026-09-23', price: 6920 },
      { date: '2026-09-24', price: 6910 },
      { date: '2026-09-25', price: 6890 },
      { date: '2026-09-26', price: 6880 },
      { date: '2026-09-27', price: 6870 },
      { date: '2026-09-28', price: 6860 },
      { date: '2026-09-29', price: 6850 }
    ]
  },
  {
    id: 'mkt-5',
    cropName: 'Soybean',
    variety: 'Yellow Supreme',
    mandi: 'Indore Mandi',
    state: 'Madhya Pradesh',
    currentPricePerQuintal: 4720,
    minPrice: 4500,
    maxPrice: 4950,
    modalPrice: 4720,
    dailyChangePercent: 2.1,
    demandIndex: 'High',
    supplyIndex: 'Adequate',
    predictedNextWeekPrice: 4850,
    historicalPrices: [
      { date: '2026-09-23', price: 4600 },
      { date: '2026-09-24', price: 4620 },
      { date: '2026-09-25', price: 4650 },
      { date: '2026-09-26', price: 4680 },
      { date: '2026-09-27', price: 4700 },
      { date: '2026-09-28', price: 4710 },
      { date: '2026-09-29', price: 4720 }
    ]
  },
  {
    id: 'mkt-6',
    cropName: 'Onion',
    variety: 'Nashik Red',
    mandi: 'Lasalgaon APMC',
    state: 'Maharashtra',
    currentPricePerQuintal: 2150,
    minPrice: 1850,
    maxPrice: 2400,
    modalPrice: 2150,
    dailyChangePercent: 6.4,
    demandIndex: 'High',
    supplyIndex: 'Shortage',
    predictedNextWeekPrice: 2350,
    historicalPrices: [
      { date: '2026-09-23', price: 1890 },
      { date: '2026-09-24', price: 1940 },
      { date: '2026-09-25', price: 1990 },
      { date: '2026-09-26', price: 2040 },
      { date: '2026-09-27', price: 2080 },
      { date: '2026-09-28', price: 2110 },
      { date: '2026-09-29', price: 2150 }
    ]
  }
];

export const initialIrrigationZones: IrrigationZone[] = [
  {
    id: 'zone-1',
    zoneName: 'North Basin Zone (Field A - Tomato)',
    farmId: 'farm-1',
    crop: 'Tomato',
    areaAcres: 5.5,
    soilMoisture: 42,
    targetMoisture: 55,
    status: 'IDLE',
    mode: 'AUTOMATIC',
    lastWatered: 'Yesterday at 06:00 AM',
    flowRateLitersPerMin: 120,
    totalWaterUsedTodayLiters: 1800,
    schedule: 'Every 2 days (45 min drip)'
  },
  {
    id: 'zone-2',
    zoneName: 'South Sector Zone (Field B - Wheat)',
    farmId: 'farm-1',
    crop: 'Wheat',
    areaAcres: 8.0,
    soilMoisture: 68,
    targetMoisture: 60,
    status: 'IDLE',
    mode: 'AUTOMATIC',
    lastWatered: '2 days ago at 05:30 AM',
    flowRateLitersPerMin: 220,
    totalWaterUsedTodayLiters: 0,
    schedule: 'Every 5 days'
  },
  {
    id: 'zone-3',
    zoneName: 'East Orchard Zone (Field C - Mustard)',
    farmId: 'farm-1',
    crop: 'Mustard',
    areaAcres: 5.0,
    soilMoisture: 26,
    targetMoisture: 50,
    status: 'IRRIGATING',
    mode: 'MANUAL',
    lastWatered: 'Active Now (Started 12 min ago)',
    flowRateLitersPerMin: 140,
    totalWaterUsedTodayLiters: 1680,
    schedule: 'Manual On-Demand'
  }
];

export const initialLabourWorkers: LabourWorker[] = [
  {
    id: 'worker-1',
    userId: 'user-worker-1',
    name: 'Vikram Singh',
    phone: '+91 98111 22334',
    location: 'Khanna, Punjab (6 km away)',
    rating: 4.9,
    reviewCount: 38,
    skills: ['Combine Harvesting', 'Precision Pruning', 'Organic Sowing', 'Fertilizer Application'],
    experienceYears: 9,
    dailyWage: 650,
    availability: 'Available',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop',
    completedJobsCount: 42
  },
  {
    id: 'worker-2',
    userId: 'user-worker-2',
    name: 'Manoj Kumar & Team (4 Workers)',
    phone: '+91 97222 33445',
    location: 'Ludhiana Rural (12 km away)',
    rating: 4.8,
    reviewCount: 54,
    skills: ['Paddy Transplanting', 'Weeding & De-stoning', 'Post-Harvest Sorting', 'Heavy Loading'],
    experienceYears: 12,
    dailyWage: 2400,
    availability: 'Available',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    completedJobsCount: 78
  },
  {
    id: 'worker-3',
    userId: 'user-worker-3',
    name: 'Harpreet Kaur',
    phone: '+91 96333 44556',
    location: 'Samrala, Punjab (15 km away)',
    rating: 5.0,
    reviewCount: 29,
    skills: ['Nursery Management', 'Greenhouse Trellising', 'Drip Tube Maintenance', 'Pesticide Spraying'],
    experienceYears: 7,
    dailyWage: 700,
    availability: 'Available',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    completedJobsCount: 31
  },
  {
    id: 'worker-4',
    userId: 'user-worker-4',
    name: 'Balwinder Jatt',
    phone: '+91 95444 55667',
    location: 'Doraha, Punjab (8 km away)',
    rating: 4.7,
    reviewCount: 22,
    skills: ['Tractor Driving', 'Subsoiling & Tilling', 'Laser Land Leveling', 'Harvester Operator'],
    experienceYears: 11,
    dailyWage: 850,
    availability: 'Booked',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    completedJobsCount: 65
  }
];

export const initialLabourBookings: LabourBooking[] = [
  {
    id: 'lbook-1',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    workerId: 'worker-1',
    workerName: 'Vikram Singh',
    jobRole: 'Tomato Trellising & Staking',
    startDate: '2026-10-02',
    daysCount: 3,
    totalCost: 1950,
    status: 'ACCEPTED',
    farmLocation: 'Patel Bio-Farms, North Sector Field A',
    specialInstructions: 'Handle hybrid stakes gently; bring own pruning shears if possible.',
    createdAt: '2026-09-28T09:30:00Z'
  },
  {
    id: 'lbook-2',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    workerId: 'worker-3',
    workerName: 'Harpreet Kaur',
    jobRole: 'Drip Line Flushing & Emitter Check',
    startDate: '2026-09-25',
    daysCount: 1,
    totalCost: 700,
    status: 'COMPLETED',
    farmLocation: 'Patel Bio-Farms, East Orchard',
    createdAt: '2026-09-24T14:00:00Z',
    ratingGiven: 5
  }
];

export const initialMachines: MachineItem[] = [
  {
    id: 'mach-1',
    ownerId: 'user-machine-1',
    ownerName: 'Bharat Agro Equipment Fleet',
    ownerPhone: '+91 98700 11223',
    title: 'Mahindra 575 DI High-Torque Tractor (45 HP)',
    category: 'Tractor',
    brand: 'Mahindra',
    model: '575 DI Sarpanch',
    hp: 45,
    ratePerHour: 450,
    ratePerDay: 3200,
    location: 'Ludhiana Agro Hub (5 km away)',
    availableFrom: 'Immediately',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1c?w=500&auto=format&fit=crop',
    rating: 4.9,
    specs: ['4-Cylinder Turbo Engine', 'Dual Clutch', 'Power Steering', 'Multi-Speed PTO (540 RPM)'],
    isAvailable: true
  },
  {
    id: 'mach-2',
    ownerId: 'user-machine-1',
    ownerName: 'Bharat Agro Equipment Fleet',
    ownerPhone: '+91 98700 11223',
    title: 'John Deere W70 Multi-Crop Combine Harvester',
    category: 'Harvester',
    brand: 'John Deere',
    model: 'W70 Grain Pro',
    hp: 100,
    ratePerHour: 1800,
    ratePerDay: 13500,
    location: 'Moga Depot (18 km away)',
    availableFrom: '2026-10-05',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop',
    rating: 4.8,
    specs: ['Grain Loss Monitor', '4.2m Cutter Bar', 'Straw Chopper Attached', 'GPS Field Mapping'],
    isAvailable: true
  },
  {
    id: 'mach-3',
    ownerId: 'user-machine-1',
    ownerName: 'Bharat Agro Equipment Fleet',
    ownerPhone: '+91 98700 11223',
    title: 'AgriHawk 16L Precision Autonomous Spraying Drone',
    category: 'Sprayer Drone',
    brand: 'AgriHawk Robotics',
    model: 'AeroSpray V4',
    hp: 12,
    ratePerHour: 950,
    ratePerDay: 6800,
    location: 'Ludhiana Tech Park (3 km away)',
    availableFrom: 'Immediately',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&auto=format&fit=crop',
    rating: 5.0,
    specs: ['16L Tank Capacity', 'Centrifugal Atomizing Nozzles', 'Obstacle Radar 360°', 'Covers 5 Acres/Hour'],
    isAvailable: true
  },
  {
    id: 'mach-4',
    ownerId: 'user-machine-1',
    ownerName: 'Bharat Agro Equipment Fleet',
    ownerPhone: '+91 98700 11223',
    title: 'Shaktiman 7-Feet Heavy Duty Rotavator',
    category: 'Rotavator',
    brand: 'Shaktiman',
    model: 'Champion Series 210',
    hp: 50,
    ratePerHour: 350,
    ratePerDay: 2400,
    location: 'Khanna Hub (8 km away)',
    availableFrom: 'Immediately',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop',
    rating: 4.7,
    specs: ['Boron Steel L-Blades', 'Side Gear Drive', 'Depth Adjust Skids', 'Heavy Duty Gearbox'],
    isAvailable: true
  }
];

export const initialMachineBookings: MachineBooking[] = [
  {
    id: 'mbook-1',
    machineId: 'mach-3',
    machineTitle: 'AgriHawk 16L Precision Autonomous Spraying Drone',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    rentalDurationDays: 1,
    startDate: '2026-10-01',
    totalAmount: 6800,
    status: 'APPROVED',
    location: 'Patel Bio-Farms, North Field A',
    createdAt: '2026-09-28T10:15:00Z'
  }
];

export const initialProducts: StoreProduct[] = [
  {
    id: 'prod-1',
    name: 'Syngenta Himsona Hybrid F1 Tomato Seeds',
    category: 'Seeds',
    brand: 'Syngenta Agri',
    price: 920,
    mrp: 1100,
    unit: '10g pack (approx 3,000 seeds)',
    stockQuantity: 140,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&auto=format&fit=crop',
    description: 'High-yielding determinate hybrid with excellent shelf life and resistance to TYLCV and bacterial wilt.',
    certifications: ['Certified F1 Hybrid', 'Disease Tolerant', 'Govt Approved'],
    dosageInstructions: 'Sow in nursery trays with coco-peat; transplant after 25 days.'
  },
  {
    id: 'prod-2',
    name: 'IFFCO Nano Urea Liquid Fertilizer (500ml)',
    category: 'Fertilizers',
    brand: 'IFFCO',
    price: 225,
    mrp: 240,
    unit: '500ml bottle (Replaces 1 Bag of 45kg Urea)',
    stockQuantity: 420,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&auto=format&fit=crop',
    description: 'Eco-friendly nanotechnology nitrogen fertilizer. Increases crop yield by 8% while preventing ground water nitrate leaching.',
    certifications: ['ICAR Tested', 'Patented Nanotech', '100% Water Soluble'],
    dosageInstructions: '2-4 ml per liter of water at tillering and flowering stage.'
  },
  {
    id: 'prod-3',
    name: 'Bio-Neem Gold 10,000 PPM Organic Insecticide',
    category: 'Organic Products',
    brand: 'EcoAgro Organics',
    price: 680,
    mrp: 799,
    unit: '1 Liter Can',
    stockQuantity: 85,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop',
    description: 'Pure cold-pressed Azadirachtin organic bio-repellent. Highly effective against aphids, thrips, whiteflies, and bollworms.',
    certifications: ['NPOP Certified Organic', 'Zero Residue', 'Bee Friendly'],
    dosageInstructions: '3ml per liter of clean water; spray early morning or sunset.'
  },
  {
    id: 'prod-4',
    name: 'HD-3226 High Protein Rust-Resistant Wheat Seed',
    category: 'Seeds',
    brand: 'IARI Pusa',
    price: 1450,
    mrp: 1600,
    unit: '40kg bag',
    stockQuantity: 65,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop',
    description: 'Revolutionary bio-fortified wheat variety with 12.8% protein content and resistance to yellow and brown rust.',
    certifications: ['National Seed Corporation Certified', 'Rust Immune'],
    dosageInstructions: 'Seed drill sowing at 40kg/acre with 20cm row spacing.'
  },
  {
    id: 'prod-5',
    name: 'Jain Irrigation Drip Tape & Emitter Kit (1 Acre)',
    category: 'Agricultural Tools',
    brand: 'Jain Irrigation Systems',
    price: 8400,
    mrp: 9500,
    unit: '1 Acre Modular Kit',
    stockQuantity: 28,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&auto=format&fit=crop',
    description: 'Complete 16mm inline drip lateral line kit with 2 LPH pressure compensating emitters, screen filter, and joiners.',
    certifications: ['ISI Certified', 'Govt Subsidy Eligible (up to 55%)'],
    dosageInstructions: 'Connect to primary mainline; operational pressure 1.0 - 1.5 bar.'
  },
  {
    id: 'prod-6',
    name: 'Coromandel Gromor 14:35:14 Complex NPK Fertilizer',
    category: 'Fertilizers',
    brand: 'Coromandel International',
    price: 1580,
    mrp: 1720,
    unit: '50kg Bag',
    stockQuantity: 110,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&auto=format&fit=crop',
    description: 'Phosphorus-rich balanced complex fertilizer perfect for root establishment and early vegetative vigour.',
    certifications: ['FCO 1985 Compliant', 'Granular High Purity'],
    dosageInstructions: 'Basal application at 50kg/acre during last ploughing.'
  }
];

export const initialStoreOrders: StoreOrder[] = [
  {
    id: 'sord-101',
    buyerId: 'user-farmer-1',
    buyerName: 'Ramesh Patel',
    items: [
      { productId: 'prod-2', productName: 'IFFCO Nano Urea Liquid (500ml)', price: 225, quantity: 4, unit: '500ml' },
      { productId: 'prod-3', productName: 'Bio-Neem Gold 10,000 PPM (1L)', price: 680, quantity: 2, unit: '1L' }
    ],
    totalAmount: 2260,
    deliveryAddress: 'Patel Bio-Farms, Plot 42-A, Ludhiana North, Punjab',
    status: 'SHIPPED',
    paymentMethod: 'UPI / Agri RuPay Card',
    createdAt: '2026-09-27T16:20:00Z'
  }
];

export const initialCropListings: CropListing[] = [
  {
    id: 'clist-1',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98765 43210',
    cropName: 'Tomato',
    variety: 'Himsona Hybrid Red',
    grade: 'Grade A+',
    quantityQuintals: 150,
    pricePerQuintal: 2800,
    location: 'Ludhiana North Farm Gate, Punjab',
    harvestDate: '2026-10-10',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&auto=format&fit=crop',
    status: 'ACTIVE',
    createdAt: '2026-09-28T08:00:00Z'
  },
  {
    id: 'clist-2',
    farmerId: 'user-farmer-2',
    farmerName: 'Jaswant Singh',
    farmerPhone: '+91 98222 11990',
    cropName: 'Wheat',
    variety: 'Sharbati Golden Grain',
    grade: 'Organic Certified',
    quantityQuintals: 400,
    pricePerQuintal: 2500,
    location: 'Khanna Grain Yard, Punjab',
    harvestDate: '2026-10-25',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop',
    status: 'ACTIVE',
    createdAt: '2026-09-26T11:00:00Z'
  },
  {
    id: 'clist-3',
    farmerId: 'user-farmer-3',
    farmerName: 'Suresh Verma',
    farmerPhone: '+91 97111 88223',
    cropName: 'Basmati Rice',
    variety: '1121 Traditional Long Grain',
    grade: 'Grade A+',
    quantityQuintals: 250,
    pricePerQuintal: 4400,
    location: 'Amritsar Rural, Punjab',
    harvestDate: '2026-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop',
    status: 'ACTIVE',
    createdAt: '2026-09-27T15:30:00Z'
  },
  {
    id: 'clist-4',
    farmerId: 'user-farmer-4',
    farmerName: 'Mahesh Patil',
    farmerPhone: '+91 96555 44112',
    cropName: 'Soybean',
    variety: 'JS-335 Organic Non-GMO',
    grade: 'Organic Certified',
    quantityQuintals: 180,
    pricePerQuintal: 4800,
    location: 'Indore Central, MP',
    harvestDate: '2026-10-08',
    imageUrl: 'https://images.unsplash.com/photo-1599818817743-7a1362e49c70?w=500&auto=format&fit=crop',
    status: 'UNDER_OFFER',
    createdAt: '2026-09-25T14:10:00Z'
  }
];

export const initialCropOrders: CropOrder[] = [
  {
    id: 'cord-501',
    listingId: 'clist-1',
    cropName: 'Tomato (Himsona Hybrid Red)',
    buyerId: 'user-buyer-1',
    buyerName: 'Rajesh Agrotech Foods',
    buyerCompany: 'Rajesh Agro Foods Ltd.',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    quantityQuintals: 60,
    agreedPricePerQuintal: 2800,
    totalAmount: 168000,
    deliveryLocation: 'Chandigarh APMC Processing Unit 4',
    status: 'TRANSPORT_ASSIGNED',
    createdAt: '2026-09-28T12:00:00Z'
  }
];

export const initialTransportVehicles: TransportVehicle[] = [
  {
    id: 'veh-1',
    providerId: 'user-transport-1',
    providerName: 'Gurpreet Logistics',
    providerPhone: '+91 94567 89012',
    vehicleType: 'Refrigerated Agri Carrier (8T)',
    vehicleNumber: 'PB-08-AG-4921',
    capacityTons: 8,
    ratePerKm: 32,
    currentLocation: 'Ludhiana Hub (Ready for dispatch)',
    isAvailable: true,
    rating: 4.9
  },
  {
    id: 'veh-2',
    providerId: 'user-transport-2',
    providerName: 'Kisan Speed Freight',
    providerPhone: '+91 93211 44556',
    vehicleType: 'Pickup Mini (1.5T)',
    vehicleNumber: 'PB-10-DX-8832',
    capacityTons: 1.5,
    ratePerKm: 18,
    currentLocation: 'Doraha Stand (3 km away)',
    isAvailable: true,
    rating: 4.7
  },
  {
    id: 'veh-3',
    providerId: 'user-transport-3',
    providerName: 'Punjab Heavy Haulers',
    providerPhone: '+91 91999 88776',
    vehicleType: 'Medium Flatbed (5T)',
    vehicleNumber: 'PB-65-AK-1029',
    capacityTons: 5,
    ratePerKm: 26,
    currentLocation: 'Khanna Bypass',
    isAvailable: true,
    rating: 4.8
  },
  {
    id: 'veh-4',
    providerId: 'user-transport-4',
    providerName: 'Malwa Agri Transit',
    providerPhone: '+91 92888 77665',
    vehicleType: 'Tractor Trolley (4T)',
    vehicleNumber: 'PB-11-TR-3041',
    capacityTons: 4,
    ratePerKm: 20,
    currentLocation: 'Ludhiana Rural',
    isAvailable: true,
    rating: 4.6
  }
];

export const initialTransportBookings: TransportBooking[] = [
  {
    id: 'tbook-1',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    vehicleId: 'veh-1',
    providerName: 'Gurpreet Logistics',
    pickupLocation: 'Patel Bio-Farms, North Sector Field A, Ludhiana',
    dropLocation: 'Chandigarh APMC Processing Unit 4',
    cropName: 'Tomato (Fresh Harvest)',
    tonnage: 6.0,
    pickupDate: '2026-10-02',
    distanceKm: 98,
    totalFare: 3136,
    driverName: 'Harbhajan Singh',
    driverPhone: '+91 98888 55443',
    vehicleNumber: 'PB-08-AG-4921',
    status: 'DRIVER_EN_ROUTE',
    liveStep: 1,
    createdAt: '2026-09-28T14:30:00Z'
  }
];

export const initialFinancialTransactions: FinancialTransaction[] = [
  {
    id: 'fin-1',
    userId: 'user-farmer-1',
    type: 'INCOME',
    category: 'Crop Sale',
    amount: 168000,
    date: '2026-09-28',
    description: 'Contract advance for 60Q Himsona Tomato to Rajesh Agro Foods',
    relatedCrop: 'Tomato',
    paymentMode: 'Bank Transfer'
  },
  {
    id: 'fin-2',
    userId: 'user-farmer-1',
    type: 'INCOME',
    category: 'Government Subsidy',
    amount: 35000,
    date: '2026-09-15',
    description: 'PM-Kisan Drip Irrigation Tech Installation Subsidy (50%)',
    paymentMode: 'Bank Transfer'
  },
  {
    id: 'fin-3',
    userId: 'user-farmer-1',
    type: 'EXPENSE',
    category: 'Labour Wage',
    amount: 4550,
    date: '2026-09-22',
    description: 'Weekly field labour wages for weeding & fertilizer application',
    relatedCrop: 'Tomato',
    paymentMode: 'Cash'
  },
  {
    id: 'fin-4',
    userId: 'user-farmer-1',
    type: 'EXPENSE',
    category: 'Seeds',
    amount: 3680,
    date: '2026-09-10',
    description: 'Syngenta Hybrid Tomato F1 seeds (4 packs) from Kisan Seva',
    relatedCrop: 'Tomato',
    paymentMode: 'UPI / Digital'
  },
  {
    id: 'fin-5',
    userId: 'user-farmer-1',
    type: 'EXPENSE',
    category: 'Fertilizer',
    amount: 4740,
    date: '2026-09-12',
    description: 'IFFCO Nano Urea & 14:35:14 NPK Complex basal dosage',
    relatedCrop: 'Wheat',
    paymentMode: 'UPI / Digital'
  },
  {
    id: 'fin-6',
    userId: 'user-farmer-1',
    type: 'EXPENSE',
    category: 'Machinery Rent',
    amount: 6800,
    date: '2026-09-28',
    description: 'Drone precision pesticide spraying advance booking',
    relatedCrop: 'Tomato',
    paymentMode: 'Bank Transfer'
  },
  {
    id: 'fin-7',
    userId: 'user-farmer-1',
    type: 'EXPENSE',
    category: 'Transport',
    amount: 3136,
    date: '2026-09-28',
    description: 'Refrigerated container truck freight to Chandigarh APMC',
    relatedCrop: 'Tomato',
    paymentMode: 'UPI / Digital'
  },
  {
    id: 'fin-8',
    userId: 'user-farmer-1',
    type: 'EXPENSE',
    category: 'Electricity / Irrigation',
    amount: 2200,
    date: '2026-09-20',
    description: 'Solar tubewell grid maintenance & backup power token',
    paymentMode: 'Bank Transfer'
  }
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'user-farmer-1',
    authorName: 'Ramesh Patel',
    authorRole: 'FARMER',
    authorLocation: 'Ludhiana, Punjab',
    category: 'Pest',
    title: 'Early leaf curl detected on hybrid tomato: Bio-neem vs Copper oxychloride?',
    content: 'Noticed slight upward curling and yellow margins on leaves in Field A. We have dry weather for the next 2 days followed by rains. Should I spray Azadirachtin 10,000 ppm immediately, or mix with a mild bio-fungicide?',
    likesCount: 14,
    isLikedByUser: false,
    repliesCount: 3,
    createdAt: '2026-09-28T07:45:00Z',
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorName: 'Dr. Sunita Rao (Chief Agronomist)',
        authorRole: 'ADMIN',
        content: 'Spray Azadirachtin 10,000 ppm at 3ml/L right now before sunset. The dry 36-hour window is perfect. If whitefly presence is confirmed on underside of leaves, install yellow sticky traps (15 per acre). Do not mix with copper compounds as it alters organic pH.',
        isExpert: true,
        createdAt: '2026-09-28T09:12:00Z'
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorName: 'Jaswant Singh',
        authorRole: 'FARMER',
        content: 'Had same issue last season. Drip irrigation control helped immensely; don’t overwater when rootzone is damp.',
        isExpert: false,
        createdAt: '2026-09-28T10:30:00Z'
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'user-farmer-2',
    authorName: 'Jaswant Singh',
    authorRole: 'FARMER',
    authorLocation: 'Khanna, Punjab',
    category: 'Market',
    title: 'Direct procurement prices vs APMC Mandi rates this Kharif harvest',
    content: 'Food processors are offering ₹2,800/Q for contract tomato and ₹2,500/Q for Sharbati wheat with farm-gate pickup. Has anyone calculated if factoring out mandi cess and loading labour makes direct farmgate more profitable?',
    likesCount: 22,
    isLikedByUser: true,
    repliesCount: 4,
    createdAt: '2026-09-27T11:20:00Z',
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorName: 'Rajesh Agrotech Foods',
        authorRole: 'BUYER',
        content: 'As a verified buyer on this ecosystem: farm-gate pickup saves you approx ₹140/Q in mandi brokerage, loading labor, and in-transit wastage. Plus payment gets released directly into your bank account within 24 hours of delivery confirmation.',
        isExpert: true,
        createdAt: '2026-09-27T13:40:00Z'
      }
    ]
  },
  {
    id: 'post-3',
    authorId: 'user-admin-1',
    authorName: 'Dr. Sunita Rao',
    authorRole: 'ADMIN',
    authorLocation: 'National Agri Tech Center',
    category: 'Government Schemes',
    title: 'New Solar Pumping & Micro-Irrigation Subsidy Window (Portal Open)',
    content: 'Farmers with registered land records can now claim up to 75% capital subsidy on 5HP to 7.5HP solar pumps under PM-KUSUM Component B. Applications are verified within 7 business days on our digital portal.',
    likesCount: 39,
    isLikedByUser: false,
    repliesCount: 6,
    createdAt: '2026-09-26T08:00:00Z',
    comments: []
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-farmer-1',
    type: 'WEATHER',
    title: 'Monsoon Rain Alert: Friday Oct 2',
    message: 'Expected 18.5mm rain with gusty winds. Complete planned pesticide spraying within the next 36 hours.',
    linkTab: 'weather',
    read: false,
    createdAt: '2026-09-29T07:00:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-farmer-1',
    type: 'MARKET',
    title: 'Tomato Mandi Price Surged +4.8%',
    message: 'Ludhiana Mandi price reached ₹2,850/Quintal due to strong wholesale demand.',
    linkTab: 'market',
    read: false,
    createdAt: '2026-09-29T06:30:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-farmer-1',
    type: 'IRRIGATION',
    title: 'Moisture Alert: Field C at 26%',
    message: 'Moisture is below target 50% for Mustard seedlings. Drip cycle recommended.',
    linkTab: 'irrigation',
    read: false,
    createdAt: '2026-09-29T05:15:00Z'
  },
  {
    id: 'notif-4',
    userId: 'user-farmer-1',
    type: 'MACHINE',
    title: 'Drone Rental Approved',
    message: 'Your booking for AgriHawk 16L Spraying Drone has been confirmed for Oct 01.',
    linkTab: 'machines',
    read: true,
    createdAt: '2026-09-28T10:18:00Z'
  },
  {
    id: 'notif-5',
    userId: 'user-farmer-1',
    type: 'TRANSPORT',
    title: 'Transport Driver Assigned',
    message: 'Harbhajan Singh (PB-08-AG-4921) is assigned for pickup on Oct 02.',
    linkTab: 'transport',
    read: true,
    createdAt: '2026-09-28T14:35:00Z'
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'audit-1',
    userId: 'user-admin-1',
    userName: 'Dr. Sunita Rao (ADMIN)',
    action: 'VERIFY_FARMER_KYC',
    module: 'USER_MANAGEMENT',
    details: 'Verified land title deed & Aadhaar KYC for farmer Ramesh Patel (18.5 Acres).',
    ipAddress: '192.168.1.104',
    result: 'SUCCESS',
    timestamp: '2026-09-28T11:45:12Z'
  },
  {
    id: 'audit-2',
    userId: 'user-admin-1',
    userName: 'Dr. Sunita Rao (ADMIN)',
    action: 'APPROVE_PRODUCT_LISTING',
    module: 'STORE_MANAGEMENT',
    details: 'Approved Bio-Neem Gold 10,000 PPM organic certification verification.',
    ipAddress: '192.168.1.104',
    result: 'SUCCESS',
    timestamp: '2026-09-27T16:02:44Z'
  },
  {
    id: 'audit-3',
    userId: 'system',
    userName: 'SYSTEM_DAEMON',
    action: 'AI_PRICE_PREDICTION_RUN',
    module: 'MARKET_INTELLIGENCE',
    details: 'Computed 7-day ARIMA & ML demand elasticity matrix for 12 mandis.',
    ipAddress: '127.0.0.1',
    result: 'SUCCESS',
    timestamp: '2026-09-29T00:00:00Z'
  }
];

// In-Memory Database class with state and helper methods
class AppDatabase {
  users = [...initialUsers];
  farms = [...initialFarms];
  weather = { ...initialWeatherData };
  marketPrices = [...initialMarketPrices];
  irrigationZones = [...initialIrrigationZones];
  labourWorkers = [...initialLabourWorkers];
  labourBookings = [...initialLabourBookings];
  machines = [...initialMachines];
  machineBookings = [...initialMachineBookings];
  products = [...initialProducts];
  storeOrders = [...initialStoreOrders];
  cropListings = [...initialCropListings];
  cropOrders = [...initialCropOrders];
  transportVehicles = [...initialTransportVehicles];
  transportBookings = [...initialTransportBookings];
  financialTransactions = [...initialFinancialTransactions];
  communityPosts = [...initialCommunityPosts];
  notifications = [...initialNotifications];
  auditLogs = [...initialAuditLogs];

  addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp'>) {
    const log: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.auditLogs.unshift(log);
    return log;
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt'>) {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...notif
    };
    this.notifications.unshift(item);
    return item;
  }
}

export const db = new AppDatabase();
