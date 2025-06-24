// JavaScript Example: Reading Entities
// Filterable fields: title, student_id, trainer_id, description, duration_weeks, exercises, status, start_date, end_date
async function fetchWorkoutPlanEntities() {
  const response = await fetch(`https://app.base44.com/api/apps/685a9b935e6afc09158ab5c6/entities/WorkoutPlan`, {
      headers: {
          'api_key': '59dae4b7cc784e13ab7ae95cec0c0236', // or use await User.me() to get the API key
          'Content-Type': 'application/json'
      }
  });
  const data = await response.json();
  console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: title, student_id, trainer_id, description, duration_weeks, exercises, status, start_date, end_date
async function updateWorkoutPlanEntity(entityId, updateData) {
  const response = await fetch(`https://app.base44.com/api/apps/685a9b935e6afc09158ab5c6/entities/WorkoutPlan/${entityId}`, {
      method: 'PUT',
      headers: {
          'api_key': '59dae4b7cc784e13ab7ae95cec0c0236', // or use await User.me() to get the API key
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
  });
  const data = await response.json();
  console.log(data);
}