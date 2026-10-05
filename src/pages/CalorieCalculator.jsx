import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Calculator.css';

const CalorieCalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.55');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState(null);

  const calculateCalories = (e) => {
    e.preventDefault();
    if (!age || !weight || !height) return;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    // Mifflin-St Jeor Equation
    let bmr = gender === 'male' 
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    const tdee = Math.round(bmr * parseFloat(activity));
    
    let targetCalories = tdee;
    if (goal === 'lose') targetCalories -= 500;
    if (goal === 'gain') targetCalories += 500;

    setResult({ bmr: Math.round(bmr), tdee, targetCalories });
  };

  return (
    <div className="calculator-page">
      <div className="container calculator-wrapper">
        <nav className="breadcrumb mb-4">
          <Link to="/">Home</Link> / <span>Tools</span> / <span className="active">Calorie Calculator</span>
        </nav>
        
        <h1 className="text-center mb-2">Calorie & TDEE <span>Calculator</span></h1>
        <p className="text-center mb-8">Calculate your exact daily calorie needs using the scientifically validated Mifflin-St Jeor equation. Designed for Indians with relevant food examples.</p>

        <div className="calculator-card">
          <form onSubmit={calculateCalories}>
            <div className="form-row">
              <div className="form-group">
                <label>Age (years)</label>
                <input type="number" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="e.g. 25" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <div className="radio-group" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} /> Male
                  </label>
                  <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} /> Female
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} required placeholder="e.g. 70" />
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" className="form-control" value={height} onChange={(e) => setHeight(e.target.value)} required placeholder="e.g. 170" />
              </div>
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select className="form-control" value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="1.2">Sedentary (Little or no exercise)</option>
                <option value="1.375">Lightly Active (Light exercise 1-3 days/week)</option>
                <option value="1.55">Moderately Active — Gym/sports 3-5 days/week</option>
                <option value="1.725">Very Active (Heavy exercise 6-7 days/week)</option>
                <option value="1.9">Extra Active (Very heavy exercise, physical job)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Your Goal</label>
              <select className="form-control" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight (Lean Bulk)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4">Calculate My Calories</button>
          </form>

          {result && (
            <div className="result-box mt-8">
              <div className="result-label" style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Your Daily Target</div>
              <div className="result-value" style={{ fontSize: '3.5rem' }}>{result.targetCalories}</div>
              <div className="result-label mb-6">Calories / Day</div>
              
              <div className="grid grid-cols-2 text-left" style={{ borderTop: '1px solid rgba(205, 215, 101, 0.3)', paddingTop: '1.5rem', gap: '1rem' }}>
                <div>
                  <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>Basal Metabolic Rate (BMR)</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{result.bmr} kcal</p>
                </div>
                <div>
                  <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>Total Daily Energy Exp. (TDEE)</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{result.tdee} kcal</p>
                </div>
              </div>
            </div>
          )}

          <div className="calculator-description">
            <h3>How This Calculator Works</h3>
            <p>This calculator uses the Mifflin-St Jeor equation, which is considered the most accurate formula for estimating Basal Metabolic Rate (BMR) by the Academy of Nutrition and Dietetics. It was developed in 1990 and has been validated across multiple studies.</p>
            
            <p><strong>For Males:</strong><br/>BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5</p>
            <p><strong>For Females:</strong><br/>BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161</p>
            
            <p>Your BMR is then multiplied by an activity factor to get your TDEE (Total Daily Energy Expenditure) — the total number of calories you burn in a day including all activities.</p>

            <h3 className="mt-6">Understanding Your Results</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-2"><strong style={{ color: 'var(--text-primary)' }}>BMR:</strong> Calories your body burns at complete rest (breathing, circulation, cell production).</li>
              <li className="mb-2"><strong style={{ color: 'var(--text-primary)' }}>TDEE:</strong> Your actual daily calorie burn including all movement and exercise.</li>
              <li className="mb-2"><strong style={{ color: 'var(--text-primary)' }}>Target Calories:</strong> The calories you should eat daily to reach your specific goal.</li>
            </ul>

            <h3 className="mt-6">Things to Keep in Mind</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-2">Indian meals tend to be carb-heavy (rice, roti). Be mindful of balancing with adequate protein from sources like dal, paneer, eggs, chicken, or whey.</li>
              <li className="mb-2">Cooking oil is a major source of hidden calories — 1 tablespoon of any oil is approximately 120 kcal. Be conscious of how much oil is used in preparation.</li>
              <li className="mb-2">Tea and coffee with sugar and milk can add up over the day. Each cup with 2 tsp sugar and full-fat milk is roughly 60-80 kcal.</li>
              <li className="mb-2">The same dish can vary significantly in calories depending on how it is prepared — a home-cooked meal vs. a restaurant version can differ by 200-400 kcal.</li>
              <li className="mb-2">Avoid oily foods, fried snacks, and heavy chutneys — they add significant calories without much nutritional benefit. If you enjoy chutney, Allam (ginger) chutney is a better option.</li>
            </ul>

            <h3 className="mt-6">Frequently Asked Questions</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', color: 'var(--accent-primary)', marginBottom: '2rem' }}>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">What is TDEE and how is it different from BMR?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">How accurate is the Mifflin-St Jeor equation?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">Should I eat below my BMR to lose weight?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">How many calories should an Indian male eat per day?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">How many calories should an Indian female eat per day?</li>
            </ul>

            <div className="disclaimer" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem' }}>
              <strong>Disclaimer:</strong> This calculator provides estimates based on the Mifflin-St Jeor equation and is intended for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Individual calorie needs can vary based on metabolism, medical conditions, medications, and other factors not accounted for by any formula. Always consult a qualified healthcare professional or registered dietitian before making significant changes to your diet, especially if you have diabetes, thyroid disorders, PCOS, or any other health condition. Results may vary from person to person.
            </div>

            <div className="mt-8 text-right">
              <Link to="/tools/macro" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Macro Calculator →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
