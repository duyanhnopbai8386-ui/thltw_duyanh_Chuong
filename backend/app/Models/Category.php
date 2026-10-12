<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'parent_id', 
        'name', 
        'slug', 
        'description', 
        'status'
    ];

    // Quan hệ: Một danh mục có nhiều danh mục con
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Scope: Lọc danh mục đang hoạt động (status = 1)
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 1);
    }
}