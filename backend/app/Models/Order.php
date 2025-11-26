<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'start_date',
        'end_date',
        'total_amount',
        'status',
        'address',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function items() { return $this->hasMany(OrderItem::class); }
    public function payment() { return $this->hasOne(Payment::class); }
    public function evidences() { return $this->hasMany(OrderEvidence::class); }
}
