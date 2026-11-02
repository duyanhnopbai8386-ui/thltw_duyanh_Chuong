'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function StaticPageView({ params: propParams }) {
  const routeParams = useParams();
  const slug = routeParams?.slug || propParams?.slug;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/pages/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        }
      } catch (err) {
        console.error('Lỗi khi tải trang:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen py-24 text-center px-6">
        <span className="text-4xl block mb-3">📄</span>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Trang không tồn tại</h2>
        <p className="text-xs text-gray-500 mb-6">Trang bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ.</p>
        <Link
          href="/"
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-800 transition"
        >
          &larr; Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-black transition">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{page.title}</span>
        </nav>

        {/* NỘI DUNG TRANG */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6 pb-6 border-b border-gray-100">
            {page.title}
          </h1>

          <div className="text-gray-700 leading-relaxed space-y-4 font-light text-sm sm:text-base">
            {page.content ? (
              page.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            ) : (
              <p>Nội dung đang được cập nhật...</p>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>DuyAnh Store • Hệ thống công nghệ uy tín</span>
            <Link href="/" className="text-blue-600 hover:underline font-medium">
              &larr; Khám phá sản phẩm
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
