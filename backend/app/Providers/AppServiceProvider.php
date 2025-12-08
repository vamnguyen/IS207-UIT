<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            // Link sẽ có dạng: http://localhost:3000/reset-password?token=xyz&email=abc@gmail.com
            return env('FRONTEND_URL') . "/reset-password?token={$token}&email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
