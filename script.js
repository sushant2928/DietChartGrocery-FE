document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const pdfFileInput = document.getElementById('pdfFile');
    const resultDiv = document.getElementById('result');

    submitBtn.addEventListener('click', async () => {
        const file = pdfFileInput.files[0];
        if (!file) {
            alert('Please select a PDF file first');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', pdfFileInput.files[0]);

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Analyzing...';

            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            console.log(data)

            resultDiv.innerHTML = `
            <h3>Analysis Results:</h3>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Category</th>
                        <th>Required For</th>
                    </tr>
                </thead>
                <tbody>
                    ${data?.map(({ item, quantity, category, requiredFor }) => {
                return `
                            <tr>
                                <td>${item}</td>
                                <td>${quantity}</td>
                                <td>${category}</td>
                                <td>${requiredFor}</td>
                            </tr>
                        `;
            }).join('')}
                </tbody>
            </table>
        `;

            resultDiv.classList.add('show');

        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = `
                <h3>Error:</h3>
                <p>Something went wrong while analyzing the diet chart. Please try again.</p>
            `;
            resultDiv.classList.add('show');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Analyze Diet Chart';
        }
    });
});