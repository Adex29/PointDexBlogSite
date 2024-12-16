<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class GoogleAuthController extends Controller
{
    public function handleGoogleLogin(Request $request)
    {
        // The token from the frontend
        $googleToken = $request->input('token');

        // Set up the Google client to verify the token
        // $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]); // Set your Google Client ID here
        $client = new Google_Client(['client_id' => '286853462386-8ksqu3nu5vf9agha6dt4b10b53br7ejn.apps.googleusercontent.com']); // Replace with your actual Client ID

        try {
            // Verify the token and get the user's info
            $payload = $client->verifyIdToken($googleToken);
            if ($payload) {
                // The token is valid; now we can authenticate the user

                // Check if the user already exists in the database
                $user = User::firstOrCreate(
                    ['email' => $payload['email']],  // Check by email
                    [
                        'name' => $payload['name'],
                        'google_id' => $payload['sub'], // Store Google ID
                    ]
                );

                // Log the user in
                Auth::login($user);

                // Respond with the authenticated user
                return response()->json(['message' => 'User authenticated', 'user' => $user], 200);
            } else {
                return response()->json(['message' => 'Invalid Google token'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Authentication failed', 'error' => $e->getMessage()], 500);
        }
    }
}
