<?php
namespace App\Http\Controllers\Auth;

use Google_Client;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class GoogleAuthController extends Controller
{
    public function handleGoogleLogin(Request $request): JsonResponse
    {
        $googleToken = $request->input('token');

        // Set up the Google client to verify the token
        $client = new Google_Client(['client_id' => '286853462386-8ksqu3nu5vf9agha6dt4b10b53br7ejn.apps.googleusercontent.com']); // Replace with your actual Client ID

        try {
            // Verify the token and get the user's info
            $payload = $client->verifyIdToken($googleToken);
            if ($payload) {
                // The token is valid; now we can authenticate the user

                // Check if the user already exists by email
                $user = User::where('email', $payload['email'])->first();

                if (!$user) {
                    // If the user does not exist, create the user
                    $user = User::create([
                        'name' => $payload['name'],
                        'email' => $payload['email'],
                        'role' => 'user',
                        'method' => 'google',
                    ]);
                }

                // Log in the user
                Auth::login($user);

                // Return a JSON response with a redirect URL to be handled on the frontend
                return response()->json([
                    'success' => true,
                    'redirect_url' => route('user.home') // or the appropriate route for the user
                ]);
            } else {
                return response()->json(['message' => 'Invalid Google token'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Authentication failed', 'error' => $e->getMessage()], 500);
        }
    }
}
