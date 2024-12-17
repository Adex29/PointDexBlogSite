<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthenticatedUserController extends Controller
{
    /**
     * Get the authenticated user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuthenticatedUser(Request $request)
    {
        // Check if user is authenticated
        if (Auth::check()) {
            return response()->json([
                'user' => Auth::user(),
            ], 200);
        }

        return response()->json([
            'user' => null,
        ], 200);
    }
}
