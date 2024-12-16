<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $postId = $request->query('postId');
        $userId = $request->query('userId');

        if (!$postId || !$userId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Both postId and userId are required.'
            ], 400);
        }

        $likeCount = Like::where('postid', $postId)->count();

        $hasLiked = Like::where('postid', $postId)
            ->where('userid', $userId)
            ->exists();

        return response()->json([
            'status' => 'success',
            'likes' => $likeCount,
            'hasLiked' => $hasLiked
        ], 200);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $validatedData = $request->validate([
                'postId' => 'required|exists:posts,id',
                'userId' => 'required|exists:users,id',
                'isLike' => 'required|boolean',
            ], [
                'postId.required' => 'Post ID is required.',
                'postId.exists' => 'The specified post does not exist.',
                'userId.required' => 'User ID is required.',
                'userId.exists' => 'The specified user does not exist.',
                'isLike.required' => 'isLike field is required.',
                'isLike.boolean' => 'isLike field must be true or false.',
            ]);
            $existingLike = DB::table('likes')
                ->where('postid', $validatedData['postId'])
                ->where('userid', $validatedData['userId'])
                ->first();

            if ($validatedData['isLike']) {
                if (!$existingLike) {
                    DB::table('likes')->insert([
                        'postid' => $validatedData['postId'],
                        'userid' => $validatedData['userId'],
                        'isLike' => true,
                    ]);
                }
            } else {
                if ($existingLike) {
                    DB::table('likes')
                        ->where('postid', $validatedData['postId'])
                        ->where('userid', $validatedData['userId'])
                        ->delete();
                }
            }

            DB::commit();

            $likeCount = DB::table('likes')
                ->where('postid', $validatedData['postId'])
                ->where('isLike', true)
                ->count();

            return response()->json([
                'status' => 'success',
                'likeCount' => $likeCount,
                'hasLiked' => $validatedData['isLike'],
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
