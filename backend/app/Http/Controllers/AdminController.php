<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'stats' => [
                'users' => User::count(),
                'admins' => User::where('role', 'admin')->count(),
                'googleUsers' => User::where('provider', 'google')->count(),
                'emailUsers' => User::whereNull('provider')->count(),
                'newThisWeek' => User::where('created_at', '>=', now()->subWeek())->count(),
            ],
            'recentUsers' => User::latest()
                ->take(6)
                ->get(['id', 'name', 'email', 'role', 'provider', 'created_at']),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $search = trim((string) $request->query('search', ''));

        $users = User::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('role', 'like', "%{$search}%")
                        ->orWhere('provider', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(12, ['id', 'name', 'email', 'role', 'provider', 'avatar', 'created_at']);

        return response()->json($users);
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);

        if ($user->role === 'admin' && $validated['role'] !== 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json([
                'message' => 'At least one admin must remain on the platform.',
            ], 422);
        }

        $user->update(['role' => $validated['role']]);

        return response()->json($user->only(['id', 'name', 'email', 'role', 'provider', 'avatar', 'created_at']));
    }

    public function deleteUser(Request $request, User $user): JsonResponse
    {
        $admin = $this->authorizeAdmin($request);

        if ($admin->is($user)) {
            return response()->json([
                'message' => 'You cannot delete your own admin account while signed in.',
            ], 422);
        }

        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return response()->json([
                'message' => 'At least one admin must remain on the platform.',
            ], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    private function authorizeAdmin(Request $request): User
    {
        $user = $request->user();

        abort_unless($user?->role === 'admin', 403);

        return $user;
    }
}
