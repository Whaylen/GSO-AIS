<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Par extends AppModel
{

    use SoftDeletes;

    protected $fillable = [
        'date_received',
        'article',
        'brand_model',
        'particulars',
        'responsibility_center',
        'account_code',
        'date_acquired',
        'unit_value',
        'quantity',
        'total_value',
        'unit_of_measure'
    ];

    protected $hidden = [
        'id'
    ];

    protected $appends = [
        'hash'
    ];

    public function employee() : BelongsToMany
    {
        return $this->belongsToMany(Custodian::class);
    }

}
