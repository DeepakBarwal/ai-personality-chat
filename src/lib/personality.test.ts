import { describe, it, expect } from 'vitest'
import { shouldTriggerProfile, getSystemPrompt } from './personality'

describe('Personality Logic', () => {
    it('should trigger profile for specific keywords', () => {
        expect(shouldTriggerProfile('Who am I?')).toBe(true)
        expect(shouldTriggerProfile('Tell me about myself')).toBe(true)
        expect(shouldTriggerProfile('analyze my personality')).toBe(true)
        expect(shouldTriggerProfile('hello world')).toBe(false)
    })

    it('should return correct system prompt', () => {
        const profilePrompt = getSystemPrompt(true)
        const normalPrompt = getSystemPrompt(false)

        expect(profilePrompt).toContain('expert psychologist')
        expect(normalPrompt).toContain('helpful AI assistant')
    })
})
