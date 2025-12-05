import { describe, it, expect } from 'vitest'
import { shouldTriggerProfile, getSystemPrompt } from './personality'

describe('Personality Logic', () => {
    describe('shouldTriggerProfile', () => {
        it('should trigger profile for specific keywords', () => {
            expect(shouldTriggerProfile('Who am I?')).toBe(true)
            expect(shouldTriggerProfile('Tell me about myself')).toBe(true)
            expect(shouldTriggerProfile('my personality is interesting')).toBe(true)
            expect(shouldTriggerProfile('analyze me please')).toBe(true)
            expect(shouldTriggerProfile('describe me')).toBe(true)
            expect(shouldTriggerProfile('what have you learned about me?')).toBe(true)
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
            expect(profilePrompt).toContain('personality analyst')
            expect(profilePrompt).toContain('Personality Profile')
            expect(profilePrompt).toContain('Communication Style')
        })

        it('should return normal prompt when not triggered', () => {
            const normalPrompt = getSystemPrompt(false)
            expect(normalPrompt).toContain('helpful')
            expect(normalPrompt).toContain('friendly')
        })

        it('should explicitly instruct to analyze chat history', () => {
            const profilePrompt = getSystemPrompt(true)
            expect(profilePrompt).toContain('conversation history')
            expect(profilePrompt).toContain('NEVER say you don\'t have access')
        })
    })
})
