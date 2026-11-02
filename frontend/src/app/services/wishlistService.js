'use client';

/**
 * Service quản lý Danh sách sản phẩm yêu thích (Wishlist) riêng biệt theo tài khoản
 */

// 1. Xác định key lưu trữ trong localStorage dựa trên tài khoản đang đăng nhập
export function getWishlistStorageKey() {
  if (typeof window === 'undefined') return 'wishlist_guest';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.id) return `wishlist_user_${user.id}`;
      if (user?.email) return `wishlist_user_${String(user.email).replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
  } catch (e) {
    console.error('Lỗi phân tích user từ localStorage:', e);
  }
  return 'wishlist_guest';
}

// 2. Lấy danh sách sản phẩm yêu thích của tài khoản hiện tại
export function getWishlist() {
  if (typeof window === 'undefined') return [];
  try {
    const key = getWishlistStorageKey();
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => item && item.id) : [];
  } catch (e) {
    console.error('Lỗi đọc wishlist:', e);
    return [];
  }
}

// 3. Kiểm tra sản phẩm có trong wishlist không
export function isInWishlist(productId) {
  if (!productId) return false;
  const list = getWishlist();
  return list.some(item => Number(item.id) === Number(productId));
}

// 4. Lưu wishlist và phát event
export function saveWishlist(items) {
  if (typeof window === 'undefined') return;
  try {
    const key = getWishlistStorageKey();
    const valid = Array.isArray(items) ? items.filter(item => item && item.id) : [];
    localStorage.setItem(key, JSON.stringify(valid));
    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch (e) {
    console.error('Lỗi lưu wishlist:', e);
  }
}

// 5. Bật / Tắt yêu thích (Toggle)
export function toggleWishlist(product) {
  if (!product || !product.id) return false;
  const current = getWishlist();
  const exists = current.some(item => Number(item.id) === Number(product.id));

  let updated;
  if (exists) {
    updated = current.filter(item => Number(item.id) !== Number(product.id));
  } else {
    updated = [
      ...current,
      {
        id: product.id,
        name: product.name,
        price: Number(product.price || 0),
        sale_price: product.sale_price !== null && product.sale_price !== undefined ? Number(product.sale_price) : null,
        image: product.image || (Array.isArray(product.images) && product.images[0]) || '',
        category: product.category ? { name: product.category.name } : null,
        brand: product.brand ? { name: product.brand.name } : null,
        created_at: new Date().toISOString(),
      }
    ];
  }

  saveWishlist(updated);
  return !exists; // true nếu vừa thêm, false nếu vừa xóa
}

// 6. Xóa khỏi wishlist
export function removeFromWishlist(productId) {
  const current = getWishlist();
  const updated = current.filter(item => Number(item.id) !== Number(productId));
  saveWishlist(updated);
  return updated;
}

// 7. Xóa sạch wishlist
export function clearWishlist() {
  if (typeof window === 'undefined') return;
  try {
    const key = getWishlistStorageKey();
    localStorage.removeItem(key);
    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch (e) {
    console.error('Lỗi xóa wishlist:', e);
  }
}

// 8. Đếm tổng số lượng yêu thích
export function getWishlistCount() {
  return getWishlist().length;
}
