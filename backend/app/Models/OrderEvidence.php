<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderEvidence extends Model
{
    protected $table = 'order_evidence';

    protected $fillable = [
        'order_id',
        'user_id',
        'type',
        'media_url',
        'note',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
