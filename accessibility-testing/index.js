const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const app = express();
app.use(cors());
app.use(express.json());

// WCAG 2.1 criteria mapped to conformance levels
const wcagLevels = {
  '1.1.1': 'A',
  '1.2.1': 'A',
  '1.2.2': 'A',
  '1.2.3': 'A',
  '1.2.4': 'AA',
  '1.2.5': 'AA',
  '1.2.6': 'AAA',
  '1.2.7': 'AAA',
  '1.2.8': 'AAA',
  '1.2.9': 'AAA',
  '1.3.1': 'A',
  '1.3.2': 'A',
  '1.3.3': 'A',
  '1.3.4': 'AA',
  '1.3.5': 'AA',
  '1.3.6': 'AAA',
  '1.4.1': 'A',
  '1.4.2': 'A',
  '1.4.3': 'AA',
  '1.4.4': 'AA',
  '1.4.5': 'AA',
  '1.4.6': 'AAA',
  '1.4.7': 'AAA',
  '1.4.8': 'AAA',
  '1.4.9': 'AAA',
  '1.4.10': 'AA',
  '1.4.11': 'AA',
  '1.4.12': 'AA',
  '1.4.13': 'AA',
  '2.1.1': 'A',
  '2.1.2': 'A',
  '2.1.3': 'AAA',
  '2.1.4': 'A',
  '2.2.1': 'A',
  '2.2.2': 'A',
  '2.2.3': 'AAA',
  '2.2.4': 'AAA',
  '2.2.5': 'AAA',
  '2.2.6': 'AAA',
  '2.3.1': 'A',
  '2.3.2': 'AAA',
  '2.3.3': 'AAA',
  '2.4.1': 'A',
  '2.4.2': 'A',
  '2.4.3': 'A',
  '2.4.4': 'A',
  '2.4.5': 'AA',
  '2.4.6': 'AA',
  '2.4.7': 'AA',
  '2.4.8': 'AAA',
  '2.4.9': 'AAA',
  '2.4.10': 'AAA',
  '2.5.1': 'A',
  '2.5.2': 'A',
  '2.5.3': 'A',
  '2.5.4': 'A',
  '2.5.5': 'AAA',
  '2.5.6': 'AAA',
  '3.1.1': 'A',
  '3.1.2': 'AA',
  '3.1.3': 'AAA',
  '3.1.4': 'AAA',
  '3.1.5': 'AAA',
  '3.1.6': 'AAA',
  '3.2.1': 'A',
  '3.2.2': 'A',
  '3.2.3': 'AA',
  '3.2.4': 'AA',
  '3.2.5': 'AAA',
  '3.2.6': 'AAA',
  '3.3.1': 'A',
  '3.3.2': 'A',
  '3.3.3': 'AA',
  '3.3.4': 'AA',
  '3.3.5': 'AAA',
  '3.3.6': 'AAA',
  '4.1.1': 'A',
  '4.1.2': 'A',
  '4.1.3': 'AA'
};

app.post('/analyze', async (req, res) => {
  const { url, standard = 'wcag21', level = 'aa' } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
      await browser.close();
      return res.status(400).json({
        success: false,
        error: `Failed to load the page: ${e.message}`
      });
    }

    // Configure Axe based on the requested standard and level
    const axeOptions = {
      runOnly: {
        type: 'tag',
        values: [`${standard}:${level}`]
      }
    };

    const results = await new AxePuppeteer(page)
      .configure(axeOptions)
      .analyze();

    await browser.close();

    // Process the results
    const processedResults = {
      success: true,
      url: url,
      timestamp: new Date().toISOString(),
      standard: 'WCAG 2.1',
      level: level.toUpperCase(),
      summary: {
        total: results.violations.length,
        byImpact: {
          critical: results.violations.filter(v => v.impact === 'critical').length,
          serious: results.violations.filter(v => v.impact === 'serious').length,
          moderate: results.violations.filter(v => v.impact === 'moderate').length,
          minor: results.violations.filter(v => v.impact === 'minor').length
        },
        byLevel: {
          A: 0,
          AA: 0,
          AAA: 0
        }
      },
      issues: []
    };

    // Transform the violations into our format
    results.violations.forEach(violation => {
      // Extract WCAG criteria from tags
      const wcagTags = violation.tags
        .filter(tag => tag.startsWith('wcag') && !tag.includes('wcag2'))
        .map(tag => {
          // Convert tags like 'wcag111' to '1.1.1'
          const match = tag.match(/wcag(\d)(\d)(\d)/);
          if (match) {
            return `${match[1]}.${match[2]}.${match[3]}`;
          }
          return null;
        })
        .filter(Boolean);

      // Determine the highest conformance level (A, AA, AAA)
      let highestLevel = 'A';
      wcagTags.forEach(tag => {
        const level = wcagLevels[tag] || 'A';
        if (level === 'AAA' || (level === 'AA' && highestLevel === 'A')) {
          highestLevel = level;
        }
      });

      // Increment the level counter
      processedResults.summary.byLevel[highestLevel]++;

      // Add the issue to our results
      violation.nodes.forEach(node => {
        processedResults.issues.push({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          wcag_criterion: wcagTags.join(', '),
          conformance_level: highestLevel,
          element: node.html,
          location: node.target.join(' '),
          failureSummary: node.failureSummary
        });
      });
    });

    res.json(processedResults);
  } catch (error) {
    console.error('Error running accessibility test:', error);
    res.status(500).json({
      success: false,
      error: `Failed to analyze website: ${error.message}`
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WCAG testing service running on port ${PORT}`);
});
