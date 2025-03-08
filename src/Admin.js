import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import './Admin.css'; // import the CSS file for styles

const Admin = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === 'zachisking') {
      setAuthorized(true);
    } else {
      alert('Incorrect admin password.');
    }
  };

  useEffect(() => {
    if (authorized) {
      setLoading(true);
      const fetchData = async () => {
        const { data, error } = await supabase.from('Main').select('*');
        if (error) {
          alert('Error fetching data: ' + error.message);
        } else {
          setProfiles(data);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [authorized]);

  // Render meal times in a more readable format
  const renderMealTimes = (mealTimes) => {
    if (!mealTimes) return null;
    return Object.entries(mealTimes).map(([day, meals]) => {
      // Filter only the meals that have times
      const validMeals = Object.entries(meals)
        .filter(([, times]) => Array.isArray(times) && times.length > 0)
        .map(([meal, times]) => (
          <div key={meal} className="meal">
            <span className="meal-label">{meal}:</span> {times.join(', ')}
          </div>
        ));
      if (validMeals.length > 0) {
        return (
          <div key={day} className="meal-day">
            <div className="day-label">{day}:</div>
            <div className="meals-container">{validMeals}</div>
          </div>
        );
      }
      return null;
    });
  };

  if (!authorized) {
    return (
      <div className="admin-container">
        <h2>Admin Login</h2>
        <form onSubmit={handlePasswordSubmit} className="login-form">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter admin password"
            className="password-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="table-wrapper">
          <table className="profiles-table">
            <thead>
              <tr>
                {/* <th>ID</th>
                <th>Auth ID</th> */}
                <th>Name</th>
                <th>Email</th>
                <th>Majors</th>
                <th>Class Level</th>
                <th>Interests</th>
                <th>Meal Plan</th>
                <th>Guest Swipe</th>
                <th>Dining Locations</th>
                <th>Meal Times</th>
                <th>Personality</th>
                <th>Preferences</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  {/* <td>{profile.id}</td>
                  <td>{profile.auth_id}</td> */}
                  <td>{profile.name}</td>
                  <td>{profile.email}</td>
                  <td>
                    {Array.isArray(profile.majors)
                      ? profile.majors.join(', ')
                      : ''}
                  </td>
                  <td>{profile.class_level}</td>
                  <td>
                    {Array.isArray(profile.interests)
                      ? profile.interests.join(', ')
                      : ''}
                  </td>
                  <td>{profile.meal_plan ? 'Yes' : 'No'}</td>
                  <td>{profile.guest_swipe ? 'Yes' : 'No'}</td>
                  <td>
                    {Array.isArray(profile.preferred_dining_locations)
                      ? profile.preferred_dining_locations.join(', ')
                      : ''}
                  </td>
                  <td>
                    {profile.meal_times
                      ? renderMealTimes(profile.meal_times)
                      : ''}
                  </td>
                  <td>
                    <div>Type: {profile.personality_type || 'N/A'}</div>
                    <div>Humor: {profile.humor_type || 'N/A'}</div>
                    <div>Convo: {profile.conversation_type || 'N/A'}</div>
                    <div>Planning: {profile.planner_type || 'N/A'}</div>
                    <div>HP House: {profile.hp_house || 'N/A'}</div>
                  </td>
                  <td>{profile.match_preference || 'N/A'}</td>
                  <td>{profile.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
