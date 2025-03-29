import React, { useState } from "react";

export default function WcagIssuesList({ issues }) {
    const [filter, setFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter issues based on impact level, conformance level, and search term
    const filteredIssues = issues.filter(issue => {
        const matchesImpact = filter === 'all' || issue.impact === filter;
        const matchesLevel = levelFilter === 'all' || issue.conformance_level === levelFilter;
        const matchesSearch = searchTerm === '' ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.wcag_criterion.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesImpact && matchesLevel && matchesSearch;
    });

    // Count issues by impact
    const counts = {
        all: issues.length,
        critical: issues.filter(i => i.impact === 'critical').length,
        serious: issues.filter(i => i.impact === 'serious').length,
        moderate: issues.filter(i => i.impact === 'moderate').length,
        minor: issues.filter(i => i.impact === 'minor').length
    };

    // Count issues by level
    const levelCounts = {
        all: issues.length,
        A: issues.filter(i => i.conformance_level === 'A').length,
        AA: issues.filter(i => i.conformance_level === 'AA').length,
        AAA: issues.filter(i => i.conformance_level === 'AAA').length
    };

    // Get appropriate badge color for impact level
    const getImpactColor = (impact) => {
        switch (impact) {
            case 'critical': return 'danger';
            case 'serious': return 'warning';
            case 'moderate': return 'info';
            case 'minor': return 'secondary';
            default: return 'primary';
        }
    };

    // Get appropriate badge color for conformance level
    const getLevelColor = (level) => {
        switch (level) {
            case 'A': return 'danger';
            case 'AA': return 'warning';
            case 'AAA': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="btn-group w-100">
                        <button
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilter('all')}
                        >
                            All ({counts.all})
                        </button>
                        <button
                            className={`btn ${filter === 'critical' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => setFilter('critical')}
                        >
                            Critical ({counts.critical})
                        </button>
                        <button
                            className={`btn ${filter === 'serious' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => setFilter('serious')}
                        >
                            Serious ({counts.serious})
                        </button>
                        <button
                            className={`btn ${filter === 'moderate' ? 'btn-info' : 'btn-outline-info'}`}
                            onClick={() => setFilter('moderate')}
                        >
                            Moderate ({counts.moderate})
                        </button>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="btn-group w-100">
                        <button
                            className={`btn ${levelFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setLevelFilter('all')}
                        >
                            All Levels
                        </button>
                        <button
                            className={`btn ${levelFilter === 'A' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => setLevelFilter('A')}
                        >
                            A ({levelCounts.A})
                        </button>
                        <button
                            className={`btn ${levelFilter === 'AA' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => setLevelFilter('AA')}
                        >
                            AA ({levelCounts.AA})
                        </button>
                        <button
                            className={`btn ${levelFilter === 'AAA' ? 'btn-info' : 'btn-outline-info'}`}
                            onClick={() => setLevelFilter('AAA')}
                        >
                            AAA ({levelCounts.AAA})
                        </button>
                    </div>
                </div>
            </div>

            {filteredIssues.length === 0 ? (
                <div className="alert alert-info">
                    No issues match your current filters.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Impact</th>
                                <th>Level</th>
                                <th>Description</th>
                                <th>WCAG Criterion</th>
                                <th>Location</th>
                                <th>Element</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map((issue, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className={`badge bg-${getImpactColor(issue.impact)}`}>
                                            {issue.impact}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${getLevelColor(issue.conformance_level)}`}>
                                            {issue.conformance_level || 'A'}
                                        </span>
                                    </td>
                                    <td>{issue.description}</td>
                                    <td>
                                        <a
                                            href={`https://www.w3.org/WAI/WCAG21/Understanding/${issue.wcag_criterion.split(', ')[0].replace('.', '-')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {issue.wcag_criterion}
                                        </a>
                                    </td>
                                    <td>{issue.location}</td>
                                    <td>
                                        <code className="small">{issue.element}</code>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
