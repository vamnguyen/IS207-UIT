<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductPriceHistory extends Model
{
    protected $table = 'product_price_history';

    protected $fillable = [
        'product_id',
        'old_price',
        'new_price',
        'changed_by',
        'reason',
        'effective_date',
    ];

    protected $casts = [
        'old_price' => 'decimal:2',
        'new_price' => 'decimal:2',
        'effective_date' => 'datetime',
    ];

    /**
     * Sản phẩm mà giá đã thay đổi
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Admin đã thay đổi giá
     */
    public function changedByUser()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Định dạng % thay đổi giá
     */
    public function getPriceChangePercentAttribute(): float
    {
        if ($this->old_price == 0) {
            return 0;
        }
        return round((($this->new_price - $this->old_price) / $this->old_price) * 100, 2);
    }

    /**
     * Kiểm tra giá tăng hay giảm
     */
    public function getIsIncreasedAttribute(): bool
    {
        return $this->new_price > $this->old_price;
    }
}
