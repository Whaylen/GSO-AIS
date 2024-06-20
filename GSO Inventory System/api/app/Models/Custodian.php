<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Custodian extends AppModel
{
    protected $fillable =[
        'profile_id',
        'tin_number',
        'employee_id'
    ];

    protected $hidden = [
        'id'
    ];

    protected $appends = [
        'hash'
    ];

    public function par() : BelongsToMany
    {
        return $this->belongsToMany(Par::class);
    }

    public function profile() : HasOne
    {
        return $this->hasOne(Profile::class);
    }
}
