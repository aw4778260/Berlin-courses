import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // حالة الإشعارات (Toast)
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // دالة عرض الإشعار
  const showToast = (msg, type = 'success') => {
      setToast({ show: true, message: msg, type });
      // إخفاء الإشعار تلقائياً بعد 3 ثواني
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (formData.password !== formData.confirmPassword) {
        return showToast("❌ كلمة المرور غير متطابقة", "error");
    }
    if (formData.password.length < 6) {
        return showToast("⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل", "error");
    }
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(formData.username)) {
        return showToast("⚠️ اسم المستخدم يجب أن يكون حروف إنجليزية وأرقام فقط", "error");
    }

    setLoading(true);

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: formData.firstName,
                username: formData.username,
                password: formData.password,
                phone: formData.phone
            })
        });

        const result = await res.json();

        if (res.ok) {
            showToast("✅ " + result.message, "success");
            // تأخير التوجيه قليلاً ليقرأ المستخدم الرسالة
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } else {
            showToast("❌ " + result.message, "error");
        }
    } catch (err) {
        showToast("فشل الاتصال بالسيرفر", "error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <Head><title>إنشاء حساب جديد</title></Head>
      
      {/* مكون الإشعار (Toast) */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
          {toast.message}
      </div>
      
      <div className="form-box">
        <h2 className="title">📝 إنشاء حساب جديد</h2>
        <p className="sub-title">سجل بياناتك لتبدأ رحلتك التعليمية</p>

        <form onSubmit={handleSubmit} className="form-column">
            
            <div className="input-group">
                <label>الاسم الثلاثي</label>
                <input 
                    className="input-field" 
                    placeholder="مثال: أحمد محمد علي"
                    value={formData.firstName} 
                    onChange={e=>setFormData({...formData, firstName: e.target.value})} 
                    required
                />
            </div>
            
            <div className="input-group">
                <label>رقم الهاتف</label>
                <input 
                    className="input-field" 
                    placeholder="01xxxxxxxxx"
                    value={formData.phone} 
                    onChange={e=>setFormData({...formData, phone: e.target.value})} 
                    required
                />
            </div>
            
            <div className="input-group">
                <label>اسم المستخدم (للدخول)</label>
                <input 
                    className="input-field" 
                    placeholder="username"
                    value={formData.username} 
                    onChange={e=>setFormData({...formData, username: e.target.value})} 
                    required
                />
            </div>
            
            <div className="input-group">
                <label>كلمة المرور</label>
                <input 
                    className="input-field" 
                    type="password" 
                    placeholder="••••••"
                    value={formData.password} 
                    onChange={e=>setFormData({...formData, password: e.target.value})} 
                    required
                />
            </div>
            
            <div className="input-group">
                <label>تأكيد كلمة المرور</label>
                <input 
                    className="input-field" 
                    type="password" 
                    placeholder="••••••"
                    value={formData.confirmPassword} 
                    onChange={e=>setFormData({...formData, confirmPassword: e.target.value})} 
                    required
                />
            </div>

            <button type="submit" disabled={loading} className="button-link action-btn">
                {loading ? 'جاري التسجيل...' : 'إنشاء الحساب ✅'}
            </button>

            <div className="login-link">
                لديك حساب بالفعل؟ <span onClick={() => router.push('/login')}>سجل دخول هنا</span>
            </div>
        </form>
      </div>

      <style jsx>{`
        .form-box { 
            background: #1e293b; 
            padding: 30px; 
            border-radius: 16px; 
            width: 100%; 
            max-width: 450px; 
            border: 1px solid #334155; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        
        .title { text-align: center; color: #38bdf8; margin: 0 0 10px; font-size: 1.8em; }
        .sub-title { text-align: center; color: #94a3b8; margin-bottom: 30px; font-size: 0.9em; }
        
        .form-column { display: flex; flex-direction: column; gap: 15px; }
        
        .input-group label { display: block; color: #cbd5e1; margin-bottom: 5px; font-size: 0.9em; font-weight: bold; }
        .input-field { 
            padding: 12px; background: #0f172a; border: 1px solid #475569; 
            border-radius: 8px; color: white; width: 100%; font-size: 16px; transition: 0.2s;
        }
        .input-field:focus { border-color: #38bdf8; outline: none; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
        
        .action-btn { 
            justify-content: center; font-weight: bold; background: #38bdf8; color: #0f172a; border: none; margin-top: 10px;
        }
        .action-btn:hover { background: #7dd3fc; }
        .action-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .login-link { text-align: center; margin-top: 20px; color: #94a3b8; font-size: 0.9em; }
        .login-link span { color: #38bdf8; cursor: pointer; text-decoration: underline; font-weight: bold; }

        /* Toast Styles */
        .toast { 
            position: fixed; 
            top: 20px; 
            left: 50%; 
            transform: translateX(-50%) translateY(-100px); 
            background: #1e293b; 
            color: white; 
            padding: 12px 24px; 
            border-radius: 8px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
            border: 1px solid #334155; 
            z-index: 2000; 
            transition: transform 0.3s ease; 
            font-weight: bold; 
            display: flex; 
            align-items: center; 
            gap: 10px; 
            white-space: nowrap; 
        }
        .toast.show { transform: translateX(-50%) translateY(0); }
        .toast.success { border-color: #22c55e; color: #22c55e; }
        .toast.error { border-color: #ef4444; color: #ef4444; }
      `}</style>
    </div>
  );
}
