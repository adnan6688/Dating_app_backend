import { envVars } from "../config/env"
import { Role, Status } from "../modules/User/user.interface"
import { User } from "../modules/User/user.model"
import bcrypt from 'bcrypt'





export const seedAdmin = async (): Promise<void> => {
  try {
    const email = envVars.ADMIN_EMAIL

    if (!email || !envVars.ADMIN_PASSWORD) {
      // eslint-disable-next-line no-console
      console.log("❌ Admin credentials are missing in environment variables.")
      return
    }

    const existingAdmin = await User.findOne({ email, role : Role.ADMIN })

    if (existingAdmin) {
      // eslint-disable-next-line no-console
      console.log("⚠️ Admin already exists. Skipping creation...")
      return
    }

    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    )

    const adminData = {
      email,
      password: hashedPassword,
      displayName: "Golam Faruk Adnan",
      status: Status.ACTIVE,
      role: Role.ADMIN,
      isVerified :true
    }

    await User.create(adminData)

    // eslint-disable-next-line no-console
    console.log("✅ Admin created successfully!")
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("🚨 Failed to create admin:", error)
  }
}