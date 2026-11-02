<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'discount_amount',
        'discount_percent',
        'min_order_value',
        'start_date',
        'end_date',
        'usage_limit',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'discount_amount' => 'decimal:2',
            'discount_percent' => 'integer',
            'min_order_value' => 'decimal:2',
            'status' => 'boolean',
        ];
    }
}
