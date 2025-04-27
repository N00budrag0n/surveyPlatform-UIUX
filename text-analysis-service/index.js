const express = require('express');
const cors = require('cors');
const natural = require('natural');
const franc = require('franc');
const stopword = require('stopword');

const app = express();
app.use(cors());
app.use(express.json());

// Indonesian stopwords
const indonesianStopwords = [
  'ada', 'adalah', 'adanya', 'adapun', 'agak', 'agaknya', 'agar', 'akan', 'akankah', 'akhir',
  'akhiri', 'akhirnya', 'aku', 'akulah', 'amat', 'amatlah', 'anda', 'andalah', 'antar', 'antara',
  'antaranya', 'apa', 'apaan', 'apabila', 'apakah', 'apalagi', 'apatah', 'artinya', 'asal',
  'asalkan', 'atas', 'atau', 'ataukah', 'ataupun', 'awal', 'awalnya', 'bagai', 'bagaikan',
  'bagaimana', 'bagaimanakah', 'bagaimanapun', 'bagi', 'bagian', 'bahkan', 'bahwa', 'bahwasanya',
  'baik', 'bakal', 'bakalan', 'balik', 'banyak', 'bapak', 'baru', 'bawah', 'beberapa', 'begini',
  'beginian', 'beginikah', 'beginilah', 'begitu', 'begitukah', 'begitulah', 'begitupun', 'bekerja',
  'belakang', 'belakangan', 'belum', 'belumlah', 'benar', 'benarkah', 'benarlah', 'berada',
  'berakhir', 'berakhirlah', 'berakhirnya', 'berapa', 'berapakah', 'berapalah', 'berapapun',
  'berarti', 'berawal', 'berbagai', 'berdatangan', 'beri', 'berikan', 'berikut', 'berikutnya',
  'berjumlah', 'berkali-kali', 'berkata', 'berkehendak', 'berkeinginan', 'berkenaan', 'berlainan',
  'berlalu', 'berlangsung', 'berlebihan', 'bermacam', 'bermacam-macam', 'bermaksud', 'bermula',
  'bersama', 'bersama-sama', 'bersiap', 'bersiap-siap', 'bertanya', 'bertanya-tanya', 'berturut',
  'berturut-turut', 'bertutur', 'berujar', 'berupa', 'besar', 'betul', 'betulkah', 'biasa',
  'biasanya', 'bila', 'bilakah', 'bisa', 'bisakah', 'boleh', 'bolehkah', 'bolehlah', 'buat',
  'bukan', 'bukankah', 'bukanlah', 'bukannya', 'bulan', 'bung', 'cara', 'caranya', 'cukup',
  'cukupkah', 'cukuplah', 'cuma', 'dahulu', 'dalam', 'dan', 'dapat', 'dari', 'daripada', 'datang',
  'dekat', 'demi', 'demikian', 'demikianlah', 'dengan', 'depan', 'di', 'dia', 'diakhiri', 'diakhirinya',
  'dialah', 'diantara', 'diantaranya', 'diberi', 'diberikan', 'diberikannya', 'dibuat', 'dibuatnya',
  'didapat', 'didatangkan', 'digunakan', 'diibaratkan', 'diibaratkannya', 'diingat', 'diingatkan',
  'diinginkan', 'dijawab', 'dijelaskan', 'dijelaskannya', 'dikarenakan', 'dikatakan', 'dikatakannya',
  'dikerjakan', 'diketahui', 'diketahuinya', 'dikira', 'dilakukan', 'dilalui', 'dilihat', 'dimaksud',
  'dimaksudkan', 'dimaksudkannya', 'dimaksudnya', 'diminta', 'dimintai', 'dimisalkan', 'dimulai',
  'dimulailah', 'dimulainya', 'dimungkinkan', 'dini', 'dipastikan', 'diperbuat', 'diperbuatnya',
  'dipergunakan', 'diperkirakan', 'diperlihatkan', 'diperlukan', 'diperlukannya', 'dipersoalkan',
  'dipertanyakan', 'dipunyai', 'diri', 'dirinya', 'disampaikan', 'disebut', 'disebutkan',
  'disebutkannya', 'disini', 'disinilah', 'ditambahkan', 'ditandaskan', 'ditanya', 'ditanyai',
  'ditanyakan', 'ditegaskan', 'ditujukan', 'ditunjuk', 'ditunjuki', 'ditunjukkan', 'ditunjukkannya',
  'ditunjuknya', 'dituturkan', 'dituturkannya', 'diucapkan', 'diucapkannya', 'diungkapkan', 'dong',
  'dua', 'dulu', 'empat', 'enggak', 'enggaknya', 'entah', 'entahlah', 'guna', 'gunakan', 'hal',
  'hampir', 'hanya', 'hanyalah', 'hari', 'harus', 'haruslah', 'harusnya', 'hendak', 'hendaklah',
  'hendaknya', 'hingga', 'ia', 'ialah', 'ibarat', 'ibaratkan', 'ibaratnya', 'ibu', 'ikut', 'ingat',
  'ingat-ingat', 'ingin', 'inginkah', 'inginkan', 'ini', 'inikah', 'inilah', 'itu', 'itukah',
  'itulah', 'jadi', 'jadilah', 'jadinya', 'jangan', 'jangankan', 'janganlah', 'jauh', 'jawab',
  'jawaban', 'jawabnya', 'jelas', 'jelaskan', 'jelaslah', 'jelasnya', 'jika', 'jikalau', 'juga',
  'jumlah', 'jumlahnya', 'justru', 'kala', 'kalau', 'kalaulah', 'kalaupun', 'kalian', 'kami',
  'kamilah', 'kamu', 'kamulah', 'kan', 'kapan', 'kapankah', 'kapanpun', 'karena', 'karenanya',
  'kasus', 'kata', 'katakan', 'katakanlah', 'katanya', 'ke', 'keadaan', 'kebetulan', 'kecil',
  'kedua', 'keduanya', 'keinginan', 'kelamaan', 'kelihatan', 'kelihatannya', 'kelima', 'keluar',
  'kembali', 'kemudian', 'kemungkinan', 'kemungkinannya', 'kenapa', 'kepada', 'kepadanya',
  'kesampaian', 'keseluruhan', 'keseluruhannya', 'keterlaluan', 'ketika', 'khususnya', 'kini',
  'kinilah', 'kira', 'kira-kira', 'kiranya', 'kita', 'kitalah', 'kok', 'kurang', 'lagi', 'lagian',
  'lah', 'lain', 'lainnya', 'lalu', 'lama', 'lamanya', 'lanjut', 'lanjutnya', 'lebih', 'lewat',
  'lima', 'luar', 'macam', 'maka', 'makanya', 'makin', 'malah', 'malahan', 'mampu', 'mampukah',
  'mana', 'manakala', 'manalagi', 'masa', 'masalah', 'masalahnya', 'masih', 'masihkah', 'masing',
  'masing-masing', 'mau', 'maupun', 'melainkan', 'melakukan', 'melalui', 'melihat', 'melihatnya',
  'memang', 'memastikan', 'memberi', 'memberikan', 'membuat', 'memerlukan', 'memihak', 'meminta',
  'memintakan', 'memisalkan', 'memperbuat', 'mempergunakan', 'memperkirakan', 'memperlihatkan',
  'mempersiapkan', 'mempersoalkan', 'mempertanyakan', 'mempunyai', 'memulai', 'memungkinkan',
  'menaiki', 'menambahkan', 'menandaskan', 'menanti', 'menanti-nanti', 'menantikan', 'menanya',
  'menanyai', 'menanyakan', 'mendapat', 'mendapatkan', 'mendatang', 'mendatangi', 'mendatangkan',
  'menegaskan', 'mengakhiri', 'mengapa', 'mengatakan', 'mengatakannya', 'mengenai', 'mengerjakan',
  'mengetahui', 'menggunakan', 'menghendaki', 'mengibaratkan', 'mengibaratkannya', 'mengingat',
  'mengingatkan', 'menginginkan', 'mengira', 'mengucapkan', 'mengucapkannya', 'mengungkapkan',
  'menjadi', 'menjawab', 'menjelaskan', 'menuju', 'menunjuk', 'menunjuki', 'menunjukkan',
  'menunjuknya', 'menurut', 'menuturkan', 'menyampaikan', 'menyangkut', 'menyatakan', 'menyebutkan',
  'menyeluruh', 'menyiapkan', 'merasa', 'mereka', 'merekalah', 'merupakan', 'meski', 'meskipun',
  'meyakini', 'meyakinkan', 'minta', 'mirip', 'misal', 'misalkan', 'misalnya', 'mula', 'mulai',
  'mulailah', 'mulanya', 'mungkin', 'mungkinkah', 'nah', 'naik', 'namun', 'nanti', 'nantinya',
  'nyaris', 'nyatanya', 'oleh', 'olehnya', 'pada', 'padahal', 'padanya', 'pak', 'paling', 'panjang',
  'pantas', 'para', 'pasti', 'pastilah', 'penting', 'pentingnya', 'per', 'percuma', 'perlu',
  'perlukah', 'perlunya', 'pernah', 'persoalan', 'pertama', 'pertama-tama', 'pertanyaan',
  'pertanyakan', 'pihak', 'pihaknya', 'pukul', 'pula', 'pun', 'punya', 'rasa', 'rasanya', 'rata',
  'rupanya', 'saat', 'saatnya', 'saja', 'sajalah', 'saling', 'sama', 'sama-sama', 'sambil', 'sampai',
  'sampai-sampai', 'sampaikan', 'sana', 'sangat', 'sangatlah', 'satu', 'saya', 'sayalah', 'se',
  'sebab', 'sebabnya', 'sebagai', 'sebagaimana', 'sebagainya', 'sebagian', 'sebaik', 'sebaik-baiknya',
  'sebaiknya', 'sebaliknya', 'sebanyak', 'sebegini', 'sebegitu', 'sebelum', 'sebelumnya', 'sebenarnya',
  'seberapa', 'sebesar', 'sebetulnya', 'sebisanya', 'sebuah', 'sebut', 'sebutlah', 'sebutnya',
  'secara', 'secukupnya', 'sedang', 'sedangkan', 'sedemikian', 'sedikit', 'sedikitnya', 'seenaknya',
  'segala', 'segalanya', 'segera', 'seharusnya', 'sehingga', 'seingat', 'sejak', 'sejauh', 'sejenak',
  'sejumlah', 'sekadar', 'sekadarnya', 'sekali', 'sekali-kali', 'sekalian', 'sekaligus', 'sekalipun',
  'sekarang', 'sekarang', 'sekecil', 'seketika', 'sekiranya', 'sekitar', 'sekitarnya', 'sekurang-kurangnya',
  'sekurangnya', 'sela', 'selain', 'selaku', 'selalu', 'selama', 'selama-lamanya', 'selamanya',
  'selanjutnya', 'seluruh', 'seluruhnya', 'semacam', 'semakin', 'semampu', 'semampunya', 'semasa',
  'semasih', 'semata', 'semata-mata', 'semaunya', 'sementara', 'semisal', 'semisalnya', 'sempat',
  'semua', 'semuanya', 'semula', 'sendiri', 'sendirian', 'sendirinya', 'seolah', 'seolah-olah',
  'seorang', 'sepanjang', 'sepantasnya', 'sepantasnyalah', 'seperlunya', 'seperti', 'sepertinya',
  'sepihak', 'sering', 'seringnya', 'serta', 'serupa', 'sesaat', 'sesama', 'sesampai', 'sesegera',
  'sesekali', 'seseorang', 'sesuatu', 'sesuatunya', 'sesudah', 'sesudahnya', 'setelah', 'setempat',
  'setengah', 'seterusnya', 'setiap', 'setiba', 'setibanya', 'setidak-tidaknya', 'setidaknya',
  'setinggi', 'seusai', 'sewaktu', 'siap', 'siapa', 'siapakah', 'siapapun', 'sini', 'sinilah',
  'soal', 'soalnya', 'suatu', 'sudah', 'sudahkah', 'sudahlah', 'supaya', 'tadi', 'tadinya', 'tahu',
  'tahun', 'tak', 'tambah', 'tambahnya', 'tampak', 'tampaknya', 'tandas', 'tandasnya', 'tanpa',
  'tanya', 'tanyakan', 'tanyanya', 'tapi', 'tegas', 'tegasnya', 'telah', 'tempat', 'tengah',
  'tentang', 'tentu', 'tentulah', 'tentunya', 'tepat', 'terakhir', 'terasa', 'terbanyak',
  'terdahulu', 'terdapat', 'terdiri', 'terhadap', 'terhadapnya', 'teringat', 'teringat-ingat',
  'terjadi', 'terjadilah', 'terjadinya', 'terkira', 'terlalu', 'terlebih', 'terlihat', 'termasuk',
  'ternyata', 'tersampaikan', 'tersebut', 'tersebutlah', 'tertentu', 'tertuju', 'terus',
  'terutama', 'tetap', 'tetapi', 'tiap', 'tiba', 'tiba-tiba', 'tidak', 'tidakkah', 'tidaklah',
  'tiga', 'tinggi', 'toh', 'tunjuk', 'turut', 'tutur', 'tuturnya', 'ucap', 'ucapnya', 'ujar',
  'ujarnya', 'umum', 'umumnya', 'ungkap', 'ungkapnya', 'untuk', 'usah', 'usai', 'waduh', 'wah',
  'wahai', 'waktu', 'waktunya', 'walau', 'walaupun', 'wong', 'yaitu', 'yakin', 'yakni', 'yang'
];

