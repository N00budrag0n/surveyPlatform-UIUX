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
            // Perceivable - Information and user interface components must be presentable to users in ways they can perceive
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
                'issue_id' => 'text-contrast',
                'title' => 'Fix Text Contrast',
                'description' => 'Text must have sufficient contrast against its background. For normal text, the contrast ratio should be at least 4.5:1. For large text, it should be at least 3:1.',
                'example' => 'Change text color from #777 to #595959 to improve contrast against a white background.',
                'resources' => [
                    'WebAIM Contrast Checker' => 'https://webaim.org/resources/contrastchecker/',
                    'Understanding WCAG 1.4.3' => 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html'
                ]
            ],
            [
                'issue_id' => 'non-text-contrast',
                'title' => 'Improve Non-Text Contrast',
                'description' => 'UI components and graphical objects must have a contrast ratio of at least 3:1 against adjacent colors.',
                'example' => 'Increase the contrast of button borders, form controls, and focus indicators.',
                'resources' => [
                    'Understanding WCAG 1.4.11' => 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html',
                    'Non-text Contrast Examples' => 'https://www.w3.org/WAI/WCAG21/Techniques/general/G207'
                ]
            ],
            [
                'issue_id' => 'audio-caption',
                'title' => 'Add Captions for Audio Content',
                'description' => 'Provide captions for all audio content in synchronized media.',
                'example' => '<video controls>\n  <source src="video.mp4" type="video/mp4">\n  <track src="captions.vtt" kind="subtitles" srclang="en" label="English">\n</video>',
                'resources' => [
                    'Understanding WCAG 1.2.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
                    'WebAIM - Captions' => 'https://webaim.org/techniques/captions/'
                ]
            ],
            [
                'issue_id' => 'audio-description',
                'title' => 'Provide Audio Descriptions',
                'description' => 'Provide audio descriptions for video content. These describe important visual details that cannot be understood from the main soundtrack alone.',
                'example' => 'Create a separate audio track that describes visual content during natural pauses in dialogue.',
                'resources' => [
                    'Understanding WCAG 1.2.5' => 'https://www.w3.org/WAI/WCAG21/Understanding/audio-description-prerecorded.html',
                    'Audio Description Examples' => 'https://www.w3.org/WAI/perspective-videos/audio-description/'
                ]
            ],

            // Operable - User interface components and navigation must be operable
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
                'issue_id' => 'keyboard',
                'title' => 'Make Content Keyboard Accessible',
                'description' => 'All functionality must be available using only a keyboard. Use native interactive elements or add appropriate ARIA roles and keyboard handlers.',
                'example' => 'Use <button>, <a>, or <input> elements instead of <div> or <span> for interactive elements.',
                'resources' => [
                    'WebAIM - Keyboard Accessibility' => 'https://webaim.org/techniques/keyboard/',
                    'Understanding WCAG 2.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html'
                ]
            ],
            [
                'issue_id' => 'timing-adjustable',
                'title' => 'Make Timing Adjustable',
                'description' => 'Users must be able to adjust, extend, or disable time limits on content or interactions.',
                'example' => 'Add options to extend session timeouts or disable auto-advancing slideshows.',
                'resources' => [
                    'Understanding WCAG 2.2.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html'
                ]
            ],
            [
                'issue_id' => 'pause-stop-hide',
                'title' => 'Provide Controls for Moving Content',
                'description' => 'For any moving, blinking, or scrolling content, provide a way to pause, stop, or hide it.',
                'example' => '<div id="carousel" class="carousel">\n  <button aria-label="Pause carousel" onclick="pauseCarousel()">⏸️</button>\n  <!-- carousel content -->\n</div>',
                'resources' => [
                    'Understanding WCAG 2.2.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html'
                ]
            ],
            [
                'issue_id' => 'three-flashes',
                'title' => 'Avoid Flashing Content',
                'description' => 'Web pages must not contain anything that flashes more than three times in any one-second period, as this can cause seizures.',
                'example' => 'Remove flashing animations or reduce the flash rate to below three per second.',
                'resources' => [
                    'Understanding WCAG 2.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html',
                    'Photosensitive Epilepsy Analysis Tool' => 'https://trace.umd.edu/peat/'
                ]
            ],
            [
                'issue_id' => 'bypass-blocks',
                'title' => 'Provide Skip Links',
                'description' => 'Provide a way to bypass blocks of content that are repeated on multiple pages, such as navigation menus.',
                'example' => '<a href="#main-content" class="skip-link">Skip to main content</a>',
                'resources' => [
                    'WebAIM - Skip Navigation Links' => 'https://webaim.org/techniques/skipnav/',
                    'Understanding WCAG 2.4.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html'
                ]
            ],
            [
                'issue_id' => 'page-titled',
                'title' => 'Provide Descriptive Page Titles',
                'description' => 'Each web page must have a title that describes its topic or purpose.',
                'example' => '<title>Product Catalog - Company Name</title>',
                'resources' => [
                    'Understanding WCAG 2.4.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html'
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
            ],
            [
                'issue_id' => 'focus-order',
                'title' => 'Ensure Logical Focus Order',
                'description' => 'The navigation order of focusable elements should be logical and intuitive.',
                'example' => 'Ensure that tabbing through a form follows the visual layout, from top to bottom and left to right.',
                'resources' => [
                    'Understanding WCAG 2.4.3' => 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html'
                ]
            ],
            [
                'issue_id' => 'link-purpose',
                'title' => 'Make Link Purpose Clear',
                'description' => 'The purpose of each link should be clear from the link text alone or from the link text together with its programmatically determined context.',
                'example' => 'Use "View Product Details" instead of "Click Here" or "Read More".',
                'resources' => [
                    'Understanding WCAG 2.4.4' => 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html'
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
                'issue_id' => 'multiple-ways',
                'title' => 'Provide Multiple Ways to Find Content',
                'description' => 'Provide multiple ways to locate content within a website, such as a site map, search function, or navigation menu.',
                'example' => 'Include a search box, site map, and consistent navigation menu on your website.',
                'resources' => [
                    'Understanding WCAG 2.4.5' => 'https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html'
                ]
            ],
            [
                'issue_id' => 'focus-visible',
                'title' => 'Ensure Focus Visibility',
                'description' => 'The keyboard focus indicator must be visible when elements receive focus.',
                'example' => 'Don\'t use outline: none; without providing an alternative focus indicator.',
                'resources' => [
                    'Understanding WCAG 2.4.7' => 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html'
                ]
            ],

            // Understandable - Information and the operation of user interface must be understandable
            [
                'issue_id' => 'language-of-page',
                'title' => 'Specify Page Language',
                'description' => 'The default human language of each web page must be programmatically determined.',
                'example' => '<html lang="en">',
                'resources' => [
                    'Understanding WCAG 3.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html'
                ]
            ],
            [
                'issue_id' => 'language-of-parts',
                'title' => 'Specify Language of Parts',
                'description' => 'The human language of each passage or phrase in the content can be programmatically determined.',
                'example' => '<p>The French word for cat is <span lang="fr">chat</span>.</p>',
                'resources' => [
                    'Understanding WCAG 3.1.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html'
                ]
            ],
            [
                'issue_id' => 'on-focus',
                'title' => 'Avoid Focus-Triggered Changes',
                'description' => 'When a component receives focus, it should not initiate a change of context.',
                'example' => 'Don\'t automatically submit forms or navigate to new pages when a field receives focus.',
                'resources' => [
                    'Understanding WCAG 3.2.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html'
                ]
            ],
            [
                'issue_id' => 'on-input',
                'title' => 'Avoid Input-Triggered Changes',
                'description' => 'Changing the setting of a user interface component should not automatically cause a change of context.',
                'example' => 'Use a submit button instead of automatically submitting a form when a select menu changes.',
                'resources' => [
                    'Understanding WCAG 3.2.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/on-input.html'
                ]
            ],
            [
                'issue_id' => 'consistent-navigation',
                'title' => 'Maintain Consistent Navigation',
                'description' => 'Navigation mechanisms that are repeated on multiple pages should occur in the same relative order each time they are repeated.',
                'example' => 'Keep the main navigation menu in the same location and order across all pages.',
                'resources' => [
                    'Understanding WCAG 3.2.3' => 'https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation.html'
                ]
            ],
            [
                'issue_id' => 'error-identification',
                'title' => 'Identify Input Errors',
                'description' => 'If an input error is automatically detected, the item that is in error must be identified and the error must be described to the user in text.',
                'example' => '<label for="email">Email:</label>\n<input type="email" id="email" aria-describedby="email-error">\n<div id="email-error" class="error">Please enter a valid email address.</div>',
                'resources' => [
                    'Understanding WCAG 3.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html'
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
                'issue_id' => 'label',
                'title' => 'Add Labels to Form Controls',
                'description' => 'All form controls must have associated label elements. Use the "for" attribute to associate labels with form controls.',
                'example' => '<label for="name">Name:</label>\n<input type="text" id="name">',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 3.3.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
                ]
            ],
            [
                'issue_id' => 'error-suggestion',
                'title' => 'Provide Error Suggestions',
                'description' => 'If an input error is detected, suggestions for correction should be provided, unless it would jeopardize security or purpose.',
                'example' => '<div id="password-error" class="error">Password must be at least 8 characters long and include at least one number.</div>',
                'resources' => [
                    'Understanding WCAG 3.3.3' => 'https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html'
                ]
            ],

            // Robust - Content must be robust enough that it can be interpreted by a wide variety of user agents
            [
                'issue_id' => 'parsing',
                'title' => 'Ensure Valid HTML',
                'description' => 'HTML documents must have complete start and end tags, elements must be nested according to specifications, and IDs must be unique.',
                'example' => 'Use a validator to check your HTML for errors.',
                'resources' => [
                    'W3C Markup Validation Service' => 'https://validator.w3.org/',
                    'Understanding WCAG 4.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html'
                ]
            ],
            [
                'issue_id' => 'name-role-value',
                'title' => 'Use Proper Name, Role, and Value',
                'description' => 'For all user interface components, the name, role, and value must be programmatically determinable.',
                'example' => '<button aria-pressed="false" id="menu-toggle">Toggle Menu</button>',
                'resources' => [
                    'Understanding WCAG 4.1.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html'
                ]
            ],
            [
                'issue_id' => 'status-messages',
                'title' => 'Make Status Messages Accessible',
                'description' => 'Status messages can be programmatically determined through role or properties so they can be presented to users without receiving focus.',
                'example' => '<div role="status" aria-live="polite">Your form has been submitted successfully.</div>',
                'resources' => [
                    'Understanding WCAG 4.1.3' => 'https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html'
                ]
            ],

            // ARIA-specific issues
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
                'issue_id' => 'aria-valid-attr',
                'title' => 'Use Valid ARIA Attributes',
                'description' => 'ARIA attributes must be valid and properly formatted.',
                'example' => 'Use aria-labelledby instead of aria-labeledby (note the spelling).',
                'resources' => [
                    'ARIA in HTML' => 'https://www.w3.org/TR/html-aria/',
                    'ARIA Authoring Practices' => 'https://www.w3.org/TR/wai-aria-practices-1.1/'
                ]
            ],
            [
                'issue_id' => 'aria-hidden-body',
                'title' => 'Don\'t Hide Document Body',
                'description' => 'The document body should not have aria-hidden="true" as it hides the entire page from assistive technologies.',
                'example' => 'Remove aria-hidden="true" from the body element.',
                'resources' => [
                    'Using aria-hidden' => 'https://developer.paciellogroup.com/blog/2012/05/html5-accessibility-chops-hidden-and-aria-hidden/'
                ]
            ],

            // Semantic structure issues
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
                'issue_id' => 'empty-heading',
                'title' => 'Fix Empty Headings',
                'description' => 'Headings must have discernible text content that describes the section it introduces.',
                'example' => '<h2>Product Features</h2> instead of <h2></h2>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'duplicate-id',
                'title' => 'Fix Duplicate IDs',
                'description' => 'ID attributes must be unique within a document to prevent confusion for assistive technologies and JavaScript functionality.',
                'example' => 'Use unique IDs like "section1-heading" and "section2-heading" instead of using "heading" multiple times.',
                'resources' => [
                    'Understanding WCAG 4.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html'
                ]
            ],
            [
                'issue_id' => 'duplicate-id-active',
                'title' => 'Fix Duplicate IDs on Interactive Elements',
                'description' => 'Interactive elements like form controls must have unique IDs to ensure proper form submission and accessibility.',
                'example' => '<input id="first-name"> <input id="last-name"> instead of <input id="name"> <input id="name">',
                'resources' => [
                    'Understanding WCAG 4.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html'
                ]
            ],
            [
                'issue_id' => 'list',
                'title' => 'Use Proper List Markup',
                'description' => 'Use semantic list elements (ul, ol, dl) for lists rather than simulating them with divs or paragraphs.',
                'example' => '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],

            // Table-related issues
            [
                'issue_id' => 'td-has-header',
                'title' => 'Associate Table Cells with Headers',
                'description' => 'Data cells in tables should be associated with their headers to make tables accessible to screen reader users.',
                'example' => '<table>\n  <tr><th id="name">Name</th><th id="age">Age</th></tr>\n  <tr><td headers="name">John</td><td headers="age">25</td></tr>\n</table>',
                'resources' => [
                    'WebAIM - Creating Accessible Tables' => 'https://webaim.org/techniques/tables/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'th-has-data-cells',
                'title' => 'Ensure Table Headers Have Data Cells',
                'description' => 'Table headers should have associated data cells to maintain proper table structure.',
                'example' => 'Ensure every <th> element has corresponding <td> elements in the table.',
                'resources' => [
                    'WebAIM - Creating Accessible Tables' => 'https://webaim.org/techniques/tables/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'table-fake-caption',
                'title' => 'Use Proper Table Captions',
                'description' => 'Use the <caption> element for table captions instead of simulating captions with other elements.',
                'example' => '<table>\n  <caption>Monthly Sales Data</caption>\n  <tr>...</tr>\n</table>',
                'resources' => [
                    'WebAIM - Creating Accessible Tables' => 'https://webaim.org/techniques/tables/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],

            // Form-related issues
            [
                'issue_id' => 'label-title-only',
                'title' => 'Use Proper Form Labels, Not Just Title',
                'description' => 'Form controls should have explicit <label> elements, not just title attributes.',
                'example' => '<label for="email">Email:</label>\n<input type="email" id="email">',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 3.3.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
                ]
            ],
            [
                'issue_id' => 'select-name',
                'title' => 'Provide Names for Select Elements',
                'description' => 'Select elements must have accessible names through labels, aria-label, or aria-labelledby.',
                'example' => '<label for="country">Country:</label>\n<select id="country" name="country">...</select>',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 4.1.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html'
                ]
            ],
            [
                'issue_id' => 'input-button-name',
                'title' => 'Provide Names for Button Inputs',
                'description' => 'Input buttons must have discernible text that describes their purpose.',
                'example' => '<input type="submit" value="Submit Form"> or <button type="submit">Submit Form</button>',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 4.1.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html'
                ]
            ],
            [
                'issue_id' => 'button-name',
                'title' => 'Provide Names for Buttons',
                'description' => 'Buttons must have discernible text that describes their purpose.',
                'example' => '<button>Submit</button> or <button aria-label="Close dialog">×</button>',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 4.1.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html'
                ]
            ],
            [
                'issue_id' => 'form-field-multiple-labels',
                'title' => 'Avoid Multiple Labels for Form Fields',
                'description' => 'Each form field should have exactly one label element associated with it.',
                'example' => 'Use a single <label> element or combine the text into one label.',
                'resources' => [
                    'WebAIM - Creating Accessible Forms' => 'https://webaim.org/techniques/forms/',
                    'Understanding WCAG 3.3.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html'
                ]
            ],

            // Mobile and responsive issues
            [
                'issue_id' => 'meta-viewport',
                'title' => 'Fix Viewport Meta Tag',
                'description' => 'The viewport meta tag should not disable user scaling, which prevents users from zooming the page.',
                'example' => '<meta name="viewport" content="width=device-width, initial-scale=1"> instead of <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">',
                'resources' => [
                    'Understanding WCAG 1.4.4' => 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html',
                    'MDN - Responsive Design' => 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design'
                ]
            ],
            [
                'issue_id' => 'target-size',
                'title' => 'Ensure Adequate Target Size',
                'description' => 'Interactive elements should be large enough to be easily activated, especially on touch screens.',
                'example' => 'Make clickable elements at least 44x44 pixels in size.',
                'resources' => [
                    'Understanding WCAG 2.5.5' => 'https://www.w3.org/WAI/WCAG21/Understanding/target-size.html'
                ]
            ],

            // Landmark and region issues
            [
                'issue_id' => 'region',
                'title' => 'Use Landmark Regions',
                'description' => 'Content should be contained in landmark regions to help users navigate the page structure.',
                'example' => '<header>...</header>\n<main>...</main>\n<footer>...</footer>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'landmark-one-main',
                'title' => 'Include Exactly One Main Landmark',
                'description' => 'Each page should have exactly one main landmark to identify the main content area.',
                'example' => '<main id="main-content">...</main>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'landmark-banner-is-top-level',
                'title' => 'Make Banner Landmark Top Level',
                'description' => 'The banner landmark (header) should be a top-level landmark, not nested within other landmarks.',
                'example' => '<body>\n  <header>...</header>\n  <main>...</main>\n</body>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],

            // Miscellaneous issues
            [
                'issue_id' => 'html-has-lang',
                'title' => 'Add Lang Attribute to HTML Element',
                'description' => 'The HTML element must have a lang attribute that identifies the language of the document.',
                'example' => '<html lang="en">',
                'resources' => [
                    'Understanding WCAG 3.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html'
                ]
            ],
            [
                'issue_id' => 'html-lang-valid',
                'title' => 'Use Valid Lang Attribute Value',
                'description' => 'The lang attribute must have a valid value according to BCP 47.',
                'example' => '<html lang="en"> or <html lang="fr-CA">',
                'resources' => [
                    'Understanding WCAG 3.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
                    'BCP 47 Language Tags' => 'https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry'
                ]
            ],
            [
                'issue_id' => 'frame-title',
                'title' => 'Add Titles to Frames and iframes',
                'description' => 'Frames and iframes must have title attributes that describe their content.',
                'example' => '<iframe title="Product Demo Video" src="demo.html"></iframe>',
                'resources' => [
                    'Understanding WCAG 4.1.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html'
                ]
            ],
            [
                'issue_id' => 'object-alt',
                'title' => 'Provide Alternatives for Object Elements',
                'description' => 'Object elements must have text alternatives for users who cannot access the content.',
                'example' => '<object data="chart.svg" type="image/svg+xml">\n  <p>Bar chart showing sales data for Q1 2023. Data available in the table below.</p>\n</object>',
                'resources' => [
                    'Understanding WCAG 1.1.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html'
                ]
            ],
            [
                'issue_id' => 'definition-list',
                'title' => 'Use Proper Definition List Markup',
                'description' => 'Definition lists should use proper dl, dt, and dd elements to maintain semantic structure.',
                'example' => '<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'dlitem',
                'title' => 'Use Proper Definition List Items',
                'description' => 'Definition list items (dt and dd) must be contained within a dl element.',
                'example' => '<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>',
                'resources' => [
                    'WebAIM - Semantic Structure' => 'https://webaim.org/techniques/semanticstructure/',
                    'Understanding WCAG 1.3.1' => 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
                ]
            ],
            [
                'issue_id' => 'valid-lang',
                'title' => 'Use Valid Language Codes',
                'description' => 'Language attributes (lang and xml:lang) must have valid values according to BCP 47.',
                'example' => 'lang="en" or lang="fr-CA" instead of lang="english"',
                'resources' => [
                    'Understanding WCAG 3.1.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html',
                    'BCP 47 Language Tags' => 'https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry'
                ]
            ],
            [
                'issue_id' => 'video-caption',
                'title' => 'Add Captions to Videos',
                'description' => 'Videos with audio must have synchronized captions.',
                'example' => '<video controls>\n  <source src="video.mp4" type="video/mp4">\n  <track src="captions.vtt" kind="subtitles" srclang="en" label="English">\n</video>',
                'resources' => [
                    'Understanding WCAG 1.2.2' => 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html',
                    'WebAIM - Captions' => 'https://webaim.org/techniques/captions/'
                ]
            ],
            [
                'issue_id' => 'autocomplete-valid',
                'title' => 'Use Valid Autocomplete Attributes',
                'description' => 'The autocomplete attribute must have a valid value for the input type it\'s applied to.',
                'example' => '<input type="text" name="name" autocomplete="name">',
                'resources' => [
                    'Understanding WCAG 1.3.5' => 'https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html',
                    'HTML Autocomplete Attribute' => 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete'
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

