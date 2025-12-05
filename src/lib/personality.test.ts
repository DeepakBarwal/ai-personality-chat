import { describe, it, expect } from 'vitest'
import { shouldTriggerProfile, getSystemPrompt } from './personality'

describe('Personality Logic', () => {
    describe('shouldTriggerProfile', () => {
        it('should trigger profile for specific keywords', () => {
            expect(shouldTriggerProfile('Who am I?')).toBe(true)
            expect(shouldTriggerProfile('Tell me about myself')).toBe(true)
            expect(shouldTriggerProfile('my personality is interesting')).toBe(true)
            expect(shouldTriggerProfile('analyze me please')).toBe(true)
        })

        it('should not trigger for regular messages', () => {
            expect(shouldTriggerProfile('hello world')).toBe(false)
            expect(shouldTriggerProfile('What is the weather?')).toBe(false)
            expect(shouldTriggerProfile('Tell me a joke')).toBe(false)
        })

        it('should be case insensitive', () => {
            expect(shouldTriggerProfile('WHO AM I?')).toBe(true)
            expect(shouldTriggerProfile('who am i')).toBe(true)
        })
    })

    describe('getSystemPrompt', () => {
        it('should return profile prompt when triggered', () => {
            const profilePrompt = getSystemPrompt(true)
            expect(profilePrompt).toContain('expert psychologist')
        })

        it('should return normal prompt when not triggered', () => {
            const normalPrompt = getSystemPrompt(false)
            expect(normalPrompt).toContain('helpful AI assistant')
        })

        it('should have different prompts for each mode', () => {
            const profilePrompt = getSystemPrompt(true)
            const normalPrompt = getSystemPrompt(false)
            expect(profilePrompt).not.toBe(normalPrompt)
        })
    })
})
