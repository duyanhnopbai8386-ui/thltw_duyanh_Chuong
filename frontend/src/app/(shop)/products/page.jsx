'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/shop/product/ProductCard';

function ProductListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category_id') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand_id') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('price_range') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [perPage, setPerPage] = useState(Number(searchParams.get('per_page') || 8));

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Tải danh mục và thương hiệu
  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/categories?limit=100').then(r => r.json()),
      fetch('http://127.0.0.1:8000/api/brands').then(r => r.json()),
    ]).then(([catData, brandData]) => {
      setCategories(catData.data || []);
      setBrands(brandData.data || []);
    }).catch(err => console.error('Lỗi tải danh mục/thương hiệu:', err));
  }, []);

  // Đồng bộ khi URL thay đổi (VD: bấm từ danh mục trang chủ vào)
  useEffect(() => {
    const catId = searchParams.get('category_id');
    if (catId !== null) setSelectedCategory(catId);
    const bId = searchParams.get('brand_id');
    if (bId !== null) setSelectedBrand(bId);
    const s = searchParams.get('sort');
    if (s) setSort(s);
  }, [searchParams]);

  // 2. Tải danh sách sản phẩm theo bộ lọc
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (selectedBrand) params.append('brand_id', selectedBrand);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('per_page', perPage);

      // Xử lý khoảng giá
      if (priceRange === 'under_2m') {
        params.append('max_price', '2000000');
      } else if (priceRange === '2m_10m') {
        params.append('min_price', '2000000');
        params.append('max_price', '10000000');
      } else if (priceRange === '10m_30m') {
        params.append('min_price', '10000000');
        params.append('max_price', '30000000');
      } else if (priceRange === 'above_30m') {
        params.append('min_price', '30000000');
      }

      const res = await fetch(`http://127.0.0.1:8000/api/products?${params.toString()}`);
      const data = await res.json();

      setProducts(data.data || []);
      if (data.meta) {
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          total: data.meta.total,
        });
      }
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedBrand, priceRange, sort, page, perPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Xử lý submit tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // Reset tất cả bộ lọc
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange('');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedBrand || priceRange || sort !== 'newest'
  );

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Title & Breadcrumbs */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Tất cả sản phẩm.
          </h1>
          <p className="text-gray-500 font-light text-sm sm:text-base">
            Khám phá các thiết bị công nghệ chính hãng, cấu hình mạnh mẽ cùng nhiều ưu đãi hấp dẫn.
          </p>
        </div>

        {/* TOP TOOLBAR: TÌM KIẾM & BỘ LỌC CHÍNH */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8 space-y-4">
          
          {/* Hàng 1: Tìm kiếm & Sắp xếp */}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
            
            {/* Form tìm kiếm */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Tìm tên sản phẩm, thông số..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-gray-200 focus:border-blue-500 focus:bg-white rounded-2xl pl-10 pr-20 py-2.5 text-xs sm:text-sm outline-none transition"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              
              </span>
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition"
              >
                Tìm
              </button>
            </form>

            {/* Sắp xếp & Số lượng hiển thị */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                  <option value="sale">Đang giảm giá (Sale)</option>
                  <option value="name_asc">Tên: A đến Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Hiển thị:</span>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  <option value={4}>4 / trang (Demo)</option>
                  <option value={8}>8 / trang</option>
                  <option value={12}>12 / trang</option>
                  <option value={16}>16 / trang</option>
                </select>
              </div>
            </div>

          </div>

          {/* Hàng 2: Bộ lọc Danh mục, Thương hiệu, Khoảng giá */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-3 items-center">
            
            {/* Lọc Danh mục */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className={`text-xs rounded-xl px-3 py-2 border font-medium outline-none transition ${
                selectedCategory ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Lọc Thương hiệu */}
            <select
              value={selectedBrand}
              onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }}
              className={`text-xs rounded-xl px-3 py-2 border font-medium outline-none transition ${
                selectedBrand ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <option value=""> Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Lọc Mức giá */}
            <select
              value={priceRange}
              onChange={(e) => { setPriceRange(e.target.value); setPage(1); }}
              className={`text-xs rounded-xl px-3 py-2 border font-medium outline-none transition ${
                priceRange ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <option value="">Mọi mức giá</option>
              <option value="under_2m">Dưới 2 triệu</option>
              <option value="2m_10m">2 triệu - 10 triệu</option>
              <option value="10m_30m">10 triệu - 30 triệu</option>
              <option value="above_30m">Trên 30 triệu</option>
            </select>

            {/* Nút Xóa bộ lọc */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl font-medium transition flex items-center gap-1"
              >
               Xóa bộ lọc
              </button>
            )}

            {/* Thống kê số lượng kết quả */}
            <span className="text-xs text-gray-400 ml-auto font-medium">
              Tìm thấy <strong className="text-gray-800">{pagination.total}</strong> sản phẩm
            </span>
          </div>

        </div>

        {/* DANH SÁCH SẢN PHẨM HOẶC TRẠNG THÁI LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm animate-pulse">
                <div className="bg-gray-200 h-56 rounded-2xl mb-4 w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-9 bg-gray-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* TRỐNG KẾT QUẢ */
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
              Không có sản phẩm nào thỏa mãn các điều kiện tìm kiếm hoặc bộ lọc hiện tại.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition"
            >
              Xem lại tất cả sản phẩm
            </button>
          </div>
        )}

        {/* THANH PHÂN TRANG (PAGINATION BAR) */}
        <div className="mt-12 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-medium">
            Trang <strong className="text-gray-900">{pagination.current_page}</strong> / <strong className="text-gray-900">{pagination.last_page || 1}</strong> (Tổng {pagination.total} sản phẩm)
          </div>

          <div className="flex items-center gap-1.5">
            {/* Nút lùi */}
            <button
              disabled={pagination.current_page <= 1}
              onClick={() => { setPage(pagination.current_page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              &larr; Trang trước
            </button>

            {/* Các số trang */}
            {Array.from({ length: pagination.last_page || 1 }, (_, i) => i + 1).map((p) => {
              // Chỉ hiển thị tối đa 5 trang xung quanh trang hiện tại nếu nhiều trang
              if (
                pagination.last_page > 7 &&
                Math.abs(p - pagination.current_page) > 2 &&
                p !== 1 &&
                p !== pagination.last_page
              ) {
                return null;
              }

              return (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    p === pagination.current_page
                      ? 'bg-black text-white shadow-sm'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {/* Nút tiếp */}
            <button
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => { setPage(pagination.current_page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              Trang sau &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center text-sm text-gray-500">Đang tải danh sách sản phẩm...</div>}>
      <ProductListContent />
    </Suspense>
  );
}
