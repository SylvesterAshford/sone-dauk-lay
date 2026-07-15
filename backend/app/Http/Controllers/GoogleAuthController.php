<?php

namespace App\Http\Controllers;

use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        $frontendUrl = $this->resolveFrontendUrl($request->query('frontend_url'));

        if (! config('services.google.client_id') || ! config('services.google.client_secret')) {
            return redirect()->to("{$frontendUrl}/auth/callback?".http_build_query([
                'error' => 'google_not_configured',
            ]));
        }

        return $this->googleProvider()
            ->stateless()
            ->with([
                'state' => $this->encodeState($frontendUrl),
            ])
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        $frontendUrl = $this->frontendUrlFromState($request->query('state'));

        try {
            $googleUser = $this->googleProvider()
                ->stateless()
                ->user();

            if (! $googleUser->getEmail()) {
                return redirect()->to("{$frontendUrl}/auth/callback?error=email_required");
            }

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                $user->update([
                    'name' => $googleUser->getName() ?: $user->name,
                    'email' => $googleUser->getEmail(),
                    'role' => $user->role === 'admin' ? 'admin' : $this->roleForEmail($googleUser->getEmail()),
                    'provider' => 'google',
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
            } else {
                $user = User::create([
                    'name' => $googleUser->getName() ?: $googleUser->getNickname() ?: 'San Dauk Lay User',
                    'email' => $googleUser->getEmail(),
                    'password' => Str::random(40),
                    'role' => $this->roleForEmail($googleUser->getEmail()),
                    'provider' => 'google',
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);
            }

            $token = $user->createToken('google-auth-token')->plainTextToken;

            return redirect()->to("{$frontendUrl}/auth/callback?".http_build_query([
                'token' => $token,
            ]));
        } catch (Throwable $exception) {
            $message = $exception->getMessage();

            Log::error('Google OAuth sign-in failed.', [
                'message' => $exception->getMessage(),
            ]);

            return redirect()->to("{$frontendUrl}/auth/callback?".http_build_query([
                'error' => str_contains($message, 'cURL error 60') ? 'google_ssl_failed' : 'google_auth_failed',
            ]));
        }
    }

    private function googleProvider(): mixed
    {
        $provider = Socialite::driver('google');
        $certificatePath = config('services.google.verify') ?: ini_get('curl.cainfo') ?: ini_get('openssl.cafile');

        if ($certificatePath && is_file($certificatePath)) {
            $provider->setHttpClient(new Client([
                'verify' => $certificatePath,
            ]));
        }

        return $provider;
    }

    private function roleForEmail(string $email): string
    {
        $adminEmails = array_map('strtolower', config('app.admin_emails', []));
        $isConfiguredAdmin = in_array(strtolower($email), $adminEmails, true);
        $hasAdmin = User::where('role', 'admin')->exists();

        return ($isConfiguredAdmin || ! $hasAdmin) ? 'admin' : 'user';
    }

    private function resolveFrontendUrl(?string $requestedUrl = null): string
    {
        $configuredUrl = rtrim((string) config('app.frontend_url'), '/');

        if (! $requestedUrl) {
            return $configuredUrl;
        }

        $requestedUrl = rtrim($requestedUrl, '/');
        $configuredParts = parse_url($configuredUrl);
        $requestedParts = parse_url($requestedUrl);

        if (! $configuredParts || ! $requestedParts) {
            return $configuredUrl;
        }

        $configuredPort = $configuredParts['port'] ?? null;
        $requestedPort = $requestedParts['port'] ?? null;
        $requestedHost = $requestedParts['host'] ?? '';
        $requestedScheme = $requestedParts['scheme'] ?? '';

        $isConfiguredOrigin = $requestedUrl === $configuredUrl;
        $isLocalDevOrigin = app()->environment('local')
            && in_array($requestedScheme, ['http', 'https'], true)
            && in_array($requestedHost, ['localhost', '127.0.0.1'], true)
            && $requestedPort === $configuredPort;

        return ($isConfiguredOrigin || $isLocalDevOrigin) ? $requestedUrl : $configuredUrl;
    }

    private function encodeState(string $frontendUrl): string
    {
        return rtrim(strtr(base64_encode(json_encode([
            'frontend_url' => $frontendUrl,
        ], JSON_THROW_ON_ERROR)), '+/', '-_'), '=');
    }

    private function frontendUrlFromState(?string $state): string
    {
        if (! $state) {
            return $this->resolveFrontendUrl();
        }

        try {
            $decoded = base64_decode(strtr($state, '-_', '+/'), true);
            $payload = json_decode($decoded ?: '', true, flags: JSON_THROW_ON_ERROR);

            return $this->resolveFrontendUrl($payload['frontend_url'] ?? null);
        } catch (Throwable) {
            return $this->resolveFrontendUrl();
        }
    }
}
