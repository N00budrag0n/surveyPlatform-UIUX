<?php

namespace App\Http\Controllers\Web;

use App\Models\User;
use App\Models\Articles;
use Illuminate\Http\Request;
use App\Models\ArticleReport;
use App\Http\Controllers\Controller;

class ArticleController extends Controller
{
    public function index()
    {
        $auth = auth()->user();
        $articles = Articles::latest()->where('status', 'Public')->paginate(8);

        return inertia('Web/Articles/Index', [
            'auth' => $auth,
            'articles' => $articles
        ]);
    }

    public function show($id, $slug, Articles $articles)
    {
        $user = auth()->user();
        $article = $articles::where('id', $id)->where('slug', $slug)->firstOrFail();

        $article->load('user');
        if ($article->status == 'Private' && $article->user_id !== $user->id) {
            abort(403, 'This survey is not available.');
        };

        return inertia('Web/Articles/Show', [
            'auth' => $user,
            'article' => $article
        ]);
    }

    public function report(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $article = Articles::findOrFail($id);
        $user = auth()->user();

        ArticleReport::create([
            'article_id' => $article->id,
            'user_id' => $user ? $user->id : null,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report submitted successfully. We will review it shortly.'
        ]);
    }
}
