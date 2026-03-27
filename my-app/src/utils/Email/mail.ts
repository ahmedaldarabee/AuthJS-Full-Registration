import { Resend } from 'resend';

export const sendVerificationEmail = async (email:string,token: string) => {
    const domain = process.env.DOMAIN || 'http://localhost:3000';
    const link = `${domain}/verify?token=${token}`;
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
          from: 'onboarding@resend.dev', 
          to: 'seahmednail@gmail.com',
          subject: 'Confirm Your Email - Next-Auth-Project',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Welcome to Next-Auth-Project</h2>
                <p>Please click the link below to verify your email address:</p>
                <a target="_blank" href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
            </div>
          `
        });

        if (error) {
            console.error("Resend Error Response:", error);
            return { error: error.message };
        }

        console.log("Email sent successfully to:", email, "Data:", data);
        return { success: true, data };
        
    } catch (err: any) {
        console.error("Unexpected error in sendVerificationEmail:", err);
        return { error: err.message || "Unknown mail error" };
    }
}

export const sendPasswordReset = async (email:string,token: string) => {
    const domain = process.env.DOMAIN || 'http://localhost:3000';
    const link = `${domain}/reset-password?token=${token}`;
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
          from: 'onboarding@resend.dev', 
          to: 'seahmednail@gmail.com',
          subject: 'Reset your password - Next-Auth-Project',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Welcome to Next-Auth-Project</h2>
                <p>Please click the link below to reset your password:</p>
                <a target="_blank" href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
          `
        });

        if (error) {
            console.error("Resend Error Response:", error);
            return { error: error.message };
        }

        console.log("reset process successfully to:", email, "Data:", data);
        return { success: true, data };
        
    } catch (err: any) {
        return { error: err.message || "Unknown mail error" };
    }
}
