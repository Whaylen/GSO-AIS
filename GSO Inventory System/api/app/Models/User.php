<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens as SanctumApiTokens;
use Laravel\Passport\HasApiTokens as PassportApiTokens;
use Veelasky\LaravelHashId\Eloquent\HashableId;

use App\Notifications\sendEmailVerification;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\PasswordChangedNotification; 
use App\Notifications\AdminPasswordChangedNotification; 
use App\Notifications\AccountChangedNotification; 
use App\Notifications\AdminAccountChangedNotification;

// Switch between Sanctum or Passport Api Token
if((bool)env('APP_AUTH_TOKEN', false)){
    class UserExtension extends Authenticatable
    {
        use PassportApiTokens;
        protected $guard_name = "api";
    }
}else{
    class UserExtension extends Authenticatable
    {
        use SanctumApiTokens;
        protected $guard_name = "sanctum";
    }
}

class User extends UserExtension
{
    use HasFactory, Notifiable, HasRoles, HashableId;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'fails',
        'disabled_at',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'disabled_at' => 'datetime',
    ];

    public function roles_all(): BelongsToMany {
        return $this->morphToMany(
            config("permission.models.role"),
            "model",
            config("permission.table_names.model_has_roles"),
            config("permission.column_names.model_morph_key"),
            config("permission.column_names.role_pivot_key") ?: "role_id"
        );
    }

    public function profile(){
        return $this->hasOne(Profile::class);
    }

    public function isSuperAdmin(){
        return $this->hasRole('Admin');
    }

    public function statusHistory(){
        return $this->hasMany(AccountStatusHistory::class);
    }

    public function logs() {
        return $this->hasMany(Logs::class, 'user_id');
    }

    public function sessions() {
        return $this->hasMany(SessionModel::class);
    }

    public function clearSessions() {
        $this->sessions()->update(["user_id" => null, "payload" => ""]);
    }

    public function assignAdmin() {
        $className = get_class($this);
        $offices = Office::select("id")
            ->get()
            ->pluck("id");
        $adminID = Role::where("name", "Admin")->first()->id;

        $insert = [];
        foreach ($offices as $office) {
            $tmp = [
                "role_id" => $adminID,
                "model_type" => $className,
                "team_id" => $office,
            ];
            $tmp[config("permission.column_names.model_morph_key")] = $this->id;
            $insert[] = $tmp;
        }

        DB::table(config("permission.table_names.model_has_roles"))
            ->where("model_type", $className)
            ->where(config("permission.column_names.model_morph_key"), $this->id)
            ->delete();
        DB::table(config("permission.table_names.model_has_roles"))->insert($insert);
    }

    public function dismissAdmin() {
        $className = get_class($this);
        $adminID = Role::where("name", "Admin")->first()->id;

        DB::table(config("permission.table_names.model_has_roles"))
            ->where("model_type", $className)
            ->where(config("permission.column_names.model_morph_key"), $this->id)
            ->where(config("permission.column_names.role_pivot_key") ?: "role_id", $adminID)
            ->delete();
    }
    
    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerification(){
        $this->notify(new sendEmailVerification);
    }

    public function sendPasswordResetNotification($token){
        $this->notify(new ResetPasswordNotification($token));
    }

    public function sendPasswordChangedNotification(){
        $this->notify(new PasswordChangedNotification);
    }

    public function sendAdminPasswordChangedNotification($newPassword){
        $this->notify(new AdminPasswordChangedNotification($newPassword));
    }

    public function sendAdminAccountChangedNotification(){
        $this->notify(new AdminAccountChangedNotification);
    }

    public function sendAccountChangedNotification(){
        $this->notify(new AccountChangedNotification);
    }
}
