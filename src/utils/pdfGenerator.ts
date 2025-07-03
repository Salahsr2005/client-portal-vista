import { Destination } from '@/hooks/useDestinations';

export const generateDestinationPDF = async (destination: Destination): Promise<void> => {
  try {
    // Create a simple HTML structure for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${destination.name} - Study Destination Brochure</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #007bff;
              margin: 0;
              font-size: 2.5em;
            }
            .header p {
              color: #666;
              font-size: 1.2em;
              margin: 10px 0;
            }
            .section {
              margin: 30px 0;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .section h2 {
              color: #007bff;
              border-bottom: 2px solid #007bff;
              padding-bottom: 10px;
            }
            .tuition-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .tuition-table th,
            .tuition-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .tuition-table th {
              background-color: #f8f9fa;
              font-weight: bold;
            }
            .highlight {
              background-color: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .stat {
              text-align: center;
            }
            .stat-value {
              font-size: 2em;
              font-weight: bold;
              color: #007bff;
            }
            .stat-label {
              color: #666;
              font-size: 0.9em;
            }
            .document-list {
              list-style-type: none;
              padding: 0;
            }
            .document-list li {
              background-color: #f8f9fa;
              margin: 5px 0;
              padding: 10px;
              border-radius: 5px;
              border-left: 4px solid #007bff;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${destination.name}</h1>
            <p>${destination.country} • ${destination.procedure_type}</p>
            <p>${destination.description || 'Your gateway to international education'}</p>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-value">${destination.admission_success_rate || 'N/A'}%</div>
              <div class="stat-label">Admission Success Rate</div>
            </div>
            <div class="stat">
              <div class="stat-value">${destination.visa_success_rate || 'N/A'}%</div>
              <div class="stat-label">Visa Success Rate</div>
            </div>
            <div class="stat">
              <div class="stat-value">${destination.processing_time || 'N/A'}</div>
              <div class="stat-label">Processing Time</div>
            </div>
          </div>

          <div class="section">
            <h2>Available Programs</h2>
            <p>We offer the following program levels at ${destination.name}:</p>
            <ul>
              ${destination.available_programs?.map(program => `<li><strong>${program}</strong></li>`).join('') || '<li>Please contact us for program details</li>'}
            </ul>
          </div>

          ${destination.bachelor_tuition_min || destination.master_tuition_min || destination.phd_tuition_min ? `
          <div class="section">
            <h2>Tuition Fees (Annual)</h2>
            <table class="tuition-table">
              <thead>
                <tr>
                  <th>Program Level</th>
                  <th>Tuition Range</th>
                  <th>Academic Level Required</th>
                </tr>
              </thead>
              <tbody>
                ${destination.bachelor_tuition_min ? `
                <tr>
                  <td>Bachelor</td>
                  <td>€${destination.bachelor_tuition_min?.toLocaleString()} - €${destination.bachelor_tuition_max?.toLocaleString()}</td>
                  <td>${destination.bachelor_academic_level || 'Standard'}</td>
                </tr>
                ` : ''}
                ${destination.master_tuition_min ? `
                <tr>
                  <td>Master</td>
                  <td>€${destination.master_tuition_min?.toLocaleString()} - €${destination.master_tuition_max?.toLocaleString()}</td>
                  <td>${destination.master_academic_level || 'Standard'}</td>
                </tr>
                ` : ''}
                ${destination.phd_tuition_min ? `
                <tr>
                  <td>PhD</td>
                  <td>€${destination.phd_tuition_min?.toLocaleString()} - €${destination.phd_tuition_max?.toLocaleString()}</td>
                  <td>${destination.phd_academic_level || 'Standard'}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="section">
            <h2>Application Requirements</h2>
            ${destination.bachelor_requirements ? `
            <h3>Bachelor Programs</h3>
            <p>${destination.bachelor_requirements}</p>
            ${destination.bachelor_documents?.length ? `
            <h4>Required Documents:</h4>
            <ul class="document-list">
              ${destination.bachelor_documents.map(doc => `<li>${doc}</li>`).join('')}
            </ul>
            ` : ''}
            ` : ''}

            ${destination.master_requirements ? `
            <h3>Master Programs</h3>
            <p>${destination.master_requirements}</p>
            ${destination.master_documents?.length ? `
            <h4>Required Documents:</h4>
            <ul class="document-list">
              ${destination.master_documents.map(doc => `<li>${doc}</li>`).join('')}
            </ul>
            ` : ''}
            ` : ''}

            ${destination.phd_requirements ? `
            <h3>PhD Programs</h3>
            <p>${destination.phd_requirements}</p>
            ${destination.phd_documents?.length ? `
            <h4>Required Documents:</h4>
            <ul class="document-list">
              ${destination.phd_documents.map(doc => `<li>${doc}</li>`).join('')}
            </ul>
            ` : ''}
            ` : ''}
          </div>

          ${destination.language_requirements ? `
          <div class="section">
            <h2>Language Requirements</h2>
            <p>${destination.language_requirements}</p>
          </div>
          ` : ''}

          ${destination.intake_periods?.length ? `
          <div class="section">
            <h2>Intake Periods</h2>
            <p>Applications are accepted for the following intake periods:</p>
            <ul>
              ${destination.intake_periods.map(period => `<li>${period}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${destination.agency_services?.length ? `
          <div class="section">
            <h2>Our Services</h2>
            <p>We provide comprehensive support services including:</p>
            <ul>
              ${destination.agency_services.map(service => `<li>${service.replace('_', ' ')}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="section">
            <h2>Application Fees</h2>
            <div class="highlight">
              ${destination.application_fee ? `<p><strong>Application Fee:</strong> €${destination.application_fee}</p>` : ''}
              ${destination.service_fee ? `<p><strong>Service Fee:</strong> €${destination.service_fee}</p>` : ''}
              ${destination.visa_processing_fee ? `<p><strong>Visa Processing Fee:</strong> €${destination.visa_processing_fee}</p>` : ''}
              <p><strong>Processing Time:</strong> ${destination.processing_time || 'Contact us for details'}</p>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>For more information and to apply, visit our website or contact our admissions team.</p>
            <p><strong>Euro Visa Services</strong> - Your trusted partner in international education</p>
          </div>
        </body>
      </html>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Failed to open print window. Please check your popup blocker settings.');
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateProgramPDF = async (program: any): Promise<void> => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${program.name} - Program Brochure</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #007bff;
              margin: 0;
              font-size: 2.5em;
            }
            .header p {
              color: #666;
              font-size: 1.2em;
              margin: 10px 0;
            }
            .section {
              margin: 30px 0;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .section h2 {
              color: #007bff;
              border-bottom: 2px solid #007bff;
              padding-bottom: 10px;
            }
            .highlight {
              background-color: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .stats {
              display: flex;
              justify-content: space-around;
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .stat {
              text-align: center;
            }
            .stat-value {
              font-size: 1.8em;
              font-weight: bold;
              color: #007bff;
            }
            .stat-label {
              color: #666;
              font-size: 0.9em;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${program.name}</h1>
            <p>${program.university} • ${program.city}, ${program.country}</p>
            <p>${program.study_level} • ${program.field}</p>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-value">€${program.tuition_min?.toLocaleString()}-${program.tuition_max?.toLocaleString()}</div>
              <div class="stat-label">Annual Tuition</div>
            </div>
            <div class="stat">
              <div class="stat-value">${program.duration_months} months</div>
              <div class="stat-label">Duration</div>
            </div>
            <div class="stat">
              <div class="stat-value">${program.success_rate || 'N/A'}%</div>
              <div class="stat-label">Success Rate</div>
            </div>
          </div>

          <div class="section">
            <h2>Program Description</h2>
            <p>${program.description || 'This program offers comprehensive education in your chosen field.'}</p>
          </div>

          <div class="section">
            <h2>Program Details</h2>
            <div class="highlight">
              <p><strong>Language:</strong> ${program.program_language}</p>
              <p><strong>Duration:</strong> ${program.duration_months} months</p>
              <p><strong>Study Level:</strong> ${program.study_level}</p>
              <p><strong>Field:</strong> ${program.field}</p>
              ${program.ranking ? `<p><strong>University Ranking:</strong> #${program.ranking}</p>` : ''}
            </div>
          </div>

          <div class="section">
            <h2>Admission Requirements</h2>
            <p>${program.admission_requirements || 'Standard admission requirements apply.'}</p>
            ${program.gpa_requirement ? `<p><strong>Minimum GPA:</strong> ${program.gpa_requirement}</p>` : ''}
            ${program.language_test ? `<p><strong>Language Test:</strong> ${program.language_test} ${program.language_test_score || ''}</p>` : ''}
          </div>

          <div class="section">
            <h2>Costs & Financial Information</h2>
            <p><strong>Tuition Fees:</strong> €${program.tuition_min?.toLocaleString()} - €${program.tuition_max?.toLocaleString()} per year</p>
            <p><strong>Living Costs:</strong> €${program.living_cost_min?.toLocaleString()} - €${program.living_cost_max?.toLocaleString()} per year</p>
            ${program.application_fee ? `<p><strong>Application Fee:</strong> €${program.application_fee}</p>` : ''}
            ${program.scholarship_available ? `
            <div class="highlight">
              <h3>Scholarship Available!</h3>
              <p>This program offers scholarship opportunities. ${program.scholarship_details || 'Contact us for more details.'}</p>
              ${program.scholarship_amount ? `<p><strong>Scholarship Amount:</strong> €${program.scholarship_amount}</p>` : ''}
            </div>
            ` : ''}
          </div>

          ${program.advantages ? `
          <div class="section">
            <h2>Program Advantages</h2>
            <p>${program.advantages}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>For more information and to apply, visit our website or contact our admissions team.</p>
            <p><strong>Euro Visa Services</strong> - Your trusted partner in international education</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Failed to open print window. Please check your popup blocker settings.');
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };

  } catch (error) {
    console.error('Error generating program PDF:', error);
    throw error;
  }
};