import { supabase } from '../supabase';

export interface AuthUser {
  uid: string;
  email: string | null;
  sessionPassword?: string;
}

let authCallback: ((user: AuthUser | null) => void) | null = null;

export const authService = {
  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => {
    authCallback = callback;
    
    // Check initial session
    const savedUser = localStorage.getItem('ok_app_db_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        callback(u);
      } catch (e) {
        callback(null);
      }
    } else {
      callback(null);
    }

    return () => {
      authCallback = null;
    };
  },

  signIn: async (email: string, password: string) => {
    const lowerEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (!lowerEmail) {
      throw new Error('يرجى إدخال البريد الإلكتروني.');
    }
    if (!cleanPassword) {
      throw new Error('يرجى إدخال كلمة المرور.');
    }

    // Direct and strict authentication against Supabase users table ONLY
    // No hardcoded emails, no mock accounts, no local fallback accounts
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', lowerEmail);

    if (error) {
      console.error('Supabase query error in authService.signIn:', error);
      throw new Error('تعذر الاتصال بـ Supabase: ' + (error.message || 'يرجى التحقق من إعدادات الاتصال'));
    }

    if (!users || users.length === 0) {
      throw new Error('البريد الإلكتروني غير مسجل في قاعدة بيانات Supabase (جدول users).');
    }

    const targetUser = users[0];
    const dbPassword = String(targetUser.password || '').trim();

    if (dbPassword !== cleanPassword && targetUser.password !== password) {
      throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور المسجلة للمستخدم في Supabase.');
    }

    if (targetUser.status === 'inactive') {
      throw new Error('هذا الحساب تم تعطيله في قاعدة البيانات.');
    }

    const uid = targetUser.uid || targetUser.id;
    const userSession: AuthUser = { uid, email: lowerEmail, sessionPassword: cleanPassword };
    localStorage.setItem('ok_app_db_user', JSON.stringify(userSession));
    if (authCallback) {
      authCallback(userSession);
    }
    return userSession;
  },

  signUp: async (email: string, password: string) => {
    const randomUid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'uid-' + Math.random().toString(36).substring(2, 12);
    return {
      uid: randomUid,
      email: email.toLowerCase().trim()
    };
  },

  signUpSecondary: async (email: string, password: string) => {
    const randomUid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'uid-' + Math.random().toString(36).substring(2, 12);
    return {
      uid: randomUid,
      email: email.toLowerCase().trim()
    };
  },

  resetPassword: async (email: string) => {
    const lowerEmail = email.toLowerCase().trim();
    const { error } = await supabase.auth.resetPasswordForEmail(lowerEmail);
    if (error) {
      throw new Error(error.message);
    }
  },

  signOut: async () => {
    localStorage.removeItem('ok_app_db_user');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    if (authCallback) {
      authCallback(null);
    }
  },

  deleteUser: async (_email?: string, _password?: string) => {
    // Database deletion via dataService.deleteUser handles user cleanup directly
  },

  getCurrentUser: (): AuthUser | null => {
    const saved = localStorage.getItem('ok_app_db_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
