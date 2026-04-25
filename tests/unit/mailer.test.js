const Mailer = require('../../core/mailer.core')
const nodemailer = require('nodemailer')

jest.mock('../../core/logger.core')
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        verify: jest.fn().mockResolvedValue(true),
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
    })
}))

describe('Mailer Core', () => {
    test('should verify connection successfully', async () => {
        const result = await Mailer.verify()
        expect(result).toBe(true)
    })

    test('should send raw mail', async () => {
        const result = await Mailer.sendRaw(
            'test@example.com',
            'Test Subject',
            '<p>Hello</p>'
        )
        expect(result).toHaveProperty('messageId', 'test-id')
    })
})