// Add Indonesian stopwords to the stopword package
stopword.id = indonesianStopwords;

// Stemmer for Indonesian
const stemmerID = {
  stem: function(word) {
    // Basic Indonesian stemming rules
    // Remove common prefixes
    const prefixes = ['me', 'pe', 'be', 'te', 'di', 'ke', 'se'];
    for (const prefix of prefixes) {
      if (word.startsWith(prefix) && word.length > prefix.length + 2) {
        word = word.substring(prefix.length);
        break;
      }
    }

    // Remove common suffixes
    const suffixes = ['kan', 'an', 'i', 'lah', 'kah', 'nya', 'pun'];
    for (const suffix of suffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        word = word.substring(0, word.length - suffix.length);
        break;
      }
    }

    return word;
  }
};

// Function to detect if text is likely Indonesian
function isIndonesian(text) {
  // Check for common Indonesian words
  const commonWords = ['yang', 'dan', 'di', 'ini', 'itu', 'dengan', 'untuk', 'tidak', 'pada', 'dari', 'dalam', 'akan', 'adalah', 'saya', 'kamu', 'mereka'];
  const words = text.toLowerCase().split(/\s+/);

  let indonesianWordCount = 0;
  for (const word of words) {
    if (commonWords.includes(word)) {
      indonesianWordCount++;
    }
  }

  // If more than 10% of words are common Indonesian words, consider it Indonesian
  return (indonesianWordCount / words.length) > 0.1;
}

