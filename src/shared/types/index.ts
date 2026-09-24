/* ================================================================== */
/* Enums (mirror of backend src/constants/enums.js)                    */
/* ================================================================== */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SELLER: 'SELLER',
  CUSTOMER: 'CUSTOMER',
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const VEHICLE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
} as const;
export type VehicleStatus = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONTACTED: 'CONTACTED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const SALE_CHANNEL = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
} as const;
export type SaleChannel = (typeof SALE_CHANNEL)[keyof typeof SALE_CHANNEL];

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const FUEL_TYPE = {
  PETROL: 'PETROL',
  DIESEL: 'DIESEL',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID',
  PLUGIN_HYBRID: 'PLUGIN_HYBRID',
  OTHER: 'OTHER',
} as const;
export type FuelType = (typeof FUEL_TYPE)[keyof typeof FUEL_TYPE];

export const TRANSMISSION = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
  CVT: 'CVT',
  DUAL_CLUTCH: 'DUAL_CLUTCH',
  OTHER: 'OTHER',
} as const;
export type Transmission = (typeof TRANSMISSION)[keyof typeof TRANSMISSION];

export const DRIVE_TYPE = {
  FWD: 'FWD',
  RWD: 'RWD',
  AWD: 'AWD',
  FOUR_WD: 'FOUR_WD',
} as const;
export type DriveType = (typeof DRIVE_TYPE)[keyof typeof DRIVE_TYPE];

export const BODY_TYPE = {
  SEDAN: 'SEDAN',
  SUV: 'SUV',
  HATCHBACK: 'HATCHBACK',
  COUPE: 'COUPE',
  CONVERTIBLE: 'CONVERTIBLE',
  PICKUP: 'PICKUP',
  VAN: 'VAN',
  WAGON: 'WAGON',
  OTHER: 'OTHER',
} as const;
export type BodyType = (typeof BODY_TYPE)[keyof typeof BODY_TYPE];

export const VEHICLE_CONDITION = {
  NEW: 'NEW',
  USED: 'USED',
  CERTIFIED_PRE_OWNED: 'CERTIFIED_PRE_OWNED',
} as const;
export type VehicleCondition =
  (typeof VEHICLE_CONDITION)[keyof typeof VEHICLE_CONDITION];

export const MILEAGE_UNIT = {
  KM: 'KM',
  MILES: 'MILES',
} as const;
export type MileageUnit = (typeof MILEAGE_UNIT)[keyof typeof MILEAGE_UNIT];

export const SELLER_TYPE = {
  INDIVIDUAL: 'INDIVIDUAL',
  COMPANY: 'COMPANY',
} as const;
export type SellerType = (typeof SELLER_TYPE)[keyof typeof SELLER_TYPE];

export const EXPENSE_CATEGORY = {
  TRANSPORT: 'TRANSPORT',
  REPAIR: 'REPAIR',
  CUSTOMS: 'CUSTOMS',
  REGISTRATION: 'REGISTRATION',
  CLEANING: 'CLEANING',
  MAINTENANCE: 'MAINTENANCE',
  PARTS: 'PARTS',
  OTHER: 'OTHER',
} as const;
export type ExpenseCategory =
  (typeof EXPENSE_CATEGORY)[keyof typeof EXPENSE_CATEGORY];

export const GENERAL_EXPENSE_CATEGORY = {
  RENT: 'RENT',
  UTILITIES: 'UTILITIES',
  SALARIES: 'SALARIES',
  MARKETING: 'MARKETING',
  SUPPLIES: 'SUPPLIES',
  OTHER: 'OTHER',
} as const;
export type GeneralExpenseCategory =
  (typeof GENERAL_EXPENSE_CATEGORY)[keyof typeof GENERAL_EXPENSE_CATEGORY];

export const AUDIT_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  STATUS_CHANGE: 'STATUS_CHANGE',
  PUBLISH: 'PUBLISH',
  UNPUBLISH: 'UNPUBLISH',
  PURCHASE_CREATE: 'PURCHASE_CREATE',
  SALE_CREATE: 'SALE_CREATE',
  ORDER_STATUS_CHANGE: 'ORDER_STATUS_CHANGE',
} as const;
export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];