// ============================================================
// BACKEND — Email Service (EmailJS transport)
// ============================================================
// Handles two outbound flows:
//   1. Admin alert emails  (login / signup activity)
//   2. Welcome emails      (sent to the user's own inbox)
// Credentials are read fresh on every call so the Admin Panel
// can override them at runtime without a page reload.
// ============================================================

import { EMAIL_DEFAULT_CONFIG, STORAGE_KEYS, MAX_EMAIL_LOG } from '../config/app.config';
import type { EmailNotification, WelcomeEmail } from '../models';

/** Load runtime config from storage (set by Admin Panel), falling back to defaults */
function getRuntimeConfig() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.EMAIL_RUNTIME_CONFIG);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          PUBLIC_KEY: parsed.publicKey || EMAIL_DEFAULT_CONFIG.PUBLIC_KEY,
          SERVICE_ID: parsed.serviceId || EMAIL_DEFAULT_CONFIG.SERVICE_ID,
          TEMPLATE_ID: parsed.templateId || EMAIL_DEFAULT_CONFIG.TEMPLATE_ID,
          ADMIN_EMAIL: parsed.adminEmail || EMAIL_DEFAULT_CONFIG.ADMIN_EMAIL,
        };
      } catch {
        return EMAIL_DEFAULT_CONFIG;
      }
    }
  }
  return EMAIL_DEFAULT_CONFIG;
}

/** Function to get fresh config (checks storage every call) */
function getConfig() {
  return getRuntimeConfig();
}

export const emailService = {
  // Send notification email to ADMIN
  sendNotification: async (notification: EmailNotification): Promise<boolean> => {
    const cfg = getConfig();
    console.log('📧 [EmailJS] Sending ADMIN notification...');

    const isCfg = cfg.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY';
    if (!isCfg) {
      console.warn('[EmailJS] ⚠️ Not configured.');
      return false;
    }

    try {
      const emailjs = await import('@emailjs/browser');

      const templateParams = {
        to_email: cfg.ADMIN_EMAIL,
        subject: `🔔 TravelTogether Alert: ${notification.type.replace('_', ' ').toUpperCase()}`,
        message: notification.message,
        user_name: notification.userName,
        user_email: notification.userEmail,
        timestamp: new Date(notification.timestamp).toLocaleString('en-IN'),
        notification_type: notification.type,
      };

      console.log('📧 [EmailJS] Config:', cfg);
      console.log('📧 [EmailJS] Params:', templateParams);

      const result = await emailjs.send(
        cfg.SERVICE_ID,
        cfg.TEMPLATE_ID,
        templateParams,
        cfg.PUBLIC_KEY
      );

      console.log('[EmailJS] ✅ Admin email sent! Response:', result);
      return true;
    } catch (error) {
      console.error('[EmailJS] ❌ Failed to send admin email:', error);
      return false;
    }
  },

  // Send WELCOME email directly TO the user's own email
  sendWelcomeEmail: async (welcomeData: WelcomeEmail): Promise<boolean> => {
    const cfg = getConfig();
    console.log('🎉 [Welcome Email] Preparing welcome email for:', welcomeData.userEmail);

    const isCfg = cfg.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY';
    if (!isCfg) {
      console.warn('[Welcome Email] ⚠️ Not configured.');
      return false;
    }

    try {
      const emailjs = await import('@emailjs/browser');

      const isLogin = welcomeData.type === 'welcome_login';

      const templateParams = {
        to_email: welcomeData.userEmail,
        subject: isLogin
          ? `👋 Welcome back, ${welcomeData.userName}! - TravelTogether`
          : `🎉 Welcome to TravelTogether, ${welcomeData.userName}!`,
        message: isLogin
          ? `Hey ${welcomeData.userName}! Welcome back! We're excited to have you traveling with us again. Happy travels! ✈️ — Team TravelTogether`
          : `Hey ${welcomeData.userName}! Welcome to TravelTogether! You're now part of a community of 12,000+ travelers. Explore destinations, find travel buddies, and start your next adventure! Happy travels! ✈️ — Team TravelTogether`,
        user_name: welcomeData.userName,
        user_email: welcomeData.userEmail,
        timestamp: new Date(welcomeData.timestamp).toLocaleString('en-IN'),
        notification_type: welcomeData.type,
      };

      console.log('🎉 [Welcome Email] Config:', cfg);
      console.log('🎉 [Welcome Email] Subject:', templateParams.subject);

      const result = await emailjs.send(
        cfg.SERVICE_ID,
        cfg.TEMPLATE_ID,
        templateParams,
        cfg.PUBLIC_KEY
      );

      console.log('[Welcome Email] ✅ Welcome email sent to', welcomeData.userEmail);
      console.log('[Welcome Email] Response:', result);

      // Log to storage
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMAIL_LOG) || '[]');
      stored.unshift({
        type: welcomeData.type,
        to: welcomeData.userEmail,
        userName: welcomeData.userName,
        timestamp: welcomeData.timestamp,
        sent: true,
        welcome: true
      });
      localStorage.setItem(STORAGE_KEYS.EMAIL_LOG, JSON.stringify(stored.slice(0, MAX_EMAIL_LOG)));

      return true;
    } catch (error) {
      console.error('[Welcome Email] ❌ Failed:', error);
      // Log failure
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMAIL_LOG) || '[]');
      stored.unshift({
        type: welcomeData.type,
        to: welcomeData.userEmail,
        userName: welcomeData.userName,
        timestamp: welcomeData.timestamp,
        sent: false,
        welcome: true,
        error: String(error)
      });
      localStorage.setItem(STORAGE_KEYS.EMAIL_LOG, JSON.stringify(stored.slice(0, MAX_EMAIL_LOG)));
      return false;
    }
  },

  getEmailLog: (): any[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EMAIL_LOG) || '[]');
  },

  clearEmailLog: (): void => {
    localStorage.removeItem(STORAGE_KEYS.EMAIL_LOG);
  },

  isConfigured: (): boolean => getConfig().PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY',

  getConfig: getConfig,
};
