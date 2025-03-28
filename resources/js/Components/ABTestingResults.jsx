import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ABTestingResults({ abTestResults, abTestQuestions, demographicRespondents }) {
    // Parse the questions data to get comparison details
    const getComparisonDetails = () => {
        if (!abTestQuestions || abTestQuestions.length === 0) {
            return {};
        }
        
        const questionsData = JSON.parse(abTestQuestions[0].questions_data);
        if (!questionsData.ab_testing) {
            return {};
        }
        
        const details = {};
        
        questionsData.ab_testing.forEach(group => {
            group.comparisons.forEach(comparison => {
                details[comparison.id] = {
                    title: comparison.title,
                    variant_a: comparison.variant_a,
                    variant_b: comparison.variant_b
                };
            });
        });
        
        return details;
    };
    
    const comparisonDetails = getComparisonDetails();
    
    // Generate demographic charts
    const generateDemographicCharts = () => {
        if (!demographicRespondents) {
            return <div className="alert alert-warning">No demographic data available</div>;
        }
        
        const charts = [];
        
        // Process each demographic category
        Object.entries(demographicRespondents).forEach(([category, data]) => {
            const labels = Object.keys(data);
            const values = Object.values(data);
            
            const chartData = {
                labels,
                datasets: [
                    {
                        label: category.charAt(0).toUpperCase() + category.slice(1),
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
            
            charts.push(
                <div key={category} className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5>{category.charAt(0).toUpperCase() + category.slice(1)} Distribution</h5>
                        </div>
                        <div className="card-body">
                            <div style={{ height: '300px' }}>
                                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        
        return (
            <div className="row">
                {charts}
            </div>
        );
    };
    
    // Generate A/B test result charts
    const generateABTestCharts = () => {
        if (!abTestResults || Object.keys(abTestResults).length === 0) {
            return <div className="alert alert-warning">No A/B testing results available</div>;
        }
        
        const groups = [];
        
        Object.entries(abTestResults).forEach(([groupName, comparisons]) => {
            const groupComparisons = [];
            
            Object.entries(comparisons).forEach(([comparisonId, data]) => {
                const comparison = comparisonDetails[comparisonId];
                if (!comparison) return;
                
                const chartData = {
                    labels: [comparison.variant_a.title, comparison.variant_b.title],
                    datasets: [
                        {
                            label: 'Preferences',
                            data: [data.a, data.b],
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 99, 132, 0.6)',
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 99, 132, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                };
                
                // Create a bar chart for this comparison
                groupComparisons.push(
                    <div key={comparisonId} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5>{comparison.title}</h5>
                            </div>
                            <div className="card-body">
                                <div style={{ height: '300px' }}>
                                    <Bar 
                                        data={chartData} 
                                        options={{
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Number of Respondents'
                                                    }
                                                }
                                            },
                                            plugins: {
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            const label = context.dataset.label || '';
                                                            const value = context.parsed.y;
                                                            const total = data.total;
                                                            const percentage = Math.round((value / total) * 100);
                                                            return `${label}: ${value} (${percentage}%)`;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                
                                <div className="mt-3">
                                    <h6>Results:</h6>
                                    <p>
                                        <strong>{comparison.variant_a.title}:</strong> {data.a} votes ({data.a_percentage}%)<br />
                                        <strong>{comparison.variant_b.title}:</strong> {data.b} votes ({data.b_percentage}%)
                                    </p>
                                    
                                    {data.reasons_a.length > 0 && (
                                        <div className="mt-2">
                                            <h6>Reasons for choosing {comparison.variant_a.title}:</h6>
                                            <ul className="list-group">
                                                {data.reasons_a.map((reason, index) => (
                                                    <li key={index} className="list-group-item">{reason}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {data.reasons_b.length > 0 && (
                                        <div className="mt-2">
                                            <h6>Reasons for choosing {comparison.variant_b.title}:</h6>
                                            <ul className="list-group">
                                                {data.reasons_b.map((reason, index) => (
                                                    <li key={index} className="list-group-item">{reason}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
            
            groups.push(
                <div key={groupName} className="mb-5">
                    <h4 className="mb-3">{groupName}</h4>
                    <div className="row">
                        {groupComparisons}
                    </div>
                </div>
            );
        });
        
        return groups;
    };
    
    return (
        <div>
            <h3 className="mb-4">Demographics</h3>
            {generateDemographicCharts()}
            
            <h3 className="mb-4 mt-5">A/B Testing Results</h3>
            {generateABTestCharts()}
        </div>
    );
}