<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SurveyQuestions;
use GuzzleHttp\Promise\Create;

class SurveyQuestionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SurveyQuestions::create([
            'survey_id' => 1,
            'questions_data' =>
            '{
                "sus": {
                    "sus1": "Saya berpikir akan menggunakan sistem Website Rumah Sakit ini lagi.",
                    "sus2": "Saya merasa sistem Website Rumah Sakit ini rumit untuk digunakan.",
                    "sus3": "Saya merasa sistem Website Rumah Sakit ini mudah digunakan.",
                    "sus4": "Saya membutuhkan bantuan dari orang lain atau teknisi dalam menggunakan sistem Website Rumah Sakit ini.",
                    "sus5": "Saya merasa fitur-fitur sistem Website Rumah Sakit ini berjalan dengan semestinya.",
                    "sus6": "Saya merasa ada banyak hal yang tidak konsisten (tidak serasi pada sistem Website Rumah Sakit ini).",
                    "sus7": "Saya merasa orang lain akan memahami cara menggunakan sistem Website Rumah Sakit ini dengan cepat.",
                    "sus8": "Saya merasa sistem Website Rumah Sakit ini membingungkan.",
                    "sus9": "Saya merasa tidak ada hambatan dalam menggunakan sistem Website Rumah Sakit ini.",
                    "sus10": "Saya perlu membiasakan diri terlebih dahulu sebelum menggunakan sistem Website Rumah Sakit ini."
                },
                "tam": [
                    {
                        "name": "PEU",
                        "indicators": [
                            {
                                "name": "Kemudahan dipelajari",
                                "questions": [
                                    "Menurut saya penggunaan Website Rumah Sakit ini mudah untuk dipelajari."
                                ]
                            },
                            {
                                "name": "Mudah dipahami/dimengerti",
                                "questions": [
                                    "Menurut saya Website Rumah Sakit ini menggunakan bahasa yang mudah dimengerti dan dipahami."
                                ]
                            },
                            {
                                "name": "Mudah sehingga mahir",
                                "questions": [
                                    "Menurut saya mendapat informasi/layanan yang saya butuhkan dari Website Rumah Sakit ini merupakan hal yang mudah."
                                ]
                            },
                            {
                                "name": "Mudah digunakan",
                                "questions": [
                                    "Menu-menu pada Website Rumah Sakit ini tersusun dengan baik sehingga fitur-fitur yang tersedia dapat mudah digunakan."
                                ]
                            },
                            {
                                "name": "Mudah dikendalikan",
                                "questions": [
                                    "Menurut saya Website Rumah Sakit ini sangat fleksibel untuk berinteraksi."
                                ]
                            },
                            {
                                "name": "Mudah diingat",
                                "questions": [
                                    "Menurut saya langkah-langkah dalam menggunakan Website Rumah Sakit ini mudah diingat."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "PU",
                        "indicators": [
                            {
                                "name": "Lebih cepat",
                                "questions": [
                                    "Menggunakan Website Rumah Sakit ini membantu saya menemukan informasi/layanan dengan lebih cepat."
                                ]
                            },
                            {
                                "name": "Meningkatkan kinerja",
                                "questions": [
                                    "Menggunakan Website Rumah Sakit ini telah meningkatkan kinerja saya dalam menerima informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan produktivitas",
                                "questions": [
                                    "Menggunakan Website Rumah Sakit ini telah meningkatkan produktivitas saya dalam mendapatkan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan efektivitas",
                                "questions": [
                                    "Menggunakan Website Rumah Sakit ini telah meningkatkan efektivitas saya dalam menggunakan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Lebih mudah",
                                "questions": [
                                    "Dengan adanya Website Rumah Sakit, saya dapat mencapai tujuan pekerjaan saya dengan lebih mudah."
                                ]
                            },
                            {
                                "name": "Bermanfaat",
                                "questions": [
                                    "Secara keseluruhan, saya merasa Website Rumah Sakit ini bermanfaat bagi saya."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ATU",
                        "indicators": [
                            {
                                "name": "Rasa senang",
                                "questions": [
                                    "Saya merasa senang menggunakan Website Rumah Sakit ini"
                                ]
                            },
                            {
                                "name": "Menikmati",
                                "questions": [
                                    "Saya merasa nyaman dan menikmati saat menggunakan Website Rumah Sakit ini"
                                ]
                            },
                            {
                                "name": "Rasa bosan",
                                "questions": [
                                    "Saya merasa tidak bosan menggunakan Website Rumah Sakit ini"
                                ]
                            },
                            {
                                "name": "Tidak suka",
                                "questions": [
                                    "Saya suka menggunakan Website Rumah Sakit ini"
                                ]
                            }
                        ]
                    },
                    {
                        "name": "BI",
                        "indicators": [
                            {
                                "name": "Menggunakan kapan saja",
                                "questions": [
                                    "Saya ingin menggunakan Website Rumah Sakit ini saat kapan pun diperlukan."
                                ]
                            },
                            {
                                "name": "Menggunakan kondisi apapun",
                                "questions": [
                                    "Saya selalu menggunakan Website Rumah Sakit ini dalam kondisi apapun."
                                ]
                            },
                            {
                                "name": "Niat menggunakan terus",
                                "questions": [
                                    "Saya memiliki niat untuk terus menggunakan Website Rumah Sakit ini di masa yang akan datang."
                                ]
                            },
                            {
                                "name": "Berharap menggunakan",
                                "questions": [
                                    "Saya berharap dapat terus menggunakan Website Rumah Sakit ini di masa depan."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ASU",
                        "indicators": [
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Website Rumah Sakit ini minimal sehari sekali."
                                ]
                            },
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Website Rumah Sakit ini selama hari kerja maupun hari libur."
                                ]
                            },
                            {
                                "name": "Durasi penggunaan",
                                "questions": [
                                    "Saya menggunakan Website Rumah Sakit ini rata-rata minimal 10 menit."
                                ]
                            }
                        ]
                    }
                ],
                "ab_testing": [
                    {
                        "id": "ab1",
                        "topic": "Homepage Design",
                        "description": "Compare these two homepage layouts",
                        "variant_a": {
                            "image": "homepage_a.jpg"
                        },
                        "variant_b": {
                            "image": "homepage_b.jpg"
                        }
                    },
                    {
                        "id": "ab2",
                        "topic": "Navigation Menu",
                        "description": "Which navigation style do you prefer?",
                        "variant_a": {
                        "image": "nav_a.jpg"
                        },
                        "variant_b": {
                            "image": "nav_b.jpg"
                        }
                    }
                ]
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 2,
            'questions_data' =>
            '{
                "tam": [
                    {
                        "name": "PEU",
                        "indicators": [
                            {
                                "name": "Kemudahan dipelajari",
                                "questions": [
                                    "Menurut saya penggunaan E-Commerce Fashion Aplication ini mudah untuk dipelajari."
                                ]
                            },
                            {
                                "name": "Mudah dipahami/dimengerti",
                                "questions": [
                                    "Menurut saya mendapat informasi/layanan yang saya butuhkan dari E-Commerce Fashion Aplication ini merupakan hal yang mudah."
                                ]
                            },
                            {
                                "name": "Mudah sehingga mahir",
                                "questions": [
                                    "Menu-menu pada E-Commerce Fashion Aplication ini tersusun dengan baik sehingga fitur-fitur yang tersedia dapat mudah digunakan."
                                ]
                            },
                            {
                                "name": "Mudah digunakan",
                                "questions": [
                                    "Menurut saya E-Commerce Fashion Aplication menggunakan bahasa yang mudah dimengerti dan dipahami."
                                ]
                            },
                            {
                                "name": "Mudah dikendalikan",
                                "questions": [
                                    "Menurut saya E-Commerce Fashion Aplication ini sangat fleksibel untuk berinteraksi."
                                ]
                            },
                            {
                                "name": "Mudah diingat",
                                "questions": [
                                    "Menurutsaya langkah-langkah dalam menggunakan E-Commerce Fashion Aplication ini mudah diingat."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "PU",
                        "indicators": [
                            {
                                "name": "Lebih cepat",
                                "questions": [
                                    "Menggunakan E-Commerce Fashion Aplication ini membantu saya menemukan informasi/layanan dengan lebih cepat."
                                ]
                            },
                            {
                                "name": "Meningkatkan kinerja",
                                "questions": [
                                    "Menggunakan E-Commerce Fashion Aplication ini telah meningkatkan kinerja saya dalam menerima informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan produktivitas",
                                "questions": [
                                    "Menggunakan E-Commerce Fashion Aplication ini telah meningkatkan produktivitas saya dalam mendapatkan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan efektivitas",
                                "questions": [
                                    "Menggunakan E-Commerce Fashion Aplication ini telah meningkatkan efektivitas saya dalam menggunakan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Lebih mudah",
                                "questions": [
                                    "Dengan adanya E-Commerce Fashion Aplication, saya dapat mencapai tujuan pekerjaan saya dengan lebih mudah."
                                ]
                            },
                            {
                                "name": "Bermanfaat",
                                "questions": [
                                    "Secara keseluruhan, saya merasa E-Commerce Fashion Aplication ini bermanfaat bagi saya."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ATU",
                        "indicators": [
                            {
                                "name": "Rasa senang",
                                "questions": [
                                    "Saya merasa senang menggunakan E-Commerce Fashion Aplication ini"
                                ]
                            },
                            {
                                "name": "Menikmati",
                                "questions": [
                                    "Saya merasa nyaman dan menikmati saat menggunakan E-Commerce Fashion Aplication ini"
                                ]
                            },
                            {
                                "name": "Rasa bosan",
                                "questions": [
                                    "Saya merasa tidak bosan menggunakan E-Commerce Fashion Aplication ini"
                                ]
                            },
                            {
                                "name": "Tidak suka",
                                "questions": [
                                    "Saya suka menggunakan E-Commerce Fashion Aplication ini"
                                ]
                            }
                        ]
                    },
                    {
                        "name": "BI",
                        "indicators": [
                            {
                                "name": "Menggunakan kapan saja",
                                "questions": [
                                    "Saya ingin menggunakan E-Commerce Fashion Aplication ini saat kapan pun diperlukan."
                                ]
                            },
                            {
                                "name": "Menggunakan kondisi apapun",
                                "questions": [
                                    "Saya selalu menggunakan E-Commerce Fashion Aplication ini dalam kondisi apapun."
                                ]
                            },
                            {
                                "name": "Niat menggunakan terus",
                                "questions": [
                                    "Saya memiliki niat untuk terus menggunakan E-Commerce Fashion Aplication ini di masa yang akan datang."
                                ]
                            },
                            {
                                "name": "Berharap menggunakan",
                                "questions": [
                                    "Saya berharap dapat terus menggunakan E-Commerce Fashion Aplication ini di masa depan."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ASU",
                        "indicators": [
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan E-Commerce Fashion Aplication ini minimal sehari sekali."
                                ]
                            },
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan E-Commerce Fashion Aplication ini selama hari kerja maupun hari libur."
                                ]
                            },
                            {
                                "name": "Durasi penggunaan",
                                "questions": [
                                    "Saya menggunakan E-Commerce Fashion Aplication ini rata-rata minimal 10 menit."
                                ]
                            }
                        ]
                    }
                ]
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 3,
            'questions_data' =>
            '{
                "sus": {
                    "sus1": "Saya berpikir akan menggunakan sistem E-Learning Platform ini lagi.",
                    "sus2": "Saya merasa sistem E-Learning Platform ini rumit untuk digunakan.",
                    "sus3": "Saya merasa sistem E-Learning Platform ini mudah digunakan.",
                    "sus4": "Saya membutuhkan bantuan dari orang lain atau teknisi dalam menggunakan sistem E-Learning Platform ini.",
                    "sus5": "Saya merasa fitur-fitur sistem E-Learning Platform ini berjalan dengan semestinya.",
                    "sus6": "Saya merasa ada banyak hal yang tidak konsisten (tidak serasi pada sistem E-Learning Platform ini).",
                    "sus7": "Saya merasa orang lain akan memahami cara menggunakan sistem E-Learning Platform ini dengan cepat.",
                    "sus8": "Saya merasa sistem E-Learning Platform ini membingungkan.",
                    "sus9": "Saya merasa tidak ada hambatan dalam menggunakan sistem E-Learning Platform ini.",
                    "sus10": "Saya perlu membiasakan diri terlebih dahulu sebelum menggunakan sistem E-Learning Platform ini."
                }
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 4,
            'questions_data' =>
            '{
                "sus": {
                    "sus1": "Saya berpikir akan menggunakan sistem Travel Booking App ini lagi.",
                    "sus2": "Saya merasa sistem Travel Booking App ini rumit untuk digunakan.",
                    "sus3": "Saya merasa sistem Travel Booking App ini mudah digunakan.",
                    "sus4": "Saya membutuhkan bantuan dari orang lain atau teknisi dalam menggunakan sistem Travel Booking App ini.",
                    "sus5": "Saya merasa fitur-fitur sistem Travel Booking App ini berjalan dengan semestinya.",
                    "sus6": "Saya merasa ada banyak hal yang tidak konsisten (tidak serasi pada sistem Travel Booking App ini).",
                    "sus7": "Saya merasa orang lain akan memahami cara menggunakan sistem Travel Booking App ini dengan cepat.",
                    "sus8": "Saya merasa sistem Travel Booking App ini membingungkan.",
                    "sus9": "Saya merasa tidak ada hambatan dalam menggunakan sistem Travel Booking App ini.",
                    "sus10": "Saya perlu membiasakan diri terlebih dahulu sebelum menggunakan sistem Travel Booking App ini."
                },
                "tam": [
                    {
                        "name": "PEU",
                        "indicators": [
                            {
                                "name": "Kemudahan dipelajari",
                                "questions": [
                                    "Menurut saya penggunaan Travel Booking App ini mudah untuk dipelajari."
                                ]
                            },
                            {
                                "name": "Mudah dipahami/dimengerti",
                                "questions": [
                                    "Menurut saya Travel Booking App ini menggunakan bahasa yang mudah dimengerti dan dipahami."
                                ]
                            },
                            {
                                "name": "Mudah sehingga mahir",
                                "questions": [
                                    "Menurut saya mendapat informasi/layanan yang saya butuhkan dari Travel Booking App ini merupakan hal yang mudah."
                                ]
                            },
                            {
                                "name": "Mudah digunakan",
                                "questions": [
                                    "Menu-menu pada Travel Booking App ini tersusun dengan baik sehingga fitur-fitur yang tersedia dapat mudah digunakan."
                                ]
                            },
                            {
                                "name": "Mudah dikendalikan",
                                "questions": [
                                    "Menurut saya Travel Booking App ini sangat fleksibel untuk berinteraksi."
                                ]
                            },
                            {
                                "name": "Mudah diingat",
                                "questions": [
                                    "Menurutsaya langkah-langkah dalam menggunakan Travel Booking App ini mudah diingat."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "PU",
                        "indicators": [
                            {
                                "name": "Lebih cepat",
                                "questions": [
                                    "Menggunakan Travel Booking App ini membantu saya menemukan informasi/layanan dengan lebih cepat."
                                ]
                            },
                            {
                                "name": "Meningkatkan kinerja",
                                "questions": [
                                    "Menggunakan Travel Booking App ini telah meningkatkan kinerja saya dalam menerima informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan produktivitas",
                                "questions": [
                                    "Menggunakan Travel Booking App ini telah meningkatkan produktivitas saya dalam mendapatkan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan efektivitas",
                                "questions": [
                                    "Menggunakan Travel Booking App ini telah meningkatkan efektivitas saya dalam menggunakan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Lebih mudah",
                                "questions": [
                                    "Dengan adanya Travel Booking App, saya dapat mencapai tujuan pekerjaan saya dengan lebih mudah."
                                ]
                            },
                            {
                                "name": "Bermanfaat",
                                "questions": [
                                    "Secara keseluruhan, saya merasa Travel Booking App ini bermanfaat bagi saya."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ATU",
                        "indicators": [
                            {
                                "name": "Rasa senang",
                                "questions": [
                                    "Saya merasa senang menggunakan Travel Booking App ini"
                                ]
                            },
                            {
                                "name": "Menikmati",
                                "questions": [
                                    "Saya merasa nyaman dan menikmati saat menggunakan Travel Booking App ini"
                                ]
                            },
                            {
                                "name": "Rasa bosan",
                                "questions": [
                                    "Saya merasa tidak bosan menggunakan Travel Booking App ini"
                                ]
                            },
                            {
                                "name": "Tidak suka",
                                "questions": [
                                    "Saya suka menggunakan Travel Booking App ini"
                                ]
                            }
                        ]
                    },
                    {
                        "name": "BI",
                        "indicators": [
                            {
                                "name": "Menggunakan kapan saja",
                                "questions": [
                                    "Saya ingin menggunakan Travel Booking App ini saat kapan pun diperlukan."
                                ]
                            },
                            {
                                "name": "Menggunakan kondisi apapun",
                                "questions": [
                                    "Saya selalu menggunakan Travel Booking App ini dalam kondisi apapun."
                                ]
                            },
                            {
                                "name": "Niat menggunakan terus",
                                "questions": [
                                    "Saya memiliki niat untuk terus menggunakan Travel Booking App ini di masa yang akan datang."
                                ]
                            },
                            {
                                "name": "Berharap menggunakan",
                                "questions": [
                                    "Saya berharap dapat terus menggunakan Travel Booking App ini di masa depan."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ASU",
                        "indicators": [
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Travel Booking App ini minimal sehari sekali."
                                ]
                            },
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Travel Booking App ini selama hari kerja maupun hari libur."
                                ]
                            },
                            {
                                "name": "Durasi penggunaan",
                                "questions": [
                                    "Saya menggunakan Travel Booking App ini rata-rata minimal 10 menit."
                                ]
                            }
                        ]
                    }
                ]
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 5,
            'questions_data' =>
            '{
                "sus": {
                    "sus1": "Saya berpikir akan menggunakan sistem Health and Fitness App ini lagi.",
                    "sus2": "Saya merasa sistem Health and Fitness App ini rumit untuk digunakan.",
                    "sus3": "Saya merasa sistem Health and Fitness App ini mudah digunakan.",
                    "sus4": "Saya membutuhkan bantuan dari orang lain atau teknisi dalam menggunakan sistem Health and Fitness App ini.",
                    "sus5": "Saya merasa fitur-fitur sistem Health and Fitness App ini berjalan dengan semestinya.",
                    "sus6": "Saya merasa ada banyak hal yang tidak konsisten (tidak serasi pada sistem Health and Fitness App ini).",
                    "sus7": "Saya merasa orang lain akan memahami cara menggunakan sistem Health and Fitness App ini dengan cepat.",
                    "sus8": "Saya merasa sistem Health and Fitness App ini membingungkan.",
                    "sus9": "Saya merasa tidak ada hambatan dalam menggunakan sistem Health and Fitness App ini.",
                    "sus10": "Saya perlu membiasakan diri terlebih dahulu sebelum menggunakan sistem Health and Fitness App ini."
                }
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 6,
            'questions_data' =>
            '{
                "tam": [
                    {
                    "name": "PEU",
                    "indicators": [
                        {
                            "name": "Kemudahan dipelajari",
                            "questions": [
                                "Menurut saya penggunaan Restaurant Website ini mudah untuk dipelajari."
                            ]
                        },
                        {
                            "name": "Mudah dipahami/dimengerti",
                            "questions": [
                                "Menurut saya Restaurant Website menggunakan bahasa yang mudah dimengerti dan dipahami."
                            ]
                        },
                        {
                            "name": "Mudah sehingga mahir",
                            "questions": [
                                "Menurut saya mendapat informasi/layanan yang saya butuhkan dari Restaurant Website ini merupakan hal yang mudah."
                            ]
                        },
                        {
                            "name": "Mudah digunakan",
                            "questions": [
                                "Menu-menu pada Restaurant Website ini tersusun dengan baik sehingga fitur-fitur yang tersedia dapat mudah digunakan."
                            ]
                        },
                        {
                            "name": "Mudah dikendalikan",
                            "questions": [
                                "Menurut saya Restaurant Website ini sangat fleksibel untuk berinteraksi."
                            ]
                        },
                        {
                            "name": "Mudah diingat",
                            "questions": [
                                "Menurutsaya langkah-langkah dalam menggunakan Restaurant Website ini mudah diingat."
                            ]
                        }
                    ]
                },
                {
                    "name": "PU",
                    "indicators": [
                        {
                            "name": "Lebih cepat",
                            "questions": [
                                "Menggunakan Restaurant Website ini membantu saya menemukan informasi/layanan dengan lebih cepat."
                            ]
                        },
                        {
                            "name": "Meningkatkan kinerja",
                            "questions": [
                                "Menggunakan Restaurant Website ini telah meningkatkan kinerja saya dalam menerima informasi/layanan."
                            ]
                        },
                        {
                            "name": "Meningkatkan produktivitas",
                            "questions": [
                                "Menggunakan Restaurant Website ini telah meningkatkan produktivitas saya dalam mendapatkan informasi/layanan."
                            ]
                        },
                        {
                            "name": "Meningkatkan efektivitas",
                            "questions": [
                                "Menggunakan Restaurant Website ini telah meningkatkan efektivitas saya dalam menggunakan informasi/layanan."
                            ]
                        },
                        {
                            "name": "Lebih mudah",
                            "questions": [
                                "Dengan adanya Restaurant Website, saya dapat mencapai tujuan pekerjaan saya dengan lebih mudah."
                            ]
                        },
                        {
                            "name": "Bermanfaat",
                            "questions": [
                                "Secara keseluruhan, saya merasa Restaurant Website ini bermanfaat bagi saya."
                            ]
                        }
                    ]
                },
                {
                    "name": "ATU",
                    "indicators": [
                        {
                            "name": "Rasa senang",
                            "questions": [
                                "Saya merasa senang menggunakan Restaurant Website ini"
                            ]
                        },
                        {
                            "name": "Menikmati",
                            "questions": [
                                "Saya merasa nyaman dan menikmati saat menggunakan Restaurant Website ini"
                            ]
                        },
                        {
                            "name": "Rasa bosan",
                            "questions": [
                                "Saya merasa tidak bosan menggunakan Restaurant Website ini"
                            ]
                        },
                        {
                            "name": "Tidak suka",
                            "questions": [
                                "Saya suka menggunakan Restaurant Website ini"
                            ]
                        }
                    ]
                },
                {
                    "name": "BI",
                    "indicators": [
                        {
                            "name": "Menggunakan kapan saja",
                            "questions": [
                                "Saya ingin menggunakan Restaurant Website ini saat kapan pun diperlukan."
                            ]
                        },
                        {
                            "name": "Menggunakan kondisi apapun",
                            "questions": [
                                "Saya selalu menggunakan Restaurant Website ini dalam kondisi apapun."
                            ]
                        },
                        {
                            "name": "Menggunakan terus",
                            "questions": [
                                "Saya selalu menggunakan Restaurant Website ini tanpa memandang kondisi."
                            ]
                        },
                        {
                            "name": "Niat menggunakan terus",
                            "questions": [
                                "Saya memiliki niat untuk terus menggunakan Restaurant Website ini di masa yang akan datang."
                            ]
                        },
                        {
                            "name": "Berharap menggunakan",
                            "questions": [
                                "Saya berharap dapat terus menggunakan Restaurant Website ini di masa depan."
                            ]
                        }
                    ]
                },
                {
                    "name": "ASU",
                    "indicators": [
                        {
                            "name": "Frekuensi penggunaan",
                            "questions": [
                                "Saya menggunakan Restaurant Website ini minimal sehari sekali."
                            ]
                        },
                        {
                            "name": "Frekuensi penggunaan",
                            "questions": [
                                "Saya menggunakan Restaurant Website ini selama hari kerja maupun hari libur."
                            ]
                        },
                        {
                            "name": "Durasi penggunaan",
                            "questions": [
                                "Saya menggunakan Restaurant Website ini rata-rata minimal 10 menit."
                            ]
                        }
                    ]
                }
            ]
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 7,
            'questions_data' =>
            '{
                "sus": {
                    "sus1": "Saya berpikir akan menggunakan sistem Aplikasi Belanja Online ini lagi.",
                    "sus2": "Saya merasa sistem Aplikasi Belanja Online ini rumit untuk digunakan.",
                    "sus3": "Saya merasa sistem Aplikasi Belanja Online ini mudah digunakan.",
                    "sus4": "Saya membutuhkan bantuan dari orang lain atau teknisi dalam menggunakan sistem Aplikasi Belanja Online ini.",
                    "sus5": "Saya merasa fitur-fitur sistem Aplikasi Belanja Online ini berjalan dengan semestinya.",
                    "sus6": "Saya merasa ada banyak hal yang tidak konsisten (tidak serasi pada sistem Aplikasi Belanja Online ini).",
                    "sus7": "Saya merasa orang lain akan memahami cara menggunakan sistem Aplikasi Belanja Online ini dengan cepat.",
                    "sus8": "Saya merasa sistem Aplikasi Belanja Online ini membingungkan.",
                    "sus9": "Saya merasa tidak ada hambatan dalam menggunakan sistem Aplikasi Belanja Online ini.",
                    "sus10": "Saya perlu membiasakan diri terlebih dahulu sebelum menggunakan sistem Aplikasi Belanja Online ini."
                }
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 8,
            'questions_data' =>
            '{
                "sus": {
                    "sus1": "Saya berpikir akan menggunakan sistem Aplikasi Streaming Musik ini lagi.",
                    "sus2": "Saya merasa sistem Aplikasi Streaming Musik ini rumit untuk digunakan.",
                    "sus3": "Saya merasa sistem Aplikasi Streaming Musik ini mudah digunakan.",
                    "sus4": "Saya membutuhkan bantuan dari orang lain atau teknisi dalam menggunakan sistem Aplikasi Streaming Musik ini.",
                    "sus5": "Saya merasa fitur-fitur sistem Aplikasi Streaming Musik ini berjalan dengan semestinya.",
                    "sus6": "Saya merasa ada banyak hal yang tidak konsisten (tidak serasi pada sistem Aplikasi Streaming Musik ini).",
                    "sus7": "Saya merasa orang lain akan memahami cara menggunakan sistem Aplikasi Streaming Musik ini dengan cepat.",
                    "sus8": "Saya merasa sistem Aplikasi Streaming Musik ini membingungkan.",
                    "sus9": "Saya merasa tidak ada hambatan dalam menggunakan sistem Aplikasi Streaming Musik ini.",
                    "sus10": "Saya perlu membiasakan diri terlebih dahulu sebelum menggunakan sistem Aplikasi Streaming Musik ini."
                }
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 9,
            'questions_data' =>
            '{
                "tam": [
                    {
                        "name": "PEU",
                        "indicators": [
                            {
                                "name": "Kemudahan dipelajari",
                                "questions": [
                                    "Menurut saya penggunaan Aplikasi Kesehatan Mental ini mudah untuk dipelajari."
                                ]
                            },
                            {
                                "name": "Mudah dipahami/dimengerti",
                                "questions": [
                                    "Menurut saya Aplikasi Kesehatan Mental ini menggunakan bahasa yang mudah dimengerti dan dipahami."
                                ]
                            },
                            {
                                "name": "Mudah sehingga mahir",
                                "questions": [
                                    "Menurut saya mendapat informasi/layanan yang saya butuhkan dari Aplikasi Kesehatan Mental ini merupakan hal yang mudah."
                                ]
                            },
                            {
                                "name": "Mudah digunakan",
                                "questions": [
                                    "Menu-menu pada Aplikasi Kesehatan Mental ini tersusun dengan baik sehingga fitur-fitur yang tersedia dapat mudah digunakan."
                                ]
                            },
                            {
                                "name": "Mudah dikendalikan",
                                "questions": [
                                    "Menurut saya Aplikasi Kesehatan Mental ini sangat fleksibel untuk berinteraksi."
                                ]
                            },
                            {
                                "name": "Mudah diingat",
                                "questions": [
                                    "Menurutsaya langkah-langkah dalam menggunakan Aplikasi Kesehatan Mental ini mudah diingat."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "PU",
                        "indicators": [
                            {
                                "name": "Lebih cepat",
                                "questions": [
                                    "Menggunakan Aplikasi Kesehatan Mental ini membantu saya menemukan informasi/layanan dengan lebih cepat."
                                ]
                            },
                            {
                                "name": "Meningkatkan kinerja",
                                "questions": [
                                    "Menggunakan Aplikasi Kesehatan Mental ini telah meningkatkan kinerja saya dalam menerima informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan produktivitas",
                                "questions": [
                                    "Menggunakan Aplikasi Kesehatan Mental ini telah meningkatkan produktivitas saya dalam mendapatkan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan efektivitas",
                                "questions": [
                                    "Menggunakan Aplikasi Kesehatan Mental ini telah meningkatkan efektivitas saya dalam menggunakan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Lebih mudah",
                                "questions": [
                                    "Dengan adanya Aplikasi Kesehatan Mental, saya dapat mencapai tujuan pekerjaan saya dengan lebih mudah."
                                ]
                            },
                            {
                                "name": "Bermanfaat",
                                "questions": [
                                    "Secara keseluruhan, saya merasa Aplikasi Kesehatan Mental ini bermanfaat bagi saya."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ATU",
                        "indicators": [
                            {
                                "name": "Rasa senang",
                                "questions": [
                                    "Saya merasa senang menggunakan Aplikasi Kesehatan Mental ini"
                                ]
                            },
                            {
                                "name": "Menikmati",
                                "questions": [
                                    "Saya merasa nyaman dan menikmati saat menggunakan Aplikasi Kesehatan Mental ini"
                                ]
                            },
                            {
                                "name": "Rasa bosan",
                                "questions": [
                                    "Saya merasa tidak bosan menggunakan Aplikasi Kesehatan Mental ini"
                                ]
                            },
                            {
                                "name": "Tidak suka",
                                "questions": [
                                    "Saya suka menggunakan Aplikasi Kesehatan Mental ini"
                                ]
                            }
                        ]
                    },
                    {
                        "name": "BI",
                        "indicators": [
                            {
                                "name": "Menggunakan kapan saja",
                                "questions": [
                                    "Saya ingin menggunakan Aplikasi Kesehatan Mental ini saat kapan pun diperlukan."
                                ]
                            },
                            {
                                "name": "Menggunakan kondisi apapun",
                                "questions": [
                                    "Saya selalu menggunakan Aplikasi Kesehatan Mental ini dalam kondisi apapun."
                                ]
                            },
                            {
                                "name": "Niat menggunakan terus",
                                "questions": [
                                    "Saya memiliki niat untuk terus menggunakan Aplikasi Kesehatan Mental ini di masa yang akan datang."
                                ]
                            },
                            {
                                "name": "Berharap menggunakan",
                                "questions": [
                                    "Saya berharap dapat terus menggunakan Aplikasi Kesehatan Mental ini di masa depan."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ASU",
                        "indicators": [
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Aplikasi Kesehatan Mental ini minimal sehari sekali."
                                ]
                            },
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Aplikasi Kesehatan Mental ini selama hari kerja maupun hari libur."
                                ]
                            },
                            {
                                "name": "Durasi penggunaan",
                                "questions": [
                                    "Saya menggunakan Aplikasi Kesehatan Mental ini rata-rata minimal 10 menit."
                                ]
                            }
                        ]
                    }
                ]
            }',
        ]);

        SurveyQuestions::create([
            'survey_id' => 10,
            'questions_data' =>
            '{
                "tam": [
                    {
                        "name": "PEU",
                        "indicators": [
                            {
                                "name": "Kemudahan dipelajari",
                                "questions": [
                                    "Menurut saya penggunaan Aplikasi Kuliner ini mudah untuk dipelajari."
                                ]
                            },
                            {
                                "name": "Mudah dipahami/dimengerti",
                                "questions": [
                                    "Menurut saya Aplikasi Kuliner menggunakan bahasa yang mudah dimengerti dan dipahami."
                                ]
                            },
                            {
                                "name": "Mudah sehingga mahir",
                                "questions": [
                                    "Menurut saya mendapat informasi/layanan yang saya butuhkan dari Aplikasi Kuliner ini merupakan hal yang mudah."
                                ]
                            },
                            {
                                "name": "Mudah digunakan",
                                "questions": [
                                    "Menu-menu pada Aplikasi Kuliner ini tersusun dengan baik sehingga fitur-fitur yang tersedia dapat mudah digunakan."
                                ]
                            },
                            {
                                "name": "Mudah dikendalikan",
                                "questions": [
                                    "Menurut saya Aplikasi Kuliner ini sangat fleksibel untuk berinteraksi."
                                ]
                            },
                            {
                                "name": "Mudah diingat",
                                "questions": [
                                    "Menurutsaya langkah-langkah dalam menggunakan Aplikasi Kuliner ini mudah diingat."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "PU",
                        "indicators": [
                            {
                                "name": "Lebih cepat",
                                "questions": [
                                    "Menggunakan Aplikasi Kuliner ini membantu saya menemukan informasi/layanan dengan lebih cepat."
                                ]
                            },
                            {
                                "name": "Meningkatkan kinerja",
                                "questions": [
                                    "Menggunakan Aplikasi Kuliner ini telah meningkatkan kinerja saya dalam menerima informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan produktivitas",
                                "questions": [
                                    "Menggunakan Aplikasi Kuliner ini telah meningkatkan produktivitas saya dalam mendapatkan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Meningkatkan efektivitas",
                                "questions": [
                                    "Menggunakan Aplikasi Kuliner ini telah meningkatkan efektivitas saya dalam menggunakan informasi/layanan."
                                ]
                            },
                            {
                                "name": "Lebih mudah",
                                "questions": [
                                    "Dengan adanya Aplikasi Kuliner, saya dapat mencapai tujuan pekerjaan saya dengan lebih mudah."
                                ]
                            },
                            {
                                "name": "Bermanfaat",
                                "questions": [
                                    "Secara keseluruhan, saya merasa Aplikasi Kuliner ini bermanfaat bagi saya."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ATU",
                        "indicators": [
                            {
                                "name": "Rasa senang",
                                "questions": [
                                    "Saya merasa senang menggunakan Aplikasi Kuliner ini"
                                ]
                            },
                            {
                                "name": "Menikmati",
                                "questions": [
                                    "Saya merasa nyaman dan menikmati saat menggunakan Aplikasi Kuliner ini"
                                ]
                            },
                            {
                                "name": "Rasa bosan",
                                "questions": [
                                    "Saya merasa tidak bosan menggunakan Aplikasi Kuliner ini"
                                ]
                            },
                            {
                                "name": "Tidak suka",
                                "questions": [
                                    "Saya suka menggunakan Aplikasi Kuliner ini"
                                ]
                            }
                        ]
                    },
                    {
                        "name": "BI",
                        "indicators": [
                            {
                                "name": "Menggunakan kapan saja",
                                "questions": [
                                    "Saya ingin menggunakan Aplikasi Kuliner ini saat kapan pun diperlukan."
                                ]
                            },
                            {
                                "name": "Menggunakan kondisi apapun",
                                "questions": [
                                    "Saya selalu menggunakan Aplikasi Kuliner ini dalam kondisi apapun."
                                ]
                            },
                            {
                                "name": "Niat menggunakan terus",
                                "questions": [
                                    "Saya memiliki niat untuk terus menggunakan Aplikasi Kuliner ini di masa yang akan datang."
                                ]
                            },
                            {
                                "name": "Berharap menggunakan",
                                "questions": [
                                    "Saya berharap dapat terus menggunakan Aplikasi Kuliner ini di masa depan."
                                ]
                            }
                        ]
                    },
                    {
                        "name": "ASU",
                        "indicators": [
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Aplikasi Kuliner ini minimal sehari sekali."
                                ]
                            },
                            {
                                "name": "Frekuensi penggunaan",
                                "questions": [
                                    "Saya menggunakan Aplikasi Kuliner ini selama hari kerja maupun hari libur."
                                ]
                            },
                            {
                                "name": "Durasi penggunaan",
                                "questions": [
                                    "Saya menggunakan Aplikasi Kuliner ini rata-rata minimal 10 menit."
                                ]
                            }
                        ]
                    }
                ]
            }',
        ]);
    }
}
