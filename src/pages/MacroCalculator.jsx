import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Calculator.css';

const MacroCalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.55');
  const [goal, setGoal] = useState('maintain');
  const [dietPref, setDietPref] = useState('non-veg');
  const [result, setResult] = useState(null);

  const calculateMacros = (e) => {
    e.preventDefault();
    if (!weight || !height || !age) return;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    let bmr = gender === 'male' 
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    let targetCalories = Math.round(bmr * parseFloat(activity));
    
    if (goal === 'cut') targetCalories -= 500;
    if (goal === 'bulk') targetCalories += 500;

    // Protein calculation based on goal and weight
    // Generally 1.6 - 2.2g per kg of bodyweight
    let proteinMultiplier = 1.8;
    if (goal === 'cut') proteinMultiplier = 2.2; // higher protein when cutting
    if (goal === 'bulk') proteinMultiplier = 2.0;

    const proteinGrams = Math.round(w * proteinMultiplier);
    const proteinCalories = proteinGrams * 4;

    // Fats usually 25-30% of total calories
    let fatPercentage = 0.25;
    const fatCalories = targetCalories * fatPercentage;
    const fatGrams = Math.round(fatCalories / 9);

    // Remaining is carbs
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);

    setResult({
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      totalCalories: targetCalories
    });
  };

  return (
    <div className="calculator-page">
      <div className="container calculator-wrapper">
        <nav className="breadcrumb mb-4">
          <Link to="/">Home</Link> / <span>Tools</span> / <span className="active">Macro Calculator</span>
        </nav>
        
        <h1 className="text-center mb-2">Macro Calculator <span>for Indians</span></h1>
        <p className="text-center mb-8">Calculate your exact daily protein, carbohydrates, and fat requirements. Get Indian food sources based on your diet preference.</p>

        <div className="calculator-card">
          <form onSubmit={calculateMacros}>
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
                <option value="1.2">Sedentary</option>
                <option value="1.375">Lightly Active</option>
                <option value="1.55">Moderately Active — Gym/sports 3-5 days/week</option>
                <option value="1.725">Very Active</option>
                <option value="1.9">Extra Active</option>
              </select>
            </div>

            <div className="form-group">
              <label>Your Goal</label>
              <select className="form-control" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="cut">Fat Loss (High protein to preserve muscle)</option>
                <option value="maintain">Maintain (Balanced macros)</option>
                <option value="bulk">Muscle Gain (Surplus for growth)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Diet Preference</label>
              <select className="form-control" value={dietPref} onChange={(e) => setDietPref(e.target.value)}>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4">Calculate My Macros</button>
          </form>

          {result && (
            <div className="result-box mt-8">
              <div className="result-label" style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                Daily Target: <strong style={{ color: 'var(--text-primary)' }}>{result.totalCalories} kcal</strong>
              </div>
              
              <div className="grid grid-cols-3">
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="result-value" style={{ fontSize: '2.5rem' }}>{result.protein}g</div>
                  <div className="result-label">Protein</div>
                </div>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="result-value" style={{ fontSize: '2.5rem', color: '#fff' }}>{result.carbs}g</div>
                  <div className="result-label">Carbs</div>
                </div>
                <div>
                  <div className="result-value" style={{ fontSize: '2.5rem', color: '#fff' }}>{result.fats}g</div>
                  <div className="result-label">Fats</div>
                </div>
              </div>
            </div>
          )}

          <div className="calculator-description">
            <h3>Understanding Macros for Indian Diets</h3>
            <p>Macronutrients (macros) are the three main categories of nutrients your body needs in large amounts: Protein, Carbohydrates, and Fats. Each plays a unique role in your body.</p>

            <h3 className="mt-6">Why Protein Matters Most</h3>
            <p>The average Indian diet is heavily carb-dominant (60-70% carbs) with inadequate protein (often only 40-50g/day). Research consistently shows that higher protein intake (1.6-2.2g/kg) is critical for:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-1">Preserving muscle during fat loss</li>
              <li className="mb-1">Building new muscle tissue</li>
              <li className="mb-1">Better satiety (feeling full longer)</li>
              <li className="mb-1">Higher thermic effect (burns more calories during digestion)</li>
              <li className="mb-1">Improved body composition over time</li>
            </ul>

            <h3 className="mt-6">The Indian Protein Problem</h3>
            <p>Most Indian meals are structured around carbs (rice, roti, paratha) with protein as a side dish. To hit adequate protein, you need to flip this — structure meals around protein sources first, then add carbs and fats. Common challenges:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-1"><strong>Dal alone is not enough</strong> — 1 cup cooked dal has only 14g protein but 40g carbs.</li>
              <li className="mb-1"><strong>Paneer is protein-rich but also high in fat</strong> (22g fat per 100g).</li>
              <li className="mb-1"><strong>Most "protein-rich" Indian snacks</strong> (chana, sprouts) have more carbs than protein.</li>
              <li className="mb-1"><strong>Whey protein supplementation</strong> is often necessary to bridge the gap affordably.</li>
            </ul>

            <h3 className="mt-6">How to Use This Calculator</h3>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <li className="mb-1">Enter your details and select your goal.</li>
              <li className="mb-1">Note down your protein target — this is the most important number.</li>
              <li className="mb-1">Plan your meals around protein sources first.</li>
              <li className="mb-1">Fill remaining calories with carbs and healthy fats.</li>
              <li className="mb-1">Re-calculate every 4-6 weeks as your weight changes.</li>
            </ol>

            <h3 className="mt-6">Frequently Asked Questions</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', color: 'var(--accent-primary)', marginBottom: '2rem' }}>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">How much protein do Indians need per day?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">Can vegetarians get enough protein in India?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">What is the ideal macro ratio for fat loss?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">Should I track macros or just calories?</li>
              <li className="mb-2 cursor-pointer border-b border-gray-800 pb-2">How often should I recalculate my macros?</li>
            </ul>

            <div className="disclaimer" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem' }}>
              <strong>Disclaimer:</strong> This macro calculator provides general estimates based on established nutritional science and is intended for informational purposes only. It is not medical or dietary advice. Individual requirements vary based on metabolic rate, health conditions, activity patterns, and other personal factors. Consult a qualified healthcare professional or registered dietitian before making significant dietary changes — especially if you have kidney disease, diabetes, liver conditions, eating disorders, or are pregnant/breastfeeding. Results are not guaranteed and may vary from person to person.
            </div>

            <div className="mt-8 text-left" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/tools/calorie" style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>← Calorie Calculator</Link>
              <Link to="/tools/1rm" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>1RM Calculator →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroCalculator;
