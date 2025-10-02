<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'image_url',
        'images',
        'status',
        'category_id',
        'shop_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'images' => 'array',
    ];

    // Một product thuộc về một category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Một product thuộc về một shop
    public function shop()
    {
        return $this->belongsTo(User::class);
    }
}
