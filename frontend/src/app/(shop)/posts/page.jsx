'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      params.append('page', page);
      params.append('per_page', 9);
      params.append('status', 1);

      const res = await fetch(`http://127.0.0.1:8000/api/posts?${params.toString()}`);
      const data = await res.json();

      setPosts(data.data || []);
      if (data.meta) {
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          total: data.meta.total,
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải bài viết:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">
            Tin Tức & Sự Kiện Công Nghệ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mt-2 mb-3">
            Góc Nhìn Công Nghệ.
          </h1>
          <p className="text-gray-500 font-light text-sm sm:text-base">
            Cập nhật xu hướng thiết bị mới nhất, mẹo sử dụng phụ kiện và các chương trình khuyến mãi đặc sắc.
          </p>
        </div>

        {/* THANH TÌM KIẾM BÀI VIẾT */}
        <div className="max-w-xl mx-auto mb-12">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, mẹo công nghệ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-full pl-5 pr-28 py-3 text-xs sm:text-sm shadow-sm outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-black hover:bg-gray-800 text-white px-5 rounded-full text-xs font-semibold transition"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <div className="bg-gray-200 h-48 rounded-2xl mb-4 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            {/* BÀI VIẾT TIÊU ĐIỂM (FEATURED POST) */}
            {featuredPost && page === 1 && !search && (
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-12 hover:shadow-md transition">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 h-72 sm:h-96 relative overflow-hidden bg-gray-100">
                    <img
                      src={featuredPost.thumbnail || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      Tiêu điểm
                    </span>
                  </div>
                  <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                        <span>{new Date(featuredPost.created_at).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span>{featuredPost.views || 0} lượt xem</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-snug">
                        <Link href={`/posts/${featuredPost.id}`} className="hover:text-blue-600 transition">
                          {featuredPost.title}
                        </Link>
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light line-clamp-3 mb-6">
                        {featuredPost.summary || 'Khám phá bài viết công nghệ mới nhất với nhiều thông tin hữu ích...'}
                      </p>
                    </div>
                    <Link
                      href={`/posts/${featuredPost.id}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                    >
                      Đọc chi tiết bài viết &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* DANH SÁCH BÀI VIẾT DẠNG GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(page === 1 && !search ? regularPosts : posts).map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-48 overflow-hidden bg-gray-100 relative">
                      <img
                        src={post.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-[11px] text-gray-400 mb-2 flex items-center gap-2">
                        <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span>{post.views || 0} lượt xem</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                        <Link href={`/posts/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 font-light leading-relaxed">
                        {post.summary || post.content?.substring(0, 100) || 'Xem bài viết để biết thêm chi tiết...'}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-0">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Xem tiếp <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* PHÂN TRANG */}
            {pagination.last_page > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  &larr; Trang trước
                </button>
                <span className="text-xs text-gray-500 px-3 font-medium">
                  Trang {page} / {pagination.last_page}
                </span>
                <button
                  disabled={page >= pagination.last_page}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  Trang sau &rarr;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto shadow-sm">
            <span className="text-4xl block mb-3">📰</span>
            <h3 className="font-bold text-gray-800 text-base mb-1">Không tìm thấy bài viết</h3>
            <p className="text-xs text-gray-500 mb-6">
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ tin tức.
            </p>
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-800 transition"
            >
              Xem tất cả bài viết
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