// Process text based on language
function processText(text, language) {
  // Convert to lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');

  // Tokenize
  const tokens = cleanText.split(/\s+/).filter(token => token.length > 1);

  // Remove stopwords based on language
  let filteredTokens;
  if (language === 'id') {
    filteredTokens = stopword.removeStopwords(tokens, stopword.id);

    // Apply stemming for Indonesian
    filteredTokens = filteredTokens.map(token => stemmerID.stem(token));
  } else {
    // Default to English
    filteredTokens = stopword.removeStopwords(tokens, stopword.en);

    // Apply stemming for English
    const stemmer = natural.PorterStemmer;
    filteredTokens = filteredTokens.map(token => stemmer.stem(token));
  }

  return filteredTokens;
}

// Endpoint for summarizing AB testing reasons
app.post('/summarize-reasons', async (req, res) => {
  const { reasons } = req.body;

  if (!reasons || !Array.isArray(reasons) || reasons.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid array of reasons is required'
    });
  }

  try {
    // Group reasons by language (focusing on Indonesian and English)
    const languageGroups = {
      'id': [],
      'en': []
    };

    reasons.forEach(text => {
      // First try to detect if it's Indonesian using our custom function
      if (isIndonesian(text)) {
        languageGroups['id'].push(text);
      } else {
        // Use franc for other languages, but focus on English
        const detectedLang = franc(text, {only: ['eng', 'ind']});
        const lang = detectedLang === 'ind' ? 'id' : 'en';
        languageGroups[lang].push(text);
      }
    });

    // Process each language group
    const summaries = {};

    for (const [lang, langTexts] of Object.entries(languageGroups)) {
      if (langTexts.length === 0) continue;

      // Process all texts in this language
      const allTokens = [];
      langTexts.forEach(text => {
        const tokens = processText(text, lang);
        allTokens.push(...tokens);
      });

      // Count token frequencies
      const tokenCounts = {};
      allTokens.forEach(token => {
        if (!tokenCounts[token]) {
            tokenCounts[token] = 0;
          }
          tokenCounts[token]++;
        });

        // Sort by frequency
        const sortedTokens = Object.entries(tokenCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10); // Get top 10 keywords

        // Create keyword summary
        const keywordSummary = sortedTokens.map(([token, count]) => ({
          term: token,
          count: count,
          percentage: Math.round((count / langTexts.length) * 100)
        }));

        // Create text summary
        const topKeywords = keywordSummary.slice(0, 5).map(k => k.term);

        // Group similar reasons
        const reasonGroups = {};
        langTexts.forEach(text => {
          // Find which top keywords are in this text
          const matchedKeywords = topKeywords.filter(keyword =>
            text.toLowerCase().includes(keyword)
          );

          if (matchedKeywords.length > 0) {
            const key = matchedKeywords.sort().join('_');
            if (!reasonGroups[key]) {
              reasonGroups[key] = {
                keywords: matchedKeywords,
                reasons: [],
                count: 0
              };
            }
            reasonGroups[key].reasons.push(text);
            reasonGroups[key].count++;
          } else {
            // If no top keywords match, put in "other" category
            if (!reasonGroups['other']) {
              reasonGroups['other'] = {
                keywords: ['other'],
                reasons: [],
                count: 0
              };
            }
            reasonGroups['other'].reasons.push(text);
            reasonGroups['other'].count++;
          }
        });

        // Sort groups by count
        const sortedGroups = Object.values(reasonGroups)
          .sort((a, b) => b.count - a.count);

        summaries[lang] = {
          keywords: keywordSummary,
          groups: sortedGroups,
          count: langTexts.length
        };
      }

      // Find dominant language
      let dominantLanguage = 'en'; // Default to English
      if ((languageGroups['id']?.length || 0) > (languageGroups['en']?.length || 0)) {
        dominantLanguage = 'id';
      }

      res.json({
        success: true,
        result: {
          by_language: summaries,
          dominant_language: dominantLanguage,
          total_reasons: reasons.length
        }
      });
    } catch (error) {
      console.error('Error analyzing reasons:', error);
      res.status(500).json({
        success: false,
        error: `Failed to analyze reasons: ${error.message}`
      });
    }
  });

  // Endpoint for extracting key themes from AB testing reasons
  app.post('/extract-themes', async (req, res) => {
    const { variant_a_reasons, variant_b_reasons } = req.body;

    if (!variant_a_reasons || !Array.isArray(variant_a_reasons) ||
        !variant_b_reasons || !Array.isArray(variant_b_reasons)) {
      return res.status(400).json({
        success: false,
        error: 'Valid arrays of reasons for both variants are required'
      });
    }

    try {
      // Process reasons for each variant
      const processVariantReasons = (reasons) => {
        // Group by language
        const languageGroups = {
          'id': [],
          'en': []
        };

        reasons.forEach(text => {
          if (isIndonesian(text)) {
            languageGroups['id'].push(text);
          } else {
            const detectedLang = franc(text, {only: ['eng', 'ind']});
            const lang = detectedLang === 'ind' ? 'id' : 'en';
            languageGroups[lang].push(text);
          }
        });

        // Process each language
        const languageSummaries = {};

        for (const [lang, texts] of Object.entries(languageGroups)) {
          if (texts.length === 0) continue;

          // Extract all tokens
          const allTokens = [];
          texts.forEach(text => {
            const tokens = processText(text, lang);
            allTokens.push(...tokens);
          });

          // Count frequencies
          const tokenCounts = {};
          allTokens.forEach(token => {
            if (!tokenCounts[token]) {
              tokenCounts[token] = 0;
            }
            tokenCounts[token]++;
          });

          // Get top themes
          const themes = Object.entries(tokenCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([term, count]) => ({
              term,
              count,
              percentage: Math.round((count / texts.length) * 100)
            }));

          languageSummaries[lang] = {
            themes,
            count: texts.length
          };
        }

        return languageSummaries;
      };

      const variantASummary = processVariantReasons(variant_a_reasons);
      const variantBSummary = processVariantReasons(variant_b_reasons);

      // Compare themes between variants
      const compareThemes = () => {
        const comparison = {
          unique_to_a: [],
          unique_to_b: [],
          common: []
        };

        // Get all languages
        const languages = new Set([
          ...Object.keys(variantASummary),
          ...Object.keys(variantBSummary)
        ]);

        for (const lang of languages) {
          const aThemes = variantASummary[lang]?.themes || [];
          const bThemes = variantBSummary[lang]?.themes || [];

          // Get terms from each
          const aTerms = new Set(aThemes.map(t => t.term));
          const bTerms = new Set(bThemes.map(t => t.term));

          // Find unique and common terms
          for (const theme of aThemes) {
            if (!bTerms.has(theme.term)) {
              comparison.unique_to_a.push({
                term: theme.term,
                language: lang,
                count: theme.count,
                percentage: theme.percentage
              });
            } else {
              // Find the matching theme in B
              const bTheme = bThemes.find(t => t.term === theme.term);
              comparison.common.push({
                term: theme.term,
                language: lang,
                variant_a: {
                  count: theme.count,
                  percentage: theme.percentage
                },
                variant_b: {
                  count: bTheme.count,
                  percentage: bTheme.percentage
                },
                difference: theme.percentage - bTheme.percentage
              });
            }
          }

          // Find themes unique to B
          for (const theme of bThemes) {
            if (!aTerms.has(theme.term)) {
              comparison.unique_to_b.push({
                term: theme.term,
                language: lang,
                count: theme.count,
                percentage: theme.percentage
              });
            }
          }
        }

        // Sort the comparisons
        comparison.unique_to_a.sort((a, b) => b.count - a.count);
        comparison.unique_to_b.sort((a, b) => b.count - a.count);
        comparison.common.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

        return comparison;
      };

      res.json({
        success: true,
        result: {
          variant_a: variantASummary,
          variant_b: variantBSummary,
          comparison: compareThemes(),
          counts: {
            variant_a: variant_a_reasons.length,
            variant_b: variant_b_reasons.length
          }
        }
      });
    } catch (error) {
      console.error('Error extracting themes:', error);
      res.status(500).json({
        success: false,
        error: `Failed to extract themes: ${error.message}`
      });
    }
  });

  // Start the server
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Text analysis service running on port ${PORT}`);
  });
