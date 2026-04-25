const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const envPath = path.join(__dirname, '../../.env')
const envExamplePath = path.join(__dirname, '../../.env.example')

console.log('Starting project setup...')

// Copy .env.example to .env if it doesn't exist
if (!fs.existsSync(envPath)) {
    console.log('.env file not found. Creating from .env.example...')
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath)
        console.log('.env file created successfully.')
    } else {
        console.error('Error: .env.example not found!')
        process.exit(1)
    }
} else {
    console.log('.env file already exists.')
}

// Generate JWT Secrets
const generateSecret = () => crypto.randomBytes(32).toString('hex')
const newJwtSecret = generateSecret()
const newJwtRefreshSecret = generateSecret()

// Update .env with new secrets
try {
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    let updated = false
    
    if (envContent.includes('JWT_SECRET=your-secret-key-change-this-in-production')) {
        envContent = envContent.replace(
            'JWT_SECRET=your-secret-key-change-this-in-production',
            `JWT_SECRET=${newJwtSecret}`
        )
        updated = true
    }
    
    if (envContent.includes('JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production')) {
        envContent = envContent.replace(
            'JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production',
            `JWT_REFRESH_SECRET=${newJwtRefreshSecret}`
        )
        updated = true
    }

    if (updated) {
        fs.writeFileSync(envPath, envContent)
        console.log('JWT secrets generated and saved to .env')
    } else {
        console.log('JWT secrets are already configured.')
    }

} catch (err) {
    console.error(`Error updating .env file: ${err.message}`)
    process.exit(1)
}

console.log('Setup completed successfully!')
