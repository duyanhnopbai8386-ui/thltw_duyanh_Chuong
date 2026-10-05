import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="bg-[#f5f5f7] min-h-screen flex items-center justify-center py-20 px-6">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] p-10 border border-gray-100">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Tạo tài khoản.</h1>
          <p className="text-gray-500 font-light">
            Tham gia cùng chúng tôi để nhận những ưu đãi đặc biệt.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <input 
              type="text" 
              placeholder="Tim Cook"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              placeholder="apple@example.com"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-gray-300 focus:bg-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-gray-400 font-medium text-gray-900"
            />
          </div>

          <button 
            type="button"
            className="w-full bg-black text-white font-medium text-lg py-3.5 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-md mt-6"
          >
            Đăng ký
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-[#0071e3] font-medium hover:underline">
              Đăng nhập ngay &gt;
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
