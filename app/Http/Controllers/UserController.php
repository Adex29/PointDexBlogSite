<?php

namespace App\Http\Controllers;

use Rules\Password;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $users = User::orderByDesc('id')->get();
            return response()->json([
                'status' => 'success',
                'users' => $users
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        echo('tet1');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validate the incoming request
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:users',
                'password' => 'required|string',
            ]);

            // Create a new user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'method' => $request->method,
                'role' => 'user',
                'password' => Hash::make($request->password),
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully!',
                'userId' => $user->id
            ], 201); // 201 Created status
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500); // 500 Internal Server Error status
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
     try{
        $user = User::find($id);
        return response()->json([
            'status' => 'success',
            'user' => $user
        ]);
     }catch(\Exception $e){
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred: ' . $e->getMessage()
        ], 500);
     }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
        echo('tets4');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        DB::beginTransaction();

        try {
            // Validate the incoming request
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|lowercase|max:255',
                'password' => 'nullable|string',
            ]);


            $user = User::findOrFail($id);


            $user->name = $request->name;
            $user->email = $request->email;
            $user->method = $request->method;
            $user->role = $request->role;


            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully!',
                'userId' => $user->id
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
