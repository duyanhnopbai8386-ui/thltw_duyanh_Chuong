'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/product/ProductCard';

export default function ShopHomePage() {
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải dữ liệu động từ Backend Laravel
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resNew, resSale, resHot, resFeatured, resCat] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/products?type=new&per_page=4'),
          fetch('http://127.0.0.1:8000/api/products?type=sale&per_page=4'),
          fetch('http://127.0.0.1:8000/api/products?type=hot&per_page=4'),
          fetch('http://127.0.0.1:8000/api/products?type=featured&per_page=4'),
          fetch('http://127.0.0.1:8000/api/categories?limit=100'),
        ]);

        const [dataNew, dataSale, dataHot, dataFeatured, dataCat] = await Promise.all([
          resNew.json(),
          resSale.json(),
          resHot.json(),
          resFeatured.json(),
          resCat.json(),
        ]);

        setNewProducts(dataNew.data || []);
        setSaleProducts(dataSale.data || []);
        setHotProducts(dataHot.data || []);
        setFeaturedProducts(dataFeatured.data || []);
        setCategories(dataCat.data || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Skeleton loading placeholder
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm animate-pulse">
          <div className="bg-gray-200 h-56 rounded-2xl mb-4 w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-9 bg-gray-200 rounded-full w-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#f5f5f7] min-h-screen">
      
      {/* 1. HERO SECTION (High-Tech Style) */}
      <section className="bg-gradient-to-b from-black via-gray-950 to-neutral-900 text-white pt-20 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-5">
            Trải Nghiệm Mua Sắm Thế Hệ Mới
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5 leading-tight">
            Đột Phá Công Nghệ.<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Đẳng Cấp Tương Lai.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-400 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Khám phá các thiết bị công nghệ chính hãng đỉnh cao: iPhone 15 Pro, MacBook M3, phụ kiện cao cấp với chính sách bảo hành uy tín.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-black px-7 py-3 rounded-full font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Khám phá ngay
            </Link>
            <Link
              href="/products?sort=sale"
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-7 py-3 rounded-full font-semibold text-sm hover:scale-105 active:scale-95 transition-all"
            >
              Xem ưu đãi Sale
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BAR */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-md border border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider px-2">
              Danh mục:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category_id=${cat.id}`}
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-gray-50 hover:bg-black hover:text-white border border-gray-200 transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/products"
              className="text-xs text-blue-600 hover:underline font-semibold px-2"
            >
              Tất cả danh mục &gt;
            </Link>
          </div>
        </section>
      )}

      {/* MAIN CONTAINER FOR 4 SECTIONS */}
      <main className="max-w-7xl mx-auto px-6 py-14 space-y-16">

        {/* SECTION 1: SẢN PHẨM MỚI (NEW ARRIVALS) */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider">
                Mới Cập Nhật
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Sản phẩm mới nhất.
              </h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              Xem tất cả <span aria-hidden="true">&gt;</span>
            </Link>
          </div>

          {loading ? (
            renderSkeletons()
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {newProducts.map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-100">
              Đang cập nhật sản phẩm mới...
            </div>
          )}
        </section>

        {/* SECTION 2: SẢN PHẨM KHUYẾN MÃI (SALE / FLASH SALE) */}
        <section className="bg-gradient-to-r from-red-500/5 via-orange-500/5 to-amber-500/5 p-6 sm:p-8 rounded-3xl border border-red-100">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="inline-flex items-center gap-1 bg-red-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Flash Sale Giá Sốc
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-2">
                Sản phẩm khuyến mãi đặc biệt.
              </h2>
            </div>
            <Link
              href="/products?sort=sale"
              className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
            >
              Xem tất cả khuyến mãi <span aria-hidden="true">&gt;</span>
            </Link>
          </div>

          {loading ? (
            renderSkeletons()
          ) : saleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {saleProducts.map((product) => (
                <ProductCard key={`sale-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-100">
              Chưa có chương trình khuyến mãi nào đang diễn ra.
            </div>
          )}
        </section>

        {/* SECTION 3: SẢN PHẨM HOT / BÁN CHẠY (HOT / BEST SELLER) */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-amber-600 font-semibold text-xs uppercase tracking-wider">
                Được Yêu Thích Nhất
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Sản phẩm Hot bán chạy.
              </h2>
            </div>
            <Link
              href="/products?type=hot"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              Xem thêm <span aria-hidden="true">&gt;</span>
            </Link>
          </div>

          {loading ? (
            renderSkeletons()
          ) : hotProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {hotProducts.map((product) => (
                <ProductCard key={`hot-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-100">
              Đang cập nhật danh sách bán chạy...
            </div>
          )}
        </section>

        {/* SECTION 4: SẢN PHẨM NỔI BẬT (FEATURED PRODUCTS) */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-purple-600 font-semibold text-xs uppercase tracking-wider">
                Lựa Chọn Tiêu Biểu
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Sản phẩm Featured (Nổi bật).
              </h2>
            </div>
            <Link
              href="/products?type=featured"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
            >
              Xem tất cả <span aria-hidden="true">&gt;</span>
            </Link>
          </div>

          {loading ? (
            renderSkeletons()
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={`featured-${product.id}`} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-gray-100">
              Đang cập nhật sản phẩm nổi bật...
            </div>
          )}
        </section>

        {/* BANNER DỊCH VỤ / CAM KẾT */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shrink-0">
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Giao Hàng Siêu Tốc</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ. Nhận hàng trong 2 giờ tại nội thành.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl shrink-0">
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Chính Hãng 100%</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Cam kết hàng mới chính hãng nguyên seal, bảo hành 12 tháng tại các trung tâm ủy quyền.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl shrink-0">
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Đổi Trả Dễ Dàng</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Lỗi 1 đổi 1 trong vòng 30 ngày đầu tiên nếu phát sinh lỗi phần cứng từ nhà sản xuất.
              </p>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
