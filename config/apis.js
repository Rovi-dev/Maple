/**
 * API Configuration & Affiliate Links
 * 
 * All APIs listed here are FREE tier compatible.
 * Affiliate links enable future monetization when users book through Maple.
 */

module.exports = {
  // ==================== MAPPING & DISTANCE ====================
  
  NOMINATIM: {
    name: 'Nominatim (OpenStreetMap)',
    description: 'Free location search/geocoding. No API key required.',
    baseUrl: 'https://nominatim.openstreetmap.org',
    free: true,
    affiliate: null,
    rateLimits: '1 request per second',
    docs: 'https://nominatim.org/release-docs/latest/api/Overview/',
  },

  GOOGLE_MAPS_DISTANCE: {
    name: 'Google Maps Distance Matrix API',
    description: 'Calculate distances, durations, and directions. Free tier: 25,000 requests/day.',
    free: true,
    freeTierLimit: 25000,
    paidTier: '$0.005 - $0.01 per request',
    setup: 'https://console.cloud.google.com/google/maps-apis/credentials',
    docs: 'https://developers.google.com/maps/documentation/distance-matrix',
  },

  // ==================== TRAIN TRAVEL ====================

  TRAINLINE: {
    name: 'Trainline',
    description: 'UK train prices, schedules, and bookings. Live price API.',
    free: true,
    setup: 'https://developer.thetrainline.com',
    affiliate: 'https://www.thetrainline.com/affiliate',
    affiliateDescription: 'Earn commission on train bookings (typically 5-10%)',
    docs: 'https://developer.thetrainline.com/documentation',
  },

  NATIONAL_RAIL: {
    name: 'National Rail Enquiries API',
    description: 'Alternative UK rail data (live departures, train times).',
    free: true,
    setup: 'https://realtime.nationalrail.co.uk/OpenLDBws/',
    docs: 'https://realtime.nationalrail.co.uk/OpenLDBws/wsdl.aspx',
  },

  // ==================== BUS & PUBLIC TRANSPORT ====================

  TFL_API: {
    name: 'Transport for London (TfL) Unified API',
    description: 'London buses, underground, DLR, tram lines, fares, and journey planning.',
    free: true,
    setup: 'https://tfl.gov.uk/info-for-developers/open-data-users/',
    docs: 'https://api.tfl.gov.uk/',
    note: 'Covers London area mainly. Good for starting point.',
  },

  NATIONAL_EXPRESS: {
    name: 'National Express',
    description: 'UK coach services (buses). Affiliate program available.',
    free: true,
    affiliate: 'https://www.nationalexpress.com/en/affiliate-program',
    affiliateDescription: 'Commission on coach bookings',
    docs: 'Contact: partnerships@nationalexpress.com',
  },

  GO_AHEAD: {
    name: 'Go-Ahead Group',
    description: 'UK bus operator (covers large UK area).',
    free: true,
    affiliate: 'https://www.go-ahead.com/partnerships',
    affiliateDescription: 'Potential partnership opportunities',
  },

  STAGECOACH: {
    name: 'Stagecoach',
    description: 'Major UK bus operator.',
    free: true,
    affiliate: 'https://www.stagecoachbus.com/about-us/partnerships',
    affiliateDescription: 'B2B partnerships available',
  },

  // ==================== RIDE-SHARING ====================

  UBER_API: {
    name: 'Uber Estimates API',
    description: 'Get Uber ride fare estimates and availability.',
    free: true,
    freeTierLimit: 'Generous free tier (check docs)',
    setup: 'https://developer.uber.com',
    affiliate: 'https://www.uber.com/en-GB/business/',
    affiliateDescription: 'Uber business partnerships and referral programs',
    docs: 'https://developer.uber.com/docs/rides/getting-started',
  },

  BOLT: {
    name: 'Bolt (European Uber alternative)',
    description: 'EU-wide ride-sharing with cheaper fares.',
    free: true,
    setup: 'https://developer.bolt.eu/',
    docs: 'https://developer.bolt.eu/docs/ride-hailing/',
  },

  // ==================== FUEL & CAR TRAVEL ====================

  UK_FUEL_PRICES: {
    name: 'UK Government RACF Fuel Prices (Free Historical Data)',
    description: 'Average UK fuel prices. For real-time, use Global Petrol Prices.',
    free: true,
    dataSource: 'https://www.gov.uk/government/statistical-data-sets/average-fuel-prices',
    affiliate: null,
  },

  GLOBAL_PETROL_PRICES: {
    name: 'Global Petrol Prices API',
    description: 'Real-time petrol/diesel prices by location.',
    free: true,
    freeTierLimit: '100 requests/month',
    setup: 'https://www.globalpetrolprices.com/API/',
    docs: 'https://www.globalpetrolprices.com/API/',
  },

  TRAVELSUPERMARKET: {
    name: 'Travel Supermarket',
    description: 'Travel comparison and affiliate marketing platform.',
    free: false,
    affiliate: 'https://www.travelsupermarket.com/affiliates/',
    affiliateDescription: 'Partner to show travel deals, earn commission on bookings',
  },

  // ==================== PARKING ====================

  PARKWHIZ: {
    name: 'ParkWhiz (via API)',
    description: 'Parking reservations and pricing.',
    free: false,
    affiliate: 'https://www.parkwhiz.com/business/',
    affiliateDescription: 'Earn commission on parking bookings',
  },

  // ==================== WEATHER (OPTIONAL) ====================

  OPENWEATHER: {
    name: 'OpenWeather API',
    description: 'Weather forecasts along the route (optional feature).',
    free: true,
    freeTierLimit: '1000 calls/day',
    setup: 'https://openweathermap.org/api',
    docs: 'https://openweathermap.org/api',
  },

  // ==================== BOOKING & AFFILIATE PROGRAMS ====================

  BOOKING_COM: {
    name: 'Booking.com Affiliate',
    description: 'Show hotel/accommodation options at destination.',
    free: false,
    affiliate: 'https://www.booking.com/affiliate-program/',
    affiliateDescription: 'Earn 1-30% commission on bookings',
  },

  HOTELS_COM: {
    name: 'Hotels.com Affiliate',
    description: 'Hotel booking platform.',
    free: false,
    affiliate: 'https://hotels.com/affiliate/',
    affiliateDescription: 'Commission on bookings made through your link',
  },

  EXPEDIA: {
    name: 'Expedia Affiliate',
    description: 'Multi-travel bookings.',
    free: false,
    affiliate: 'https://www.expediaaffiliate.com/',
    affiliateDescription: 'Commission on travel bookings',
  },

  // ==================== IMPLEMENTATION NOTES ====================

  IMPLEMENTATION_PHASES: {
    phase1: {
      name: 'MVP (No Monetization)',
      apis: ['NOMINATIM', 'GOOGLE_MAPS_DISTANCE', 'TRAINLINE', 'TFL_API', 'UBER_API'],
      affiliates: [],
      timeframe: 'Weeks 1-4',
    },
    phase2: {
      name: 'Monetization Ready',
      apis: ['All Phase 1', 'GLOBAL_PETROL_PRICES', 'NATIONAL_EXPRESS', 'BOLT'],
      affiliates: ['TRAINLINE', 'NATIONAL_EXPRESS', 'UBER', 'BOOKING_COM'],
      timeframe: 'Weeks 5-8',
    },
    phase3: {
      name: 'Full Features',
      apis: ['All Phase 2', 'OPENWEATHER', 'PARKWHIZ'],
      affiliates: ['All Phase 2', 'HOTELS_COM', 'EXPEDIA'],
      timeframe: 'Weeks 9+',
    },
  },

  AFFILIATE_REVENUE_MODEL: {
    description: 'Earn commission when users book through Maple',
    streams: [
      '🚂 Train: 5-10% on Trainline bookings',
      '🚌 Bus: 5-8% on National Express bookings',
      '🚕 Uber: Referral bonus per ride or % commission',
      '🏨 Hotel: 1-30% on Booking.com affiliate',
      '✈️ Flights: Commission via Expedia affiliate',
      '🅿️ Parking: Commission via ParkWhiz',
    ],
    example: 'User books £50 train ticket → Maple earns £3-5',
  },
};
