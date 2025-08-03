import natural from 'natural';
import compromise from 'compromise';


const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;


const specialtyKeywords = {
  'cardiology': ['heart', 'cardiac', 'chest pain', 'palpitation', 'blood pressure', 'hypertension'],
  'dermatology': ['skin', 'rash', 'acne', 'eczema', 'mole', 'dermatitis', 'psoriasis'],
  'orthopedics': ['bone', 'joint', 'fracture', 'arthritis', 'muscle', 'back pain', 'knee pain'],
  'neurology': ['headache', 'migraine', 'seizure', 'memory', 'dizziness', 'stroke', 'paralysis'],
  'gastroenterology': ['stomach', 'abdominal', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'acid reflux'],
  'pulmonology': ['breathing', 'cough', 'asthma', 'lung', 'shortness of breath', 'pneumonia'],
  'psychiatry': ['depression', 'anxiety', 'stress', 'mental health', 'insomnia', 'mood', 'panic'],
  'gynecology': ['menstrual', 'pregnancy', 'reproductive', 'pelvic', 'ovarian', 'cervical'],
  'pediatrics': ['child', 'infant', 'fever', 'vaccination', 'growth', 'development'],
  'ophthalmology': ['eye', 'vision', 'blurred vision', 'cataract', 'glaucoma', 'conjunctivitis'],
  'ent': ['ear', 'nose', 'throat', 'hearing', 'sinus', 'tonsil', 'voice'],
  'urology': ['kidney', 'bladder', 'urinary', 'prostate', 'stone', 'infection'],
  'endocrinology': ['diabetes', 'thyroid', 'hormone', 'insulin', 'glucose', 'metabolism'],
  'general': ['checkup', 'physical', 'routine', 'general', 'overall health']
};


const severityKeywords = {
  'high': ['severe', 'intense', 'excruciating', 'unbearable', 'acute', 'critical'],
  'medium': ['moderate', 'noticeable', 'persistent', 'ongoing', 'concerning'],
  'low': ['mild', 'slight', 'minor', 'occasional', 'light']
};

class MLService {
  constructor() {
    this.isInitialized = false;
    this.models = {};
    this.initialize();
  }

