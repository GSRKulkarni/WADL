const fs = require("fs");
const path = require("path");

const viewsDir = path.join(__dirname);

// ─── Read an HTML template file and replace placeholders ───
function renderTemplate(templateName, data = {}) {
  // Read layout
  let layoutHtml = fs.readFileSync(path.join(viewsDir, "layout.html"), "utf-8");

  // Read page content
  let pageHtml = fs.readFileSync(path.join(viewsDir, templateName), "utf-8");

  // Replace placeholders in the page content
  for (const key in data) {
    pageHtml = pageHtml.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }

  // Inject page content and title into layout
  layoutHtml = layoutHtml.replace("{{CONTENT}}", pageHtml);
  layoutHtml = layoutHtml.replace("{{TITLE}}", data.TITLE || "Student Marks");

  return layoutHtml;
}

// ─── Build full student table rows HTML ───
function buildTableRows(students, showActions = false) {
  if (!students || students.length === 0) {
    const cols = showActions ? 8 : 7;
    return `<tr><td colspan="${cols}" class="empty-state">No student records found.</td></tr>`;
  }
  return students
    .map(
      (s) => `<tr>
      <td>${s.Name}</td>
      <td>${s.Roll_No}</td>
      <td>${s.WAD_Marks}</td>
      <td>${s.DSBDA_Marks}</td>
      <td>${s.CNS_Marks}</td>
      <td>${s.CC_Marks}</td>
      <td>${s.AI_Marks}</td>
      ${showActions ? `<td><a href="/students/delete/${s._id}" class="btn btn-danger" onclick="return confirm('Delete ${s.Name}?')">Delete</a></td>` : ""}
    </tr>`
    )
    .join("");
}

// ─── Build name-only table rows HTML ───
function buildNameRows(students) {
  if (!students || students.length === 0) {
    return `<tr><td colspan="3" class="empty-state">No matching students found.</td></tr>`;
  }
  return students
    .map(
      (s, i) => `<tr>
      <td>${i + 1}</td>
      <td>${s.Name}</td>
      <td>${s.Roll_No}</td>
    </tr>`
    )
    .join("");
}

// ─── Build <option> tags for student dropdown ───
function buildOptions(students) {
  return students
    .map((s) => `<option value="${s._id}">${s.Name} (Roll: ${s.Roll_No})</option>`)
    .join("");
}

module.exports = { renderTemplate, buildTableRows, buildNameRows, buildOptions };
