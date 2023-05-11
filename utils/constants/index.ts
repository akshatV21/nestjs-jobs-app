export const SKILLS = [
  'javascript',
  'frontend',
  'reactjs',
  'vuejs',
  'angularjs',
  'backend',
  'expressjs',
  'nodejs',
  'nestjs',
  'typescript',
  'docker',
  'redis',
  'rabbitmq',
  'grpc',
  'kubernetes',
  'aws',
  'gcp',
  'azure',
] as const

export const GENDERS = ['male', 'female', 'transgender'] as const

export const SERVICES = {
  AUTH_SERVICE: 'AUTH',
  JOBS_SERVICE: 'JOBS',
  PAYMENTS_SERVICE: 'PAYMENTS',
} as const

export const JOB_TYPES = ['ON_SITE', 'REMOTE', 'HYBRID'] as const

export const TARGETS = {
  USER: 'user',
  COMPANY: 'company',
  BOTH: 'both',
} as const

export const EXCEPTION_MSGS = {
  NULL_TOKEN: 'TokenNotProvided',
  UNAUTHORIZED: 'UnauthorizedAccess',
  JWT_EXPIRED: 'JwtExpired',
  INVALID_JWT: 'InvalidJwt',
} as const

export const APPLICATION_STATUSES = {
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  IN_PROCESS: 'in-process',
} as const
