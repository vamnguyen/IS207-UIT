<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AdminUserController extends Controller
{
    // GET /api/admin/users
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 20);
        $users = User::orderBy('id', 'desc')->paginate($perPage);

        return response()->json($users);
    }

    // PUT /api/admin/users/{id}/role
    public function updateRole(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|in:customer,shop,admin',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($id);
        $user->role = $request->input('role');
        $user->save();

        return response()->json($user);
    }

    // DELETE /api/admin/users/{id}
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Prevent self-delete
        $authUser = $request->user();
        if ($authUser && $authUser->id === $user->id) {
            return response()->json(['message' => 'Cannot delete yourself'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
