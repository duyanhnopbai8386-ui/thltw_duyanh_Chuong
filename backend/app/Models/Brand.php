<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Brand extends Model
{
    protected $fillable = ['name', 'slug', 'image', 'status'];

    public function scopeActive(Builder $query): void
    {
        $query->where('status', 1);
    }
}