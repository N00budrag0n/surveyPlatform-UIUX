<p align="center">
    <img src="https://github.com/user-attachments/assets/f511b797-ec50-4392-ae83-4fc9e8def001" alt="Build Status">
</p>

## About UIXProbe

UIXProbe is web-application software that help designers to test their design. Also, it can help web developers to test their website accessibility according to WCAG 2.1 criteria. UIXProbe come with common survey methods and automated testing for accessibility, such as:

- System Usability Scale (SUS).
- Technology Acceptance Model (TAM).
- A/B Design.
- Web Content Accessibility Guidelines Automated Testing.

UIXProbe is accessible and provides tools required for common designs and websites testing.

## Using UIXProbe
### Requirement
1. PHP > 8.3.*
2. Composer
3. Laravel
4. Node > 18.*

### Installation
1. Clone this repository with `git clone https://github.com/N00budrag0n/surveyPlatform-UIUX`
2. Install composer dependencies in root directory `composer install`
3. Install npm dependencies in root directory `npm install`
4. Open the accessibility-testing directory `cd accessibility-testing`
5. Install npm dependencies for accessibility-testing `npm install`

### Running Service (Local)
1. Open root directory
2. Run `php artisan serve` and `npm run dev`
3. Open the accessibility-testing directory `cd accessibility-testing`
4. Run pm2 service in accessibility-testing `pm2 start index.js --name wcag-testing-service`
5. Open localhost
