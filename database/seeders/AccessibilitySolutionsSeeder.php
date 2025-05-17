<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AccessibilitySolution;

class AccessibilitySolutionsSeeder extends Seeder
{
    public function run()
    {
        // Common accessibility issues and their solutions
        $solutions = [
            [
                'issue_id' => 'image-alt',
                'title' => 'Add Alternative Text to Images',
                'description' => 'All images must have an alt attribute that describes the image. If the image is decorative, use alt="".',
                'example' => '<img src="logo.png" alt="Company Logo">',
                'resources' => [
                    'WAI Tutorial - Images' => 'https://www.w3.org/WAI/tutorials/images/',
                    'WebAIM - Alternative Text' => 'https://webaim.org/techniques/alttext/'
                ]
            ],
            [
                'issue_id' => 'color-contrast',
                'title' => 'Improve Color Contrast',
                'description' => 'Text must have sufficient contrast against its background. For normal text, the contrast ratio should be at least 4.5:1. For large text, it should be at least 3:1.',
                'example' => 'Use tools like the WebAIM Contrast Checker to verify your color combinations.',
                'resources' => [
                    'WebAIM Contrast Checker' => 'https://webaim.org/resources/contrastchecker/',
                    'Understanding WCAG 1.4.3' => 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html'
                ]
            ],
            [
                'issue_id' => 'keyboard-nav',
                'title' => 'Ensure Keyboard Accessibility',
                'description' => 'All functionality must be available using only a keyboard. Replace "onclick" handlers with proper button or link elements, or add keyboard event handlers.',
                'example' => '<button onclick="doSomething()">Click me</button> instead of <div onclick="doSomething()">Click me</div>',
                'resources' => [
                    'WebAIM - Keyboard Accessibility' => 'https://webaim.org/techniques/keyboard/',
                    'Understanding WCAG 2.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html'
                ]
            ],
            [
                'issue_id' => 'heading-order',
                'title' => 'Fix Heading Structure',
                'description' => 'Headings should form a logical outline, and heading levels should only increase by one. Never skip heading levels (e.g., from h1 to h3).',
                'example' => '<h1>Title</h1>\n<h2>Subtitle</h2> instead of <h1>Title</h1>\n<h3>Subtitle</h3>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'form-labels',
                'title' => 'Add Labels to Form Controls',
                'description' => 'All form controls must have associated label elements. Use the "for" attribute to associate labels with form controls.',
                'example' => '<label for="name">Name:</label>\n<input type="text" id="name">',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 3.3.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
                ]
            ],
            [
                'issue_id' => 'aria-required-attr',
                'title' => 'Add Required ARIA Attributes',
                'description' => 'ARIA roles require specific attributes to function correctly. Make sure all required attributes are present.',
                'example' => '<div role="checkbox" aria-checked="false">Option</div>',
                'resources' => [
                    'WAI-ARIA Authoring Practices' => 'https://www.w3.org/TR/wai-aria-practices-1.1/',
                    'MDN: ARIA' => 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA'
                ]
            ],
            [
                'issue_id' => 'aria-roles',
                'title' => 'Use Correct ARIA Roles',
                'description' => 'ARIA roles must be valid and appropriate for the element they are applied to.',
                'example' => '<nav role="navigation">...</nav> (though in this example, the role is redundant with the nav element)',
                'resources' => [
                    'WAI-ARIA Roles Model' => 'https://www.w3.org/TR/wai-aria-1.1/#roles',
                    'Using ARIA' => 'https://www.w3.org/TR/using-aria/'
                ]
            ],
            [
                'issue_id' => 'link-name',
                'title' => 'Provide Accessible Link Names',
                'description' => 'Links must have accessible names that describe their purpose. Avoid generic text like "click here" or "read more".',
                'example' => '<a href="policy.html">Privacy Policy</a> instead of <a href="policy.html">Click here</a>',
                'resources' => [
                    'WebAIM - Links and Hypertext' => 'https://webaim.org/techniques/hypertext/',
                    'Understanding WCAG 2.4.4' => 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html'
                ]
            ],
            [
                'issue_id' => 'document-title',
                'title' => 'Add Descriptive Page Title',
                'description' => 'Every page must have a title element that identifies its contents.',
                'example' => '<title>Product Catalog - Company Name</title>',
                'resources' => [
                    'WebAIM - Document Titles' => 'https://webaim.org/techniques/titles/',
                    'Understanding WCAG 2.4.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html'
                ]
            ]
        ];

        foreach ($solutions as $solution) {
            AccessibilitySolution::updateOrCreate(
                ['issue_id' => $solution['issue_id']],
                [
                    'title' => $solution['title'],
                    'description' => $solution['description'],
                    'example' => $solution['example'],
                    'resources' => $solution['resources']
                ]
            );
        }
    }
}

