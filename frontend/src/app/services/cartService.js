'use client';

/**
 * Service quản lý giỏ hàng riêng biệt theo từng tài khoản (Account Scoped Cart)
 * - Mỗi tài khoản có key riêng: `cart_user_{userId}` hoặc `cart_user_{userEmail}`
 * - Khách vãng lai: `cart_guest`
 * - Đảm bảo tài khoản A không bao giờ thấy sản phẩm giỏ hàng của tài khoản B
 */

// 1. Xác định key lưu trữ trong localStorage dựa trên tài khoản đang đăng nhập
export function getCartStorageKey() {
  if (typeof window === 'undefined') return 'cart_guest';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.id) return `cart_user_${user.id}`;
      if (user?.email) return `cart_user_${String(user.email).replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
  } catch (e) {
    console.error('Lỗi phân tích user từ localStorage:', e);
  }
  return 'cart_guest';
}

// 2. Lấy danh sách sản phẩm trong giỏ của tài khoản hiện tại
export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const key = getCartStorageKey();
    const raw = localStorage.getItem(key);

    // Dọn dẹp key cũ không có scope nếu còn sót để tránh xung đột
    if (localStorage.getItem('cart')) {
      // Nếu key hiện tại chưa có dữ liệu và là tài khoản guest, có thể giữ lại, nếu là user thì xóa bỏ
      if (key === 'cart_guest' && !raw) {
        const legacy = localStorage.getItem('cart');
        localStorage.setItem(key, legacy);
      }
      localStorage.removeItem('cart');
    }

    const currentRaw = localStorage.getItem(key);
    const parsed = currentRaw ? JSON.parse(currentRaw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => item && item.id) : [];
  } catch (e) {
    console.error('Lỗi đọc giỏ hàng:', e);
    return [];
  }
}

// 3. Lưu giỏ hàng cho tài khoản hiện tại và bắn event thông báo UI cập nhật
export function saveCart(items) {
  if (typeof window === 'undefined') return;
  try {
    const key = getCartStorageKey();
    const validItems = Array.isArray(items) ? items.filter(item => item && item.id) : [];
    localStorage.setItem(key, JSON.stringify(validItems));
    
    // Phát event để Header và các components khác cập nhật tức thì
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) {
    console.error('Lỗi lưu giỏ hàng:', e);
  }
}

// 4. Xóa sạch giỏ hàng của tài khoản hiện tại (khi đặt hàng thành công hoặc người dùng bấm xóa hết)
export function clearCart() {
  if (typeof window === 'undefined') return;
  try {
    const key = getCartStorageKey();
    localStorage.removeItem(key);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) {
    console.error('Lỗi làm trống giỏ hàng:', e);
  }
}

// 5. Thêm sản phẩm vào giỏ hàng của tài khoản hiện tại
export function addToCart(product, quantity = 1) {
  if (!product || !product.id) return [];
  const current = getCart();
  const existingIndex = current.findIndex(item => Number(item.id) === Number(product.id));
  const qtyToAdd = Math.max(1, Number(quantity) || 1);

  if (existingIndex > -1) {
    current[existingIndex].quantity = (Number(current[existingIndex].quantity) || 1) + qtyToAdd;
  } else {
    current.push({
      id: product.id,
      name: product.name,
      price: Number(product.price_sale || product.price || 0),
      original_price: Number(product.price || 0),
      image: product.image || (Array.isArray(product.images) && product.images[0]) || '',
      quantity: qtyToAdd,
    });
  }

  saveCart(current);
  return current;
}

// 6. Cập nhật số lượng
export function updateCartQuantity(productId, quantity) {
  const qty = Number(quantity);
  if (qty <= 0) {
    return removeFromCart(productId);
  }
  const current = getCart();
  const updated = current.map(item => Number(item.id) === Number(productId) ? { ...item, quantity: qty } : item);
  saveCart(updated);
  return updated;
}

// 7. Xóa 1 sản phẩm khỏi giỏ hàng
export function removeFromCart(productId) {
  const current = getCart();
  const updated = current.filter(item => Number(item.id) !== Number(productId));
  saveCart(updated);
  return updated;
}

// 8. Đếm tổng số lượng món hàng trong giỏ hiện tại
export function getCartCount() {
  const current = getCart();
  return current.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);
}
