import { GoogleGenAI, Type } from '@google/genai';
import { CropRecommendationInput, CropRecommendationItem } from '../src/types/index.ts';

const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Agronomic Fallback Engine for high resilience & offline/instant testing
function generateHeuristicRecommendations(input: CropRecommendationInput): CropRecommendationItem[] {
  const recommendations: CropRecommendationItem[] = [];
  const ph = Number(input.soilPh) || 6.5;
  const n = Number(input.nitrogen) || 60;
  const p = Number(input.phosphorus) || 45;
  const k = Number(input.potassium) || 40;
  const area = Number(input.farmArea) || 5;

  if (input.season === 'Kharif' || input.temperature >= 24) {
    // Tomato / Veg recommendation
    const suitability = Math.min(96, Math.max(75, Math.round(88 + (ph >= 6.0 && ph <= 7.2 ? 6 : -5) + (k > 35 ? 4 : -4))));
    const revenue = Math.round(185000 + (suitability - 80) * 1800);
    recommendations.push({
      id: 'crop-rec-tomato',
      cropName: 'Tomato',
      variety: 'Himsona / Abhinav Hybrid F1',
      suitabilityScore: suitability,
      expectedYield: '18 - 24 tons/acre',
      estimatedDuration: '90 - 110 days',
      waterRequirement: 'Medium',
      fertilizerRequirement: `NPK ${Math.round(n * 1.5)}:${Math.round(p * 1.2)}:${Math.round(k * 1.8)} kg/ha with micronutrient zinc spray`,
      riskLevel: 'Moderate',
      expectedMarketDemand: 'High',
      estimatedRevenuePerAcre: revenue,
      estimatedProfitPerAcre: Math.round(revenue * 0.58),
      whyRecommended: `Your soil pH of ${ph} and potassium level of ${k} mg/kg are well-suited for high-density solanaceous flowering and fruit set. With ${input.irrigationType} irrigation, hybrid tomato gives accelerated turnover and strong local mandi demand.`,
      growthTips: [
        'Transplant seedlings 25 days after nursery sowing with 60cm row spacing',
        'Incorporate trichoderma viride bio-fungicide during land preparation to prevent collar rot',
        'Implement trellising / staking within 3 weeks of transplanting to ensure Grade A shape and shelf life'
      ]
    });

    // Soybean / Legume recommendation
    const soySuitability = Math.min(94, Math.max(72, Math.round(85 + (input.soilType === 'Black' || input.soilType === 'Clay' ? 8 : 2))));
    const soyRev = 68000;
    recommendations.push({
      id: 'crop-rec-soybean',
      cropName: 'Soybean',
      variety: 'JS-335 / NRC-37 Organic',
      suitabilityScore: soySuitability,
      expectedYield: '1.2 - 1.5 tons/acre',
      estimatedDuration: '95 - 105 days',
      waterRequirement: 'Medium',
      fertilizerRequirement: 'NPK 20:60:40 kg/ha with Rhizobium seed inoculation',
      riskLevel: 'Low',
      expectedMarketDemand: 'Very High',
      estimatedRevenuePerAcre: soyRev,
      estimatedProfitPerAcre: Math.round(soyRev * 0.62),
      whyRecommended: `Soybean fixes atmospheric nitrogen, revitalizing soil organic carbon after ${input.previousCrop || 'previous crop'}. Given moderate rainfall and ${input.soilType} soil, this leguminous crop delivers reliable cash flow with guaranteed MSP procurement.`,
      growthTips: [
        'Seed treatment with Bradyrhizobium japonicum culture before sowing',
        'Maintain plant population at 4.5 lakh plants per hectare',
        'Avoid waterlogging during flowering and pod development'
      ]
    });
  }

  // Wheat / Cereal recommendation
  const wheatSuit = Math.min(98, Math.max(78, Math.round(92 + (input.season === 'Rabi' ? 6 : -4) + (ph >= 6.5 && ph <= 7.8 ? 3 : -3))));
  const wheatRev = 62000;
  recommendations.push({
    id: 'crop-rec-wheat',
    cropName: 'Wheat (Sharbati / HD-3226)',
    variety: 'HD-3226 Biofortified Rust-Resistant',
    suitabilityScore: wheatSuit,
    expectedYield: '2.4 - 2.8 tons/acre',
    estimatedDuration: '120 - 135 days',
    waterRequirement: input.irrigationType.includes('Drip') || input.irrigationType.includes('Sprinkler') ? 'Medium' : 'High',
    fertilizerRequirement: `NPK ${Math.round(n * 1.8)}:${Math.round(p * 1.3)}:${Math.round(k * 1.0)} kg/ha with split nitrogen application`,
    riskLevel: 'Low',
    expectedMarketDemand: 'High',
    estimatedRevenuePerAcre: wheatRev,
    estimatedProfitPerAcre: Math.round(wheatRev * 0.54),
    whyRecommended: `Excellent thermal adaptation for ${input.location} during cool growth periods. The soil profile (${input.soilType}) offers optimal root penetration and water holding capacity for high tillering and grain weight.`,
    growthTips: [
      'First irrigation at Crown Root Initiation (CRI) stage 21 days after sowing',
      'Foliar spray of 2% potassium nitrate (13:0:45) at boot and anthesis stages',
      'Harvest when grains become hard and moisture falls below 14%'
    ]
  });

  // High value crop: Mustard / Maize
  recommendations.push({
    id: 'crop-rec-mustard',
    cropName: 'Mustard (Brassica)',
    variety: 'Pusa Bold / Giriraj Premium',
    suitabilityScore: Math.round(86 + (input.waterAvailability === 'Limited' ? 7 : -2)),
    expectedYield: '1.0 - 1.3 tons/acre',
    estimatedDuration: '105 - 120 days',
    waterRequirement: 'Low',
    fertilizerRequirement: 'NPK 80:40:40 kg/ha + 20 kg Sulphur/ha',
    riskLevel: 'Low',
    expectedMarketDemand: 'Very High',
    estimatedRevenuePerAcre: 54000,
    estimatedProfitPerAcre: 36000,
    whyRecommended: `Low water requirement makes Mustard an exceptional water-saving rotation. High oil content commands premium APMC rates and requires minimal pesticide inputs.`,
    growthTips: [
      'Incorporate gypsum or elemental sulphur during land prep for high oil percentage',
      'Thinning at 15-20 days after germination to maintain 15cm inter-plant spacing',
      'Monitor for aphid infestation during cloudy winter weather'
    ]
  });

  return recommendations;
}

