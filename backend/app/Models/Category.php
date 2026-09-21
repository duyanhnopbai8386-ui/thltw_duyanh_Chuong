<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'description',
        'image',
        'status',
    ];

    // Một danh mục có nhiều sản phẩm
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // Danh mục cha (nếu có)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Một danh mục có nhiều danh mục con
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
}