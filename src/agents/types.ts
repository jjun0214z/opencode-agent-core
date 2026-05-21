export type AgentMode = "primary" | "background"

export type AgentCost = "FREE" | "CHEAP" | "EXPENSIVE"

export interface AgentTrigger {
  domain: string
  trigger: string
}

export interface AgentMetadata {
  cost: AgentCost
  category: string
  triggers: AgentTrigger[]
  keyTrigger?: string
  useWhen?: string[]
  avoidWhen?: string[]
}
