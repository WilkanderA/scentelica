interface User {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  rating: number | null;
  helpfulCount: number;
  createdAt: Date;
  user: User;
}

interface CommentSectionProps {
  comments: Comment[];
  fragranceId?: string;
  showForm?: React.ReactNode;
}

export default function CommentSection({ comments, fragranceId, showForm }: CommentSectionProps) {
  if (comments.length === 0 && !showForm) {
    return (
      <div className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {showForm && (
        <div className="mb-8">
          {showForm}
        </div>
      )}

      {comments.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reviews ({comments.length})
            </h3>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-tonal-20 rounded-xl border border-gray-200 dark:border-tonal-40 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary-dm/30 dark:to-primary-dm/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary dark:text-primary-dm">
                        {comment.user.name?.[0]?.toUpperCase() || comment.user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {comment.user.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {comment.rating && (
                    <div className="flex items-center space-x-1 bg-primary/10 dark:bg-primary-dm/20 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-primary dark:text-primary-dm fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="text-sm font-semibold text-primary dark:text-primary-dm">
                        {comment.rating}/5
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>

                <div className="flex items-center space-x-4 pt-2 border-t border-gray-100 dark:border-tonal-40">
                  <button className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>Helpful ({comment.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
