import { GENDERS, SERVICES, SKILLS } from 'utils/constants'

type ObjectValuesUnion<T extends Record<string, string>> = T extends Record<string, infer U> ? U : never

export type Skill = (typeof SKILLS)[number]

export type Gender = (typeof GENDERS)[number]

export type Service = ObjectValuesUnion<typeof SERVICES>
