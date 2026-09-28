<<<<<<< HEAD
=======
<?php

>>>>>>> chuong
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

<<<<<<< HEAD
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
            // Nếu bạn muốn lấy kèm danh mục con hoặc số lượng sản phẩm:
            // 'children' => CategoryResource::collection($this->whenLoaded('children')),
=======
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'slug'       => $this->slug,
            'price'      => $this->price,
            'sale_price' => $this->sale_price,
            'image'      => $this->image ? asset($this->image) : null,
>>>>>>> chuong
        ];
    }
}