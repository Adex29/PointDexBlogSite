<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request){
        try {
            $searchQuery = $request->query('search');

            $query = DB::table('posts')
                ->join('users', 'posts.userid', '=', 'users.id')
                ->select('posts.*', 'users.name as author')
                ->orderByDesc('posts.id');

            if ($searchQuery) {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('posts.title', 'like', '%' . $searchQuery . '%')
                        ->orWhere('posts.category', 'like', '%' . $searchQuery . '%')
                        ->orWhere('posts.summary', 'like', '%' . $searchQuery . '%');
                });
            }

            $posts = $query->get();

            return response()->json([
                'status' => 'success',
                'posts' => $posts
            ]);
        } catch (\Exception $e) {
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
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // return response()->json($request->all());

        DB::beginTransaction();

        try {

            $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'summary' => 'required|string|max:500',
                'content' => 'required|string',
                'status' => 'required|in:published,draft',
                'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);


            $imagePath = null;
            if ($request->hasFile('img')) {
                $imagePath = $request->file('img')->store('posts/images', 'public');
            }

            $post = Post::create([
                'title' => $request->title,
                'category' => $request->category,
                'summary' => $request->summary,
                'userid' => $request->userid,
                'content' => $request->content,
                'status' => $request->status,
                'img' => $imagePath,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Post created successfully!',
                'postId' => $post->id,
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();

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
        try {
            $post = DB::table('posts')
                ->join('users', 'posts.userid', '=', 'users.id')
                ->select('posts.*', 'users.name as author')
                ->where('posts.id', $id)
                ->first();

            if (!$post) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Post not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'posts' => $post
            ]);
        } catch (\Exception $e) {
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
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        DB::beginTransaction();

        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'summary' => 'required|string|max:500',
                'content' => 'required|string',
                'status' => 'required|in:published,draft',
                'img' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $post = Post::findOrFail($id);

            if ($request->hasFile('img')) {

                if ($post->img) {
                    Storage::delete('public/' . $post->img);
                }

                $imagePath = $request->file('img')->store('posts/images', 'public');
                $post->img = $imagePath;
            }

            $post->title = $request->title;
            $post->category = $request->category;
            $post->summary = $request->summary;
            $post->content = $request->content;
            $post->status = $request->status;

            $post->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Post updated successfully!',
                'postId' => $post->id,
            ], 200);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = Post::findOrFail($id);
            $user->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Post deleted successfully!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
