<?php

namespace App\Models;

<<<<<<< HEAD
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
=======
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    protected $fillable = ['parent_id', 'name', 'slug', 'status'];

    // Quan hệ: Một danh mục có nhiều danh mục con
>>>>>>> chuong
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
<<<<<<< HEAD
=======

    // Scope: Lọc danh mục đang hoạt động (status = 1)
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 1);
    }
>>>>>>> chuong
}