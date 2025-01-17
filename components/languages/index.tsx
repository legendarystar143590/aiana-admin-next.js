const languages = [
    {"name": "Abkhaz", "code": "AB"},
    {"name": "Afar", "code": "AA"},
    {"name": "Afrikaans", "code": "AF"},
    {"name": "Akan", "code": "AK"},
    {"name": "Albanian", "code": "SQ"},
    {"name": "Amharic", "code": "AM"},
    {"name": "Arabic", "code": "AR"},
    {"name": "Aragonese", "code": "AN"},
    {"name": "Armenian", "code": "HY"},
    {"name": "Assamese", "code": "AS"},
    {"name": "Avaric", "code": "AV"},
    {"name": "Avestan", "code": "AE"},
    {"name": "Aymara", "code": "AY"},
    {"name": "Azerbaijani", "code": "AZ"},
    {"name": "Bambara", "code": "BM"},
    {"name": "Bashkir", "code": "BA"},
    {"name": "Basque", "code": "EU"},
    {"name": "Belarusian", "code": "BE"},
    {"name": "Bengali", "code": "BN"},
    {"name": "Bihari", "code": "BH"},
    {"name": "Bislama", "code": "BI"},
    {"name": "Bosnian", "code": "BS"},
    {"name": "Breton", "code": "BR"},
    {"name": "Bulgarian", "code": "BG"},
    {"name": "Burmese", "code": "MY"},
    {"name": "Catalan; Valencian", "code": "CA"},
    {"name": "Chamorro", "code": "CH"},
    {"name": "Chechen", "code": "CE"},
    {"name": "Chichewa; Chewa; Nyanja", "code": "NY"},
    {"name": "Chinese", "code": "ZH"},
    {"name": "Chuvash", "code": "CV"},
    {"name": "Cornish", "code": "KW"},
    {"name": "Corsican", "code": "CO"},
    {"name": "Cree", "code": "CR"},
    {"name": "Croatian", "code": "HR"},
    {"name": "Czech", "code": "CS"},
    {"name": "Danish", "code": "DA"},
    {"name": "Divehi; Dhivehi; Maldivian;", "code": "DV"},
    {"name": "Dutch", "code": "NL"},
    {"name": "English", "code": "EN"},
    {"name": "Esperanto", "code": "EO"},
    {"name": "Estonian", "code": "ET"},
    {"name": "Ewe", "code": "EE"},
    {"name": "Faroese", "code": "FO"},
    {"name": "Fijian", "code": "FJ"},
    {"name": "Finnish", "code": "FI"},
    {"name": "French", "code": "FR"},
    {"name": "Fula; Fulah; Pulaar; Pular", "code": "FF"},
    {"name": "Galician", "code": "GL"},
    {"name": "Georgian", "code": "KA"},
    {"name": "German", "code": "DE"},
    {"name": "Greek, Modern", "code": "EL"},
    {"name": "Guarani", "code": "GN"},
    {"name": "Gujarati", "code": "GU"},
    {"name": "Haitian; Haitian Creole", "code": "HT"},
    {"name": "Hausa", "code": "HA"},
    {"name": "Hebrew (modern)", "code": "HE"},
    {"name": "Herero", "code": "HZ"},
    {"name": "Hindi", "code": "HI"},
    {"name": "Hiri Motu", "code": "HO"},
    {"name": "Hungarian", "code": "HU"},
    {"name": "Interlingua", "code": "IA"},
    {"name": "Indonesian", "code": "ID"},
    {"name": "Interlingue", "code": "IE"},
    {"name": "Irish", "code": "GA"},
    {"name": "Igbo", "code": "IG"},
    {"name": "Inupiaq", "code": "IK"},
    {"name": "Ido", "code": "IO"},
    {"name": "Icelandic", "code": "IS"},
    {"name": "Italian", "code": "IT"},
    {"name": "Inuktitut", "code": "IU"},
    {"name": "Japanese", "code": "JA"},
    {"name": "Javanese", "code": "JV"},
    {"name": "Kalaallisut, Greenlandic", "code": "KL"},
    {"name": "Kannada", "code": "KN"},
    {"name": "Kanuri", "code": "KR"},
    {"name": "Kashmiri", "code": "KS"},
    {"name": "Kazakh", "code": "KK"},
    {"name": "Khmer", "code": "KM"},
    {"name": "Kikuyu, Gikuyu", "code": "KI"},
    {"name": "Kinyarwanda", "code": "RW"},
    {"name": "Kirundi", "code": "RN"},
    {"name": "Kyrgyz", "code": "KY"},
    {"name": "Komi", "code": "KV"},
    {"name": "Kongo", "code": "KG"},
    {"name": "Korean", "code": "KO"},
    {"name": "Kurdish", "code": "KU"},
    {"name": "Kwanyama, Kuanyama", "code": "KJ"},
    {"name": "Latin", "code": "LA"},
    {"name": "Luxembourgish, Letzeburgesch", "code": "LB"},
    {"name": "Luganda", "code": "LG"},
    {"name": "Limburgish, Limburgan, Limburger", "code": "LI"},
    {"name": "Lingala", "code": "LN"},
    {"name": "Lao", "code": "LO"},
    {"name": "Lithuanian", "code": "LT"},
    {"name": "Luba-Katanga", "code": "LU"},
    {"name": "Latvian", "code": "LV"},
    {"name": "Manx", "code": "GV"},
    {"name": "Macedonian", "code": "MK"},
    {"name": "Malagasy", "code": "MG"},
    {"name": "Malay", "code": "MS"},
    {"name": "Malayalam", "code": "ML"},
    {"name": "Maltese", "code": "MT"},
    {"name": "Maori", "code": "MI"},
    {"name": "Marathi", "code": "MR"},
    {"name": "Marshallese", "code": "MH"},
    {"name": "Mongolian", "code": "MN"},
    {"name": "Nauru", "code": "NA"},
    {"name": "Navajo, Navaho", "code": "NV"},
    {"name": "Ndonga", "code": "NG"},
    {"name": "Nepali", "code": "NE"},
    {"name": "North Ndebele", "code": "ND"},
    {"name": "Norwegian Bokmål", "code": "NB"},
    {"name": "Norwegian Nynorsk", "code": "NN"},
    {"name": "Norwegian", "code": "NO"},
    {"name": "Nuosu", "code": "II"},
    {"name": "South Ndebele", "code": "NR"},
    {"name": "Occitan", "code": "OC"},
    {"name": "Ojibwe, Ojibwa", "code": "OJ"},
    {"name": "Old Church Slavonic, Church Slavic", "code": "CU"},
    {"name": "Oromo", "code": "OM"},
    {"name": "Oriya", "code": "OR"},
    {"name": "Ossetian, Ossetic", "code": "OS"},
    {"name": "Panjabi, Punjabi", "code": "PA"},
    {"name": "Pali", "code": "PI"},
    {"name": "Persian", "code": "FA"},
    {"name": "Polish", "code": "PL"},
    {"name": "Pashto, Pushto", "code": "PS"},
    {"name": "Portuguese", "code": "PT"},
    {"name": "Quechua", "code": "QU"},
    {"name": "Romansh", "code": "RM"},
    {"name": "Kirundi", "code": "RN"},
    {"name": "Russian", "code": "RU"},
    {"name": "Sanskrit (Saṁskṛta)", "code": "SA"},
    {"name": "Sardinian", "code": "SC"},
    {"name": "Sindhi", "code": "SD"},
    {"name": "Northern Sami", "code": "SE"},
    {"name": "Samoan", "code": "SM"},
    {"name": "Sango", "code": "SG"},
    {"name": "Serbian", "code": "SR"},
    {"name": "Scottish Gaelic; Gaelic", "code": "GD"},
    {"name": "Shona", "code": "SN"},
    {"name": "Sinhala, Sinhalese", "code": "SI"},
    {"name": "Slovak", "code": "SK"},
    {"name": "Slovene", "code": "SL"},
    {"name": "Somali", "code": "SO"},
    {"name": "Southern Sotho", "code": "ST"},
    {"name": "Spanish; Castilian", "code": "ES"},
    {"name": "Sundanese", "code": "SU"},
    {"name": "Swahili", "code": "SW"},
    {"name": "Swati", "code": "SS"},
    {"name": "Swedish", "code": "SV"},
    {"name": "Tamil", "code": "TA"},
    {"name": "Telugu", "code": "TE"},
    {"name": "Tajik", "code": "TG"},
    {"name": "Thai", "code": "TH"},
    {"name": "Tigrinya", "code": "TI"},
    {"name": "Tibetan Standard, Tibetan, Central", "code": "BO"},
    {"name": "Turkmen", "code": "TK"},
    {"name": "Tagalog", "code": "TL"},
    {"name": "Tswana", "code": "TN"},
    {"name": "Tonga (Tonga Islands)", "code": "TO"},
    {"name": "Turkish", "code": "TR"},
    {"name": "Tsonga", "code": "TS"},
    {"name": "Tatar", "code": "TT"},
    {"name": "Twi", "code": "TW"},
    {"name": "Tahitian", "code": "TY"},
    {"name": "Uighur, Uyghur", "code": "UG"},
    {"name": "Ukrainian", "code": "UK"},
    {"name": "Urdu", "code": "UR"},
    {"name": "Uzbek", "code": "UZ"},
    {"name": "Venda", "code": "VE"},
    {"name": "Vietnamese", "code": "VI"},
    {"name": "Volapük", "code": "VO"},
    {"name": "Walloon", "code": "WA"},
    {"name": "Welsh", "code": "CY"},
    {"name": "Wolof", "code": "WO"},
    {"name": "Western Frisian", "code": "FY"},
    {"name": "Xhosa", "code": "XH"},
    {"name": "Yiddish", "code": "YI"},
    {"name": "Yoruba", "code": "YO"},
    {"name": "Zhuang, Chuang", "code": "ZA"},
    {"name": "Zulu", "code": "ZU"}
  ]

export default languages