  async initialize() {
    try {
      console.log('Initializing ML Service...');
      
      
      this.models.doctorRecommendation = this.createRuleBasedRecommendationModel();
      this.models.appointmentDuration = this.createDurationPredictionModel();
      this.models.healthInsights = this.createHealthInsightsModel();
      
      this.isInitialized = true;
      console.log('ML Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ML Service:', error);
      this.isInitialized = false;
    }
  }

  
  preprocessText(text) {
    if (!text) return [];
    
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const stemmed = tokens.map(token => stemmer.stem(token));
    const filtered = stemmed.filter(token => token.length > 2);
    
    return filtered;
  }

  
  extractMedicalEntities(text) {
    const doc = compromise(text);
    
    return {
      symptoms: doc.match('#Noun').out('array'),
      bodyParts: doc.match('#BodyPart').out('array'),
      conditions: doc.match('#Condition').out('array'),
      duration: doc.match('#Duration').out('array')
    };
  }

  
  calculateSpecialtyScore(symptoms, specialtyKeywords) {
    let score = 0;
    const preprocessedSymptoms = symptoms.flatMap(s => this.preprocessText(s));
    
    specialtyKeywords.forEach(keyword => {
      const preprocessedKeywords = this.preprocessText(keyword);
      preprocessedKeywords.forEach(kw => {
        if (preprocessedSymptoms.includes(kw)) {
          score += 1;
        }
      });
    });
    
    return score;
  }

  
  createRuleBasedRecommendationModel() {
    return {
      predict: (symptoms, patientData = {}) => {
        const recommendations = [];
        
        Object.entries(specialtyKeywords).forEach(([specialty, keywords]) => {
          const score = this.calculateSpecialtyScore(symptoms, keywords);
          
          if (score > 0) {
            let confidence = Math.min(score / keywords.length, 1);
            
           
            if (patientData.age) {
              if (specialty === 'pediatrics' && patientData.age < 18) {
                confidence *= 1.5;
              } else if (specialty === 'geriatrics' && patientData.age > 65) {
                confidence *= 1.3;
              }
            }
            
            recommendations.push({
              specialty,
              confidence: Math.round(confidence * 100),
              matchedSymptoms: symptoms.filter(symptom => 
                keywords.some(keyword => symptom.toLowerCase().includes(keyword))
              )
            });
          }
        });
        
       
        return recommendations
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5);
      }
    };
  }

  
  createDurationPredictionModel() {
    return {
      predict: (appointmentData) => {
        let baseDuration = 30; 
        
        const { type, symptoms = [], reason = '', isFollowUp = false } = appointmentData;
        
        
        switch (type) {
          case 'emergency':
            baseDuration = 45;
            break;
          case 'consultation':
            baseDuration = 30;
            break;
          case 'follow-up':
            baseDuration = 20;
            break;
          case 'routine-checkup':
            baseDuration = 25;
            break;
        }
        
        
        const complexSymptoms = ['multiple symptoms', 'chronic pain', 'mental health'];
        const hasComplexSymptoms = symptoms.some(symptom => 
          complexSymptoms.some(complex => symptom.toLowerCase().includes(complex))
        );
        
        if (hasComplexSymptoms) {
          baseDuration += 15;
        }
        
        
        if (reason.length > 200) {
          baseDuration += 10;
        }
        
        
        if (isFollowUp) {
          baseDuration = Math.max(baseDuration - 10, 15);
        }
        
        return Math.min(baseDuration, 60); 
      }
    };
  }

  
  createHealthInsightsModel() {
    return {
      predict: (patientData) => {
        const insights = [];
        const { age, gender, medicalHistory = [], symptoms = [], bloodType } = patientData;
        
        
        if (age > 40) {
          insights.push({
            type: 'preventive',
            message: 'Consider regular health screenings for early detection of common conditions.',
            priority: 'medium',
            recommendations: ['Annual physical exam', 'Blood pressure monitoring', 'Cholesterol screening']
          });
        }
        
        if (age > 50) {
          insights.push({
            type: 'screening',
            message: 'Age-appropriate cancer screenings are recommended.',
            priority: 'high',
            recommendations: ['Mammography', 'Colonoscopy', 'Prostate screening (for men)']
          });
        }
        
        
        if (gender === 'female' && age >= 21) {
          insights.push({
            type: 'gynecological',
            message: 'Regular gynecological check-ups are important for women\'s health.',
            priority: 'medium',
            recommendations: ['Pap smear', 'Breast examination', 'HPV screening']
          });
        }
        
       
        const chronicConditions = medicalHistory.filter(h => h.status === 'chronic');
        if (chronicConditions.length > 0) {
          insights.push({
            type: 'chronic-care',
            message: 'Regular monitoring of chronic conditions is essential.',
            priority: 'high',
            recommendations: ['Medication adherence', 'Regular follow-ups', 'Lifestyle modifications']
          });
        }
        
        
        if (symptoms.length > 3) {
          insights.push({
            type: 'symptom-analysis',
            message: 'Multiple symptoms detected. Consider comprehensive evaluation.',
            priority: 'high',
            recommendations: ['Complete medical evaluation', 'Specialist consultation', 'Diagnostic tests']
          });
        }
        
        return insights;
      }
    };
  }

 
  async recommendDoctors(symptoms, patientData = {}) {
    if (!this.isInitialized) {
      throw new Error('ML Service not initialized');
    }
    
    try {
      const recommendations = this.models.doctorRecommendation.predict(symptoms, patientData);
      return recommendations;
    } catch (error) {
      console.error('Doctor recommendation error:', error);
      return [];
    }
  }

  async predictAppointmentDuration(appointmentData) {
    if (!this.isInitialized) {
      return 30; 
    }
    
    try {
      return this.models.appointmentDuration.predict(appointmentData);
    } catch (error) {
      console.error('Duration prediction error:', error);
      return 30; 
    }
  }

  async generateHealthInsights(patientData) {
    if (!this.isInitialized) {
      return [];
    }
    
    try {
      return this.models.healthInsights.predict(patientData);
    } catch (error) {
      console.error('Health insights error:', error);
      return [];
    }
  }

  
  analyzeSentiment(text) {
    const analyzer = new natural.SentimentAnalyzer('English', 
      natural.PorterStemmer, ['negation']);
    const tokens = tokenizer.tokenize(text.toLowerCase());
    
    const score = analyzer.getSentiment(tokens);
    
    let sentiment = 'neutral';
    if (score > 0.1) sentiment = 'positive';
    else if (score < -0.1) sentiment = 'negative';
    
    return {
      sentiment,
      score,
      confidence: Math.abs(score)
    };
  }
}


const mlService = new MLService();


export const recommendDoctors = (symptoms, patientData) => 
  mlService.recommendDoctors(symptoms, patientData);

export const predictAppointmentDuration = (appointmentData) => 
  mlService.predictAppointmentDuration(appointmentData);

export const generateHealthInsights = (patientData) => 
  mlService.generateHealthInsights(patientData);

export const analyzeSentiment = (text) => 
  mlService.analyzeSentiment(text);

export default mlService;
