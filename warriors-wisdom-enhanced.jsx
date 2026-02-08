import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Car, Search, FileText, Users, Award, ChevronRight, Play, Save, Menu, X, Map, Crosshair, Camera, Book, Shield, AlertTriangle, MessageCircle, Clock, Link2, ZoomIn, CheckCircle, XCircle, ArrowRight, Eye, Brain, ChevronDown, Info } from 'lucide-react';

export default function WarriorsWisdomEnhanced() {
  const [gameState, setGameState] = useState({
    currentLevel: 0, // 0 = tutorial
    unlockedLevels: 0,
    evidence: [],
    completedLevels: [],
    currentScene: 'menu',
    playerChoices: [],
    gameProgress: 0,
    currentLocation: null,
    driving: false,
    drivingScore: 0,
    forensicsComplete: [],
    suspectProfiles: {},
    endings: [],
    playTime: 0,
    connections: [],
    interrogationResults: {},
    witnessStatements: {},
    documentsAnalyzed: [],
    timeRemaining: null,
    reputation: 50, // affects dialogue options
    stress: 0, // affects performance
    tutorialComplete: false
  });

  const [activeTab, setActiveTab] = useState('investigation');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [activeMinigame, setActiveMinigame] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [evidenceBoard, setEvidenceBoard] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState([]);

  // Enhanced game data with full dialogue and scenes
  const levels = {
    0: {
      title: "Training Simulation",
      subtitle: "Tutorial",
      difficulty: "Tutorial",
      cities: ["Training Facility"],
      description: "Learn the basics of investigation, forensics, driving, and interrogation in a safe training environment.",
      locations: [
        { 
          id: "training_lab", 
          name: "Forensics Lab", 
          icon: "🔬",
          description: "A state-of-the-art facility equipped with microscopes, chemical analysis tools, and evidence storage. Perfect for learning forensic techniques."
        },
        { 
          id: "training_course", 
          name: "Driving Course", 
          icon: "🏁",
          description: "An obstacle course designed to test your driving skills in various conditions. Learn to navigate traffic, pursue suspects, and handle different terrains."
        },
        { 
          id: "interview_room", 
          name: "Interview Room", 
          icon: "🎤",
          description: "A controlled environment for practicing interrogation techniques. One-way mirror, recording equipment, and psychological assessment tools available."
        }
      ],
      objectives: [
        "Complete forensic analysis tutorial",
        "Pass driving course certification",
        "Conduct practice interrogation",
        "Learn evidence board connections"
      ],
      tutorial: true
    },
    1: {
      title: "The Initial Report",
      subtitle: "Nairobi",
      difficulty: "Beginner",
      cities: ["Nairobi"],
      description: "A priceless Kamba carving has been stolen from the National Museum. Your first task: determine if this is more than it seems.",
      locations: [
        { 
          id: "museum", 
          name: "Nairobi National Museum", 
          icon: "🏛️",
          description: "East Africa's premier cultural institution. The display case for 'The Warrior's Wisdom' stands empty, glass shattered. Security footage shows a masked figure, but something feels off."
        },
        { 
          id: "market", 
          name: "City Center Maasai Market", 
          icon: "🏪",
          description: "A bustling marketplace filled with traditional crafts, beadwork, and wood carvings. Local artisans here might recognize the materials used in the stolen piece."
        },
        { 
          id: "vehicle", 
          name: "Investigation Vehicle", 
          icon: "🚗",
          description: "Your mobile command center. Equipped with evidence storage, communication gear, and route planning software. The streets of Nairobi await."
        }
      ],
      objectives: [
        "Analyze the crime scene for physical evidence",
        "Confirm the stolen carving is a forgery",
        "Trace forgery materials to their source",
        "Interview museum staff and witnesses",
        "Navigate to the Maasai Market",
        "Identify the material supplier"
      ],
      timeLimit: 45, // minutes
      witnesses: [
        {
          id: "security_guard",
          name: "James Ochieng",
          role: "Night Security Guard",
          location: "museum",
          statements: [
            "I heard glass breaking around 2:30 AM, but the alarm didn't go off immediately.",
            "The surveillance system was acting strange that night - kept flickering.",
            "I saw a black SUV parked in the loading zone earlier, but it was gone when I checked after the theft."
          ],
          truthfulness: 0.9
        },
        {
          id: "curator_assistant",
          name: "Grace Wanjiku",
          role: "Curator's Assistant",
          location: "museum",
          statements: [
            "Dr. Kamau has been very stressed lately, working late hours.",
            "She mentioned something about authentication issues with some pieces last month.",
            "I noticed she was photographing the Warrior's Wisdom carving extensively two weeks ago."
          ],
          truthfulness: 1.0
        }
      ],
      twist: "Tire tracks near the museum match a government-issued SUV registered to the Cabinet Secretary for Culture's aide",
      unlocks: "Level 2 + Nairobi industrial area roads",
      reveals: "Forgery materials shipped by a company linked to a Mombasa cartel",
      keyEvidence: ["wood_sample", "bead_fragment", "tire_tracks", "security_footage"],
      scenes: {
        intro: {
          text: "Your phone buzzes at 4:47 AM. Detective, we have a situation at the National Museum. The caller's voice is tight with urgency. Kenya's most famous Kamba carving has been stolen. Get here now.",
          choices: [
            { text: "Rush to the scene immediately", nextScene: "museum_arrival", reputation: 5 },
            { text: "Call for backup first", nextScene: "museum_arrival", reputation: -2, stress: -5 }
          ]
        },
        museum_arrival: {
          text: "The museum's grand entrance is lit by police strobes. Yellow tape cordons off the East African Heritage wing. Inside, the empty display case tells its story in fractured glass and absence. Security Director Kipkorir approaches, his face grim.",
          choices: [
            { text: "Examine the crime scene first", nextScene: "crime_scene", type: "investigate" },
            { text: "Interview witnesses immediately", nextScene: "interviews", type: "social" },
            { text: "Check security footage", nextScene: "security_room", type: "technical" }
          ]
        }
      }
    },
    2: {
      title: "Digging Into Motives",
      subtitle: "Nairobi + Mombasa",
      difficulty: "Intermediate I",
      cities: ["Nairobi", "Mombasa"],
      description: "The forgery trail leads to Kenya's coast. Corruption runs deeper than you thought - port officials, shipping manifests, and a governor with secrets.",
      locations: [
        { 
          id: "security_hub", 
          name: "Security Hub", 
          icon: "🔒",
          description: "Museum security headquarters. Banks of monitors show every angle. The chief of security, Kipkorir Cheboi, has worked here for 15 years. He knows something."
        },
        { 
          id: "curator_office", 
          name: "Curator's Office", 
          icon: "📋",
          description: "Dr. Muthoni Kamau's workspace is immaculate - too immaculate. Authentication certificates line the walls. Her computer is still logged in. What was she hiding?"
        },
        { 
          id: "port", 
          name: "Port Warehouse", 
          icon: "⚓",
          description: "Mombasa's massive shipping hub. Containers stretch to the horizon. Somewhere in this maze of international trade, your evidence waits. The smell of salt and diesel is overwhelming."
        },
        { 
          id: "old_town", 
          name: "Old Town Craft Shop", 
          icon: "🏺",
          description: "Narrow Swahili streets wind past coral stone buildings. This antique shop specializes in East African artifacts. The owner's eyes are sharp, appraising both you and your questions."
        }
      ],
      objectives: [
        "Investigate museum security protocols",
        "Access curator's private files",
        "Travel to Mombasa (4-hour drive)",
        "Infiltrate port warehouse",
        "Analyze shipping documents",
        "Chase suspect through Old Town",
        "Expose cartel-governor connection"
      ],
      timeLimit: 90,
      witnesses: [
        {
          id: "port_worker",
          name: "Hassan Mbarak",
          role: "Dock Supervisor",
          location: "port",
          statements: [
            "Certain containers get special treatment - no inspections, fast-tracked through customs.",
            "Governor Swaleh's company owns the main shipping contractor here.",
            "Last month I saw crates marked 'Cultural Exchange Program' - they were loaded at night."
          ],
          truthfulness: 0.95
        },
        {
          id: "shop_owner",
          name: "Zainab Omar",
          role: "Antique Dealer",
          location: "old_town",
          statements: [
            "A man came asking about Kamba carving techniques three months ago.",
            "He wanted to know about aging wood artificially, making new pieces look old.",
            "He paid in cash - a lot of it. I didn't ask questions."
          ],
          truthfulness: 0.7,
          canBePressured: true
        }
      ],
      twist: "The Mombasa Governor has stakes in the cartel's shipping business",
      unlocks: "Level 3 + Kisumu-Turkana highway routes",
      reveals: "A 2024 Kawangware festival photo links all core suspects to a Kisumu-based black market broker",
      keyEvidence: ["shipping_manifest", "festival_photo", "governor_contract", "warehouse_footage"]
    },
    3: {
      title: "Following the Trail",
      subtitle: "Nairobi + Kisumu",
      difficulty: "Intermediate II",
      cities: ["Nairobi", "Kisumu"],
      description: "The real carving surfaces in Kisumu. A network of ferry routes, cultural foundations, and mining permits converges on Lake Victoria. The sapphire inside changes everything.",
      locations: [
        { 
          id: "kipkorir_shop", 
          name: "Kipkorir's Kariakor Shop", 
          icon: "🔨",
          description: "A humble woodworking shop in Nairobi's industrial district. Tools line the walls. Wood shavings cover the floor. The owner claims to run a community heritage project. Is he a hero or a thief?"
        },
        { 
          id: "industrial", 
          name: "Industrial Woodworks", 
          icon: "🏭",
          description: "A legitimate manufacturing facility - on paper. The smell of sawdust mingles with something chemical. Night shift workers avoid eye contact. The back warehouse is locked."
        },
        { 
          id: "ferry", 
          name: "Lake Victoria Terminal", 
          icon: "⛴️",
          description: "Kisumu's waterfront buzzes with commerce. Ferries cross to Uganda and Tanzania daily. Passenger logs exist, but corruption is currency here. Who crossed the lake with the carving?"
        },
        { 
          id: "luo_foundation", 
          name: "Luo Cultural Foundation", 
          icon: "📜",
          description: "A beautiful building overlooking the lake. Inside, archives document centuries of heritage. The director is passionate, protective. But some records have been altered recently."
        }
      ],
      objectives: [
        "Confront Kipkorir about his activities",
        "Investigate industrial facility at night",
        "Drive to Kisumu (5-hour journey)",
        "Analyze ferry passenger manifests",
        "Navigate corrupt checkpoints with bribes or badges",
        "Access foundation archives",
        "Discover the Turkana sapphire connection",
        "Match tire tracks to desert cartel truck"
      ],
      timeLimit: 120,
      twist: "The Cabinet Secretary for Mining approved illegal Turkana sapphire permits",
      unlocks: "Level 4 + Eldoret city + cartel processing plant",
      reveals: "The cartel operates under the guise of a 'global cultural exchange' organization"
    },
    4: {
      title: "Uncovering the Ring",
      subtitle: "Mombasa + Turkana",
      difficulty: "Advanced I",
      cities: ["Mombasa", "Turkana"],
      description: "The investigation goes north to Kenya's desert frontier. Mining operations, indigenous heritage, and diplomatic immunity create a deadly web. The cartel's leader is within reach.",
      locations: [
        { 
          id: "diplomatic", 
          name: "Diplomatic Compound", 
          icon: "🏢",
          description: "Fortified walls and foreign flags. Diplomatic immunity shields whatever happens inside. Security cameras track your surveillance. One wrong move could create an international incident."
        },
        { 
          id: "customs", 
          name: "Port Customs Office", 
          icon: "📦",
          description: "The bureaucratic heart of Mombasa's trade. Forms in triplicate, stamps and signatures. Some inspectors look away for the right price. The records you need are here - if you can access them."
        },
        { 
          id: "mining_site", 
          name: "Desert Mining Site", 
          icon: "⛏️",
          description: "Turkana's harsh landscape hides precious gems. The sun is merciless. Armed guards patrol the perimeter. This illegal operation has government protection. Evidence is being extracted along with sapphires."
        },
        { 
          id: "turkana_center", 
          name: "Turkana Cultural Center", 
          icon: "🏛️",
          description: "A modest building in Lodwar. Elders preserve traditions here. They've watched their land pillaged, their heritage stolen. One elder's son disappeared. Now you know why."
        }
      ],
      objectives: [
        "Surveil diplomatic compound without detection",
        "Obtain mining permit documents",
        "Drive across Turkana desert (off-road)",
        "Infiltrate illegal mining operation",
        "Rescue coerced operative",
        "Interview Turkana elders",
        "Connect financial trails to government officials",
        "Evade cartel patrols in desert chase"
      ],
      timeLimit: 150,
      twist: "The 'dead' fingerprint suspect is alive – a Turkana elder's son coerced into the cartel",
      unlocks: "Level 5 + Garissa city + cartel transit hub",
      reveals: "Gems are flown out of Nairobi's Wilson Airport using diplomatic immunity"
    },
    5: {
      title: "Political Entanglements",
      subtitle: "All Four Cities",
      difficulty: "Advanced II",
      cities: ["Nairobi", "Mombasa", "Kisumu", "Turkana"],
      description: "The conspiracy reaches the highest levels of government. Campaign finance, money laundering, and international cartels. Stop the diplomatic flight before evidence disappears forever.",
      locations: [
        { 
          id: "state_house", 
          name: "State House Annex", 
          icon: "🏰",
          description: "Power's epicenter. Marble halls and hushed conversations. The Deputy President's Chief of Staff works from here. Getting inside requires perfect credentials - or perfect timing."
        },
        { 
          id: "residence", 
          name: "Politician's Residence", 
          icon: "🏠",
          description: "A mansion in Karen, purchased with laundered money. Surveillance is sophisticated. Security is private military. But everyone makes mistakes. The evidence you need is in the study."
        },
        { 
          id: "airport", 
          name: "Wilson Airport", 
          icon: "✈️",
          description: "Private aviation hub. A diplomatic flight is scheduled to depart in 2 hours carrying stolen gems and incriminating documents. Once it's airborne, your case dies. Time is running out."
        },
        { 
          id: "highways", 
          name: "Intercity Highways", 
          icon: "🛣️",
          description: "Kenya's arterial roads. You must coordinate across four cities simultaneously. Radio chatter fills your car. Multiple suspects are on the move. Choose your intercepts wisely."
        }
      ],
      objectives: [
        "Gather evidence from all four cities",
        "Expose Deputy President's Chief of Staff",
        "Coordinate multi-city interceptions",
        "Race against time to Wilson Airport",
        "Stop diplomatic flight departure",
        "Decrypt financial records",
        "Convince anti-corruption authorities to act",
        "Prevent evidence destruction"
      ],
      timeLimit: 180,
      twist: "The Deputy President's Chief of Staff is laundering cartel money through real estate projects",
      unlocks: "Level 6 + Cross-border routes to Uganda/Tanzania",
      reveals: "The museum theft was a distraction – the cartel plans to steal 5 more artifacts"
    },
    6: {
      title: "The Final Resolution",
      subtitle: "All Regions + Beyond",
      difficulty: "Expert",
      cities: ["Nairobi", "Mombasa", "Kisumu", "Turkana", "Eldoret", "Garissa"],
      description: "Everything converges. Stop the five-artifact heist, expose the international syndicate, recover Kenya's heritage. Your choices determine the ending. Justice or corruption - what will prevail?",
      locations: [
        { 
          id: "cartel_hq", 
          name: "Cartel Regional HQ", 
          icon: "🏴",
          description: "Hidden in plain sight in downtown Nairobi. The Ghost coordinates operations from here. Armed guards, sophisticated security. This is the final confrontation."
        },
        { 
          id: "transit_point", 
          name: "International Transit", 
          icon: "🌍",
          description: "Mombasa port's high-security zone. Five artifacts are being loaded for shipment to private collectors worldwide. International law, diplomatic immunity, and cartel firepower protect them. Almost."
        }
      ],
      objectives: [
        "Prevent five-artifact heist across multiple locations",
        "Infiltrate cartel headquarters",
        "Confront 'The Ghost'",
        "Recover 'The Warrior's Wisdom'",
        "Compile irrefutable evidence",
        "Choose: media, authorities, or direct action",
        "Ensure heritage repatriation",
        "Determine Kenya's future"
      ],
      timeLimit: 240,
      multipleEndings: [
        {
          id: "v1_success",
          title: "Local Victory",
          requirements: { evidenceCount: 15, corruption: "exposed_local" },
          description: "You recover 'The Warrior's Wisdom' and arrest local leaders and mid-level officials. The syndicate's Kenyan operations are disrupted, but international networks remain intact."
        },
        {
          id: "v2_success",
          title: "Regional Triumph",
          requirements: { evidenceCount: 25, corruption: "exposed_regional", artifactsSaved: 5 },
          description: "You stop the five-artifact heist, expose regional corruption, and secure funding for affected communities. The cartel is significantly weakened but not destroyed."
        },
        {
          id: "v3_success",
          title: "Complete Justice",
          requirements: { evidenceCount: 35, corruption: "exposed_international", artifactsSaved: 5, reformsPushed: true },
          description: "You break the international syndicate, repatriate all stolen artifacts, expose corruption at the highest levels, and push through heritage protection reforms. Kenya's cultural legacy is secured."
        },
        {
          id: "failure",
          title: "The System Wins",
          requirements: { timeExpired: true },
          description: "Evidence is destroyed, the cartel escapes, corruption continues. The Warrior's Wisdom is lost to private collectors. Your investigation becomes another buried file."
        }
      ],
      twist: "Curator Muthoni Kamau has been working with anti-corruption agents for 2 years – her blackmail was a cover",
      finalReveal: true
    }
  };

  const characters = {
    muthoni: {
      name: "Muthoni Kamau",
      role: "Museum Curator",
      city: "Nairobi",
      age: 42,
      background: "PhD in African Archaeology from Cambridge. 15 years at National Museum.",
      publicIdentity: "Nairobi National Museum Curator - Respected scholar, meticulous professional",
      hiddenTruth: "Forger hired under threat; secretly working with anti-corruption agents for 2 years",
      threat: "High",
      color: "#e67e22",
      personality: "Intelligent, careful, burdened by secrets",
      interrogationTopics: ["theft_night", "authentication", "threats", "contacts"],
      dialogue: {
        initial: "Detective. I've been expecting you. This theft... it's more complicated than it appears.",
        cooperative_low: "I can't tell you everything. Not yet. My family's safety depends on silence.",
        cooperative_high: "Alright. I'll tell you what I can. But you must promise protection.",
        hostile: "I've answered your questions. Unless you're charging me, we're done here.",
        revelation: "I've been working with Interpol for two years. The theft was staged. We needed the cartel to make a move."
      }
    },
    raj: {
      name: "Raj Patel",
      role: "Art Dealer",
      city: "Nairobi",
      age: 38,
      background: "International art trade specialist. Frequent visitor to Kenya.",
      publicIdentity: "Private Art Dealer - Wealthy collector with questionable ethics",
      hiddenTruth: "Undercover Interpol agent investigating the cartel",
      threat: "Ally",
      color: "#3498db",
      personality: "Charming, observant, playing a dangerous game",
      interrogationTopics: ["art_trade", "contacts", "purchases", "international_network"],
      dialogue: {
        initial: "Detective. Looking into the museum theft? Tragic loss for Kenya's heritage.",
        cooperative_low: "I deal in legitimate antiquities. My papers are all in order.",
        cooperative_high: "Meet me later. Alone. There are things I can't say here.",
        hostile: "This harassment is unacceptable. My lawyer will hear about this.",
        revelation: "Interpol, Cultural Property Division. I've been tracking this syndicate for three years."
      }
    },
    kipkorir: {
      name: "Kipkorir Cheboi",
      role: "Head of Security",
      city: "Nairobi",
      age: 51,
      background: "Former police officer. 15 years at the museum. Active in community organizations.",
      publicIdentity: "Museum Head of Security - Dedicated, by-the-book professional",
      hiddenTruth: "Runs community group recovering stolen artifacts; holds the real carving for safekeeping",
      threat: "Medium",
      color: "#2ecc71",
      personality: "Principled, protective, conflicted about methods",
      interrogationTopics: ["security_breach", "theft_night", "community_work", "real_carving"],
      dialogue: {
        initial: "This theft happened on my watch. I take full responsibility.",
        cooperative_low: "I did everything by protocol. Check the logs yourself.",
        cooperative_high: "Off the record? I think someone inside helped. But I can't prove it.",
        hostile: "I've served this museum faithfully for 15 years. How dare you suggest otherwise.",
        revelation: "I took the real carving months ago. It was the only way to protect it from the corrupt officials planning to steal it."
      }
    },
    amara: {
      name: "Amara Okonkwo",
      role: "Exhibit Installer",
      city: "Nairobi",
      age: 28,
      background: "Art restoration training. Recently hired. Skilled woodworker.",
      publicIdentity: "Temporary Exhibit Installer - Talented but inexperienced",
      hiddenTruth: "Isaac Thuo's daughter; helped create forgery to protect the artifact from cartel",
      threat: "Low",
      color: "#9b59b6",
      personality: "Nervous, protective of family, skilled artisan",
      interrogationTopics: ["installation_work", "woodworking_skills", "family", "forgery"],
      dialogue: {
        initial: "I just install exhibits. I don't know anything about the theft.",
        cooperative_low: "Please, I need this job. I haven't done anything wrong.",
        cooperative_high: "My father... he was trying to help. The cartel threatened our village.",
        hostile: "Stop harassing me! I'm just a contract worker!",
        revelation: "I made the forgery. But only to buy time. We were trying to save the real artifact from being sold to criminals."
      }
    },
    isaac: {
      name: "Isaac Thuo",
      role: "Custodian",
      city: "Kisumu",
      age: 67,
      background: "Claims descent from carving's creator. Village elder.",
      publicIdentity: "Claimed Carving Custodian/Descendant - Traditional knowledge keeper",
      hiddenTruth: "Imposter who stole the real piece for village medical funds; tricked and threatened by cartel",
      threat: "Medium",
      color: "#e74c3c",
      personality: "Desperate, remorseful, manipulated",
      interrogationTopics: ["lineage", "theft_motive", "cartel_contact", "village_needs"],
      dialogue: {
        initial: "The carving belongs with my people. The museum stole it from us generations ago.",
        cooperative_low: "I did what I had to do. My village was dying.",
        cooperative_high: "They promised money for our clinic. Instead they threatened to kill my grandchildren.",
        hostile: "You wouldn't understand. Your people take everything and call it preservation.",
        revelation: "I'm not even related to the original carver. The cartel found me, fed me a story, used me. I was a fool."
      }
    },
    njoroge: {
      name: "Mwangi Njoroge",
      role: "Cabinet Secretary",
      city: "Nairobi",
      age: 55,
      background: "Career politician. Cabinet Secretary for Culture and Heritage.",
      publicIdentity: "Cabinet Secretary for Culture - Ambitious politician with gubernatorial aspirations",
      hiddenTruth: "Uses cartel money for campaign; has ownership stakes in Mombasa shipping through shell companies",
      threat: "Critical",
      color: "#c0392b",
      personality: "Smooth, calculating, ruthless when cornered",
      interrogationTopics: ["campaign_finance", "shipping_companies", "government_suv", "mombasa_connections"],
      dialogue: {
        initial: "Detective. I'm very busy. Make this quick.",
        cooperative_low: "My finances are audited regularly. Everything is above board.",
        cooperative_high: "You're making serious accusations. I hope you have serious evidence.",
        hostile: "This conversation is over. My lawyers will be in touch.",
        revelation: "You have no idea how deep this goes. Touch me, and you'll destroy yourself."
      }
    },
    fatuma: {
      name: "Fatuma Swaleh",
      role: "Governor",
      city: "Mombasa",
      age: 48,
      background: "Governor of Mombasa County. Business background in logistics.",
      publicIdentity: "Mombasa Governor - Popular leader focused on port development",
      hiddenTruth: "Owns 30% stake in cartel shipping company; funds luxury projects with smuggling profits",
      threat: "Critical",
      color: "#d35400",
      personality: "Charismatic, connected, believes she's untouchable",
      interrogationTopics: ["port_operations", "business_interests", "shipping_contracts", "luxury_developments"],
      dialogue: {
        initial: "Welcome to Mombasa, Detective. I hope you're enjoying our hospitality.",
        cooperative_low: "My business interests are properly declared. Public record.",
        cooperative_high: "You're out of your depth. This isn't Nairobi.",
        hostile: "I have powerful friends. Think carefully about your next move.",
        revelation: "Prove it. You won't. No one investigates a governor without consequences."
      }
    },
    kibet: {
      name: "John Kibet",
      role: "Cabinet Secretary",
      city: "Nairobi",
      age: 59,
      background: "Cabinet Secretary for Mining. Former mining company executive.",
      publicIdentity: "Cabinet Secretary for Mining - Technical expert promoting mining development",
      hiddenTruth: "Approved illegal Turkana sapphire permits; pays massive gambling debts with bribes",
      threat: "Critical",
      color: "#8e44ad",
      personality: "Weak-willed, addicted to gambling, desperate",
      interrogationTopics: ["mining_permits", "turkana_operations", "gambling", "debt"],
      dialogue: {
        initial: "Yes? What is this about?",
        cooperative_low: "All permits go through proper channels. I just sign what my staff recommends.",
        cooperative_high: "I... I didn't know it was illegal. They told me it was routine.",
        hostile: "I won't be interrogated like a criminal!",
        revelation: "I'm in debt. Half a million shillings to the wrong people. They own me. The permits were... insurance."
      }
    },
    barnett: {
      name: "Barnett Mwenda",
      role: "Chief of Staff",
      city: "Nairobi",
      age: 44,
      background: "Deputy President's Chief of Staff. Former corporate lawyer.",
      publicIdentity: "Deputy President's Chief of Staff - Power broker, presidential campaign strategist",
      hiddenTruth: "Launders cartel money through real estate; funds next presidential campaign with dirty money",
      threat: "Critical",
      color: "#2c3e50",
      personality: "Ice-cold, brilliant, the real power behind the throne",
      interrogationTopics: ["real_estate", "campaign_finance", "deputy_president", "cartel_connections"],
      dialogue: {
        initial: "I can give you five minutes. Then I have a meeting with the President.",
        cooperative_low: "My real estate portfolio is managed by professionals. All legal.",
        cooperative_high: "You're investigating the wrong people, Detective. This goes nowhere.",
        hostile: "This interview is terminated. Security will escort you out.",
        revelation: "You think you've won? I have judges, prosecutors, ministers in my pocket. Your evidence will disappear. You will disappear."
      }
    },
    ghost: {
      name: "David Kamau (The Ghost)",
      role: "Regional Boss",
      city: "Unknown",
      age: 52,
      background: "Former museum security director. Disappeared 5 years ago.",
      publicIdentity: "Unknown - Urban legend among investigators",
      hiddenTruth: "Former museum security head; built international syndicate using insider knowledge",
      threat: "Extreme",
      color: "#34495e",
      personality: "Brilliant, ruthless, always three steps ahead",
      interrogationTopics: ["syndicate_structure", "international_connections", "museum_knowledge", "endgame"],
      dialogue: {
        initial: "So you finally made it. I'm impressed, Detective.",
        cooperative_low: "You want to know how it works? I'll tell you. Knowledge is worth more than gold.",
        cooperative_high: "We could work together. I pay better than the police force.",
        hostile: "Kill me, arrest me - it doesn't matter. The syndicate continues.",
        revelation: "I spent 15 years protecting heritage for pennies while politicians sold it for millions. I just cut out the middleman. The system is the crime, Detective. I'm just profit."
      }
    }
  };

  // Mini-game components
  const ForensicsAnalysis = ({ type, level, onComplete }) => {
    const [selected, setSelected] = useState([]);
    const [analysis, setAnalysis] = useState({});
    const [step, setStep] = useState(1);
    const [timeLeft, setTimeLeft] = useState(120);

    const forensicChallenges = {
      wood: {
        title: "Wood Analysis",
        description: "Compare wood samples under microscope. Identify authentic Kamba wood grain patterns.",
        samples: [
          { id: 1, type: 'Kamba Wood', match: true, desc: 'Indigenous hardwood, distinctive dark grain, mineral deposits', visual: '🪵' },
          { id: 2, type: 'Tanzanian Cedar', match: false, desc: 'Imported softwood, light color, regular grain', visual: '🌲' },
          { id: 3, type: 'Aged Kamba', match: true, desc: 'Authentic patina, natural weathering, micro-fractures', visual: '🪵' },
          { id: 4, type: 'Artificially Aged', match: false, desc: 'Chemical staining, uniform color, no natural wear', visual: '🧪' }
        ],
        correctCount: 2,
        hint: "Look for natural aging patterns and mineral deposits unique to Kamba heartwood"
      },
      beads: {
        title: "Bead Authentication",
        description: "Examine Maasai beadwork. Traditional patterns and glass composition reveal authenticity.",
        samples: [
          { id: 1, type: 'Traditional Maasai', match: true, desc: 'Hand-made glass, irregular shapes, natural dyes', visual: '🔴' },
          { id: 2, type: 'Factory Made', match: false, desc: 'Perfect uniformity, synthetic dyes, mass-produced', visual: '🔵' },
          { id: 3, type: 'Antique Trade Beads', match: true, desc: 'Venetian glass, historical patterns, aged patina', visual: '🟡' },
          { id: 4, type: 'Modern Replica', match: false, desc: 'Plastic composite, printed patterns, no wear', visual: '🟢' }
        ],
        correctCount: 2,
        hint: "Traditional beads show hand-crafting irregularities and natural aging"
      },
      documents: {
        title: "Document Analysis",
        description: "Examine shipping manifests, permits, and financial records. Find the forgeries.",
        samples: [
          { id: 1, type: 'Authentic Permit', match: true, desc: 'Correct watermarks, authorized signatures, proper seals', visual: '📄' },
          { id: 2, type: 'Forged Permit', match: false, desc: 'Photocopied watermark, signature mismatch, wrong paper stock', visual: '📄' },
          { id: 3, type: 'Real Manifest', match: true, desc: 'Sequential numbering, customs stamps, port authority seal', visual: '📋' },
          { id: 4, type: 'Fake Manifest', match: false, desc: 'Number gaps, missing stamps, laser printer (should be dot matrix)', visual: '📋' },
          { id: 5, type: 'Bank Statement', match: true, desc: 'Verified transactions, bank security features, proper formatting', visual: '💰' },
          { id: 6, type: 'Doctored Statement', match: false, desc: 'Altered amounts, font inconsistencies, missing transaction IDs', visual: '💰' }
        ],
        correctCount: 3,
        hint: "Check watermarks, sequential numbers, and printing methods. Modern forgeries use wrong technology."
      },
      fingerprints: {
        title: "Fingerprint Matching",
        description: "Match partial prints from the crime scene to suspects in the database.",
        samples: [
          { id: 1, type: 'Print A - Loop Pattern', match: true, desc: 'Clear loop, 12 matching points, found on display case', visual: '👆' },
          { id: 2, type: 'Print B - Whorl Pattern', match: false, desc: 'Partial whorl, only 6 points, likely museum staff', visual: '👆' },
          { id: 3, type: 'Print C - Arch Pattern', match: false, desc: 'Smudged arch, insufficient points for match', visual: '👆' },
          { id: 4, type: 'Print D - Loop Pattern', match: true, desc: 'Matches Print A, found on security panel', visual: '👆' }
        ],
        correctCount: 2,
        hint: "Need minimum 10 matching points. Look for pattern consistency between samples."
      },
      tire_tracks: {
        title: "Tire Track Analysis",
        description: "Match tire impressions to vehicle types. Tread patterns tell stories.",
        samples: [
          { id: 1, type: 'Government SUV', match: true, desc: 'Michelin LTX, government fleet standard, recent tread', visual: '🚙' },
          { id: 2, type: 'Civilian Sedan', match: false, desc: 'Standard all-season, doesn\'t match crime scene depth', visual: '🚗' },
          { id: 3, type: 'Desert Truck', match: true, desc: 'All-terrain, sand damage, matches Turkana sample', visual: '🚚' },
          { id: 4, type: 'Delivery Van', match: false, desc: 'Commercial tread, wrong wheelbase width', visual: '🚐' }
        ],
        correctCount: 2,
        hint: "Government vehicles use specific tire brands. Match tread wear patterns to terrain."
      }
    };

    const challenge = forensicChallenges[type] || forensicChallenges.wood;

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            checkAnalysis(true); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const checkAnalysis = (timeOut = false) => {
      const correct = selected.every(id => challenge.samples.find(s => s.id === id)?.match);
      const complete = selected.length === challenge.correctCount;
      
      if (correct && complete) {
        collectEvidence({
          type: 'forensics',
          title: `${challenge.title} Complete`,
          description: `Successfully identified authentic samples. ${type === 'documents' ? 'Forgeries exposed.' : 'Materials confirmed.'}`,
          level: gameState.currentLevel,
          quality: timeOut ? 'rushed' : 'thorough'
        });
        setGameState(prev => ({ ...prev, stress: prev.stress - 5 }));
        onComplete(true);
      } else if (timeOut) {
        alert('Time expired! Analysis incomplete - evidence may be questioned in court.');
        onComplete(false);
      } else {
        setGameState(prev => ({ ...prev, stress: prev.stress + 3 }));
        alert('Analysis incomplete or incorrect. Review the samples and forensic markers.');
      }
    };

    return (
      <div className="forensics-panel">
        <div className="forensics-header">
          <div>
            <h3>🔬 {challenge.title}</h3>
            <p>{challenge.description}</p>
          </div>
          <div className="timer">⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
        </div>
        
        <div className="hint-box">
          <Info size={16} />
          <span>{challenge.hint}</span>
        </div>

        <div className="samples-grid">
          {challenge.samples.map(sample => (
            <div
              key={sample.id}
              className={`sample ${selected.includes(sample.id) ? 'selected' : ''}`}
              onClick={() => setSelected(prev =>
                prev.includes(sample.id)
                  ? prev.filter(id => id !== sample.id)
                  : [...prev, sample.id]
              )}
            >
              <div className="sample-visual">{sample.visual}</div>
              <div className="sample-name">{sample.type}</div>
              <div className="sample-desc">{sample.desc}</div>
              {selected.includes(sample.id) && <div className="selected-badge">✓ Selected</div>}
            </div>
          ))}
        </div>

        <div className="forensics-actions">
          <div className="selection-count">
            Selected: {selected.length} / {challenge.correctCount}
          </div>
          <button onClick={() => checkAnalysis(false)} className="analyze-btn">
            Submit Analysis
          </button>
        </div>
      </div>
    );
  };

  const DrivingSequence = ({ level, terrain, onComplete }) => {
    const [position, setPosition] = useState(50);
    const [obstacles, setObstacles] = useState([]);
    const [score, setScore] = useState(100);
    const [time, setTime] = useState(45);
    const [speed, setSpeed] = useState(50);
    const [damage, setDamage] = useState(0);
    const [distance, setDistance] = useState(0);

    const terrainTypes = {
      urban: {
        name: "Nairobi Traffic",
        obstacles: ['🚗', '🚕', '🚌', '🏍️', '🚧'],
        background: 'linear-gradient(90deg, #333 0%, #333 20%, #555 20%, #555 80%, #333 80%, #333 100%)',
        speedLimit: 60,
        description: "Navigate heavy city traffic"
      },
      highway: {
        name: "Mombasa Highway",
        obstacles: ['🚛', '🚗', '🏗️', '🦓'],
        background: 'linear-gradient(90deg, #2a4a2a 0%, #2a4a2a 15%, #444 15%, #444 85%, #2a4a2a 85%, #2a4a2a 100%)',
        speedLimit: 100,
        description: "High-speed pursuit on coastal highway"
      },
      desert: {
        name: "Turkana Desert",
        obstacles: ['🪨', '🌵', '⛰️', '🦅'],
        background: 'linear-gradient(90deg, #c19a6b 0%, #c19a6b 20%, #8b7355 20%, #8b7355 80%, #c19a6b 80%, #c19a6b 100%)',
        speedLimit: 45,
        description: "Navigate treacherous desert terrain"
      },
      oldtown: {
        name: "Old Town Chase",
        obstacles: ['📦', '🛒', '🏺', '👥'],
        background: 'linear-gradient(90deg, #8b4513 0%, #8b4513 30%, #555 30%, #555 70%, #8b4513 70%, #8b4513 100%)',
        speedLimit: 30,
        description: "Tight corners through narrow streets"
      }
    };

    const currentTerrain = terrainTypes[terrain] || terrainTypes.urban;

    useEffect(() => {
      const timer = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishDrive();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const obstacleTimer = setInterval(() => {
        const randomPos = Math.random() * 80 + 10;
        const obstacleType = currentTerrain.obstacles[Math.floor(Math.random() * currentTerrain.obstacles.length)];
        setObstacles(prev => [...prev, { id: Date.now(), position: randomPos, type: obstacleType }]);
        setDistance(prev => prev + speed / 10);
      }, 1500 - (speed * 5));

      return () => {
        clearInterval(timer);
        clearInterval(obstacleTimer);
      };
    }, [speed]);

    useEffect(() => {
      setObstacles(prev => prev.filter(obs => obs.id > Date.now() - 3000));
    }, [obstacles]);

    const handleMove = (direction) => {
      setPosition(prev => {
        const newPos = direction === 'left' ? Math.max(15, prev - 20) : Math.min(85, prev + 20);
        
        obstacles.forEach(obs => {
          if (Math.abs(obs.position - newPos) < 12) {
            setScore(s => Math.max(0, s - 15));
            setDamage(d => d + 10);
            setGameState(prev => ({ ...prev, stress: prev.stress + 2 }));
          }
        });
        
        return newPos;
      });
    };

    const adjustSpeed = (change) => {
      setSpeed(prev => {
        const newSpeed = Math.max(20, Math.min(currentTerrain.speedLimit + 20, prev + change));
        if (newSpeed > currentTerrain.speedLimit) {
          setScore(s => Math.max(0, s - 2));
        }
        return newSpeed;
      });
    };

    const finishDrive = () => {
      const finalScore = Math.max(0, score - damage);
      const success = finalScore > 40;
      
      if (success) {
        collectEvidence({
          type: 'chase',
          title: `${currentTerrain.name} - Successful`,
          description: `Completed pursuit. Distance: ${distance.toFixed(0)}km. Score: ${finalScore}`,
          level: gameState.currentLevel,
          quality: finalScore > 70 ? 'excellent' : 'adequate'
        });
      }
      
      onComplete(finalScore);
    };

    return (
      <div className="driving-game">
        <div className="driving-hud">
          <div className="hud-group">
            <div className="stat">⏱️ {time}s</div>
            <div className="stat">⭐ {score}</div>
            <div className="stat">🚗 {speed} km/h</div>
          </div>
          <div className="hud-group">
            <div className="stat">📏 {distance.toFixed(0)} km</div>
            <div className="stat damage">💥 {damage}%</div>
          </div>
        </div>
        
        <div className="terrain-name">{currentTerrain.name}</div>
        
        <div className="road" style={{ background: currentTerrain.background }}>
          {obstacles.map(obs => (
            <div 
              key={obs.id} 
              className="obstacle" 
              style={{ 
                left: `${obs.position}%`,
                animation: `moveDown ${3 - (speed / 50)}s linear forwards`
              }}
            >
              {obs.type}
            </div>
          ))}
          <div className="player-car" style={{ left: `${position}%` }}>
            🚓
          </div>
          
          {damage > 50 && <div className="damage-smoke">💨</div>}
        </div>

        <div className="driving-controls">
          <div className="control-row">
            <button onClick={() => handleMove('left')} className="control-btn">
              ← LEFT
            </button>
            <button onClick={() => handleMove('right')} className="control-btn">
              RIGHT →
            </button>
          </div>
          <div className="control-row speed-controls">
            <button onClick={() => adjustSpeed(-10)} className="control-btn small">
              🐌 SLOW
            </button>
            <button onClick={() => adjustSpeed(10)} className="control-btn small">
              🚀 FAST
            </button>
          </div>
        </div>

        <div className="speed-warning">
          {speed > currentTerrain.speedLimit && (
            <div className="warning-flash">⚠️ SPEED LIMIT: {currentTerrain.speedLimit} km/h</div>
          )}
        </div>
      </div>
    );
  };

  const InterrogationSequence = ({ character, onComplete }) => {
    const [currentTopic, setCurrentTopic] = useState(null);
    const [topicsExhausted, setTopicsExhausted] = useState([]);
    const [cooperation, setCooperation] = useState(0.5);
    const [pressure, setPressure] = useState(0);
    const [evidenceUsed, setEvidenceUsed] = useState([]);
    const [transcript, setTranscript] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const char = characters[character];
    if (!char) return null;

    const topics = {
      theft_night: {
        question: "Where were you on the night of the theft?",
        responses: {
          low: "I was at home, asleep. Check my phone records if you don't believe me.",
          medium: "I was... working late. But not at the museum. I can't say more.",
          high: "I was at the museum, but not stealing. I was trying to prevent the theft."
        },
        evidenceRequired: null,
        pressureThreshold: 0.3
      },
      authentication: {
        question: "Tell me about the authentication process for 'The Warrior's Wisdom'.",
        responses: {
          low: "Standard procedures. Carbon dating, provenance verification. Everything checked out.",
          medium: "There were... irregularities. In the documentation. From months ago.",
          high: "The piece was re-authenticated three times in six months. Someone was very interested in it."
        },
        evidenceRequired: null,
        pressureThreshold: 0.4
      },
      threats: {
        question: "Has anyone threatened you or your family?",
        responses: {
          low: "No. Why would they?",
          medium: "I... I can't talk about this. Please.",
          high: "They showed me photos of my children. At school. Coming home. They said if I didn't cooperate..."
        },
        evidenceRequired: null,
        pressureThreshold: 0.6
      },
      contacts: {
        question: "Who have you been in contact with regarding the carving?",
        responses: {
          low: "Just normal museum business. Researchers, donors, that sort of thing.",
          medium: "There was someone. An art dealer. He asked very specific questions.",
          high: "Raj Patel. He's not what he seems. He gave me a number to call if I was in danger."
        },
        evidenceRequired: 'shipping_manifest',
        pressureThreshold: 0.5
      }
    };

    const approachOptions = [
      {
        id: 'friendly',
        name: 'Build Rapport',
        description: 'Gain trust through empathy and understanding',
        effect: { cooperation: 0.15, pressure: -0.1 },
        icon: '🤝'
      },
      {
        id: 'evidence',
        name: 'Present Evidence',
        description: 'Confront with facts and documentation',
        effect: { cooperation: 0.2, pressure: 0.2 },
        icon: '📄',
        requiresEvidence: true
      },
      {
        id: 'pressure',
        name: 'Apply Pressure',
        description: 'Increase interrogation intensity',
        effect: { cooperation: -0.1, pressure: 0.3 },
        icon: '⚡',
        risk: true
      },
      {
        id: 'legal',
        name: 'Legal Leverage',
        description: 'Discuss charges and consequences',
        effect: { cooperation: 0.1, pressure: 0.25 },
        icon: '⚖️'
      }
    ];

    const askQuestion = (topicId) => {
      const topic = topics[topicId];
      if (!topic) return;

      let response;
      if (cooperation < 0.3) {
        response = topic.responses.low;
      } else if (cooperation < 0.7) {
        response = topic.responses.medium;
      } else {
        response = topic.responses.high;
      }

      const newTranscript = [
        ...transcript,
        { speaker: 'You', text: topic.question, type: 'question' },
        { speaker: char.name, text: response, type: 'answer', cooperation: cooperation }
      ];

      setTranscript(newTranscript);
      setTopicsExhausted([...topicsExhausted, topicId]);
      
      // Check if we've gotten the revelation
      if (cooperation > 0.8 && topicsExhausted.length >= 3) {
        setTimeout(() => {
          setTranscript(prev => [...prev, {
            speaker: char.name,
            text: char.dialogue.revelation,
            type: 'revelation'
          }]);
          
          collectEvidence({
            type: 'testimony',
            title: `${char.name} - Full Confession`,
            description: char.dialogue.revelation,
            level: gameState.currentLevel,
            quality: 'breakthrough'
          });
          
          setGameOver(true);
          setTimeout(() => onComplete(true), 3000);
        }, 2000);
      }
    };

    const useApproach = (approach) => {
      if (approach.requiresEvidence && gameState.evidence.length === 0) {
        alert("You need evidence to use this approach!");
        return;
      }

      setCooperation(prev => Math.max(0, Math.min(1, prev + approach.effect.cooperation)));
      setPressure(prev => Math.max(0, Math.min(1, prev + approach.effect.pressure)));

      if (approach.risk && pressure > 0.7) {
        setTranscript(prev => [...prev, {
          speaker: char.name,
          text: char.dialogue.hostile,
          type: 'hostile'
        }]);
        setGameState(prev => ({ ...prev, stress: prev.stress + 10, reputation: prev.reputation - 5 }));
        setTimeout(() => {
          alert("Interrogation terminated. Subject refused to continue.");
          onComplete(false);
        }, 2000);
        return;
      }

      const responses = {
        friendly: `${char.name} seems slightly more comfortable. They lean back in their chair.`,
        evidence: `${char.name}'s eyes widen as you present the documents. Their confidence wavers.`,
        pressure: `${char.name} shifts uncomfortably. Sweat beads on their forehead.`,
        legal: `${char.name} considers the implications. You see calculation in their eyes.`
      };

      setTranscript(prev => [...prev, {
        speaker: 'Narrator',
        text: responses[approach.id],
        type: 'action'
      }]);
    };

    return (
      <div className="interrogation-room">
        <div className="interrogation-header">
          <div className="suspect-info">
            <h3>🎤 Interrogating: {char.name}</h3>
            <div className="suspect-role">{char.role} • {char.city}</div>
          </div>
          <div className="interrogation-metrics">
            <div className="metric">
              <span>Cooperation</span>
              <div className="meter">
                <div className="meter-fill coop" style={{ width: `${cooperation * 100}%` }} />
              </div>
            </div>
            <div className="metric">
              <span>Pressure</span>
              <div className="meter">
                <div className="meter-fill pressure" style={{ width: `${pressure * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="interrogation-transcript">
          {transcript.length === 0 && (
            <div className="transcript-start">
              <p className="narrator">{char.name} enters the room and sits across from you. {char.dialogue.initial}</p>
            </div>
          )}
          {transcript.map((entry, i) => (
            <div key={i} className={`transcript-entry ${entry.type}`}>
              <div className="speaker">{entry.speaker}</div>
              <div className="text">{entry.text}</div>
              {entry.type === 'answer' && (
                <div className="cooperation-indicator">
                  Cooperation: {(entry.cooperation * 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>

        {!gameOver && (
          <div className="interrogation-controls">
            <div className="approach-buttons">
              <h4>Interrogation Approach:</h4>
              <div className="approaches">
                {approachOptions.map(approach => (
                  <button
                    key={approach.id}
                    onClick={() => useApproach(approach)}
                    className={`approach-btn ${approach.risk ? 'risky' : ''}`}
                    disabled={approach.requiresEvidence && gameState.evidence.length === 0}
                  >
                    <span className="approach-icon">{approach.icon}</span>
                    <span className="approach-name">{approach.name}</span>
                    <span className="approach-desc">{approach.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="questions">
              <h4>Question Topics:</h4>
              <div className="topics-grid">
                {Object.entries(topics).map(([id, topic]) => (
                  <button
                    key={id}
                    onClick={() => askQuestion(id)}
                    className="topic-btn"
                    disabled={topicsExhausted.includes(id)}
                  >
                    {topicsExhausted.includes(id) ? '✓' : '❓'} {topic.question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button onClick={() => onComplete(cooperation > 0.5)} className="btn end-interrogation">
          End Interrogation
        </button>
      </div>
    );
  };

  const EvidenceConnectionBoard = ({ onComplete }) => {
    const [connections, setConnections] = useState([]);
    const [selected, setSelected] = useState([]);
    const [theory, setTheory] = useState('');

    const connectableItems = [
      ...gameState.evidence.slice(0, 8),
      ...Object.values(characters).slice(0, 6).map(char => ({
        type: 'person',
        title: char.name,
        description: char.role,
        id: char.name
      }))
    ];

    const makeConnection = () => {
      if (selected.length !== 2) {
        alert("Select exactly 2 items to connect");
        return;
      }

      const newConnection = {
        from: selected[0],
        to: selected[1],
        theory: theory || "Connected in investigation"
      };

      setConnections([...connections, newConnection]);
      setSelected([]);
      setTheory('');
      setGameState(prev => ({ ...prev, connections: [...prev.connections, newConnection] }));
    };

    const calculateScore = () => {
      const score = connections.length * 10 + (theory.length > 20 ? 15 : 0);
      onComplete(score > 50);
    };

    return (
      <div className="evidence-board-interactive">
        <h3>🔗 Evidence Connection Board</h3>
        <p>Connect evidence and suspects to build your case theory</p>

        <div className="connection-workspace">
          <div className="connectable-items">
            {connectableItems.map((item, i) => (
              <div
                key={i}
                className={`connectable-item ${selected.includes(item) ? 'selected' : ''} ${item.type === 'person' ? 'person-item' : 'evidence-item'}`}
                onClick={() => {
                  if (selected.includes(item)) {
                    setSelected(selected.filter(s => s !== item));
                  } else if (selected.length < 2) {
                    setSelected([...selected, item]);
                  }
                }}
              >
                <div className="item-icon">
                  {item.type === 'person' ? '👤' : '📌'}
                </div>
                <div className="item-title">{item.title}</div>
              </div>
            ))}
          </div>

          <div className="connection-builder">
            <h4>Create Connection:</h4>
            {selected.length === 2 && (
              <>
                <div className="connection-preview">
                  <span>{selected[0].title}</span>
                  <ArrowRight />
                  <span>{selected[1].title}</span>
                </div>
                <textarea
                  value={theory}
                  onChange={(e) => setTheory(e.target.value)}
                  placeholder="Explain how these are connected..."
                  className="theory-input"
                  rows={3}
                />
                <button onClick={makeConnection} className="btn btn-primary">
                  Add Connection
                </button>
              </>
            )}
          </div>

          <div className="connections-list">
            <h4>Established Connections ({connections.length}):</h4>
            {connections.map((conn, i) => (
              <div key={i} className="connection-item">
                <div className="connection-line">
                  {conn.from.title} → {conn.to.title}
                </div>
                <div className="connection-theory">{conn.theory}</div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={calculateScore}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Finalize Case Theory
        </button>
      </div>
    );
  };

  const WitnessInterview = ({ witness, onComplete }) => {
    const [currentStatement, setCurrentStatement] = useState(0);
    const [notes, setNotes] = useState('');
    const [believability, setBelievability] = useState(0.5);

    const wit = levels[gameState.currentLevel]?.witnesses?.find(w => w.id === witness);
    if (!wit) return null;

    const recordStatement = () => {
      collectEvidence({
        type: 'witness_statement',
        title: `${wit.name} - ${wit.role}`,
        description: wit.statements[currentStatement],
        level: gameState.currentLevel,
        believability: believability,
        notes: notes
      });

      if (currentStatement < wit.statements.length - 1) {
        setCurrentStatement(currentStatement + 1);
        setNotes('');
      } else {
        onComplete(true);
      }
    };

    return (
      <div className="witness-interview">
        <div className="witness-header">
          <h3>👁️ Witness Interview</h3>
          <div className="witness-info">
            <div className="witness-name">{wit.name}</div>
            <div className="witness-role">{wit.role}</div>
            <div className="witness-location">📍 {wit.location}</div>
          </div>
        </div>

        <div className="statement-box">
          <div className="statement-number">
            Statement {currentStatement + 1} of {wit.statements.length}
          </div>
          <div className="statement-text">
            "{wit.statements[currentStatement]}"
          </div>
        </div>

        <div className="believability-slider">
          <label>How credible is this statement?</label>
          <input
            type="range"
            min="0"
            max="100"
            value={believability * 100}
            onChange={(e) => setBelievability(e.target.value / 100)}
          />
          <div className="believability-labels">
            <span>Lying</span>
            <span>Uncertain</span>
            <span>Truthful</span>
          </div>
        </div>

        <div className="notes-section">
          <label>Investigation Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record observations, follow-up questions, or contradictions..."
            rows={4}
          />
        </div>

        <button onClick={recordStatement} className="btn btn-primary">
          {currentStatement < wit.statements.length - 1 ? 'Next Statement' : 'Complete Interview'}
        </button>
      </div>
    );
  };

  const DocumentPuzzle = ({ documentType, onComplete }) => {
    const [findings, setFindings] = useState([]);
    const [zoom, setZoom] = useState(1);

    const documents = {
      shipping_manifest: {
        title: "Port Shipping Manifest #47823",
        image: "📄",
        clues: [
          { x: 20, y: 30, hint: "Sequential number gap - manifest #47821 missing", critical: true },
          { x: 60, y: 45, hint: "Customs stamp dated after departure date", critical: true },
          { x: 40, y: 70, hint: "Cargo weight doesn't match container capacity", critical: false },
          { x: 75, y: 20, hint: "Signature matches known forgery pattern", critical: true }
        ]
      },
      financial_records: {
        title: "Campaign Finance Statement",
        image: "💰",
        clues: [
          { x: 25, y: 40, hint: "Donation from shell company registered 1 day before", critical: true },
          { x: 55, y: 55, hint: "Amount in words doesn't match numerical value", critical: true },
          { x: 70, y: 25, hint: "Bank routing number belongs to different institution", critical: true },
          { x: 35, y: 75, hint: "Receipt dates overlap suspiciously with shipments", critical: false }
        ]
      }
    };

    const doc = documents[documentType] || documents.shipping_manifest;

    const examineArea = (clue) => {
      if (!findings.includes(clue)) {
        setFindings([...findings, clue]);
        if (clue.critical) {
          setGameState(prev => ({ ...prev, reputation: prev.reputation + 2 }));
        }
      }
    };

    const submitAnalysis = () => {
      const criticalFound = findings.filter(f => f.critical).length;
      const totalCritical = doc.clues.filter(c => c.critical).length;
      
      if (criticalFound === totalCritical) {
        collectEvidence({
          type: 'document_analysis',
          title: `${doc.title} - Fully Analyzed`,
          description: `All critical discrepancies identified. Document proven fraudulent.`,
          level: gameState.currentLevel,
          quality: 'thorough'
        });
        onComplete(true);
      } else {
        alert(`Found ${criticalFound}/${totalCritical} critical discrepancies. Keep examining!`);
      }
    };

    return (
      <div className="document-puzzle">
        <div className="document-header">
          <h3>🔍 Document Analysis</h3>
          <div className="document-title">{doc.title}</div>
        </div>

        <div className="zoom-controls">
          <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="btn-small">🔍-</button>
          <span>Zoom: {zoom}x</span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="btn-small">🔍+</button>
        </div>

        <div className="document-viewer" style={{ transform: `scale(${zoom})` }}>
          <div className="document-image">{doc.image}</div>
          {doc.clues.map((clue, i) => (
            <div
              key={i}
              className={`clue-hotspot ${findings.includes(clue) ? 'found' : ''}`}
              style={{ left: `${clue.x}%`, top: `${clue.y}%` }}
              onClick={() => examineArea(clue)}
            >
              {findings.includes(clue) ? '✓' : '?'}
            </div>
          ))}
        </div>

        <div className="findings-panel">
          <h4>Findings ({findings.length}/{doc.clues.length}):</h4>
          {findings.map((finding, i) => (
            <div key={i} className={`finding ${finding.critical ? 'critical' : 'minor'}`}>
              {finding.critical && '⚠️ '}{finding.hint}
            </div>
          ))}
        </div>

        <button onClick={submitAnalysis} className="btn btn-primary">
          Submit Analysis
        </button>
      </div>
    );
  };

  // Save/Load functions
  const saveGame = async () => {
    try {
      await window.storage.set('warriors_wisdom_save', JSON.stringify(gameState), false);
      alert('✓ Game saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save game. Please try again.');
    }
  };

  const loadGame = async () => {
    try {
      const saved = await window.storage.get('warriors_wisdom_save', false);
      if (saved && saved.value) {
        setGameState(JSON.parse(saved.value));
        alert('✓ Game loaded successfully!');
        if (gameState.currentLevel === 0 && !gameState.tutorialComplete) {
          setShowTutorial(true);
        }
      } else {
        alert('No saved game found.');
      }
    } catch (error) {
      alert('No saved game found.');
    }
  };

  const collectEvidence = (evidence) => {
    setGameState(prev => ({
      ...prev,
      evidence: [...prev.evidence, { ...evidence, timestamp: Date.now(), id: Date.now() }]
    }));
  };

  const startLevel = (levelNum) => {
    const level = levels[levelNum];
    setGameState(prev => ({
      ...prev,
      currentLevel: levelNum,
      currentScene: levelNum === 0 ? 'tutorial' : 'investigation',
      currentLocation: level.locations[0].id,
      timeRemaining: level.timeLimit ? level.timeLimit * 60 : null
    }));
    setShowMenu(false);

    if (levelNum === 0) {
      setShowTutorial(true);
    }
  };

  const completeLevel = (levelNum) => {
    setGameState(prev => ({
      ...prev,
      completedLevels: [...prev.completedLevels, levelNum],
      unlockedLevels: Math.max(prev.unlockedLevels, levelNum + 1),
      gameProgress: ((prev.completedLevels.length + 1) / 7) * 100,
      tutorialComplete: levelNum === 0 ? true : prev.tutorialComplete
    }));
  };

  // Main render
  return (
    <div className="game-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap');

        .game-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: #e8e8e8;
          font-family: 'Manrope', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .game-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(212, 106, 56, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 168, 150, 0.08) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .header {
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid #d46a38;
          padding: 1.5rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(212, 106, 56, 0.2);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .game-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #d46a38 0%, #00a896 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-stats {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #d46a38;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .progress-bar {
          width: 200px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #d46a38, #00a896);
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(212, 106, 56, 0.5);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d46a38;
          background: rgba(212, 106, 56, 0.1);
          color: #d46a38;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:hover {
          background: #d46a38;
          color: #0a0a0a;
          box-shadow: 0 4px 15px rgba(212, 106, 56, 0.4);
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #d46a38, #c05228);
          border-color: #d46a38;
          color: #fff;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #e07a48, #d46a38);
          box-shadow: 0 6px 20px rgba(212, 106, 56, 0.5);
        }

        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        .main-menu {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          position: relative;
          z-index: 1;
        }

        .menu-hero {
          text-align: center;
          margin-bottom: 4rem;
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #d46a38 0%, #00a896 50%, #d46a38 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
        }

        .menu-hero p {
          font-size: 1.2rem;
          color: #b8b8b8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .menu-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
        }

        .menu-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .menu-card:hover {
          background: rgba(212, 106, 56, 0.1);
          border-color: #d46a38;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(212, 106, 56, 0.3);
        }

        .menu-card h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #d46a38;
        }

        .investigation-screen {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .investigation-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(212, 106, 56, 0.3);
          padding-bottom: 1rem;
          flex-wrap: wrap;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          color: #b8b8b8;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab.active {
          color: #d46a38;
          border-bottom-color: #d46a38;
        }

        .tab:hover {
          color: #d46a38;
        }

        .evidence-board {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .objectives-panel {
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #d46a38;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .objectives-panel h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #d46a38;
          margin-bottom: 1rem;
        }

        .objective-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .objective-item:last-child {
          border-bottom: none;
        }

        .forensics-panel {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid #00a896;
          border-radius: 8px;
          padding: 2rem;
        }

        .forensics-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .forensics-header h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #00a896;
          margin-bottom: 0.5rem;
        }

        .timer {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e67e22;
          padding: 0.5rem 1rem;
          background: rgba(230, 126, 34, 0.1);
          border-radius: 4px;
        }

        .hint-box {
          background: rgba(0, 168, 150, 0.1);
          border-left: 3px solid #00a896;
          padding: 1rem;
          margin: 1rem 0;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.9rem;
          color: #b8b8b8;
        }

        .samples-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .sample {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(0, 168, 150, 0.3);
          border-radius: 6px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .sample:hover {
          border-color: #00a896;
          box-shadow: 0 5px 15px rgba(0, 168, 150, 0.3);
          transform: translateY(-2px);
        }

        .sample.selected {
          border-color: #00a896;
          background: rgba(0, 168, 150, 0.2);
          box-shadow: 0 0 20px rgba(0, 168, 150, 0.5);
        }

        .sample-visual {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .sample-name {
          font-weight: 700;
          color: #00a896;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .sample-desc {
          font-size: 0.85rem;
          color: #b8b8b8;
          text-align: center;
          line-height: 1.4;
        }

        .selected-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #00a896;
          color: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .forensics-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }

        .selection-count {
          font-size: 1.1rem;
          color: #00a896;
          font-weight: 600;
        }

        .analyze-btn {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #00a896, #008876);
          border: none;
          color: #fff;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }

        .analyze-btn:hover {
          background: linear-gradient(135deg, #00c9b0, #00a896);
          box-shadow: 0 5px 20px rgba(0, 168, 150, 0.5);
          transform: translateY(-2px);
        }

        .driving-game {
          background: linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%);
          border: 2px solid #d46a38;
          border-radius: 8px;
          padding: 2rem;
          min-height: 500px;
          position: relative;
        }

        .driving-hud {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .hud-group {
          display: flex;
          gap: 2rem;
        }

        .stat {
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: 1px solid rgba(212, 106, 56, 0.3);
        }

        .stat.damage {
          color: #e74c3c;
          border-color: rgba(231, 76, 60, 0.5);
        }

        .terrain-name {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: #00a896;
          margin-bottom: 1rem;
          font-family: 'Cormorant Garamond', serif;
        }

        .road {
          width: 100%;
          height: 350px;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
        }

        .obstacle {
          position: absolute;
          bottom: 100%;
          width: 50px;
          height: 50px;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes moveDown {
          from { bottom: 100%; }
          to { bottom: -50px; }
        }

        .player-car {
          position: absolute;
          bottom: 30px;
          width: 60px;
          height: 60px;
          font-size: 2.5rem;
          transition: left 0.2s ease;
          filter: drop-shadow(0 0 15px rgba(212, 106, 56, 0.6));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .damage-smoke {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          animation: smoke 1s infinite;
        }

        @keyframes smoke {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .driving-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }

        .control-row {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .speed-controls {
          gap: 1rem;
        }

        .control-btn {
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #d46a38, #c05228);
          border: none;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .control-btn:hover {
          background: linear-gradient(135deg, #e07a48, #d46a38);
          box-shadow: 0 5px 20px rgba(212, 106, 56, 0.5);
          transform: scale(1.05);
        }

        .control-btn.small {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          min-width: 120px;
        }

        .speed-warning {
          text-align: center;
          margin-top: 1rem;
          min-height: 30px;
        }

        .warning-flash {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 700;
          animation: flash 0.5s infinite;
        }

        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .interrogation-room {
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid #d46a38;
          border-radius: 8px;
          padding: 2rem;
          min-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .interrogation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid rgba(212, 106, 56, 0.3);
        }

        .suspect-info h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #d46a38;
          margin-bottom: 0.5rem;
        }

        .suspect-role {
          color: #b8b8b8;
          font-size: 0.9rem;
        }

        .interrogation-metrics {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 250px;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric span {
          font-size: 0.85rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .meter {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .meter-fill.coop {
          background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71);
        }

        .meter-fill.pressure {
          background: linear-gradient(90deg, #3498db, #e67e22, #c0392b);
        }

        .interrogation-transcript {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .transcript-entry {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .transcript-entry:last-child {
          border-bottom: none;
        }

        .transcript-entry .speaker {
          font-weight: 700;
          color: #d46a38;
          margin-bottom: 0.5rem;
        }

        .transcript-entry .text {
          color: #e8e8e8;
          line-height: 1.6;
        }

        .transcript-entry.revelation {
          background: rgba(212, 106, 56, 0.1);
          border: 2px solid #d46a38;
          border-radius: 4px;
          padding: 1rem;
        }

        .transcript-entry.revelation .speaker {
          color: #00a896;
        }

        .transcript-entry.action {
          font-style: italic;
          color: #888;
        }

        .cooperation-indicator {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #00a896;
        }

        .interrogation-controls {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .approach-buttons h4,
        .questions h4 {
          color: #d46a38;
          margin-bottom: 1rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
        }

        .approaches {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .approach-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 6px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }

        .approach-btn:hover:not(:disabled) {
          border-color: #d46a38;
          background: rgba(212, 106, 56, 0.1);
          transform: translateY(-2px);
        }

        .approach-btn.risky {
          border-color: rgba(231, 76, 60, 0.5);
        }

        .approach-btn.risky:hover:not(:disabled) {
          border-color: #e74c3c;
          background: rgba(231, 76, 60, 0.1);
        }

        .approach-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .approach-icon {
          font-size: 1.5rem;
        }

        .approach-name {
          font-weight: 700;
          color: #d46a38;
          font-size: 0.95rem;
        }

        .approach-desc {
          font-size: 0.8rem;
          color: #b8b8b8;
          line-height: 1.4;
        }

        .topics-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .topic-btn {
          background: rgba(0, 168, 150, 0.1);
          border: 2px solid rgba(0, 168, 150, 0.3);
          border-radius: 4px;
          padding: 0.75rem 1rem;
          color: #e8e8e8;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-size: 0.95rem;
        }

        .topic-btn:hover:not(:disabled) {
          border-color: #00a896;
          background: rgba(0, 168, 150, 0.2);
        }

        .topic-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        .end-interrogation {
          margin-top: 2rem;
          width: 100%;
        }

        .witness-interview {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid #00a896;
          border-radius: 8px;
          padding: 2rem;
        }

        .witness-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(0, 168, 150, 0.3);
        }

        .witness-header h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #00a896;
          margin-bottom: 1rem;
        }

        .witness-info {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .witness-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #e8e8e8;
        }

        .witness-role {
          color: #b8b8b8;
        }

        .witness-location {
          color: #00a896;
        }

        .statement-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 168, 150, 0.3);
          border-radius: 4px;
          padding: 2rem;
          margin: 2rem 0;
        }

        .statement-number {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .statement-text {
          font-size: 1.2rem;
          color: #e8e8e8;
          line-height: 1.8;
          font-style: italic;
        }

        .believability-slider {
          margin: 2rem 0;
        }

        .believability-slider label {
          display: block;
          margin-bottom: 1rem;
          color: #d46a38;
          font-weight: 600;
        }

        .believability-slider input[type="range"] {
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71);
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
        }

        .believability-slider input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #fff;
          border: 2px solid #d46a38;
          border-radius: 50%;
          cursor: pointer;
        }

        .believability-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #888;
        }

        .notes-section {
          margin: 2rem 0;
        }

        .notes-section label {
          display: block;
          margin-bottom: 0.75rem;
          color: #d46a38;
          font-weight: 600;
        }

        .notes-section textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 168, 150, 0.3);
          border-radius: 4px;
          padding: 1rem;
          color: #e8e8e8;
          font-family: 'Manrope', sans-serif;
          font-size: 0.95rem;
          resize: vertical;
        }

        .notes-section textarea:focus {
          outline: none;
          border-color: #00a896;
        }

        .evidence-board-interactive {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid #d46a38;
          border-radius: 8px;
          padding: 2rem;
        }

        .evidence-board-interactive h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #d46a38;
          margin-bottom: 0.5rem;
        }

        .connection-workspace {
          margin-top: 2rem;
        }

        .connectable-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .connectable-item {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 6px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .connectable-item:hover {
          border-color: #d46a38;
          transform: scale(1.05);
        }

        .connectable-item.selected {
          border-color: #00a896;
          background: rgba(0, 168, 150, 0.2);
          box-shadow: 0 0 15px rgba(0, 168, 150, 0.5);
        }

        .connectable-item.person-item {
          border-color: rgba(0, 168, 150, 0.3);
        }

        .connectable-item.evidence-item {
          border-color: rgba(212, 106, 56, 0.3);
        }

        .item-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .item-title {
          font-size: 0.85rem;
          color: #e8e8e8;
          font-weight: 600;
        }

        .connection-builder {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .connection-builder h4 {
          color: #d46a38;
          margin-bottom: 1rem;
        }

        .connection-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-weight: 600;
          color: #00a896;
        }

        .theory-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 106, 56, 0.3);
          border-radius: 4px;
          padding: 0.75rem;
          color: #e8e8e8;
          font-family: 'Manrope', sans-serif;
          margin-bottom: 1rem;
          resize: vertical;
        }

        .theory-input:focus {
          outline: none;
          border-color: #d46a38;
        }

        .connections-list {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 1.5rem;
        }

        .connections-list h4 {
          color: #d46a38;
          margin-bottom: 1rem;
        }

        .connection-item {
          background: rgba(255, 255, 255, 0.05);
          border-left: 3px solid #00a896;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }

        .connection-line {
          font-weight: 700;
          color: #00a896;
          margin-bottom: 0.5rem;
        }

        .connection-theory {
          color: #b8b8b8;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .document-puzzle {
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid #d46a38;
          border-radius: 8px;
          padding: 2rem;
        }

        .document-header {
          margin-bottom: 2rem;
        }

        .document-header h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          color: #d46a38;
          margin-bottom: 0.5rem;
        }

        .document-title {
          color: #b8b8b8;
          font-size: 1.1rem;
        }

        .zoom-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .document-viewer {
          width: 600px;
          height: 400px;
          margin: 0 auto 2rem;
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .document-image {
          font-size: 15rem;
        }

        .clue-hotspot {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(212, 106, 56, 0.3);
          border: 2px solid #d46a38;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 700;
          color: #d46a38;
        }

        .clue-hotspot:hover {
          background: rgba(212, 106, 56, 0.6);
          transform: scale(1.2);
        }

        .clue-hotspot.found {
          background: rgba(46, 204, 113, 0.5);
          border-color: #2ecc71;
          color: #2ecc71;
        }

        .findings-panel {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .findings-panel h4 {
          color: #d46a38;
          margin-bottom: 1rem;
        }

        .finding {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          border-radius: 4px;
          border-left: 3px solid #00a896;
        }

        .finding.critical {
          border-left-color: #e74c3c;
          background: rgba(231, 76, 60, 0.1);
        }

        .finding.minor {
          border-left-color: #f39c12;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .evidence-item {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 106, 56, 0.3);
          border-radius: 6px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .evidence-item::before {
          content: '📌';
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 1.5rem;
          filter: drop-shadow(0 0 10px rgba(212, 106, 56, 0.5));
        }

        .evidence-item:hover {
          border-color: #d46a38;
          transform: rotate(-1deg);
          box-shadow: 0 5px 20px rgba(212, 106, 56, 0.3);
        }

        .levels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .level-card {
          background: linear-gradient(135deg, rgba(212, 106, 56, 0.05) 0%, rgba(0, 168, 150, 0.05) 100%);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .level-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #d46a38, #00a896);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .level-card:hover::before {
          transform: scaleX(1);
        }

        .level-card:hover {
          border-color: #d46a38;
          box-shadow: 0 8px 25px rgba(212, 106, 56, 0.25);
          transform: translateY(-3px);
        }

        .level-card.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .level-card.completed {
          border-color: #00a896;
        }

        .level-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .level-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(212, 106, 56, 0.3);
          line-height: 1;
        }

        .difficulty-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .difficulty-tutorial {
          background: rgba(52, 152, 219, 0.2);
          color: #3498db;
          border: 1px solid #3498db;
        }

        .difficulty-beginner {
          background: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
          border: 1px solid #2ecc71;
        }

        .difficulty-intermediate {
          background: rgba(241, 196, 15, 0.2);
          color: #f1c40f;
          border: 1px solid #f1c40f;
        }

        .difficulty-advanced {
          background: rgba(230, 126, 34, 0.2);
          color: #e67e22;
          border: 1px solid #e67e22;
        }

        .difficulty-expert {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: 1px solid #e74c3c;
        }

        .level-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #e8e8e8;
        }

        .level-subtitle {
          color: #d46a38;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .level-cities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .city-tag {
          padding: 0.25rem 0.75rem;
          background: rgba(0, 168, 150, 0.2);
          border: 1px solid #00a896;
          border-radius: 12px;
          font-size: 0.75rem;
          color: #00a896;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #888;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .locations-map {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .location-card {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(0, 168, 150, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .location-card:hover {
          border-color: #00a896;
          box-shadow: 0 5px 20px rgba(0, 168, 150, 0.3);
          transform: scale(1.05);
        }

        .location-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px rgba(0, 168, 150, 0.5));
        }

        .character-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .character-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(212, 106, 56, 0.05) 100%);
          border: 2px solid rgba(212, 106, 56, 0.3);
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .character-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--character-color);
          transition: width 0.3s ease;
        }

        .character-card:hover::before {
          width: 100%;
          opacity: 0.1;
        }

        .character-card:hover {
          border-color: var(--character-color);
          box-shadow: 0 8px 25px rgba(212, 106, 56, 0.3);
          transform: translateY(-3px);
        }

        .threat-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .threat-extreme { background: #e74c3c; color: #fff; }
        .threat-critical { background: #c0392b; color: #fff; }
        .threat-high { background: #e67e22; color: #fff; }
        .threat-medium { background: #f39c12; color: #fff; }
        .threat-low { background: #2ecc71; color: #fff; }
        .threat-ally { background: #3498db; color: #fff; }

        .character-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
          border: 3px solid var(--character-color);
          border-radius: 12px;
          padding: 3rem;
          max-width: 600px;
          width: 90%;
          position: relative;
          animation: slideUp 0.3s ease;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          max-height: 90vh;
          overflow-y: auto;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #e8e8e8;
          cursor: pointer;
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(90deg);
        }

        .modal-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid var(--character-color);
        }

        .modal-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: var(--character-color);
          margin-bottom: 0.5rem;
        }

        .modal-section {
          margin: 1.5rem 0;
        }

        .modal-section h4 {
          color: #d46a38;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .modal-section p {
          color: #e8e8e8;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .header-stats {
            flex-direction: column;
            gap: 0.5rem;
          }

          .investigation-tabs {
            overflow-x: auto;
          }

          .samples-grid,
          .evidence-grid,
          .levels-grid,
          .character-grid,
          .locations-map {
            grid-template-columns: 1fr;
          }

          .menu-hero h1 {
            font-size: 2.5rem;
          }

          .document-viewer {
            width: 100%;
            max-width: 400px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="game-title">The Warrior's Wisdom</h1>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Reputation</span>
              <span className="stat-value">{gameState.reputation}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Stress</span>
              <span className="stat-value">{gameState.stress}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Evidence</span>
              <span className="stat-value">{gameState.evidence.length}</span>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${gameState.gameProgress}%` }}
              />
            </div>
            
            <button onClick={saveGame} className="btn">
              <Save size={18} />
              Save
            </button>
            
            <button onClick={() => setShowMenu(!showMenu)} className="btn">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {gameState.currentScene === 'menu' && (
        <div className="main-menu">
          <div className="menu-hero">
            <h1>The Warrior's Wisdom</h1>
            <p>
              Uncover the truth behind the theft of Kenya's priceless Kamba carving. 
              Navigate through corruption, cultural heritage, and international crime 
              across Nairobi, Mombasa, Kisumu, and Turkana.
            </p>
          </div>

          <div className="menu-actions">
            <div className="menu-card" onClick={() => setGameState(prev => ({ ...prev, currentScene: 'levels' }))}>
              <h3>🎮 Play</h3>
              <p>Continue your investigation</p>
            </div>
            
            <div className="menu-card" onClick={loadGame}>
              <h3>📂 Load Game</h3>
              <p>Resume from saved progress</p>
            </div>
            
            <div className="menu-card" onClick={() => setGameState(prev => ({ ...prev, currentScene: 'characters' }))}>
              <h3>👥 Dossiers</h3>
              <p>Review suspect profiles</p>
            </div>
            
            <div className="menu-card" onClick={() => setGameState(prev => ({ ...prev, currentScene: 'about' }))}>
              <h3>ℹ️ About</h3>
              <p>Game information & controls</p>
            </div>
          </div>
        </div>
      )}

      {gameState.currentScene === 'levels' && (
        <div className="investigation-screen">
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '2.5rem', 
            marginBottom: '2rem',
            color: '#d46a38'
          }}>
            Case Files
          </h2>
          
          <div className="levels-grid">
            {Object.entries(levels).map(([num, level]) => {
              const levelNum = parseInt(num);
              const isLocked = levelNum > gameState.unlockedLevels;
              const isCompleted = gameState.completedLevels.includes(levelNum);
              
              return (
                <div 
                  key={num}
                  className={`level-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => !isLocked && startLevel(levelNum)}
                >
                  <div className="level-header">
                    <div className="level-number">
                      {isCompleted ? '✓' : levelNum === 0 ? '🎓' : levelNum}
                    </div>
                    <span className={`difficulty-badge difficulty-${level.difficulty.toLowerCase().replace(' ', '-')}`}>
                      {level.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="level-title">{level.title}</h3>
                  <div className="level-subtitle">{level.subtitle}</div>
                  
                  <div className="level-cities">
                    {level.cities.map(city => (
                      <span key={city} className="city-tag">{city}</span>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#b8b8b8' }}>
                    {level.objectives.length} objectives • {level.locations.length} locations
                    {level.timeLimit && ` • ${level.timeLimit} min time limit`}
                  </div>
                  
                  {isLocked && levelNum > 0 && (
                    <div style={{ 
                      marginTop: '1rem', 
                      color: '#e67e22',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      🔒 Complete Level {levelNum - 1} to unlock
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => setGameState(prev => ({ ...prev, currentScene: 'menu' }))}
            className="btn"
            style={{ marginTop: '2rem' }}
          >
            ← Back to Menu
          </button>
        </div>
      )}

      {gameState.currentScene === 'investigation' && (
        <div className="investigation-screen">
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            color: '#d46a38'
          }}>
            {levels[gameState.currentLevel]?.title}
          </h2>
          
          <div style={{ marginBottom: '2rem', color: '#b8b8b8' }}>
            {levels[gameState.currentLevel]?.subtitle} • {levels[gameState.currentLevel]?.description}
          </div>

          <div className="objectives-panel">
            <h3>🎯 Mission Objectives</h3>
            {levels[gameState.currentLevel]?.objectives.map((obj, i) => (
              <div key={i} className="objective-item">
                <span style={{ color: '#d46a38' }}>□</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>

          <div className="investigation-tabs">
            <button 
              className={`tab ${activeTab === 'investigation' ? 'active' : ''}`}
              onClick={() => setActiveTab('investigation')}
            >
              <Search size={20} />
              Investigate
            </button>
            <button 
              className={`tab ${activeTab === 'evidence' ? 'active' : ''}`}
              onClick={() => setActiveTab('evidence')}
            >
              <FileText size={20} />
              Evidence ({gameState.evidence.length})
            </button>
            <button 
              className={`tab ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => setActiveTab('locations')}
            >
              <Map size={20} />
              Locations
            </button>
            <button 
              className={`tab ${activeTab === 'suspects' ? 'active' : ''}`}
              onClick={() => setActiveTab('suspects')}
            >
              <Users size={20} />
              Suspects
            </button>
            <button 
              className={`tab ${activeTab === 'connect' ? 'active' : ''}`}
              onClick={() => setActiveTab('connect')}
            >
              <Link2 size={20} />
              Connections
            </button>
          </div>

          {activeTab === 'investigation' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Active Investigation Tools
              </h3>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <button 
                  onClick={() => setActiveMinigame({ type: 'forensics', subtype: 'wood' })}
                  className="btn btn-primary"
                >
                  <Crosshair size={18} />
                  Forensic Analysis
                </button>

                <button 
                  onClick={() => setActiveMinigame({ type: 'driving', terrain: 'urban' })}
                  className="btn btn-primary"
                >
                  <Car size={18} />
                  Begin Pursuit
                </button>

                <button 
                  onClick={() => setActiveMinigame({ type: 'interrogation', character: 'muthoni' })}
                  className="btn btn-primary"
                >
                  <MessageCircle size={18} />
                  Interrogation
                </button>

                <button 
                  onClick={() => setActiveMinigame({ type: 'witness', id: levels[gameState.currentLevel]?.witnesses?.[0]?.id })}
                  className="btn btn-primary"
                  disabled={!levels[gameState.currentLevel]?.witnesses?.length}
                >
                  <Eye size={18} />
                  Interview Witness
                </button>

                <button 
                  onClick={() => setActiveMinigame({ type: 'document', docType: 'shipping_manifest' })}
                  className="btn btn-primary"
                >
                  <ZoomIn size={18} />
                  Analyze Documents
                </button>

                <button 
                  onClick={() => {
                    collectEvidence({
                      type: 'discovery',
                      title: `Level ${gameState.currentLevel} Key Finding`,
                      description: levels[gameState.currentLevel]?.twist,
                      level: gameState.currentLevel
                    });
                  }}
                  className="btn"
                >
                  <Camera size={18} />
                  Document Evidence
                </button>
              </div>

              {activeMinigame && (
                <>
                  {activeMinigame.type === 'forensics' && (
                    <ForensicsAnalysis 
                      type={activeMinigame.subtype}
                      level={gameState.currentLevel}
                      onComplete={(success) => {
                        setActiveMinigame(null);
                        if (success) {
                          alert('✓ Forensic analysis complete! Evidence added.');
                        }
                      }}
                    />
                  )}

                  {activeMinigame.type === 'driving' && (
                    <DrivingSequence 
                      level={gameState.currentLevel}
                      terrain={activeMinigame.terrain}
                      onComplete={(score) => {
                        setActiveMinigame(null);
                        if (score > 40) {
                          alert(`✓ Pursuit successful! Score: ${score}`);
                        } else {
                          alert(`Pursuit ended. Score: ${score}. Try again for better results.`);
                        }
                      }}
                    />
                  )}

                  {activeMinigame.type === 'interrogation' && (
                    <InterrogationSequence 
                      character={activeMinigame.character}
                      onComplete={(success) => {
                        setActiveMinigame(null);
                        if (success) {
                          alert('✓ Interrogation complete. New information obtained.');
                        }
                      }}
                    />
                  )}

                  {activeMinigame.type === 'witness' && (
                    <WitnessInterview 
                      witness={activeMinigame.id}
                      onComplete={(success) => {
                        setActiveMinigame(null);
                        if (success) {
                          alert('✓ Witness statement recorded.');
                        }
                      }}
                    />
                  )}

                  {activeMinigame.type === 'document' && (
                    <DocumentPuzzle 
                      documentType={activeMinigame.docType}
                      onComplete={(success) => {
                        setActiveMinigame(null);
                        if (success) {
                          alert('✓ Document fraud exposed!');
                        }
                      }}
                    />
                  )}
                </>
              )}

              {!activeMinigame && (
                <div style={{ 
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'rgba(212, 106, 56, 0.1)',
                  border: '2px solid #d46a38',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#d46a38', marginBottom: '0.5rem' }}>
                    🔍 Case Breakthrough
                  </h4>
                  <p>{levels[gameState.currentLevel]?.twist}</p>
                </div>
              )}

              <button 
                onClick={() => {
                  completeLevel(gameState.currentLevel);
                  alert(`✓ Level ${gameState.currentLevel} complete! Next level unlocked.`);
                  setGameState(prev => ({ ...prev, currentScene: 'levels' }));
                }}
                className="btn btn-primary"
                style={{ marginTop: '2rem', width: '100%' }}
              >
                Complete Level {gameState.currentLevel}
              </button>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Evidence Board
              </h3>

              {gameState.evidence.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <p>No evidence collected yet. Begin your investigation to gather clues.</p>
                </div>
              ) : (
                <div className="evidence-grid">
                  {gameState.evidence.map((item, i) => (
                    <div key={i} className="evidence-item">
                      <h4 style={{ 
                        color: '#d46a38',
                        marginBottom: '0.5rem',
                        fontWeight: 700
                      }}>
                        {item.title}
                      </h4>
                      <div style={{ 
                        fontSize: '0.85rem',
                        color: '#00a896',
                        marginBottom: '0.5rem'
                      }}>
                        Level {item.level} • {item.type}
                        {item.quality && ` • ${item.quality}`}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#b8b8b8' }}>
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Accessible Locations
              </h3>

              <div className="locations-map">
                {levels[gameState.currentLevel]?.locations.map(loc => (
                  <div 
                    key={loc.id}
                    className="location-card"
                    onClick={() => setGameState(prev => ({ ...prev, currentLocation: loc.id }))}
                  >
                    <div className="location-icon">{loc.icon}</div>
                    <div style={{ fontWeight: 600, color: '#e8e8e8', marginBottom: '0.5rem' }}>
                      {loc.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#b8b8b8', marginBottom: '0.5rem' }}>
                      {loc.description}
                    </div>
                    {gameState.currentLocation === loc.id && (
                      <div style={{ 
                        marginTop: '0.5rem',
                        color: '#00a896',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        ● Current Location
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suspects' && (
            <div className="evidence-board">
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                marginBottom: '1.5rem',
                color: '#e8e8e8'
              }}>
                Suspect Dossiers
              </h3>

              <div className="character-grid">
                {Object.entries(characters).map(([id, char]) => (
                  <div 
                    key={id}
                    className="character-card"
                    style={{ '--character-color': char.color }}
                    onClick={() => setSelectedCharacter(char)}
                  >
                    <span className={`threat-badge threat-${char.threat.toLowerCase()}`}>
                      {char.threat}
                    </span>
                    
                    <h4 style={{ 
                      fontSize: '1.3rem',
                      marginBottom: '0.25rem',
                      color: '#e8e8e8',
                      fontFamily: "'Cormorant Garamond', serif"
                    }}>
                      {char.name}
                    </h4>
                    
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: char.color,
                      marginBottom: '0.5rem',
                      fontWeight: 600
                    }}>
                      {char.role}
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', color: '#b8b8b8', marginBottom: '0.5rem' }}>
                      📍 {char.city}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#b8b8b8', marginTop: '1rem' }}>
                      Age: {char.age} • {char.background}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'connect' && (
            <EvidenceConnectionBoard 
              onComplete={(success) => {
                if (success) {
                  alert('✓ Case theory established!');
                }
              }}
            />
          )}

          <button 
            onClick={() => setGameState(prev => ({ ...prev, currentScene: 'levels' }))}
            className="btn"
            style={{ marginTop: '2rem' }}
          >
            ← Back to Levels
          </button>
        </div>
      )}

      {gameState.currentScene === 'characters' && (
        <div className="investigation-screen">
          <h2 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '2.5rem', 
            marginBottom: '2rem',
            color: '#d46a38'
          }}>
            Suspect Dossiers
          </h2>

          <div className="character-grid">
            {Object.entries(characters).map(([id, char]) => (
              <div 
                key={id}
                className="character-card"
                style={{ '--character-color': char.color }}
                onClick={() => setSelectedCharacter(char)}
              >
                <span className={`threat-badge threat-${char.threat.toLowerCase()}`}>
                  {char.threat}
                </span>
                
                <h4 style={{ 
                  fontSize: '1.3rem',
                  marginBottom: '0.25rem',
                  color: '#e8e8e8',
                  fontFamily: "'Cormorant Garamond', serif"
                }}>
                  {char.name}
                </h4>
                
                <div style={{ 
                  fontSize: '0.9rem',
                  color: char.color,
                  marginBottom: '0.5rem',
                  fontWeight: 600
                }}>
                  {char.role}
                </div>
                
                <div style={{ fontSize: '0.85rem', color: '#b8b8b8', marginBottom: '0.5rem' }}>
                  📍 {char.city}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#b8b8b8' }}>
                  {char.background}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setGameState(prev => ({ ...prev, currentScene: 'menu' }))}
            className="btn"
            style={{ marginTop: '2rem' }}
          >
            ← Back to Menu
          </button>
        </div>
      )}

      {gameState.currentScene === 'about' && (
        <div className="investigation-screen">
          <div className="evidence-board">
            <h2 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: '2.5rem', 
              marginBottom: '2rem',
              color: '#d46a38'
            }}>
              About The Warrior's Wisdom
            </h2>

            <div style={{ lineHeight: 1.8, color: '#e8e8e8' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                A comprehensive detective game featuring 6 levels of escalating complexity, 
                from forensic analysis to political corruption. Master forensics, interrogation, 
                driving, and evidence connection to solve the mystery of Kenya's stolen heritage.
              </p>

              <h3 style={{ 
                color: '#00a896',
                marginTop: '2rem',
                marginBottom: '1rem',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem'
              }}>
                Game Controls & Features
              </h3>
              
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Forensic Analysis:</strong> Select authentic samples within time limit. Look for natural aging patterns and material composition.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Driving Sequences:</strong> Use LEFT/RIGHT to avoid obstacles. Adjust speed based on terrain limits. Watch damage meter.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Interrogations:</strong> Build cooperation through rapport or pressure. Use evidence strategically. Manage stress levels.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Witness Interviews:</strong> Rate statement credibility. Take detailed notes for cross-referencing.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Document Analysis:</strong> Zoom and examine for forgery markers. Find all critical discrepancies.
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <strong>Evidence Board:</strong> Connect clues and suspects. Build comprehensive case theory.
                </li>
              </ul>

              <h3 style={{ 
                color: '#00a896',
                marginTop: '2rem',
                marginBottom: '1rem',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem'
              }}>
                Multiple Endings
              </h3>
              
              <p style={{ marginBottom: '0.75rem' }}>
                Your investigation thoroughness, evidence quality, and time management determine the outcome:
              </p>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.75rem' }}><strong>Local Victory:</strong> Recover artifact, arrest local officials</li>
                <li style={{ marginBottom: '0.75rem' }}><strong>Regional Triumph:</strong> Stop heist, expose regional corruption</li>
                <li style={{ marginBottom: '0.75rem' }}><strong>Complete Justice:</strong> Break syndicate, repatriate all artifacts, push reforms</li>
                <li style={{ marginBottom: '0.75rem' }}><strong>Failure:</strong> Evidence destroyed, cartel escapes</li>
              </ul>
            </div>

            <button 
              onClick={() => setGameState(prev => ({ ...prev, currentScene: 'menu' }))}
              className="btn btn-primary"
              style={{ marginTop: '2rem' }}
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      )}

      {/* Character Modal */}
      {selectedCharacter && (
        <div className="character-modal" onClick={() => setSelectedCharacter(null)}>
          <div 
            className="modal-content"
            style={{ '--character-color': selectedCharacter.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedCharacter(null)}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <h2>{selectedCharacter.name}</h2>
              <div style={{ color: selectedCharacter.color, fontSize: '1.2rem', fontWeight: 600 }}>
                {selectedCharacter.role}
              </div>
            </div>

            <div className="modal-section">
              <h4>Location</h4>
              <p>📍 {selectedCharacter.city} • Age: {selectedCharacter.age}</p>
            </div>

            <div className="modal-section">
              <h4>Background</h4>
              <p>{selectedCharacter.background}</p>
            </div>

            <div className="modal-section">
              <h4>Public Identity</h4>
              <p>{selectedCharacter.publicIdentity}</p>
            </div>

            <div className="modal-section">
              <h4>🔒 Classified Information</h4>
              <p style={{ color: '#e67e22' }}>{selectedCharacter.hiddenTruth}</p>
            </div>

            <div className="modal-section">
              <h4>Personality Profile</h4>
              <p>{selectedCharacter.personality}</p>
            </div>

            <div className="modal-section">
              <h4>Threat Assessment</h4>
              <span className={`threat-badge threat-${selectedCharacter.threat.toLowerCase()}`}>
                {selectedCharacter.threat}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
