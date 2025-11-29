import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (data, title) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add timestamp
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 30);

    // Define columns, rows, and summary based on data type
    let columns = [];
    let rows = [];
    let summaryText = "";

    if (title.includes("Waste")) {
        const totalWaste = data.reduce((acc, item) => acc + item.plastic + item.paper + item.glass + item.organic + item.ewaste, 0);
        summaryText = `This report provides a comprehensive breakdown of waste management metrics. The total waste collected across all categories is ${totalWaste} tons. This data helps in tracking recycling efficiency and identifying areas for improvement in waste reduction strategies.`;

        columns = ["Month", "Plastic (tons)", "Paper (tons)", "Glass (tons)", "Organic (tons)", "E-Waste (tons)"];
        rows = data.map(item => [
            item.month,
            item.plastic,
            item.paper,
            item.glass,
            item.organic,
            item.ewaste
        ]);
    } else if (title.includes("Emissions")) {
        const totalEmissions = data.reduce((acc, item) => acc + item.emissions, 0);
        summaryText = `This report tracks carbon emissions across various sectors. The total recorded carbon emissions amount to ${totalEmissions} tons of CO2. Monitoring these figures is crucial for our goal of achieving carbon neutrality and implementing effective emission control measures.`;

        columns = ["Sector", "Emissions (tons CO2)"];
        rows = data.map(item => [
            item.sector,
            item.emissions
        ]);
    } else if (title.includes("Energy")) {
        const totalUsage = data.weekly.reduce((acc, item) => acc + item.usage, 0);
        summaryText = `This report details the energy consumption patterns over the recorded period. The total energy usage stands at ${totalUsage} kWh. Understanding these consumption trends is vital for optimizing energy distribution and promoting renewable energy adoption.`;

        columns = ["Day", "Usage (kWh)"];
        rows = data.weekly.map(item => [
            item.day,
            item.usage
        ]);
    } else if (title.includes("Water")) {
        const totalUsage = data.reduce((acc, item) => acc + item.usage, 0);
        summaryText = `This report outlines water usage statistics. The total water consumption recorded is ${totalUsage} Liters. Efficient water management is essential for sustainability, and this data serves as a baseline for conservation efforts.`;

        columns = ["Month", "Usage (L)"];
        rows = data.map(item => [
            item.month,
            item.usage
        ]);
    } else if (title.includes("Grid")) {
        const criticalCount = data.filter(item => item.status === 'Critical').length;
        const totalBlocks = data.length;
        summaryText = `This report presents the status of the community grid. Out of ${totalBlocks} monitored blocks, ${criticalCount} are currently flagged as 'Critical'. Immediate attention may be required for these areas to ensure grid stability and optimal resource allocation.`;

        columns = ["Block Name", "Status", "Usage (%)", "Row", "Col"];
        rows = data.map(item => [
            item.name,
            item.status,
            item.usage,
            item.row,
            item.col
        ]);
    }

    // Add summary text
    doc.setFontSize(10);
    doc.setTextColor(100);
    const splitText = doc.splitTextToSize(summaryText, 180);
    doc.text(splitText, 14, 40);

    // Calculate startY for table based on text height
    const textHeight = splitText.length * 5;
    const tableStartY = 45 + textHeight;

    // Add table
    autoTable(doc, {
        head: [columns],
        body: rows,
        startY: tableStartY,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [22, 163, 74] } // Primary green color
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
};

export const generateCSV = (data, filename) => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Determine headers and rows
    let headers = [];
    let rows = [];

    if (filename.includes("waste")) {
        headers = ["Month", "Plastic", "Paper", "Glass", "Organic", "E-Waste"];
        rows = data.map(item => [item.month, item.plastic, item.paper, item.glass, item.organic, item.ewaste]);
    } else if (filename.includes("emissions")) {
        headers = ["Sector", "Emissions"];
        rows = data.map(item => [item.sector, item.emissions]);
    } else if (filename.includes("energy")) {
        headers = ["Day", "Usage"];
        rows = data.weekly.map(item => [item.day, item.usage]);
    } else if (filename.includes("water")) {
        headers = ["Month", "Usage"];
        rows = data.map(item => [item.month, item.usage]);
    } else if (filename.includes("grid")) {
        headers = ["Block Name", "Status", "Usage", "Row", "Col"];
        rows = data.map(item => [item.name, item.status, item.usage, item.row, item.col]);
    }

    csvContent += headers.join(",") + "\r\n";
    rows.forEach(rowArray => {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
