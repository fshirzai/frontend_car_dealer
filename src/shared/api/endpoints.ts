/**
 * Central list of all backend endpoint paths.
 * Keeping them in one place means route changes are a one-line fix.
 */
export const ENDPOINTS = {
  // Health
  health: '/health',

  // Auth
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    logoutAll: '/auth/logout-all',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
  },

  // Users
  users: {
    me: '/users/me',
    updateMe: '/users/me',
    changePassword: '/users/me/password',
    list: '/users',
    create: '/users',
    byId: (id: string) => `/users/${id}`,
    activate: (id: string) => `/users/${id}/activate`,
    deactivate: (id: string) => `/users/${id}/deactivate`,
  },

  // Customer profiles
  customerProfiles: {
    me: '/customer-profiles/me',
    list: '/customer-profiles',
    create: '/customer-profiles',
    byId: (id: string) => `/customer-profiles/${id}`,
  },

  // Sellers
  sellers: {
    list: '/sellers',
    create: '/sellers',
    byId: (id: string) => `/sellers/${id}`,
    activate: (id: string) => `/sellers/${id}/activate`,
    deactivate: (id: string) => `/sellers/${id}/deactivate`,
  },

  // Vehicles
  vehicles: {
    // Public
    publicList: '/vehicles',
    publicById: (id: string) => `/vehicles/${id}`,
    images: (vehicleId: string) => `/vehicles/${vehicleId}/images`,
    video: (vehicleId: string) => `/vehicles/${vehicleId}/video`,

    // Staff
    staffList: '/vehicles/staff',
    staffCreate: '/vehicles/staff',
    staffById: (id: string) => `/vehicles/staff/${id}`,
    staffStatus: (id: string) => `/vehicles/staff/${id}/status`,
    staffPublish: (id: string) => `/vehicles/staff/${id}/publish`,
    staffUnpublish: (id: string) => `/vehicles/staff/${id}/unpublish`,
    staffProfit: (id: string) => `/vehicles/staff/${id}/profit`,
    staffReport: '/vehicles/staff/report',

    // Images (staff)
    createImage: (vehicleId: string) => `/vehicles/staff/${vehicleId}/images`,
    bulkImages: (vehicleId: string) => `/vehicles/staff/${vehicleId}/images/bulk`,
    reorderImages: (vehicleId: string) => `/vehicles/staff/${vehicleId}/images/reorder`,
    updateImage: (id: string) => `/vehicles/staff/images/${id}`,
    setPrimaryImage: (id: string) => `/vehicles/staff/images/${id}/primary`,
    deleteImage: (id: string) => `/vehicles/staff/images/${id}`,

    // Video (staff)
    upsertVideo: (vehicleId: string) => `/vehicles/staff/${vehicleId}/video`,
    updateVideo: (vehicleId: string) => `/vehicles/staff/${vehicleId}/video`,
    deleteVideo: (vehicleId: string) => `/vehicles/staff/${vehicleId}/video`,
  },

  // Favorites
  favorites: {
    list: '/favorites',
    add: '/favorites',
    toggle: '/favorites/toggle',
    removeByVehicle: '/favorites',
    removeById: (id: string) => `/favorites/${id}`,
  },

  // Cart
  cart: {
    list: '/cart',
    count: '/cart/count',
    add: '/cart',
    remove: '/cart',
    removeById: (id: string) => `/cart/${id}`,
    clear: '/cart/clear',
  },

  // Orders
  orders: {
    create: '/orders',
    mine: '/orders/mine',
    mineById: (id: string) => `/orders/mine/${id}`,
    cancelMine: (id: string) => `/orders/mine/${id}/cancel`,
    staffList: '/orders/staff',
    staffById: (id: string) => `/orders/staff/${id}`,
    staffStatus: (id: string) => `/orders/staff/${id}/status`,
    staffNotes: (id: string) => `/orders/staff/${id}/staff-notes`,
  },

  // Purchases
  purchases: {
    list: '/purchases',
    create: '/purchases',
    byId: (id: string) => `/purchases/${id}`,
  },

  // Sales
  sales: {
    list: '/sales',
    create: '/sales',
    byId: (id: string) => `/sales/${id}`,
  },

  // Vehicle expenses
  vehicleExpenses: {
    list: '/vehicle-expenses',
    create: '/vehicle-expenses',
    byId: (id: string) => `/vehicle-expenses/${id}`,
    byVehicle: (vehicleId: string) =>
      `/vehicle-expenses/by-vehicle/${vehicleId}`,
    summaryByVehicle: (vehicleId: string) =>
      `/vehicle-expenses/by-vehicle/${vehicleId}/summary`,
  },

  // General expenses
  generalExpenses: {
    list: '/general-expenses',
    create: '/general-expenses',
    byId: (id: string) => `/general-expenses/${id}`,
    summary: '/general-expenses/summary',
  },

  // Audit logs
  auditLogs: {
    list: '/audit-logs',
    byId: (id: string) => `/audit-logs/${id}`,
    byEntity: (entityType: string, entityId: string) =>
      `/audit-logs/by-entity/${entityType}/${entityId}`,
  },

  // Dealership settings
  dealershipSettings: {
    public: '/dealership-settings/public',
    get: '/dealership-settings',
    upsert: '/dealership-settings',
    update: '/dealership-settings',
  },
} as const;