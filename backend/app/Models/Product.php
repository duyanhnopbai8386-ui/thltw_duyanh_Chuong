<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    protected $fillable = ['category_id', 'brand_id', 'name', 'slug', 'price', 'sale_price', 'status'];

    public function scopeActive(Builder $query): void
    {
        $query->where('status', 1);
    }
}