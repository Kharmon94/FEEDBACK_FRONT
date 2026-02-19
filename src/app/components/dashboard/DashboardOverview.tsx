import { useState, useEffect } from 'react';
import { Star, TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, MapPin } from 'lucide-react';
import { api } from '../../api/client';

interface Stats {
  totalFeedback: number;
  averageRating: number;
  positiveCount: number;
  negativeCount: number;
  recentFeedback: Array<{
    id: string;
    rating: number;
    comment: string;
    name?: string;
    createdAt: string;
  }>;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalFeedback: 0,
    averageRating: 0,
    positiveCount: 0,
    negativeCount: 0,
    recentFeedback: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const feedback = await api.getFeedback();
      
      const totalFeedback = feedback.length;
      const positiveCount = feedback.filter((f: any) => Number(f.rating) >= 4).length;
      const negativeCount = feedback.filter((f: any) => Number(f.rating) <= 3).length;
      const averageRating = totalFeedback > 0
        ? feedback.reduce((sum: number, f: any) => sum + Number(f.rating), 0) / totalFeedback
        : 0;

      setStats({
        totalFeedback,
        averageRating,
        positiveCount,
        negativeCount,
        recentFeedback: feedback.slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl text-slate-900 text-center">Overview</h2>

      {/* Stats Grid - 2 columns on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          icon={MessageSquare}
          label="Total Feedback"
          value={stats.totalFeedback}
          color="blue"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={typeof stats.averageRating === 'number' && !isNaN(stats.averageRating)
            ? stats.averageRating.toFixed(1)
            : '0.0'}
          color="yellow"
        />
        <StatCard
          icon={ThumbsUp}
          label="Positive (4-5★)"
          value={stats.positiveCount}
          color="green"
        />
        <StatCard
          icon={ThumbsDown}
          label="Needs Attention (1-3★)"
          value={stats.negativeCount}
          color="red"
        />
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Feedback</h3>
        
        {stats.recentFeedback.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No feedback yet</p>
        ) : (
          <div className="space-y-4">
            {stats.recentFeedback.map((feedback) => (
              <div key={feedback.id} className="border-b border-slate-200 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= feedback.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    {feedback.name && (
                      <span className="text-sm text-slate-600">by {feedback.name}</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {feedback.comment && (
                  <p className="text-sm text-slate-700">{feedback.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3 sm:mb-4`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}