export async function getAiCropRecommendations(input: CropRecommendationInput): Promise<CropRecommendationItem[]> {
  if (!ai) {
    return generateHeuristicRecommendations(input);
  }

  try {
    const prompt = `You are a Senior Agronomist and Digital Agriculture AI specialist.
Analyze the following farm parameters and recommend the top 3-4 most viable, profitable, and ecologically sound crops:
- Location: ${input.location}
- Soil Type: ${input.soilType}
- Soil pH: ${input.soilPh}
- Nitrogen (N): ${input.nitrogen} kg/ha
- Phosphorus (P): ${input.phosphorus} kg/ha
- Potassium (K): ${input.potassium} kg/ha
- Ambient Temperature: ${input.temperature}°C
- Humidity: ${input.humidity}%
- Annual/Seasonal Rainfall: ${input.rainfall} mm
- Water Availability: ${input.waterAvailability}
- Season: ${input.season}
- Farm Area: ${input.farmArea} acres
- Previous Crop: ${input.previousCrop || 'None specified'}
- Irrigation Method: ${input.irrigationType}

Return a valid JSON array of 3-4 crop recommendation objects according to this schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert agronomist providing structured, highly scientific and actionable agricultural advice to farmers. Return only clean JSON conforming to the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              cropName: { type: Type.STRING },
              variety: { type: Type.STRING },
              suitabilityScore: { type: Type.NUMBER, description: 'Percentage 0 to 100' },
              expectedYield: { type: Type.STRING },
              estimatedDuration: { type: Type.STRING },
              waterRequirement: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
              fertilizerRequirement: { type: Type.STRING },
              riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
              expectedMarketDemand: { type: Type.STRING, enum: ['High', 'Very High', 'Moderate', 'Stable'] },
              estimatedRevenuePerAcre: { type: Type.NUMBER },
              estimatedProfitPerAcre: { type: Type.NUMBER },
              whyRecommended: { type: Type.STRING },
              growthTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: [
              'id', 'cropName', 'variety', 'suitabilityScore', 'expectedYield',
              'estimatedDuration', 'waterRequirement', 'fertilizerRequirement',
              'riskLevel', 'expectedMarketDemand', 'estimatedRevenuePerAcre',
              'estimatedProfitPerAcre', 'whyRecommended', 'growthTips'
            ]
          }
        }
      }
    });

    const text = response.text?.trim();
    if (!text) {
      return generateHeuristicRecommendations(input);
    }
    const parsed = JSON.parse(text) as CropRecommendationItem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return generateHeuristicRecommendations(input);
  } catch (err) {
    console.error('Gemini API recommendation error, falling back to agronomy heuristic:', err);
    return generateHeuristicRecommendations(input);
  }
}

// AI Pest & Disease Diagnosis Helper
export async function getAiPestDiagnosis(crop: string, symptom: string, stage: string): Promise<{
  diagnosis: string;
  probability: number;
  organicRemedy: string;
  chemicalRemedy: string;
  preventiveMeasures: string[];
}> {
  if (!ai) {
    return {
      diagnosis: `${crop} Leaf Curl Virus / Sucking Pest Stress`,
      probability: 91,
      organicRemedy: 'Neem oil spray (10,000 ppm) at 3ml/liter with 1g agricultural soap. Install yellow sticky traps (12-15 traps/acre).',
      chemicalRemedy: 'Imidacloprid 17.8% SL at 0.5ml per liter of water during vegetative or early flowering stage.',
      preventiveMeasures: [
        'Avoid over-application of synthetic nitrogen fertilizers which attract aphids and whiteflies',
        'Maintain clean field borders free of solanaceous weeds',
        'Regulate irrigation to prevent root moisture stagnation'
      ]
    };
  }

  try {
    const prompt = `Diagnose plant disease/pest for:
Crop: ${crop}
Growth Stage: ${stage}
Observed Symptoms: ${symptom}

Return structured JSON with diagnosis, probability (percentage), organicRemedy, chemicalRemedy, and preventiveMeasures array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            probability: { type: Type.NUMBER },
            organicRemedy: { type: Type.STRING },
            chemicalRemedy: { type: Type.STRING },
            preventiveMeasures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['diagnosis', 'probability', 'organicRemedy', 'chemicalRemedy', 'preventiveMeasures']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return parsed;
  } catch (err) {
    console.error('Gemini Pest Diagnosis error:', err);
    return {
      diagnosis: `${crop} Pathogenic/Nutrient Deficiency Syndrome`,
      probability: 85,
      organicRemedy: 'Spray fermented butter-milk (1:10 dilution) or Trichoderma viride culture.',
      chemicalRemedy: 'Mancozeb 75% WP at 2g/liter of water.',
      preventiveMeasures: ['Ensure field drainage', 'Balanced NPK feeding']
    };
  }
}
