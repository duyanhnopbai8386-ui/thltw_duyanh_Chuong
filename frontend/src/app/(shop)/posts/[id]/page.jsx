'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PostDetailPage({ params: propParams }) {
  const routeParams = useParams();
  const postId = routeParams?.id || propParams?.id;

  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const [resPost, resRecent] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/posts/${postId}`),
          fetch('http://127.0.0.1:8000/api/posts?per_page=4&status=1'),
        ]);

        if (resPost.ok) {
          const data = await resPost.json();
          setPost(data.data || data);
        }

        if (resRecent.ok) {
          const dataRecent = await resRecent.json();
          const items = dataRecent.data || [];
          setRecentPosts(items.filter((p) => String(p.id) !== String(postId)).slice(0, 3));
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết bài viết:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-72 bg-gray-200 rounded-3xl mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#f5f5f7] min-h-screen py-24 text-center px-6">
        <span className="text-4xl block mb-3">⚠️</span>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
        <p className="text-xs text-gray-500 mb-6">Bài viết này không tồn tại hoặc đã được gỡ bỏ.</p>
        <Link
          href="/posts"
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-800 transition"
        >
          &larr; Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link href="/" className="hover:text-black transition">Trang chủ</Link>
          <span>/</span>
          <Link href="/posts" className="hover:text-black transition">Tin tức</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate">{post.title}</span>
        </nav>

        {/* BÀI VIẾT CHÍNH */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-gray-100 mb-12">
          
          {/* HEADER BÀI VIẾT */}
          <div className="border-b border-gray-100 pb-6 mb-8">
            <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Tin Công Nghệ
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">E</span>
                Ban biên tập E-Shop
              </span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
              <span>•</span>
              <span>{post.views || 0} lượt xem</span>
            </div>
          </div>

          {/* SUMMARY NỔI BẬT */}
          {post.summary && (
            <div className="bg-blue-50/60 border-l-4 border-blue-500 p-4 rounded-r-2xl mb-8">
              <p className="text-xs sm:text-sm text-blue-900 font-medium leading-relaxed italic">
                "{post.summary}"
              </p>
            </div>
          )}

          {/* ẢNH THUMBNAIL LỚN */}
          {post.thumbnail && (
            <div className="rounded-2xl overflow-hidden mb-8 max-h-[420px] bg-gray-100 border border-gray-100">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* NỘI DUNG CHI TIẾT */}
          <div className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed space-y-4 font-light text-sm sm:text-base">
            {post.content ? (
              post.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>Nội dung chi tiết đang được cập nhật...</p>
            )}
          </div>

          {/* NÚT QUAY LẠI */}
          <div className="pt-10 mt-10 border-t border-gray-100 flex justify-between items-center">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              &larr; Xem tất cả bài viết khác
            </Link>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép liên kết bài viết!');
                }
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs font-medium transition"
            >
              Chia sẻ bài viết
            </button>
          </div>
        </article>

        {/* BÀI VIẾT LIÊN QUAN / MỚI NHẤT KHÁC */}
        {recentPosts.length > 0 && (
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
              Bài viết công nghệ mới nhất
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 rounded-xl overflow-hidden bg-gray-100 mb-3">
                      <img
                        src={rPost.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'}
                        alt={rPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1.5 hover:text-blue-600 transition">
                      <Link href={`/posts/${rPost.id}`}>
                        {rPost.title}
                      </Link>
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {new Date(rPost.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <Link
                    href={`/posts/${rPost.id}`}
                    className="text-xs text-blue-600 font-semibold hover:underline mt-3"
                  >
                    Xem bài viết &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
