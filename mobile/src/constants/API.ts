// src/constants/API.ts

const DEV_API_URL = 'http://localhost:8000/api/v1'; 
const PROD_API_URL = 'https://seu-sistema-intercampi.com/api/v1';

export const API_URL = process.env.NODE_ENV === 'production' 
  ? PROD_API_URL 
  : DEV_API_URL;

export const MealTypes = {
  BREAKFAST: 'CB2025', 
  LUNCH: 'AL2025',
  AFTERNOON_SNACK: 'CT2025',
};