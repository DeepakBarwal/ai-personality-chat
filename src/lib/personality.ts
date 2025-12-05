export function shouldTriggerProfile(message: string): boolean {
    const triggers = [
        'who am i',
        'tell me about myself',
        'my personality',
        'analyze me',
        'what do you think of me'
    ]
    const lowerMessage = message.toLowerCase()
    return triggers.some(trigger => lowerMessage.includes(trigger))
}

export function getSystemPrompt(isProfileRequest: boolean): string {
    if (isProfileRequest) {
        return "You are an expert psychologist. Analyze the user's chat history and provide a detailed personality profile. Use markdown formatting. Focus on their communication style, interests, and potential traits based on what they've said."
    }
    return "You are a helpful AI assistant."
}
