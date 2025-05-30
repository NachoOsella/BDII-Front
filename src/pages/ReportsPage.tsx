import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
    getEnrichedTodoHistory,
    getCompletedTasksPerWeek,
    getCompletedTasksRanking,
    getMostActiveDayOfWeek,
    getCreatedTasksByMonth
} from '../services/reportsService';
import type {
    EnrichedTodoHistoryItem,
    CompletedTasksWeekReport,
    UserCompletedRanking,
    MostActiveDayReport,
    CreatedTasksByMonth
} from '../types/reports';

const ReportsPage: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para los diferentes reportes
    const [history, setHistory] = useState<EnrichedTodoHistoryItem[]>([]);
    const [weeklyReport, setWeeklyReport] = useState<CompletedTasksWeekReport | null>(null);
    const [ranking, setRanking] = useState<UserCompletedRanking[]>([]);
    const [mostActiveDay, setMostActiveDay] = useState<MostActiveDayReport | null>(null);
    const [monthlyTasks, setMonthlyTasks] = useState<CreatedTasksByMonth>({});

    const [activeTab, setActiveTab] = useState<string>('overview');

    useEffect(() => {
        const fetchReports = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            setError(null);

            try {
                const [
                    historyData,
                    weeklyData,
                    rankingData,
                    activeDayData,
                    monthlyData
                ] = await Promise.all([
                    getEnrichedTodoHistory(user.id),
                    getCompletedTasksPerWeek(user.id),
                    getCompletedTasksRanking(),
                    getMostActiveDayOfWeek(user.id),
                    getCreatedTasksByMonth(user.id)
                ]);

                setHistory(historyData);
                setWeeklyReport(weeklyData);
                setRanking(rankingData);
                setMostActiveDay(activeDayData);
                setMonthlyTasks(monthlyData);
            } catch (err) {
                setError('Error al cargar los reportes.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMonthYear = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        });
    };

    const formatDayName = (day: string | null) => {
        if (!day) return 'N/A';
        const dayNames: { [key: string]: string } = {
            'MONDAY': 'Lunes',
            'TUESDAY': 'Martes',
            'WEDNESDAY': 'Miércoles',
            'THURSDAY': 'Jueves',
            'FRIDAY': 'Viernes',
            'SATURDAY': 'Sábado',
            'SUNDAY': 'Domingo'
        };
        return dayNames[day] || day;
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATED': return <div className="icon-circle" />;
            case 'COMPLETED': return <span className="icon-check"></span>;
            case 'UPDATED': return <div className="icon-circle icon-dim" />;
            case 'DELETED': return <span className="icon-cross"></span>;
            default: return <div className="icon-circle icon-faded" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATED': return 'var(--color-success)';
            case 'COMPLETED': return 'var(--color-primary)';
            case 'UPDATED': return 'var(--color-warning)';
            case 'DELETED': return 'var(--color-error)';
            default: return 'var(--color-secondary)';
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Cargando reportes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <div className="reports-container fade-in">
            <div className="reports-header">
                <h1>Panel de Reportes</h1>
                <p>Analiza tu productividad y progreso</p>
            </div>

            {/* Resumen General */}
            {activeTab === 'overview' && (
                <div className="slide-up">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{weeklyReport?.completedThisWeek || 0}</div>
                            <div className="stat-label">Tareas completadas esta semana</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-value">
                                {ranking.findIndex(r => r.username === user?.username) + 1 || 'N/A'}
                            </div>
                            <div className="stat-label">Tu posición en el ranking</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-value">{formatDayName(mostActiveDay?.mostActiveDay || null)}</div>
                            <div className="stat-label">Tu día más productivo</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-value">{history.length}</div>
                            <div className="stat-label">Total de actividades</div>
                        </div>
                    </div>

                    {/* Actividad Reciente */}
                    <div className="card">
                        <h3 className="card-title">Actividad Reciente</h3>
                        <div className="activity-list">
                            {history.slice(0, 5).map((item) => (
                                <div key={item.id} className="activity-item">
                                    <div className="activity-content">
                                        <div className="activity-text">{item.actionDescription}</div>
                                        <div className="activity-meta">
                                            <span
                                                className="activity-action"
                                                style={{ '--dynamic-color': getActionColor(item.action) } as React.CSSProperties}
                                            >
                                                {getActionIcon(item.action)} {item.action}
                                            </span>
                                            <span className="activity-date">{formatDate(item.actionAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs de navegación */}
            <div className="tabs">
                {[
                    { key: 'overview', label: 'Resumen' },
                    { key: 'ranking', label: 'Ranking' },
                    { key: 'monthly', label: 'Mensual' },
                    { key: 'history', label: 'Historial' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Contenido de los tabs */}
            {activeTab === 'ranking' && (
                <div className="chart-container fade-in">
                    <h3 className="chart-title">Ranking Global de Productividad</h3>
                    {ranking.length > 0 ? (
                        <div className="ranking-list stagger-animation">
                            {ranking.map((userRank, index) => (
                                <div
                                    key={userRank.username}
                                    className={`ranking-item micro-bounce ${userRank.username === user?.username ? 'user-highlight' : ''}`}
                                >
                                    <div className="ranking-position">
                                        {index === 0 ? (
                                            <span className="status-indicator status-completed">1°</span>
                                        ) : index === 1 ? (
                                            <span className="status-indicator status-pending">2°</span>
                                        ) : index === 2 ? (
                                            <span className="status-indicator status-error">3°</span>
                                        ) : (
                                            <span className="ranking-number">#{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="ranking-user">
                                        {userRank.username}
                                        {userRank.username === user?.username && <span className="status-indicator status-completed">Tú</span>}
                                    </div>
                                    <div className="ranking-score">
                                        {userRank.completedTasks} tareas
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <div className="icon-circle-large" />
                            </div>
                            <h3>No hay datos de ranking</h3>
                            <p>Completa algunas tareas para aparecer en el ranking</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'monthly' && (
                <div className="chart-container fade-in">
                    <h3 className="chart-title">Tareas Creadas por Mes</h3>
                    {Object.keys(monthlyTasks).length > 0 ? (
                        <div className="monthly-chart stagger-animation">
                            {Object.entries(monthlyTasks)
                                .sort(([a], [b]) => b.localeCompare(a)) // Keep sort by YYYY-MM for correct chronological order
                                .map(([month, count]: [string, number]) => (
                                    <div key={month} className="monthly-item micro-bounce">
                                        <div className="month-label">{formatMonthYear(month)}</div>
                                        <div className="month-bar-container">
                                            <div
                                                className="month-bar glow-effect"
                                                style={{
                                                    width: `${Math.max((count / Math.max(...Object.values(monthlyTasks))) * 100, 5)}%`
                                                }}
                                            />
                                            <span className="month-count">{count}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <div className="icon-circle-large" />
                            </div>
                            <h3>No hay datos mensuales</h3>
                            <p>Crea algunas tareas para ver las estadísticas mensuales</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="chart-container fade-in">
                    <h3 className="chart-title">Historial Completo de Actividades</h3>
                    {history.length > 0 ? (
                        <div className="history-list stagger-animation">
                            {history.slice(0, 50).map((item) => (
                                <div key={item.id} className="history-item micro-bounce">
                                    <div
                                        className="history-icon dynamic-color"
                                        style={{ '--dynamic-color': getActionColor(item.action) } as React.CSSProperties}
                                    >
                                        {getActionIcon(item.action)}
                                    </div>
                                    <div className="history-content">
                                        <div className="history-header">
                                            <span className="history-text">{item.text}</span>
                                            <span className="history-date">{formatDate(item.actionAt)}</span>
                                        </div>
                                        <div className="history-meta">
                                            <span
                                                className="history-action dynamic-color"
                                                style={{ '--dynamic-color': getActionColor(item.action) } as React.CSSProperties}
                                            >
                                                {getActionIcon(item.action)} {item.action}
                                            </span>
                                            <span className={`status-indicator ${item.completed ? 'status-completed' : 'status-pending'}`}>
                                                {item.completed ? 'Completada' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {history.length > 50 && (
                                <div className="history-more">
                                    <p>... y {history.length - 50} actividades más</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <div className="icon-circle-large" />
                            </div>
                            <h3>No hay historial disponible</h3>
                            <p>Las actividades aparecerán aquí cuando empieces a usar la aplicación</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
