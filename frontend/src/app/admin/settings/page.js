'use client';
import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        site_name: 'DuyAnh & Chương Apple Store',
        hotline: '1900 8888',
        email: 'support@duyanhstore.vn',
        address: '123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh',
        slogan: 'Trải Nghiệm Mua Sắm Thiết Bị Công Nghệ Đỉnh Cao',
        bank_name: 'Ngân hàng Quân Đội (MB Bank)',
        bank_account: '0988888888',
        bank_owner: 'LE NGUYEN NGOC DUY ANH',
        facebook_url: 'https://facebook.com/duyanhstore',
        zalo_number: '0988888888',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data && Object.keys(res.data).length > 0) {
                    setSettings(prev => ({ ...prev, ...res.data }));
                }
            } catch (err) {
                console.error("Lỗi tải cấu hình:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await api.post('/settings', settings);
            setMessage('✓ Cập nhật cấu hình website thành công!');
        } catch (err) {
            alert('Có lỗi xảy ra khi lưu cấu hình!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Cấu hình Hệ thống & Website
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Quản lý thông tin chung, hotline, thanh toán và mạng xã hội của cửa hàng
                </p>
            </div>

            {message && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                
                {/* 1. THÔNG TIN CHUNG */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">
                        1. Thông tin chung Website
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Tên cửa hàng / Website *</label>
                            <input
                                type="text"
                                required
                                value={settings.site_name}
                                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Slogan / Khẩu hiệu</label>
                            <input
                                type="text"
                                value={settings.slogan}
                                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. LIÊN HỆ & ĐỊA CHỈ */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">
                        2. Thông tin Liên hệ & Showroom
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Hotline hỗ trợ</label>
                            <input
                                type="text"
                                value={settings.hotline}
                                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email hỗ trợ khách hàng</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ trụ sở / Showroom</label>
                            <input
                                type="text"
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. TÀI KHOẢN NGÂN HÀNG THANH TOÁN */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">
                        3. Tài khoản Ngân hàng (Dùng hiển thị mã VietQR)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Tên Ngân hàng</label>
                            <input
                                type="text"
                                value={settings.bank_name}
                                onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Số tài khoản</label>
                            <input
                                type="text"
                                value={settings.bank_account}
                                onChange={(e) => setSettings({ ...settings, bank_account: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Chủ tài khoản</label>
                            <input
                                type="text"
                                value={settings.bank_owner}
                                onChange={(e) => setSettings({ ...settings, bank_owner: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. MẠNG XÃ HỘI */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">
                        4. Liên kết Mạng xã hội
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook Fanpage URL</label>
                            <input
                                type="url"
                                value={settings.facebook_url}
                                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Số Zalo tư vấn</label>
                            <input
                                type="text"
                                value={settings.zalo_number}
                                onChange={(e) => setSettings({ ...settings, zalo_number: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-xs font-semibold transition shadow-md disabled:opacity-50"
                    >
                        {saving ? 'Đang lưu cấu hình...' : 'Lưu Thay Đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
}
