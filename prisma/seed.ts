import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Read credentials from environment variables
  const email = process.env.DEMO_USER_EMAIL
  const password = process.env.DEMO_USER_PASSWORD
  const name = process.env.DEMO_USER_NAME || 'Demo User'

  if (!email || !password) {
    console.error('Error: DEMO_USER_EMAIL and DEMO_USER_PASSWORD must be set in environment variables')
    console.log('Example:')
    console.log('  DEMO_USER_EMAIL=your@email.com')
    console.log('  DEMO_USER_PASSWORD=your-secure-password')
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
    },
    create: {
      email,
      name,
      password: hashedPassword,
    },
  })

  console.log('Demo user created/updated:', { email: user.email, name: user.name })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
