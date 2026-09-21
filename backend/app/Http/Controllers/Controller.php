namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        // Lấy tất cả danh mục (có thể phân trang hoặc lấy theo điều kiện status = 1)
        $categories = Category::all(); 

        // Trả về danh sách dưới dạng JSON qua API Resource
        return CategoryResource::collection($categories);
    }
}