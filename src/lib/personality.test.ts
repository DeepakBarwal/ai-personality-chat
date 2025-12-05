import { describe, it, expect } from 'vitest'
import { shouldTriggerProfile, getSystemPrompt } from './personality'

describe('Personality Logic', () => {
    describe('shouldTriggerProfile', () => {
        it('should trigger profile for "who am i" variations', () => {
            expect(shouldTriggerProfile('Who am I?')).toBe(true)
            expect(shouldTriggerProfile('who am i')).toBe(true)
            expect(shouldTriggerProfile('WHO AM I?')).toBe(true)
        })

        it('should trigger profile for "tell me about myself"', () => {
            expect(shouldTriggerProfile('Tell me about myself')).toBe(true)
            expect(shouldTriggerProfile('Can you tell me about myself?')).toBe(true)
        })

        it('should trigger profile for "my personality"', () => {
            expect(shouldTriggerProfile('What is my personality like?')).toBe(true)
            expect(shouldTriggerProfile('Describe my personality')).toBe(true)
        })

        it('should trigger profile for "analyze me"', () => {
            expect(shouldTriggerProfile('analyze me please')).toBe(true)
            expect(shouldTriggerProfile('Can you analyze me?')).toBe(true)
        })

        it('should trigger profile for "describe me"', () => {
            expect(shouldTriggerProfile('describe me')).toBe(true)
            expect(shouldTriggerProfile('How would you describe me?')).toBe(true)
        })

        it('should trigger profile for "what have you learned about me"', () => {
            expect(shouldTriggerProfile('what have you learned about me?')).toBe(true)
        })

        it('should trigger profile for "profile me"', () => {
            expect(shouldTriggerProfile('profile me')).toBe(true)
        })

        it('should NOT trigger for regular messages', () => {
            expect(shouldTriggerProfile('hello world')).toBe(false)
            expect(shouldTriggerProfile('What is the weather?')).toBe(false)
            expect(shouldTriggerProfile('Tell me a joke')).toBe(false)
            expect(shouldTriggerProfile('Who is the president?')).toBe(false)
            expect(shouldTriggerProfile('Describe this image')).toBe(false)
        })

        it('should be case insensitive', () => {
            expect(shouldTriggerProfile('WHO AM I?')).toBe(true)
            expect(shouldTriggerProfile('ANALYZE ME')).toBe(true)
            expect(shouldTriggerProfile('Profile Me Please')).toBe(true)
        })
    })

    describe('getSystemPrompt', () => {
        it('should return personality analyst prompt when triggered', () => {
            const profilePrompt = getSystemPrompt(true)
            expect(profilePrompt).toContain('personality analyst')
            expect(profilePrompt).toContain('Personality Profile')
        })

        it('should include structured sections in profile prompt', () => {
            const profilePrompt = getSystemPrompt(true)
            expect(profilePrompt).toContain('Communication Style')
            expect(profilePrompt).toContain('Interests & Topics')
            expect(profilePrompt).toContain('Personality Traits')
            expect(profilePrompt).toContain('Summary')
        })

        it('should include emoji headers in profile prompt', () => {
            const profilePrompt = getSystemPrompt(true)
            expect(profilePrompt).toContain('🧠')
            expect(profilePrompt).toContain('💬')
            expect(profilePrompt).toContain('🎯')
            expect(profilePrompt).toContain('✨')
            expect(profilePrompt).toContain('📝')
        })

        it('should instruct to analyze conversation history', () => {
            const profilePrompt = getSystemPrompt(true)
            expect(profilePrompt).toContain('conversation history')
            expect(profilePrompt).toContain('NEVER say you don\'t have access')
        })

        it('should return helpful assistant prompt when not triggered', () => {
            const normalPrompt = getSystemPrompt(false)
            expect(normalPrompt).toContain('helpful')
            expect(normalPrompt).toContain('friendly')
        })

        it('should have different prompts for each mode', () => {
            const profilePrompt = getSystemPrompt(true)
            const normalPrompt = getSystemPrompt(false)
            expect(profilePrompt).not.toBe(normalPrompt)
            expect(profilePrompt.length).toBeGreaterThan(normalPrompt.length)
        })
    })
})
