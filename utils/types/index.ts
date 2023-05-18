import { APPLICATION_STATUSES, GENDERS, JOB_TYPES, MESSAGE_STATUS, MESSAGE_TYPES, SERVICES, SKILLS, TARGETS } from 'utils/constants'

type ObjectValuesUnion<T extends Record<string, string>> = T extends Record<string, infer U> ? U : never

export type Skill = (typeof SKILLS)[number]

export type Gender = (typeof GENDERS)[number]

export type Service = ObjectValuesUnion<typeof SERVICES>

export type JobType = (typeof JOB_TYPES)[number]

export type JobTypeLowerCase = Lowercase<JobType>

export type Target = ObjectValuesUnion<typeof TARGETS>

export type ApplicationStatus = ObjectValuesUnion<typeof APPLICATION_STATUSES>

export type MessageType = (typeof MESSAGE_TYPES)[number]

export type MessageStatus = ObjectValuesUnion<typeof MESSAGE_STATUS>
