import nodemailer from 'nodemailer'
import otpGenerator from "otp-generator"
import { envVars } from "../config/env"


export const sendEmail = async (email: string) => {



  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  })

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envVars.ADMIN_EMAIL,
      pass: envVars.APP_PASSWORD, // 16 digit app password
    },
  })




  await transport.sendMail({

    from: `"Dating App" <${envVars.ADMIN_EMAIL}>`,
    to: `${email}`,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">

  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f12; padding: 40px 0;">
    <tr>
      <td align="center">
        
        <table class="container" width="500" cellpadding="0" cellspacing="0" 
               style="background-color: #1a1a1f; border-radius: 24px; border: 1px solid #2d2d35; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
          
          <tr>
            <td align="center" style="padding: 40px 0 20px 0;">
              <div style=" -webkit-background-clip: text; color: transparent; font-size: 32px; font-weight: 800; letter-spacing: 4px;">
                <img src="https://i.ibb.co.com/JRK3rc6x/edited-photo-6-1-3.png" 
         alt="TRUTH" 
         width="150" 
         style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;">
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px; text-align: center;">
              <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 10px;">Security Checkpoint</h2>
              <p style="color: #a0a0ab; font-size: 15px; line-height: 1.6;">
                To keep your profile safe and authentic, please enter the following code to continue your journey.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 30px 0;">
              <div style="background-color: #25252b; border: 1px solid #3f3f46; display: inline-block; padding: 20px 40px; border-radius: 16px;">
                <span style="font-family: 'Courier New', monospace; font-size: 42px; font-weight: bold; color: #FF1493; letter-spacing: 12px; margin-right: -12px;">
                  ${otp}
                </span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <p style="color: #6a6a75; font-size: 13px;">
                This code is valid for <span style="color: #FF1493;">5 minutes</span>. <br>
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td height="6" style="background: linear-gradient(90deg, #FF00FF, #FF1493, #C7B268);"></td>
          </tr>
        </table>

        <table width="500" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 30px; text-align: center; color: #4b4b53; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
              &copy; ${new Date().getFullYear()} Truth Dating App • Built for Authenticity
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`,
  })


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expiresAt = new Date(Date.now() + 4 * 60 * 1000) // 2 minutes

  // await OTP.create({
  //   email,
  //   otp,
  //   expiresAt,
  // })
  return otp
}