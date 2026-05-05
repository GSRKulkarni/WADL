document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/employees')
    .then(response => response.json())
    .then(employees => {
      const directory = document.getElementById('employeeDirectory');
      employees.forEach(employee => {
        const div = document.createElement('div');
        div.className = 'employee';
        div.innerHTML = `
          <img src="${employee.profile_image}" alt="${employee.name}" />
          <h3>${employee.name}</h3>
          <p><strong>Designation:</strong> ${employee.designation}</p>
          <p><strong>Department:</strong> ${employee.department}</p>
          <p><strong>Salary:</strong> $${employee.salary.toLocaleString()}</p>
        `;
        directory.appendChild(div);
      });
    })
    .catch(error => console.error('Failed to load employee data:', error));
});
