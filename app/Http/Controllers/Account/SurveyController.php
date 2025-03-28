<?php

namespace App\Http\Controllers\Account;

use App\Models\Survey;
use App\Models\Method;
use App\Models\Category;
use App\Models\SurveyHasCategories;
use App\Models\SurveyHasMethods;
use App\Models\SurveyQuestions;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SurveyController extends Controller
{
    public function index()
    {
        if (auth()->user()->hasPermissionTo('surveys.index.full')) {
            $surveys = Survey::when(request()->q, function ($surveys) {
                $surveys = $surveys->where('title', 'like', '%' . request()->q . '%');
            })->latest()->paginate(10);

            $surveys->load('user');
        } else {
            $surveys = Survey::when(request()->q, function ($surveys) {
                $surveys = $surveys->where('title', 'like', '%' . request()->q . '%');
            })
                ->where('user_id', auth()->user()->id)
                ->latest()
                ->paginate(10);
        }

        if ($surveys->count() == 0) {
            if (request()->q) {
                $message = 'No surveys found for your search query.';
            } else {
                return redirect()->route('account.surveys.create');
            }
        }

        $surveys->appends(['q' => request()->q]);

        return inertia('Account/Surveys/Survey', [
            'surveys' => $surveys,
            'app_url' => config('app.url')
        ]);
    }

    public function create()
    {
        if (auth()->user()->hasPermissionTo('surveys.index.full')) {
            $categories = Category::all();
        } else {
            $categories = Category::whereNotIn('status', ['Private'])->get();
        }
        $methods = Method::all();
        $surveyQuestionsExample = SurveyQuestions::where('survey_id', 1)->get();

        return inertia('Account/Surveys/Create', [
            'categories' => $categories,
            'methods' => $methods,
            'surveyQuestionsExample' => $surveyQuestionsExample
        ]);
    }

    public function store(Request $request, SurveyHasCategories $surveyHasCategories, SurveyHasMethods $surveyHasMethods)
    {
        // dd($request->survey_questions);
        if ($request->image != null) {
            $this->validate($request, [
                'user_id'        => 'required',
                'title'          => 'required',
                'image'         => 'image|mimes:jpeg,jpg,png,svg|max:2048',
                'theme'          => 'required',
                'description'    => 'required',
                'survey_categories' => 'required',
                'survey_methods' => 'required',
                'general_access' => 'required',
                'survey_questions' => 'required',
                'url_website'    => 'required_without_all:embed_design,embed_prototype',
                'embed_design'   => 'required_without_all:url_website,embed_prototype',
                'embed_prototype'   => 'required_without_all:url_website,embed_design',
            ], [
                'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
            ]);
        } else {
            $this->validate($request, [
                'user_id'        => 'required',
                'title'          => 'required',
                'theme'          => 'required',
                'description'    => 'required',
                'survey_categories' => 'required',
                'survey_methods' => 'required',
                'general_access' => 'required',
                'survey_questions' => 'required',
                'url_website'    => 'required_without_all:embed_design,embed_prototype',
                'embed_design'   => 'required_without_all:url_website,embed_prototype',
                'embed_prototype'   => 'required_without_all:url_website,embed_design',
            ], [
                'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
            ]);
        }

        if ($request->file('image')) {
            $image = $request->file('image');
            $image->storeAs('public/image/surveys/', $image->hashName());

            $survey = Survey::create([
                'user_id'        => $request->user_id,
                'title'          => $request->title,
                'slug'          => Str::slug($request->title, '-'),
                'image'         => $image->hashName(),
                'theme'          => $request->theme,
                'description'    => $request->description,
                'url_website'    => $request->url_website,
                'embed_design'   => $request->embed_design,
                'embed_prototype'   => $request->embed_prototype,
                'status' => $request->general_access,
            ]);
        } else {
            $image = "surveyFactory.jpg";

            $survey = Survey::create([
                'user_id'        => $request->user_id,
                'title'          => $request->title,
                'slug'          => Str::slug($request->title, '-'),
                'image'         => $image,
                'theme'          => $request->theme,
                'description'    => $request->description,
                'url_website'    => $request->url_website,
                'embed_design'   => $request->embed_design,
                'embed_prototype'   => $request->embed_prototype,
                'status' => $request->general_access,
            ]);
        }

        $questionsData = json_decode($request->survey_questions, true);

        // Handle A/B Testing image uploads

        // if (isset($questionsData['ab_testing'])) {
        //     foreach ($questionsData['ab_testing'] as $groupIndex => $group) {
        //         if (isset($group['comparisons'])) {
        //             foreach ($group['comparisons'] as $compIndex => $comparison) {
        //                 // process image A
        //                 $variantAKey = "ab_image_{$group['name']}_{$comparison['id']}_a";
        //                 if ($request->hasFile($variantAKey)) {
        //                     $image = $request->file($variantAKey);
        //                     $imageName = 'ab_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
        //                     $image->storeAs('public/image/ab_testing/', $imageName);

        //                     // Update the image path in the questions data
        //                     $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_a']['image'] = $imageName;
        //                 }
        //                 // process image B
        //                 $variantBKey = "ab_image_{$group['name']}_{$comparison['id']}_b";
        //                 if ($request->hasFile($variantBKey)) {
        //                     $image = $request->file($variantBKey);
        //                     $imageName = 'ab_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
        //                     $image->storeAs('public/image/ab_testing/', $imageName);

        //                     // Update the image path in the questions data
        //                     $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_b']['image'] = $imageName;
        //                 }
        //             }
        //         }
        //     }
        //     $request->merge(['survey_questions' => json_encode($questionsData)]);
        // }

        if (isset($questionsData['ab_testing'])) {
            // Ensure the storage directory exists
            if (!Storage::exists('public/image/ab_testing')) {
                Storage::makeDirectory('public/image/ab_testing');
            }

            foreach ($questionsData['ab_testing'] as $groupIndex => $group) {
                if (isset($group['comparisons'])) {
                    foreach ($group['comparisons'] as $compIndex => $comparison) {
                        // Check for variant A image placeholder
                        if (isset($comparison['variant_a']['image']) &&
                            is_string($comparison['variant_a']['image']) &&
                            strpos($comparison['variant_a']['image'], '__FILE_PLACEHOLDER_') === 0) {

                            // Extract the field name from the placeholder
                            $fieldName = str_replace(['__FILE_PLACEHOLDER_', '__'], '', $comparison['variant_a']['image']);

                            if ($request->hasFile($fieldName)) {
                                $image = $request->file($fieldName);
                                $imageName = 'ab_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                                $image->storeAs('public/image/ab_testing', $imageName);

                                // Update the image path in the questions data
                                $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_a']['image'] = $imageName;
                            } else {
                                // No file found, set to null
                                $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_a']['image'] = null;
                            }
                        }

                        // Check for variant B image placeholder
                        if (isset($comparison['variant_b']['image']) &&
                            is_string($comparison['variant_b']['image']) &&
                            strpos($comparison['variant_b']['image'], '__FILE_PLACEHOLDER_') === 0) {

                            // Extract the field name from the placeholder
                            $fieldName = str_replace(['__FILE_PLACEHOLDER_', '__'], '', $comparison['variant_b']['image']);

                            if ($request->hasFile($fieldName)) {
                                $image = $request->file($fieldName);
                                $imageName = 'ab_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                                $image->storeAs('public/image/ab_testing', $imageName);

                                // Update the image path in the questions data
                                $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_b']['image'] = $imageName;
                            } else {
                                // No file found, set to null
                                $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_b']['image'] = null;
                            }
                        }
                    }
                }
            }

            // Log the processed data for debugging
            \Log::info('Processed AB Testing data:', $questionsData['ab_testing']);
        }

        SurveyQuestions::create([
            'survey_id' => $survey->id,
            'questions_data' => json_encode($questionsData),
        ]);

        if ($request->has('survey_categories')) {
            // Check if the data is a JSON string and decode it if needed
            $surveyCategoriesData = $request->survey_categories;
            if (is_string($surveyCategoriesData) && is_array(json_decode($surveyCategoriesData, true))) {
                $surveyCategoriesData = json_decode($surveyCategoriesData, true);
            }

            // Ensure we have an array before proceeding
            if (!is_array($surveyCategoriesData)) {
                $surveyCategoriesData = [$surveyCategoriesData]; // Convert to array if it's a single value
            }

            $surveyHasCategories->where('survey_id', $survey->id)->delete();

            foreach ($surveyCategoriesData as $category_id) {
                $surveyHasCategories->create(['category_id' => $category_id, 'survey_id' => $survey->id]);
            }
        }

        if ($request->has('survey_methods')) {
            $surveyMethodsData = $request->survey_methods;
            if (is_string($surveyMethodsData) && is_array(json_decode($surveyMethodsData, true))) {
                $surveyMethodsData = json_decode($surveyMethodsData, true);
            }

            if (!is_array($surveyMethodsData)) {
                $surveyMethodsData = [$surveyMethodsData];
            }

            $surveyHasMethods->where('survey_id', $survey->id)->delete();

            foreach ($surveyMethodsData as $method_id) {
                $surveyHasMethods->create(['method_id' => $method_id, 'survey_id' => $survey->id]);
            }
        }

        return redirect()->route('account.surveys.index');
    }


    public function edit(Survey $survey)
    {
        if (auth()->user()->hasPermissionTo('surveys.index.full')) {
            $categories = Category::all();
        } else {
            $categories = Category::whereNotIn('status', ['Private'])->get();
        }
        $methods = Method::all();
        $surveyCategories = SurveyHasCategories::where('survey_id', $survey->id)->get();
        $surveyMethods = SurveyHasMethods::where('survey_id', $survey->id)->get();
        $surveyQuestions = SurveyQuestions::where('survey_id', $survey->id)->get();

        return inertia('Account/Surveys/Edit', [
            'survey' => $survey,
            'categories' => $categories,
            'methods' => $methods,
            'surveyCategories' => $surveyCategories,
            'surveyMethods' => $surveyMethods,
            'surveyQuestions' => $surveyQuestions,
        ]);
    }

    public function update(Request $request, Survey $survey, SurveyHasCategories $surveyHasCategories, SurveyHasMethods $surveyHasMethods, SurveyQuestions $surveyQuestion)
    {
        if ($survey->id == 1 && $survey->user_id !== auth()->user()->id) {
            return abort(403, 'You do not have permission to update this survey.');
        }

        if ($request->file('image')) {
            $this->validate($request, [
                'user_id'        => 'required',
                'title'          => 'required',
                'image'         => 'image|mimes:jpeg,jpg,png,svg|max:2048',
                'theme'          => 'required',
                'description'    => 'required',
                'survey_categories' => 'required',
                'survey_questions' => 'required',
                'survey_visible' => 'required',
                'url_website'    => 'required_without_all:embed_design,embed_prototype',
                'embed_design'   => 'required_without_all:url_website,embed_prototype',
                'embed_prototype'   => 'required_without_all:url_website,embed_design',
            ], [
                'image.max' => 'The image may not be greater than 2 MB.',
                'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
            ]);
        } else {
            $this->validate(
                $request,
                [
                    'user_id'        => 'required',
                    'title'          => 'required',
                    'theme'          => 'required',
                    'description'    => 'required',
                    'survey_categories' => 'required',
                    'survey_questions' => 'required',
                    'survey_visible' => 'required',
                    'url_website'    => 'required_without_all:embed_design,embed_prototype',
                    'embed_design'   => 'required_without_all:url_website,embed_prototype',
                    'embed_prototype'   => 'required_without_all:url_website,embed_design',
                ],
                [
                    'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                    'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                    'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                ]
            );
        }

        if ($request->file('image')) {
            if (!Str::contains($survey->image, 'surveyFactory.jpg')) {
                Storage::disk('local')->delete('storage/image/surveys/' . basename($survey->image));
            }

            $image = $request->file('image');
            $image->storeAs('public/image/surveys/', $image->hashName());

            $survey->update([
                'image' => $image->hashName(),
                'name' => $request->name,
                'slug' => Str::slug($request->name, '-')
            ]);
        }

        // Process survey questions data
        $questionsData = json_decode($request->survey_questions, true);

        // Handle A/B Testing image uploads
        if (isset($questionsData['ab_testing'])) {
            // Ensure the storage directory exists
            if (!Storage::exists('public/image/ab_testing')) {
                Storage::makeDirectory('public/image/ab_testing');
            }

            foreach ($questionsData['ab_testing'] as $groupIndex => $group) {
                if (isset($group['comparisons'])) {
                    foreach ($group['comparisons'] as $compIndex => $comparison) {
                        // Process variant A image
                        $variantAKey = "ab_image_{$group['name']}_{$comparison['id']}_a";
                        if ($request->hasFile($variantAKey)) {
                            try {
                                // Delete old image if it exists
                                if (isset($comparison['variant_a']['image']) &&
                                    is_string($comparison['variant_a']['image']) &&
                                    Storage::exists('public/image/ab_testing/' . $comparison['variant_a']['image'])) {
                                    Storage::delete('public/image/ab_testing/' . $comparison['variant_a']['image']);
                                }

                                $image = $request->file($variantAKey);
                                $imageName = 'ab_' . Str::random(10) . '.' . $image->getClientOriginalExtension();

                                // Store the image
                                $image->storeAs('public/image/ab_testing', $imageName);

                                // Update the image path in the questions data
                                $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_a']['image'] = $imageName;
                            } catch (\Exception $e) {
                                \Log::error('Failed to store A/B testing image: ' . $e->getMessage());
                            }
                        }

                        // Process variant B image (similar logic)
                        $variantBKey = "ab_image_{$group['name']}_{$comparison['id']}_b";
                        if ($request->hasFile($variantBKey)) {
                            try {
                                // Delete old image if it exists
                                if (isset($comparison['variant_b']['image']) &&
                                    is_string($comparison['variant_b']['image']) &&
                                    Storage::exists('public/image/ab_testing/' . $comparison['variant_b']['image'])) {
                                    Storage::delete('public/image/ab_testing/' . $comparison['variant_b']['image']);
                                }

                                $image = $request->file($variantBKey);
                                $imageName = 'ab_' . Str::random(10) . '.' . $image->getClientOriginalExtension();

                                // Store the image
                                $image->storeAs('public/image/ab_testing', $imageName);

                                // Update the image path in the questions data
                                $questionsData['ab_testing'][$groupIndex]['comparisons'][$compIndex]['variant_b']['image'] = $imageName;
                            } catch (\Exception $e) {
                                \Log::error('Failed to store A/B testing image: ' . $e->getMessage());
                            }
                        }
                    }
                }
            }

            // Update the request with the modified questions data
            $request->merge(['survey_questions' => json_encode($questionsData)]);
        }

        $survey->update([
            'title'          => $request->title,
            'theme'          => $request->theme,
            'description'    => $request->description,
            'url_website'    => $request->url_website,
            'embed_design'   => $request->embed_design,
            'embed_prototype' => $request->embed_prototype,
            'slug'          => Str::slug($request->title, '-'),
            'status' => $request->survey_visible
        ]);

        if ($request->has('survey_categories')) {
            $surveyCategoriesData = $request->survey_categories;
            $surveyHasCategories->where('survey_id', $survey->id)->delete();

            foreach ($surveyCategoriesData as $category_id) {
                $surveyHasCategories->create(['category_id' => $category_id, 'survey_id' => $survey->id]);
            }
        }

        if ($request->has('survey_methods')) {
            $surveyMethodsData = $request->survey_methods;
            $surveyHasMethods->where('survey_id', $survey->id)->delete();

            foreach ($surveyMethodsData as $method_id) {
                $surveyHasMethods->create(['method_id' => $method_id, 'survey_id' => $survey->id]);
            }
        }

        if ($request->has('survey_questions')) {
            $surveyQuestion->where('survey_id', $survey->id)->delete();
            $surveyQuestion->create([
                'survey_id' => $survey->id,
                'questions_data' => $request->survey_questions
            ]);
        }

        return redirect()->route('account.surveys.index');
    }


    public function destroy($id)
    {
        $Survey = Survey::findOrFail($id);

        if ($Survey->id == 1 && $Survey->user_id !== auth()->user()->id) {
            return abort(403, 'You do not have permission to delete this survey.');
        }

        if (!Str::contains($Survey->image, 'surveyFactory.jpg')) {
            Storage::disk('local')->delete('public/image/surveys/' . basename($Survey->image));
        }

        Cache::forget('responses-tam-' . $id);
        Cache::forget('responses-sus-' . $id);

        $Survey->delete();

        return redirect()->route('account.surveys.index');
    }

    private function getExistingImage($surveyId, $groupName, $comparisonId, $variant) {
        $surveyQuestion = SurveyQuestions::where('survey_id', $surveyId)->first();

        if (!$surveyQuestion) {
            return null;
        }

        $questionsData = json_decode($surveyQuestion->questions_data, true);

        if (!isset($questionsData['ab_testing'])) {
            return null;
        }

        foreach ($questionsData['ab_testing'] as $group) {
            if ($group['name'] === $groupName && isset($group['comparisons'])) {
                foreach ($group['comparisons'] as $comparison) {
                    if ($comparison['id'] === $comparisonId) {
                        return $variant === 'a'
                            ? (isset($comparison['variant_a']['image']) ? $comparison['variant_a']['image'] : null)
                            : (isset($comparison['variant_b']['image']) ? $comparison['variant_b']['image'] : null);
                    }
                }
            }
        }

        return null;
    }
}
