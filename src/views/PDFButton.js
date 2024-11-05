import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFButton = () => {
    const handleDownloadPDF = () => {
        const input = document.getElementById('table-to-pdf');
        
        if (!input) {
            console.error('Elemento com id "table-to-pdf" não encontrado.');
            return;
        }

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 10; // Position for the title

            // Add title to PDF
            pdf.setFontSize(18); // Font size for the title
            pdf.text('Resultado da Consulta - SIPET', 60, position); // Text and position for the title

            position += 10; // Adjust position for the table

            // Add image of the table to PDF
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('tabela.pdf');
        }).catch((error) => {
            console.error('Erro ao gerar PDF:', error);
        });
    };

    return (
        <button onClick={handleDownloadPDF} className="btn btn-primary">
            Salvar como PDF
        </button>
    );
};

export default PDFButton;
