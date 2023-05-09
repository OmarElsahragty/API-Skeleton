export const Environments = ["PRODUCTION", "DEVELOPMENT", "SEEDING"] as const;
export type EnvironmentsEnum = (typeof Environments)[number];

export const SocketEvents = ["NOTIFICATION"] as const;
export type SocketEventsEnum = (typeof SocketEvents)[number];

export const AccessTypes = ["ADMIN", "APPROVED", "DENIED"] as const;
export type AccessTypesEnum = (typeof AccessTypes)[number];

// ********************************* //
